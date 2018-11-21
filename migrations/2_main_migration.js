var V00_UserRegistry = artifacts.require("./origin/identity/V00_UserRegistry.sol");
var ClaimHolder = artifacts.require("./origin/identity/ClaimHolder.sol");
var VerifiedNFT = artifacts.require("./VerifiedNFT.sol");

var { writeFileSync } = require('fs')
var Wallet = require('ethereumjs-wallet');
var Web3Utils = require('web3-utils');

var wallet = Wallet.generate();
var signerPrivKey = wallet.getPrivateKeyString();
var signerAddress = wallet.getAddressString();
var signerKey = Web3Utils.soliditySha3(signerAddress)

writeFileSync('../signer_priv_key', signerPrivKey)

module.exports = async function(deployer) {
  await deployer.deploy(V00_UserRegistry).then(async () => {
    await deployer.deploy(ClaimHolder).then(async () => {
      var claimHolder = await ClaimHolder.deployed();
      var v00_UserRegistry = await V00_UserRegistry.deployed();
      await claimHolder.addKey(signerKey, 3, 1);

      await deployer.deploy(VerifiedNFT, claimHolder.address, v00_UserRegistry.address, 1, 2, 2);
    })
  })
};
