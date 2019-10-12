require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonic = process.env.MNEMONIC
const infuraKey = process.env.INFURA_API_KEY

module.exports = {
  rpc: {
    host:"0.0.0.0",
    port:8545
  },

  networks: {

    development: {
      host: "127.0.0.1",     
      port: 7545,            
      network_id: "*",       
    },

    ropsten: {
      provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/${infuraKey}`),
      network_id: 3,       // Ropsten's id
      gas: 5500000,        // Ropsten has a lower block limit than mainnet
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },

    local: {
      provider: new HDWalletProvider(process.env.MNEMONIC, 'http://0.0.0.0:8545'),
      network_id: "1515",
      gas: 0,
      gasPrice: 0
    },

  },

  contracts_directory: './contracts/',
  contracts_build_directory: `./src/abis/`,

  mocha: {
    //timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "native",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
