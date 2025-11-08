import { network } from 'hardhat';

const { ethers } = await network.connect();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', await deployer.getAddress());
  const contractFactory = await ethers.getContractFactory('ArtistNFT');
  const contract = await contractFactory.deploy(deployer);
  await contract.waitForDeployment();
  console.log('Contract deployed to:', await contract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
