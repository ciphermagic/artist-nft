# 🎨 Artist NFT 艺术品交易平台

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-3.0+-FFDB1C?style=flat)](https://hardhat.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=flat&logo=solidity)](https://soliditylang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🌟 项目概述

Artist NFT 是一个去中心化的数字艺术品交易平台，允许艺术家将数字作品铸造为NFT并在开放市场opensea上进行交易。平台集成了IPFS和Arweave双重存储方案，确保数字艺术品的永久保存和快速访问。

### 核心功能
- **🖼️ 数字艺术品铸造** - 将数字作品转换为NFT
- **🏪 NFT交易市场** - 点对点的NFT买卖平台
- **🌊 OpenSea集成** - 实时获取OpenSea交易市场数据
- **🔍 市场浏览器** - 浏览热门NFT收藏集和实时统计
- **💰 版税管理** - 完整的版税设置和资金提取功能
- **🔐 去中心化存储** - 集成IPFS和Arweave双存储
- **💳 Web3钱包集成** - 支持MetaMask等主流钱包
- **⚡ 现代化架构** - 基于Vite的开发体验

### 技术特点
- **前端技术栈** - React 18 + TypeScript + Vite + Ant Design
- **智能合约** - Solidity 0.8.20 + OpenZeppelin标准实现
- **存储方案** - IPFS快速访问 + Arweave永久保存，灵活切换
- **开发框架** - Hardhat 3.0，自动化部署流程
- **第三方集成** - OpenSea API v2，实时市场数据获取
- **测试覆盖** - 完整的智能合约测试和前端组件测试
- **模块化架构** - 组件化设计，服务层封装，易于扩展维护

### 🔗 智能合约

#### 🏗️ **多重继承架构设计**
ArtistNFT合约采用OpenZeppelin模块化设计模式，同时继承四个关键合约，实现功能的高度解耦和复用：
- **ERC721URIStorage**: 提供NFT元数据存储功能，支持tokenURI管理
- **ERC721Enumerable**: 支持NFT枚举查询，提供totalSupply、tokenByIndex等方法
- **ERC721Royalty**: 集成ERC-2981版税标准，支持二级市场版税分成
- **Ownable**: 实现权限控制机制，确保关键操作的安全性

#### 💰 **版税机制实现**
- **ERC-2981标准**: 完全兼容以太坊版税标准，支持所有主流NFT市场
- **动态版税比例**: 默认2%版税（basis points为200），合约所有者可调整
- **艺术家受益**: 每个NFT独立设置版税接收者，确保艺术家在二级市场持续获益
- **市场兼容**: 与OpenSea、LooksRare等主流NFT交易平台无缝集成

#### 🏦 **费用管理系统**
- **铸造收费**: 用户铸造NFT需支付指定费用（默认1 gwei），防止恶意铸造
- **费用收集**: 独立设置费用收集地址，支持DAO治理或团队资金管理
- **资金提取**: 仅费用收集者可提取合约余额，确保资金安全
- **动态费率**: 合约所有者可根据市场情况调整铸造费用

#### 🔒 **安全设计模式**
- **权限控制**: 使用OpenZeppelin经过审计的Ownable模式
- **重入保护**: 通过低级call函数返回值检查，防止重入攻击
- **输入验证**: 铸造时严格验证支付金额，避免逻辑漏洞
- **接口兼容**: 正确实现supportsInterface，确保合约互操作性

#### ⚡ **状态管理优化**
- **自增ID机制**: 使用_tokenIds实现自动递增的token ID，简化编号管理
- **原子操作**: 铸造过程中同时设置元数据和版税信息，保证数据一致性
- **Gas优化**: 合理的状态变量布局，减少存储操作成本
- **事件驱动**: 关键操作触发事件，便于链下应用监听和索引

### 🧠 后续升级方向（ArtistCoin）

#### 代币经济原理

ArtistCoin 作为一个分红型代币，其代币经济模型基于以下核心原理：

1. **持有即收益**: 任何持有 ArtistCoin 的用户都可以获得平台交易手续费的分红，通过 `distributeDividends()` 函数实现收益分配。

2. **动态股息计算**: 通过 `magnitude` 放大因子和 `magnifiedDividendPerShare` 参数，确保即使收到少量以太也能精确计算股息分配。

3. **股息修正机制**: 在用户转移、铸造或销毁代币时，通过 `magnifiedDividendCorrections` 映射保持用户股息权益不变，确保公平性。

4. **供应量控制**: 最大供应量限制为 100 ether，通过 `mintable` 修饰符防止无限增发，维护代币价值。

5. **防重复提取**: 使用 `withdrawnDividends` 记录用户已提取的股息，防止重复提取。

#### 系统集成方案

ArtistCoin 将与 ArtistNFT 平台深度集成：

1. **收益来源**: 平台 NFT 交易产生的版税和铸造费用将部分用于 ArtistCoin 持有者的分红。
2. **铸造机制**: 用户可以通过支付以太铸造 ArtistCoin，这部分资金将作为平台发展基金。
3. **治理功能**: ArtistCoin 持有者可参与平台治理决策，如版税比例调整、新功能投票等。
4. **激励体系**: 持有 ArtistCoin 可享受平台交易手续费折扣、优先参与新功能测试等特权。

#### 智能合约实现（已完成）
ArtistCoin 是一个基于以太坊的 ERC20 代币合约，具有创新的股息分配功能。继承自 OpenZeppelin 的 ERC20、Ownable 和 ReentrancyGuard 合约，确保标准的代币功能、所有权控制和重入攻击防护。

**代币机制**
- **最大供应量**: 限制为 100 ether
- **铸造机制**: 允许合约所有者铸造新代币，铸造时收到的 ETH 存入 `ownerWithdrawable` 供所有者提取
- **锁定机制**: 提供 `locked` 状态，可以阻止用户提取股息

**股息分配系统**
合约实现了创新的股息分配机制，确保代币持有者能够按比例分享收到的 ETH：

- **Magnified Dividend Per Share**: 使用 2^128 作为放大因子，确保即使少量 ETH 也能精确分配
- **Correction Mechanism**: 实现了修正机制，当用户余额变化时保持其累计股息不变
- **自动分配**: 通过 `receive()` 函数自动触发股息分配
- **三种查看函数**:
  - `dividendOf()`: 查看指定地址的股息
  - `withdrawableDividendOf()`: 查看可提取的股息
  - `accumulativeDividendOf()`: 查看累计获得的股息总额

**股息提取**
- 用户可以调用 `withdrawDividend()` 提取其股息
- 合约所有者可以调用 `collect()` 提取铸造时收到的 ETH

**继承的安全合约**
- **Ownable**: 确保只有所有者才能执行敏感操作（如提取资金、锁定合约）
- **ReentrancyGuard**: 防止重入攻击，在提取函数中使用 `nonReentrant` 修饰符

**自定义安全机制**
- **锁定机制**: `locked` 状态可以阻止用户提取资金，由所有者控制
- **修饰符**:
  - `mintable`: 确保铸造不会超过最大供应量
  - `isUnlocked`: 确保合约未锁定时才能提取股息
- **输入验证**: 在关键函数中使用 `require` 进行参数验证

**整数安全性**
- 使用 `int256` 类型处理修正值，防止溢出问题
- 在转账、铸造和销毁操作中正确更新修正值，保持股息计算的准确性

**核心函数**

1. `distributeDividends()`: 分配收到的 ETH 作为股息给代币持有者
2. `withdrawDividend()`: 允许用户提取其股息
3. `collect()`: 允许合约所有者提取铸造时收到的 ETH
4. `_transfer()`, `_mint()`, `_burn()`: 重写这些函数以维护股息修正机制

#### TODO 项

1. **前端集成**
- [ ] 创建 ArtistCoin 钱包页面，展示用户持有量和可提取股息
- [ ] 开发代币铸造界面，支持用户购买 ArtistCoin
- [ ] 实现代币转账功能，允许用户之间转移 ArtistCoin
- [ ] 添加分红提取界面，用户可一键提取累积的股息
- [ ] 开发治理投票界面，展示提案并支持用户投票

2. **后端服务**
- [ ] 实现分红计算服务，定期统计平台收益并计算用户分红
- [ ] 开发代币交易记录服务，记录所有铸造、转账和销毁操作
- [ ] 创建治理服务，管理提案创建、投票统计和执行
- [ ] 实现事件监听服务，监控合约事件并更新数据库状态
- [ ] 开发API接口，为前端提供代币余额、分红记录等数据

3. **测试与安全**
- [ ] 编写 ArtistCoin 合约完整测试用例，覆盖所有功能场景
- [ ] 进行代币经济模型模拟测试，验证分红机制的正确性
- [ ] 执行安全审计，确保合约无漏洞和安全隐患
- [ ] 进行压力测试，验证大量用户同时提取分红时的性能表现
- [ ] 实现合约升级机制，确保未来功能扩展的兼容性

4. **文档与部署**
- [ ] 编写 ArtistCoin 技术文档，详细说明合约接口和使用方法
- [ ] 创建用户指南，指导用户如何使用代币功能
- [ ] 部署 ArtistCoin 合约到测试网络，进行实际环境测试
- [ ] 部署 ArtistCoin 合约到主网络，正式上线代币功能
- [ ] 建立监控系统，实时跟踪代币经济指标和合约状态

## 📁 项目结构

```
artist-nft/
├── contracts/          # 智能合约源码
│   ├── ArtistNFT.sol   # 主要NFT合约
│   └── Lock.sol        # 示例锁合约
├── src/                # 前端应用源码
│   ├── components/     # React组件
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
- **MarketBrowser**: OpenSea市场浏览器，展示热门收藏集和实时数据
- **NftMarket**: OpenSea数据展示页面，支持收藏集搜索和NFT浏览
- **RoyaltySettings**: 版税管理界面，支持版税设置和资金提取

### 🎯 核心功能模块

#### 🎨 **内容创作模块**
- **文章系统**: 富文本编辑器 + NFT铸造 + 草稿管理
- **图片NFT**: 文件上传 + 元数据管理 + 一键铸造
- **分类管理**: 书法、绘画、诗词等多类别支持

#### 🏪 **NFT市场模块**
- **市场浏览**: 分类筛选 + 搜索功能 + 网格展示
- **作品展示**: 卡片式布局 + 元数据显示 + 所有者信息
- **个人收藏**: 所有权验证 + 收藏管理 + 交易历史

#### 🌊 **OpenSea集成模块**
- **市场浏览器**: 实时展示OpenSea热门收藏集和统计数据
- **收藏集统计**: 交易量、地板价、持有者数量等关键指标
- **NFT浏览**: 按收藏集浏览NFT，支持分页和详情查看
- **事件追踪**: 实时获取交易事件、铸造事件等活动数据
- **搜索功能**: 支持按收藏集名称搜索和筛选

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
- **调试工具**: 实时监控 + 日志输出 + 状态反馈

## 🎯 核心功能演示

### 🖼️ 对于艺术家
1. **连接钱包** - 使用MetaMask连接您的数字钱包
2. **上传作品** - 选择您的数字艺术品文件
3. **设置元数据** - 添加作品标题、描述等信息
4. **铸造NFT** - 一键将作品铸造为NFT
   ![](./docs/screenshots/铸币.png)
5. **管理作品** - 在个人中心查看和管理您的作品集
   ![](./docs/screenshots/个人藏品.png)

### 🛒 对于收藏家
1. **浏览收藏** - 在藏品列表和文章列表查看所有NFT
   ![](./docs/screenshots/文章列表.png)
   ![](./docs/screenshots/藏品列表.png)
2. **浏览市场** - 在NFT市场发现独特的数字艺术品
   ![](./docs/screenshots/NFT市场.png)
   ![](./docs/screenshots/搜索市场.png)
3. **查看详情** - 了解作品信息和创作者背景
4. **购买NFT** - 使用加密货币购买心仪的NFT

### 💰 版税管理功能
1. **版税设置** - 合约所有者可设置版税比例（如2%），确保艺术家在二级市场持续获益
2. **费用管理** - 设置铸造费用和费用收集者地址，管理合约资金
3. **资金提取** - 合约所有者可提取合约中的资金
4. **实时查看** - 显示合约余额和可提取金额
   ![](./docs/screenshots/版税管理.png)

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

## 🔧 配置说明

### 网络配置 (`src/config.ts`)
- **本地网络**: Hardhat本地区块链 (Chain ID: 0x7A69)
- **Ganache网络**: 本地Ganache模拟 (Chain ID: 0x539)
- **测试网**: 支持Sepolia等以太坊测试网络

### 存储配置
- **IPFS**: 本地节点 `127.0.0.1:8080`
- **Arweave**: 本地节点 `127.0.0.1:1984`

### OpenSea API配置
- **API密钥**: 在 `.env` 文件中设置 `VITE_OPENSEA_API_KEY`
- **API端点**: `https://api.opensea.io/api/v2`
- **支持功能**: 收藏集统计、NFT浏览、事件追踪、市场数据

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

### OpenSea API数据获取失败
**问题**: 无法获取OpenSea市场数据
**解决**:
1. 检查API密钥：确保 `.env` 文件中已正确设置 `VITE_OPENSEA_API_KEY`
2. 网络连接：确认能够访问 `https://api.opensea.io`
3. 收藏集slug：检查输入的收藏集名称是否正确，如 `boredapeyachtclub`
4. API限制：注意OpenSea API的调用频率限制

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源协议发布。

## 🌟 致谢

感谢以下开源项目的贡献：
- [Hardhat](https://hardhat.org/) - 以太坊开发环境
- [OpenZeppelin](https://openzeppelin.com/) - 智能合约安全标准
- [Vite](https://vitejs.dev/) - 前端构建工具
- [React](https://reactjs.org/) - 前端框架
- [Ethers.js](https://docs.ethers.io/) - 以太坊交互库
- [OpenSea](https://opensea.io/) - 全球最大NFT交易市场

---

## 📞 联系我们

如有问题或建议，欢迎通过以下方式联系我们：
- 💬 提交 [Issue](https://github.com/yourusername/artist-nft/issues)
- 📧 发送邮件至: ciphermagic@gmail.com

<div align="center">
  <p>⭐ 如果这个项目对您有帮助，请给我们一个Star！</p>
</div>