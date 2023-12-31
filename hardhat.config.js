require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require('@nomicfoundation/hardhat-chai-matchers');
require('@nomicfoundation/hardhat-ethers');
require('@typechain/hardhat');
require('hardhat-gas-reporter');
require('solidity-coverage');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    mainnet: {
      url: process.env.ETH_MAINNET_PROVIDER,
      accounts: [
        process.env.PRIVATE_KEY,
      ],
      gasPrice: 50000000000, // 50 gwei
    },
    goerli: {
      url: process.env.ETH_GOERLI_PROVIDER,
      accounts: [
        process.env.PRIVATE_KEY,
      ],
      gasPrice: 50000000000, // 50 gwei
    },
    polygon: {
      url: process.env.POLYGON_PROVIDER,
      accounts: [
        process.env.PRIVATE_KEY,
      ],
      gasPrice: 150000000000, // 150 gwei
    },
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY,
      goerli: process.env.ETHERSCAN_API_KEY,
      polygon: process.env.POLYGONSCAN_API_KEY
    }
  }
};
