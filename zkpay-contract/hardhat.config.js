require("@nomicfoundation/hardhat-toolbox");
require("hardhat-contract-sizer");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  networks: {
    matic: {
      url: process.env.MATIC_API_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
    mumbai: {
      url: process.env.MUMBAI_API_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
    hardhat: {
      forking: {
        url: process.env.MATIC_API_URL,
      },
    },
  },
  etherscan: {
    apiKey: process.env.POLYGON_SCAN_API_KEY,
  },
};
