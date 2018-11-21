var VerifiedNFT = artifacts.require('TestVerifiedNFT.sol')
var Identity = artifacts.require('Identity.sol')

var V00_UserRegistry = artifacts.require("./origin/identity/V00_UserRegistry.sol");
var ClaimVerifier = artifacts.require("./origin/identity/ClaimVerifier.sol");
var ClaimHolder = artifacts.require("./origin/identity/ClaimHolder.sol");

var { readFileSync } = require('fs')

var Web3 = require('web3');
var signerPrivKey = readFileSync('signer_priv_key', 'utf-8');

console.log(new Web3(web3.currentProvider))

const web3Eth = new Web3(web3.currentProvider).eth;
const web3Utils = new Web3(web3.currentProvider).utils;

contract('Integration', async function (accounts) {

    it('Deploy identity', async function () {
        var v00_UserRegistry = await V00_UserRegistry.deployed()
        await Identity.new(v00_UserRegistry.address);
        await Identity.new(v00_UserRegistry.address, { from: accounts[1] });
    })

    it('mint without identity', async function () {
        var verifiedNFT = await VerifiedNFT.deployed();

        var ID;

        try {
            ID = await VerifiedNFT.mint();
        } catch (error) {
            
        }
            assert.equal(ID, undefined)

    })

    it('mint with identity', async function () {

        var verifiedNFT = await VerifiedNFT.deployed();
        var v00_UserRegistry = await V00_UserRegistry.deployed()
        var issuer = await ClaimHolder.deployed();

        var user = await v00_UserRegistry.users(accounts[0]);
        var identity = await Identity.at(user);

        var claimType = 1;
        var rawData = "Verified OK";
        var hexData = web3Utils.asciiToHex(rawData)
        var data = web3Utils.soliditySha3(user, claimType, hexData)
        var sig = web3Eth.accounts.sign(data, signerPrivKey).signature;

        await identity.addClaim(
            claimType,
            0,
            issuer.address,
            sig,
            hexData,
            ""
        )

        await verifiedNFT.mint();
        var ID = await verifiedNFT.totalSupply();
        assert.equal(await verifiedNFT.ownerOf(ID), accounts[0]);    
    })

    it('send without reciever kyc', async function () {

        var verifiedNFT = await VerifiedNFT.deployed();
        var v00_UserRegistry = await V00_UserRegistry.deployed()
        var issuer = await ClaimHolder.deployed();

        var user = await v00_UserRegistry.users(accounts[0]);
        var identity = await Identity.at(user);

        var claimType = 2;
        var rawData = "Verified OK";
        var hexData = web3Utils.asciiToHex(rawData)
        var data = web3Utils.soliditySha3(user, claimType, hexData)
        var sig = web3Eth.accounts.sign(data, signerPrivKey).signature;

        await identity.addClaim(
            claimType,
            0,
            issuer.address,
            sig,
            hexData,
            ""
        )

        var FLAG = false;
        var ID = await verifiedNFT.totalSupply();
        try {
            await VerifiedNFT.transferFrom(accounts[0],accounts[1], ID);
            FLAG = true;
        } catch (error) {
            
        }
        assert.equal(FLAG, false)
        
    })

    it('send with kyc', async function () {

        var verifiedNFT = await VerifiedNFT.deployed();
        var v00_UserRegistry = await V00_UserRegistry.deployed()
        var issuer = await ClaimHolder.deployed();

        var user = await v00_UserRegistry.users(accounts[1]);
        var identity = await Identity.at(user);

        var claimType = 2;
        var rawData = "Verified OK";
        var hexData = web3Utils.asciiToHex(rawData)
        var data = web3Utils.soliditySha3(user, claimType, hexData)
        var sig = web3Eth.accounts.sign(data, signerPrivKey).signature;

        await identity.addClaim(
            claimType,
            0,
            issuer.address,
            sig,
            hexData,
            "",
            {from: accounts[1]}
        )

        var ID = await verifiedNFT.totalSupply();
        await verifiedNFT.transferFrom(accounts[0],accounts[1], ID);

        
    })    

})