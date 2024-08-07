require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  defaultNetwork: "polygonAmoy",
  networks: {
    hardhat: {
    },
    polygonAmoy: {
      url: "https://rpc-amoy.polygon.technology",
      accounts: [""]
    }
  },
  etherscan: {
    apiKey:{
      polygonAmoy:'RZUY4JU3CP4NHICXM1P9K99QPVI5TY7R3U'
    },
    customChains:[
      {
        network:"polygonAmoy",
        chainId:80002,
        urls:{
          apiUrl:"",
          browserURL:"https://amoy.polygonscan.com/"
        }

      }
    ]
  },
  
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
}
