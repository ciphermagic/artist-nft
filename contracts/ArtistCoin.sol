// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ArtistCoin is ERC20, Ownable, ReentrancyGuard {

    uint256 public constant MAX_SUPPLY = 100 ether;

    // 通过 `magnitude`，即使收到的以太数量很少，我们也能正确分配股息。
    uint256 internal constant magnitude = 2 ** 128;

    uint256 internal magnifiedDividendPerShare;

    uint256 public ownerWithdrawable;

    // @notice 如果locked为true，则不允许用户提取资金
    bool public locked;

    // 关于 dividendCorrection:
    // 如果 `_user` 的代币余额从未改变，则 `_user` 的股息可以用以下方式计算:
    //   `dividendOf(_user) = dividendPerShare * balanceOf(_user)`。
    // 当 [balanceOf(_user)] 发生变化时 (通过铸造/销毁/转移代币),
    //   `dividendOf(_user)` 不应该改变,
    //   但计算值 `dividendPerShare * balanceOf(_user)` 会发生变化。
    // 为了保持 `dividendOf(_user)` 不变，我们添加一个修正项:
    //   `dividendOf(_user) = dividendPerShare * balanceOf(_user) + dividendCorrectionOf(_user)`,
    //   其中每当 [balanceOf(_user)] 改变时，`dividendCorrectionOf(_user)` 会更新:
    //   `dividendCorrectionOf(_user) = dividendPerShare * (旧的 balanceOf(_user)) - (新的 balanceOf(_user))`。
    // 这样，`dividendOf(_user)` 在 [balanceOf(_user)] 改变前后返回相同的值。
    mapping(address => int256) internal magnifiedDividendCorrections;
    mapping(address => uint256) internal withdrawnDividends;

    // @dev 当向代币持有者分配以太时，此事件必须触发。
    // @param from 向此合约发送以太的地址。
    // @param weiAmount 分配的以太数量（单位为wei）。
    event DividendsDistributed(address indexed from, uint256 weiAmount);

    // @dev 当地址提取其股息时，此事件必须触发。
    // @param to 从该合约提取以太的地址。
    // @param weiAmount 提取的以太数量（单位为wei）。
    event DividendWithdrawn(address indexed to, uint256 weiAmount);

    modifier mintable(uint256 amount) {
        require(amount + totalSupply() <= MAX_SUPPLY, "amount surpasses max supply");
        _;
    }

    modifier isUnlocked() {
        require(!locked, "contract is currently locked");
        _;
    }

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    // @dev 当ether转入此合约时分配股息。
    receive() external payable {
        distributeDividends();
    }

    function mint(address to_) public payable mintable(msg.value) {
        ownerWithdrawable += msg.value;
        _mint(to_, msg.value);
    }

    function collect() public onlyOwner nonReentrant {
        require(ownerWithdrawable > 0);
        uint _with = ownerWithdrawable;
        ownerWithdrawable = 0;
        payable(msg.sender).transfer(_with);
    }

    function toggleLock() external onlyOwner {
        locked = !locked;
    }

    // @notice 向代币持有者分配以太作为股息。
    // @dev 如果代币总供应量为0则会回退。
    // 如果收到的以太数量大于0，则会触发 `DividendsDistributed` 事件。
    // 关于未分配的以太:
    //   在每次分配中，都有少量以太未被分配,
    //     其放大的数量为
    //     `(msg.value * magnitude) % totalSupply()`。
    //   通过合理选择 `magnitude`，分配中未分配的以太
    //     (去放大后) 可以小于1 wei。
    //   我们实际上可以跟踪分配中未分配的以太
    //     并尝试在下一次分配中进行分配,
    //     但在链上跟踪这些数据的成本远高于
    //     节省的以太，所以我们不这样做。
    function distributeDividends() public payable {
        require(totalSupply() > 0);
        if (msg.value > 0) {
            magnifiedDividendPerShare += (msg.value * magnitude) / totalSupply();
            emit DividendsDistributed(msg.sender, msg.value);
        }
    }

    // @notice 提取分配给发送者的以太。
    // @dev 如果提取的以太数量大于0，则会触发 `DividendWithdrawn` 事件。
    function withdrawDividend() public nonReentrant isUnlocked {
        uint256 _withdrawableDividend = withdrawableDividendOf(msg.sender);
        if (_withdrawableDividend > 0) {
            withdrawnDividends[msg.sender] += _withdrawableDividend;
            emit DividendWithdrawn(msg.sender, _withdrawableDividend);
            (payable(msg.sender)).transfer(_withdrawableDividend);
        }
    }

    // @notice 查看地址可以提取的以太股息数量。
    // @param _owner 代币持有者的地址。
    // @return `_owner` 可以提取的以太股息数量。
    function dividendOf(address _owner) public view returns (uint256) {
        return withdrawableDividendOf(_owner);
    }

    // @notice 查看地址可以提取的以太股息数量。
    // @param _owner 代币持有者的地址。
    // @return `_owner` 可以提取的以太股息数量。
    function withdrawableDividendOf(address _owner) public view returns (uint256){
        return accumulativeDividendOf(_owner) - (withdrawnDividends[_owner]);
    }

    // @notice 查看地址已提取的以太股息数量。
    // @param _owner 代币持有者的地址。
    // @return `_owner` 已提取的以太股息数量。
    function withdrawnDividendOf(address _owner) public view returns (uint256) {
        return withdrawnDividends[_owner];
    }

    // @notice 查看地址总共获得的以太股息数量。
    // @dev accumulativeDividendOf(_owner) = withdrawableDividendOf(_owner) + withdrawnDividendOf(_owner)
    // = (magnifiedDividendPerShare * balanceOf(_owner) + magnifiedDividendCorrections[_owner]) / magnitude
    // @param _owner 代币持有者的地址。
    // @return `_owner` 总共获得的以太股息数量。
    function accumulativeDividendOf(address _owner) public view returns (uint256){
        int256 x = int256(magnifiedDividendPerShare * balanceOf(_owner));
        x += magnifiedDividendCorrections[_owner];
        return uint256(x) / magnitude;
    }

    // @dev 在地址间转移代币的内部函数。
    // 更新 magnifiedDividendCorrections 以保持股息不变。
    // @param from 转出地址。
    // @param to 转入地址。
    // @param value 转移数量。
    function _transfer(address from, address to, uint256 value) internal override {
        super._transfer(from, to, value);
        int256 _magCorrection = int256(magnifiedDividendPerShare * (value));
        magnifiedDividendCorrections[from] += _magCorrection;
        magnifiedDividendCorrections[to] -= _magCorrection;
    }

    // @dev 向账户铸造代币的内部函数。
    // 更新 magnifiedDividendCorrections 以保持股息不变。
    // @param account 将收到代币的账户。
    // @param value 将被铸造的数量。
    function _mint(address account, uint256 value) internal override {
        super._mint(account, value);
        magnifiedDividendCorrections[account] -= int256(
            magnifiedDividendPerShare * value
        );
    }

    // @dev 销毁给定账户代币的内部函数。
    // 更新 magnifiedDividendCorrections 以保持股息不变。
    // @param account 将被销毁代币的账户。
    // @param value 将被销毁的数量。
    function _burn(address account, uint256 value) internal override {
        super._burn(account, value);
        magnifiedDividendCorrections[account] += int256(
            magnifiedDividendPerShare * value
        );
    }
}
