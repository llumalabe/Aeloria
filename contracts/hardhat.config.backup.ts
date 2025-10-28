import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Ronin Testnet (Saigon)
    saigon: {
      url: "https://saigon-testnet.roninchain.com/rpc",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 2021,
    },
    // Ronin Mainnet
    ronin: {
      url: "https://api.roninchain.com/rpc",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 2020,
    },
  },
  etherscan: {
    apiKey: {
      saigon: "no-api-key-needed",
      ronin: "no-api-key-needed",
    },
    customChains: [
      {
        network: "saigon",
        chainId: 2021,
        urls: {
          apiURL: "https://saigon-explorer.roninchain.com/api",
          browserURL: "https://saigon-explorer.roninchain.com",
        },
      },
      {
        network: "ronin",
        chainId: 2020,
        urls: {
          apiURL: "https://explorer.roninchain.com/api",
          browserURL: "https://explorer.roninchain.com",
        },
      },
    ],
  },
};

export default config;
