require("@nomiclabs/hardhat-waffle");

const projectId = "062197f90459457391338d91602a518b";
const fs = require("fs");
const keyData = fs.readFileSync("./p-key.txt", {
  encoding: "utf-8",
  flag: "r",
});

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chaindId: 3,
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${projectId}`,
      accounts: [
        "df57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e",
      ],
      gas: 2100000,
      gasPrice: 8000000000,
    },
    matic: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [
        "d200a3304b014421078158fc442b2c37a2c3b5cd4ed435ccc7286e53369df90d",
      ],
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${projectId}`,
      accounts: [keyData],
    },
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
