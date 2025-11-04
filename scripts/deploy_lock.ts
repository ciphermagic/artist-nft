import { network } from 'hardhat';

const { ethers } = await network.connect();

async function main() {
  // 获取部署者账户
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', await deployer.getAddress());
  // 获取合约工厂
  const Lock = await ethers.getContractFactory('Lock');

  // 部署合约，传递构造函数参数
  const unlockTime = 1893456000; // 示例解锁时间（Unix 时间戳）
  const lock = await Lock.deploy(unlockTime, { value: ethers.parseEther('0.001') });

  // 等待部署完成（Hardhat 3 使用 waitForDeployment）
  await lock.waitForDeployment();
  // 获取部署地址

  console.log('Lock deployed to:', await lock.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
