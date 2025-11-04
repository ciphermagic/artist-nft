# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于React + TypeScript + Vite的NFT艺术品交易平台，集成以太坊智能合约和去中心化存储（IPFS/Arweave）功能。

## 核心命令

### 开发启动
```bash
npm run dev          # 启动前端开发服务器 (Vite)
npm run compile      # 编译智能合约
npm run htest        # 运行Hardhat测试
npm run deploy       # 部署合约到本地网络
npm run build        # 构建生产版本
npm run lint         # 运行ESLint代码检查
```

### 区块链开发
```bash
npx hardhat node     # 启动本地Hardhat网络
npx hardhat test     # 运行所有测试 (Solidity + Mocha)
npx hardhat test solidity  # 仅运行Solidity测试
npx hardhat test mocha     # 仅运行Mocha集成测试
```

## 架构结构

### 前端应用 (`/src/`)
- **组件架构**: React 18 + TypeScript + Ant Design
- **路由结构**: React Router管理页面导航
- **状态管理**: 组件级状态管理
- **区块链交互**: Ethers.js v6连接智能合约
- **去中心化存储**: 支持IPFS和Arweave双存储

### 智能合约 (`/contracts/`)
- **ArtistNFT.sol**: 主要NFT合约，基于OpenZeppelin ERC721标准
- **编译输出**: `src/artifacts/` 和 `src/typechain-types/`
- **测试覆盖**: Solidity单元测试 + TypeScript集成测试

### 配置管理
- **网络配置**: `src/config.ts` 定义本地测试网络和Sepolia配置
- **Hardhat配置**: `hardhat.config.ts` 定义编译和部署设置
- **构建配置**: `vite.config.ts` 定义前端构建流程

## 关键集成点

### 区块链集成流程
1. 用户通过MetaMask连接钱包 (`src/components/Connect.tsx`)
2. 前端调用ArtistNFT合约的mint函数铸造NFT
3. NFT元数据存储到IPFS/Arweave
4. 合约记录NFT所有权和元数据URI

### 存储架构
- **IPFS**: 本地IPFS节点 (127.0.0.1:8080)
- **Arweave**: 本地Arweave节点 (127.0.0.1:1984)
- **配置**: 在`src/config.ts`中统一管理存储端点

### 组件通信模式
- 钱包连接状态通过props传递
- NFT数据通过组件间直接传递
- 区块链操作封装在服务层函数中

## 开发注意事项

### 合约开发
- Solidity版本: 0.8.28
- 使用OpenZeppelin安全库
- 合约编译到`src/artifacts/`
- 自动生成TypeScript类型到`src/typechain-types/`

### 前端开发
- TypeScript严格模式启用
- ESLint + Prettier代码规范
- Vite热重载开发体验
- React组件使用函数组件+Hooks模式

### 测试要求
- 智能合约必须有单元测试
- 关键功能需要集成测试覆盖
- 测试使用Mocha + Chai断言库

## 部署流程

### 本地开发
1. 启动本地Hardhat网络: `npx hardhat node`
2. 编译合约: `npm run compile`
3. 部署合约: `npm run deploy`
4. 启动前端: `npm run dev`

### 测试网部署
需要配置Sepolia私钥和网络参数，使用Hardhat Ignition模块进行部署。