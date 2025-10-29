require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
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
    // Ronin Saigon Testnet
    "ronin-testnet": {
      url: process.env.RONIN_TESTNET_RPC || "https://saigon-testnet.roninchain.com/rpc",
      chainId: 2021,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 20000000000, // 20 gwei
    },
    // Ronin Mainnet
    "ronin-mainnet": {
      url: process.env.RONIN_MAINNET_RPC || "https://api.roninchain.com/rpc",
      chainId: 2020,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 20000000000,
    },
  },
  etherscan: {
    apiKey: {
      'ronin-testnet': 'no-api-key-needed',
      'ronin-mainnet': 'no-api-key-needed',
    },
    customChains: [
      {
        network: "ronin-testnet",
        chainId: 2021,
        urls: {
          apiURL: "https://saigon-app.roninchain.com/api",
          browserURL: "https://saigon-app.roninchain.com"
        }
      },
      {
        network: "ronin-mainnet",
        chainId: 2020,
        urls: {
          apiURL: "https://app.roninchain.com/api",
          browserURL: "https://app.roninchain.com"
        }
      }
    ]
  },
  paths: {
    sources: "./",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
