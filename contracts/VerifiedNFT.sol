pragma solidity ^0.4.24;

import "./openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "./origin/identity/ClaimVerifier.sol";
import "./origin/identity/V00_UserRegistry.sol";

contract VerifiedNFT is ERC721Full, ClaimVerifier {

    V00_UserRegistry userRegistry;

    uint8 mintable;
    uint8 sendable;
    uint8 receivable;

    constructor (
        address _userRegistryAddress,
        address _claimHolderAddress,
        uint8 _mintable,
        uint8 _sendable,
        uint8 _receivable
    ) ERC721Full (
        "VerifiedNFT",
        "VNFT"
    ) ClaimVerifier (
        _claimHolderAddress
    ) public {
        userRegistry = V00_UserRegistry(_userRegistryAddress);
        mintable;
        sendable;
        receivable;
    }    

  // Mapping from token ID to approved address
  mapping (uint256 => address) private _tokenApprovals;

  /**
   * @dev Transfers the ownership of a given token ID to another address
   * Usage of this method is discouraged, use `safeTransferFrom` whenever possible
   * Requires the msg sender to be the owner, approved, or operator
   * @param from current owner of the token
   * @param to address to receive the ownership of the given token ID
   * @param tokenId uint256 ID of the token to be transferred
  */
  function transferFrom(
    address from,
    address to,
    uint256 tokenId
  )
    public
  {
    ClaimHolder _sender = ClaimHolder(userRegistry.users(from));
    require(checkClaim(_sender, sendable));   

    ClaimHolder _receiver = ClaimHolder(userRegistry.users(to));
    require(checkClaim(_receiver, receivable));   
    
    require(_isApprovedOrOwner(msg.sender, tokenId));
    require(to != address(0));

    _clearApproval(from, tokenId);
    _removeTokenFrom(from, tokenId);
    _addTokenTo(to, tokenId);

    emit Transfer(from, to, tokenId);
  }

  /**
   * @dev Internal function to mint a new token
   * Reverts if the given token ID already exists
   * @param to The address that will own the minted token
   * @param tokenId uint256 ID of the token to be minted by the msg.sender
   */
  function _mint(address to, uint256 tokenId) internal {
    ClaimHolder _minter = ClaimHolder(userRegistry.users(msg.sender));
    require(checkClaim(_minter, mintable));   
    
    require(to != address(0));
    _addTokenTo(to, tokenId);
    emit Transfer(address(0), to, tokenId);
  }

  /**
   * @dev Private function to clear current approval of a given token ID
   * Reverts if the given address is not indeed the owner of the token
   * @param owner owner of the token
   * @param tokenId uint256 ID of the token to be transferred
   */
  function _clearApproval(address owner, uint256 tokenId) private {
    require(ownerOf(tokenId) == owner);
    if (_tokenApprovals[tokenId] != address(0)) {
      _tokenApprovals[tokenId] = address(0);
    }
  }


}