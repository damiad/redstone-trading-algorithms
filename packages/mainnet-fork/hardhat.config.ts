import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const ALCHEMY_KEY = "C-w0d3RWz-od6wJL2z2HfSpSF9iKOV9P"; // must be your API key
const CHAIN_IDS = {
  hardhat: 31337, // chain ID for hardhat testing
};

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
  },
  networks: {
    hardhat: {
      chainId: CHAIN_IDS.hardhat,
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
        blockNumber: 12821000, // a specific block number with which you want to work
      },
    },
  },
};

export default config;
