// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ArtistNFT is
    ERC721URIStorage,
    ERC721Enumerable,
    ERC721Royalty,
    Ownable
{
    uint256 private _tokenIds;
    uint96 public royaltyFraction = 200;
    uint256 public feeRate = 1 gwei;
    address public feeCollector;

    constructor(address owner) ERC721("ArtistNFT", "AN") Ownable(owner) {
        feeCollector = owner;
    }

    function setFeeRoyaltyFraction(uint96 rf) external onlyOwner {
        royaltyFraction = rf;
    }

    function setFeeRate(uint fr) external onlyOwner {
        feeRate = fr;
    }

    function setFeeCollector(address fc) external onlyOwner {
        feeCollector = fc;
    }

    function withdraw() external {
        require(msg.sender == feeCollector, "only fee collector can withdraw");
        (bool suc, ) = feeCollector.call{value: address(this).balance}("");
        require(suc, "withdraw failed!");
    }

    function mint(
        address artist,
        string memory uri
    ) public payable returns (uint256) {
        require(
            msg.value >= feeRate,
            "please provide 1g wei for your minting!"
        );
        uint256 newItemId = _tokenIds;
        _mint(artist, newItemId);
        _setTokenURI(newItemId, uri);
        _tokenIds++;
        _setTokenRoyalty(newItemId, artist, royaltyFraction);
        return newItemId;
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
    public
    view
    override(ERC721Enumerable, ERC721URIStorage, ERC721Royalty)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return ERC721URIStorage.tokenURI(tokenId);
    }
}
