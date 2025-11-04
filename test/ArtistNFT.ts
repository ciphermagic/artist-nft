import { expect } from 'chai';
import { network } from 'hardhat';

const { ethers, networkHelpers } = await network.connect();

describe('ArtistNFT', function () {
  async function deployNftFixture() {
    const [owner, artist, other] = await ethers.getSigners();
    const contractFactory = await ethers.getContractFactory('ArtistNFT');
    const contract = await contractFactory.deploy();
    return { contract, owner, artist, other };
  }

  describe('基本功能测试', function () {
    it('应该成功铸造NFT并触发Transfer事件', async function () {
      const { contract, artist } = await networkHelpers.loadFixture(deployNftFixture);
      const artistAddr = await artist.getAddress();
      const tokenUri = 'https://example.com/token/1';

      await expect(contract.mint(artistAddr, tokenUri))
        .to.emit(contract, 'Transfer')
        .withArgs(ethers.ZeroAddress, artistAddr, 0);
    });

    it('应该正确存储和返回tokenURI', async function () {
      const { contract, artist } = await networkHelpers.loadFixture(deployNftFixture);
      const artistAddr = await artist.getAddress();
      const tokenUri = 'https://example.com/token/1';

      await contract.mint(artistAddr, tokenUri);
      expect(await contract.tokenURI(0)).to.equal(tokenUri);
    });

    it('应该正确跟踪账户余额', async function () {
      const { contract, artist } = await networkHelpers.loadFixture(deployNftFixture);
      const artistAddr = await artist.getAddress();

      await contract.mint(artistAddr, 'https://example.com/token/1');
      await contract.mint(artistAddr, 'https://example.com/token/2');

      expect(await contract.balanceOf(artistAddr)).to.equal(2);
    });

    it('应该正确跟踪NFT所有者', async function () {
      const { contract, artist } = await networkHelpers.loadFixture(deployNftFixture);
      const artistAddr = await artist.getAddress();

      await contract.mint(artistAddr, 'https://example.com/token/1');

      expect(await contract.ownerOf(0)).to.equal(artistAddr);
    });
  });

  describe('TokenId递增测试', function () {
    it('应该为每个新NFT分配递增的tokenId', async function () {
      const { contract, artist, other } = await networkHelpers.loadFixture(deployNftFixture);
      const artistAddr = await artist.getAddress();
      const otherAddr = await other.getAddress();

      // 铸造多个NFT
      await contract.mint(artistAddr, 'https://example.com/token/1');
      await contract.mint(artistAddr, 'https://example.com/token/2');
      await contract.mint(otherAddr, 'https://example.com/token/3');

      // 验证tokenId递增
      expect(await contract.ownerOf(0)).to.equal(artistAddr);
      expect(await contract.ownerOf(1)).to.equal(artistAddr);
      expect(await contract.ownerOf(2)).to.equal(otherAddr);

      // 验证各自的URI
      expect(await contract.tokenURI(0)).to.equal('https://example.com/token/1');
      expect(await contract.tokenURI(1)).to.equal('https://example.com/token/2');
      expect(await contract.tokenURI(2)).to.equal('https://example.com/token/3');
    });
  });

  describe('多用户场景测试', function () {
    it('应该正确处理多个用户的NFT', async function () {
      const { contract, owner, artist, other } = await networkHelpers.loadFixture(deployNftFixture);
      const ownerAddr = await owner.getAddress();
      const artistAddr = await artist.getAddress();
      const otherAddr = await other.getAddress();

      // 为不同用户铸造NFT
      await contract.mint(ownerAddr, 'https://example.com/owner/1');
      await contract.mint(artistAddr, 'https://example.com/artist/1');
      await contract.mint(otherAddr, 'https://example.com/other/1');
      await contract.mint(artistAddr, 'https://example.com/artist/2');

      // 验证各用户余额
      expect(await contract.balanceOf(ownerAddr)).to.equal(1);
      expect(await contract.balanceOf(artistAddr)).to.equal(2);
      expect(await contract.balanceOf(otherAddr)).to.equal(1);

      // 验证NFT所有权
      expect(await contract.ownerOf(0)).to.equal(ownerAddr);
      expect(await contract.ownerOf(1)).to.equal(artistAddr);
      expect(await contract.ownerOf(2)).to.equal(otherAddr);
      expect(await contract.ownerOf(3)).to.equal(artistAddr);
    });
  });

  describe('ERC721Enumerable功能测试', function () {
    it('应该支持tokenByIndex和tokenOfOwnerByIndex', async function () {
      const { contract, artist } = await networkHelpers.loadFixture(deployNftFixture);
      const artistAddr = await artist.getAddress();

      // 铸造多个NFT
      await contract.mint(artistAddr, 'https://example.com/token/1');
      await contract.mint(artistAddr, 'https://example.com/token/2');
      await contract.mint(artistAddr, 'https://example.com/token/3');

      // 测试tokenByIndex
      expect(await contract.tokenByIndex(0)).to.equal(0);
      expect(await contract.tokenByIndex(1)).to.equal(1);
      expect(await contract.tokenByIndex(2)).to.equal(2);

      // 测试tokenOfOwnerByIndex
      expect(await contract.tokenOfOwnerByIndex(artistAddr, 0)).to.equal(0);
      expect(await contract.tokenOfOwnerByIndex(artistAddr, 1)).to.equal(1);
      expect(await contract.tokenOfOwnerByIndex(artistAddr, 2)).to.equal(2);
    });

    it('应该正确返回totalSupply', async function () {
      const { contract, artist, other } = await networkHelpers.loadFixture(deployNftFixture);
      const artistAddr = await artist.getAddress();
      const otherAddr = await other.getAddress();

      expect(await contract.totalSupply()).to.equal(0);

      await contract.mint(artistAddr, 'https://example.com/token/1');
      expect(await contract.totalSupply()).to.equal(1);

      await contract.mint(artistAddr, 'https://example.com/token/2');
      expect(await contract.totalSupply()).to.equal(2);

      await contract.mint(otherAddr, 'https://example.com/token/3');
      expect(await contract.totalSupply()).to.equal(3);
    });
  });

  describe('边界条件测试', function () {
    it('应该处理空URI字符串', async function () {
      const { contract, artist } = await networkHelpers.loadFixture(deployNftFixture);
      const artistAddr = await artist.getAddress();

      await contract.mint(artistAddr, '');
      expect(await contract.tokenURI(0)).to.equal('');
    });

    it('应该处理非常长的URI', async function () {
      const { contract, artist } = await networkHelpers.loadFixture(deployNftFixture);
      const artistAddr = await artist.getAddress();
      const longUri = 'https://example.com/token/' + 'a'.repeat(200);

      await contract.mint(artistAddr, longUri);
      expect(await contract.tokenURI(0)).to.equal(longUri);
    });
  });

  describe('错误处理测试', function () {
    it('查询不存在的tokenURI应该回退', async function () {
      const { contract } = await networkHelpers.loadFixture(deployNftFixture);

      await expect(contract.tokenURI(999)).to.revert(ethers);
    });

    it('查询不存在的NFT所有者应该回退', async function () {
      const { contract } = await networkHelpers.loadFixture(deployNftFixture);

      await expect(contract.ownerOf(999)).to.revert(ethers);
    });

    it('查询零地址的余额应该回退', async function () {
      const { contract } = await networkHelpers.loadFixture(deployNftFixture);

      // OpenZeppelin ERC721 使用自定义错误而不是revert字符串
      await expect(contract.balanceOf(ethers.ZeroAddress)).to.revert(ethers);
    });
  });

  describe('合约标准兼容性测试', function () {
    it('应该支持ERC721接口', async function () {
      const { contract } = await networkHelpers.loadFixture(deployNftFixture);

      // ERC721接口ID
      const erc721InterfaceId = '0x80ac58cd';
      expect(await contract.supportsInterface(erc721InterfaceId)).to.equal(true);
    });

    it('应该支持ERC721Enumerable接口', async function () {
      const { contract } = await networkHelpers.loadFixture(deployNftFixture);

      // ERC721Enumerable接口ID
      const erc721EnumerableInterfaceId = '0x780e9d63';
      expect(await contract.supportsInterface(erc721EnumerableInterfaceId)).to.equal(true);
    });

    it('应该支持ERC721Metadata接口', async function () {
      const { contract } = await networkHelpers.loadFixture(deployNftFixture);

      // ERC721Metadata接口ID
      const erc721MetadataInterfaceId = '0x5b5e139f';
      expect(await contract.supportsInterface(erc721MetadataInterfaceId)).to.equal(true);
    });
  });
});
