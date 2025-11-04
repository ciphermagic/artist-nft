import type {HardhatUserConfig} from "hardhat/config";

import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";

const config: HardhatUserConfig = {
    plugins: [hardhatToolboxMochaEthersPlugin],
    solidity: "0.8.28",
    paths: {
        artifacts: "./src/artifacts"
    },
    typechain: {
        outDir: "./src/typechain-types",
        tsNocheck: true,
    }
};

export default config;
