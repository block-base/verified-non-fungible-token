pragma solidity ^0.4.23;

import "./VerifiedNFT.sol";

contract TestVerifiedNFT is VerifiedNFT {

    constructor (
        address _userRegistryAddress,
        address _claimHolderAddress,
        uint8 _mintable,
        uint8 _sendable,
        uint8 _receivable
    ) VerifiedNFT (
        _userRegistryAddress,
        _claimHolderAddress,
        _mintable,
        _sendable,
        _receivable    
    ) ERC721Full (
        "SmartContents",
        "SC"
    )public {

    }    

    uint public totalSupply;

    function mint() public {
        totalSupply++;
        _mint(msg.sender, totalSupply);
    }

}