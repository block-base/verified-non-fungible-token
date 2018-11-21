pragma solidity ^0.4.22;

import "./origin/identity/ClaimHolder.sol";
import "./origin/identity/V00_UserRegistry.sol";

contract Identity is ClaimHolder {

    function Identity(
        address _registry
    )
        public 
    {   
        V00_UserRegistry(_registry).registerUser();
    }

}
