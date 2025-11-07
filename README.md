# 🎨 Artist NFT 艺术品交易平台

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-3.0+-FFDB1C?style=flat)](https://hardhat.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=flat&logo=solidity)](https://soliditylang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🌟 项目概述

### 核心功能
- **🖼️ 数字艺术品铸造** - 将数字作品转换为NFT
- **🏪 NFT交易市场** - 点对点的NFT买卖平台
- **🔐 去中心化存储** - 集成IPFS和Arweave存储方案
- **💳 Web3钱包集成** - 支持MetaMask等主流钱包
- **⚡ 现代化架构** - 基于Vite的开发体验

### 技术特色
- **技术栈** - React 18 + TypeScript + Vite
- **智能合约** - OpenZeppelin标准，Solidity 0.8.20
- **存储方案** - IPFS快速访问 + Arweave永久保存，灵活切换
- **开发框架** - Hardhat 3.0，自动化部署流程
- **模块化架构**: 组件化设计，服务层封装，易于扩展维护

## 🏗️ 系统架构

### 技术栈分层
```
┌─────────────────────────────────────┐
│            前端展示层                │
│  React 18 + TypeScript + Ant Design │
├─────────────────────────────────────┤
│           区块链交互层                │
│  Ethers.js v6 + MetaMask集成        │
├─────────────────────────────────────┤
│            智能合约层                 │
│  ArtistNFT.sol + OpenZeppelin标准    │
├─────────────────────────────────────┤
│          去中心化存储层               │
│     IPFS + Arweave双存储方案          │
└─────────────────────────────────────┘
```

### 🎯 核心功能模块

#### 🎨 **内容创作模块**
- **文章系统**: 富文本编辑器 + NFT铸造 + 草稿管理
![](./docs/screenshots/写文章.png) 
![](./docs/screenshots/文章草稿.png)
![](./docs/screenshots/个人文章.png)
![](./docs/screenshots/文章列表.png)
- **图片NFT**: 文件上传 + 元数据管理 + 一键铸造
![](./docs/screenshots/铸币.png)
![](./docs/screenshots/个人藏品.png)
![](./docs/screenshots/藏品列表.png)
- **分类管理**: 书法、绘画、诗词等多类别支持

#### 🏪 **NFT市场模块**
- **市场浏览**: 分类筛选 + 搜索功能 + 网格展示
- **作品展示**: 卡片式布局 + 元数据显示 + 所有者信息
- **个人收藏**: 所有权验证 + 收藏管理 + 交易历史

#### 🔐 **Web3身份模块**
- **钱包连接**: MetaMask集成 + 多网络支持 + 状态管理
- **身份验证**: 地址验证 + 签名认证 + 权限控制
- **用户界面**: 连接状态显示 + 网络切换 + 错误处理

#### 💾 **去中心化存储模块**
- **双存储架构**: IPFS本地节点 + Arweave永久存储
- **文件管理**: 图片上传 + 元数据构建 + URI生成
- **存储服务**: 统一接口 + 自动切换 + 状态监控

#### 🧪 **开发测试模块**
- **合约测试**: 读写操作演示 + 事件监听 + 错误处理
- **存储测试**: 双存储验证 + 钱包集成 + 本地挖矿
![](./docs/screenshots/测试存储.png)
- **调试工具**: 实时监控 + 日志输出 + 状态反馈

## 🚀 快速开始

### 环境要求
- Node.js ≥ 18.0.0
- npm ≥ 9.0.0
- MetaMask浏览器插件
- Git
- IPFS本地节点 (可选，用于文件存储)
- Arweave本地节点 (可选，用于永久存储)

### 安装部署

#### 1. 克隆项目
```bash
git clone https://github.com/ciphermagic/artist-nft.git
cd artist-nft
```

#### 2. 安装依赖
```bash
npm install
```

#### 3. 配置存储节点（可选）
```bash
# 安装并启动IPFS
npm install -g ipfs
ipfs init
ipfs daemon

# 验证IPFS状态
curl http://127.0.0.1:8080/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme
```

#### 4. 启动本地开发环境
```bash
# 启动Hardhat本地区块链
npx hardhat node

# 新终端：编译智能合约
npm run compile

# 部署合约到本地网络
npm run deploy

# 启动前端开发服务器
npm run dev
```

#### 5. 访问应用
- 前端地址: http://localhost:5173
- 区块链RPC: http://localhost:8545

## 🎯 核心功能演示

### 🖼️ 对于艺术家
1. **连接钱包** - 使用MetaMask连接您的数字钱包
2. **上传作品** - 选择您的数字艺术品文件
3. **设置元数据** - 添加作品标题、描述、价格信息
4. **铸造NFT** - 一键将作品铸造为NFT
5. **管理作品** - 在个人中心查看和管理您的作品集

### 🛒 对于收藏家
1. **浏览市场** - 在NFT市场发现独特的数字艺术品
2. **查看详情** - 了解作品信息和创作者背景
3. **购买NFT** - 使用加密货币购买心仪的NFT
4. **管理收藏** - 在个人中心展示您的NFT收藏

## 🧪 开发指南

### 测试覆盖
```bash
# 运行所有测试
npm run htest

# 仅运行智能合约测试
npx hardhat test solidity

# 仅运行集成测试
npx hardhat test mocha
```

### 代码质量
```bash
# 代码检查
npm run lint

# 类型检查
npm run compile
```

### 构建发布
```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 📁 项目结构

```
artist-nft/
├── contracts/          # 智能合约源码
│   ├── ArtistNFT.sol   # 主要NFT合约
│   └── Lock.sol        # 示例锁合约
├── src/                # 前端应用源码
│   ├── components/     # React组件
│   │   ├── TopLayout.tsx           # 应用顶层布局
│   │   ├── Connect.tsx             # 钱包连接组件
│   │   ├── Home.tsx                # 首页内容管理
│   │   ├── NftMarket.tsx           # NFT市场界面
│   │   ├── Personal.tsx            # 个人中心
│   │   ├── TestContract.tsx        # 合约测试组件
│   │   ├── TestStorage.tsx         # 存储测试组件
│   │   ├── ArticleEditor.tsx       # 富文本编辑器
│   │   ├── ArticleBrowser.tsx      # 文章浏览器
│   │   ├── ImageNftMinter.tsx      # NFT铸造器
│   │   └── NftCard.tsx             # NFT卡片组件
│   ├── service/        # 业务逻辑服务
│   ├── artifacts/      # 编译后的合约ABI
│   └── typechain-types/# TypeScript类型定义
├── test/               # 测试文件
│   ├── ArtistNFT.ts    # NFT合约测试
│   └── Lock.ts         # 锁合约测试
├── scripts/            # 部署脚本
├── cache/              # 编译缓存
├── dist/               # 构建输出目录
└── node_modules/       # 项目依赖
```

### 🏗️ 组件架构设计

#### **顶层架构**
- **TopLayout**: 统一导航框架，集成钱包连接状态
- **路由管理**: React Router v6，支持嵌套路由和动态参数
- **状态管理**: 组件级状态，服务层封装，Props传递

#### **功能组件分层**
```
展示层 (Presentation)
├── Ant Design组件库
├── 自定义UI组件
└── 响应式布局

业务层 (Business Logic)
├── NFT服务层
├── 存储服务层
├── 连接服务层
└── 工具函数层

数据层 (Data Access)
├── Ethers.js合约交互
├── IPFS/Arweave存储
├── MetaMask钱包连接
└── 本地存储管理
```

#### **核心组件特性**
- **ArticleEditor**: Jodit富文本编辑器，支持草稿保存和NFT铸造
- **NftCard**: 统一NFT展示卡片，支持图片和文章类型
- **ImageNftMinter**: 完整的图片上传、预览、铸造流程
- **ArticleBrowser**: 表格化文章NFT展示，支持模态框阅读
- **Connect**: 极简钱包连接，状态自动管理

## 🔧 配置说明

### 网络配置 (`src/config.ts`)
- **本地网络**: Hardhat本地区块链 (Chain ID: 0x7A69)
- **Ganache网络**: 本地Ganache模拟 (Chain ID: 0x539)
- **测试网**: 支持Sepolia等以太坊测试网络

### 存储配置
- **IPFS**: 本地节点 `127.0.0.1:8080`
- **Arweave**: 本地节点 `127.0.0.1:1984`

## 🤝 贡献指南

我们欢迎社区贡献！请遵循以下步骤：

1. Fork 项目仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 贡献类型
- 🐛 **Bug修复** - 修复代码中的问题
- ✨ **新功能** - 添加新的功能特性
- 📝 **文档改进** - 完善项目文档
- 🎨 **UI/UX优化** - 改善用户界面和体验
- ⚡ **性能优化** - 提升系统性能

## 🛡️ 安全说明

- ✅ 智能合约基于OpenZeppelin安全标准
- ✅ 使用最新稳定版本的Solidity编译器
- ✅ 完整的测试覆盖确保代码质量
- ✅ 去中心化存储确保数据安全
- ✅ 前端交互经过安全审计

## 🛠️ 常见问题

### MetaMask连接失败
**问题**: 无法连接到本地网络
**解决**:
1. 检查Hardhat节点是否运行：`npx hardhat node`
2. 添加网络配置：RPC URL `http://127.0.0.1:8545`，Chain ID `0x7A69`
3. 清除浏览器缓存后重试

### IPFS文件上传失败
**问题**: 文件无法上传到IPFS
**解决**:
1. 检查IPFS守护进程：`ipfs daemon`
2. 验证IPFS状态：`curl http://127.0.0.1:8080/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme`
3. 检查防火墙设置，确保端口8080开放

### 端口被占用
**问题**: 8545端口已被占用
**解决**:
```bash
# Mac/Linux
lsof -ti:8545 | xargs kill -9

# Windows
netstat -ano | findstr :8545
taskkill /PID <进程ID> /F
```

### 合约部署失败
**问题**: 部署合约时超时
**解决**:
1. 检查网络连接状态
2. 确认账户有足够ETH（本地网络会自动分配）
3. 重启Hardhat节点后重试

### 依赖安装失败
**问题**: npm install报错
**解决**:
1. 清除npm缓存：`npm cache clean --force`
2. 删除node_modules后重试：`rm -rf node_modules && npm install`
3. 检查Node.js版本是否符合要求（≥18.0.0）

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源协议发布。

## 🌟 致谢

感谢以下开源项目的贡献：
- [Hardhat](https://hardhat.org/) - 以太坊开发环境
- [OpenZeppelin](https://openzeppelin.com/) - 智能合约安全标准
- [Vite](https://vitejs.dev/) - 前端构建工具
- [React](https://reactjs.org/) - 前端框架
- [Ethers.js](https://docs.ethers.io/) - 以太坊交互库

---

## 📞 联系我们

如有问题或建议，欢迎通过以下方式联系我们：
- 💬 提交 [Issue](https://github.com/yourusername/artist-nft/issues)
- 📧 发送邮件至: ciphermagic@gmail.com

<div align="center">
  <p>⭐ 如果这个项目对您有帮助，请给我们一个Star！</p>
</div>