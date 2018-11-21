var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = process.env.MNEMONIC;
var accessToken = process.env.INFURA_ACCESS_TOKEN;

module.exports = {

  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" 
    },

    live: {
      provider: function() {
        return new HDWalletProvider(
          mnemonic,
          "https://mainnet.infura.io/" + accessToken 
        );
      },
      network_id: 1
    },

    rinkeby: {
      provider: function() {
        return new HDWalletProvider(
          mnemonic,
          "https://rinkeby.infura.io/" + accessToken 
        );
      },
      network_id: 4
    }

  }
}
