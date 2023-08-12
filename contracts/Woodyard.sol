// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./interfaces/IERC6551Registry.sol";
import "./utils/Exec.sol";

contract Woodyard {
    IERC721 public immutable axeToken; // The AXE NFT contract

    IERC20 public immutable woodToken; // The WOOD token contract

    IERC6551Registry private registryContract; // The registry contract

    address private implementation; // Implementation set by the owner

    mapping(address => uint) public lastClaimedAt; // 6551 account address => last claimed timestamp

    uint public maxAccumulatedWood = 100e18; // Maximum amount of WOOD tokens that can be accumulated per account

    constructor(
        address _axeToken,
        address _woodToken,
        address _registryAddress,
        address _implementation
    ) {
        axeToken = IERC721(_axeToken);
        woodToken = IERC20(_woodToken);
        registryContract = IERC6551Registry(_registryAddress);
        implementation = _implementation;
    }

    // check if msg.sender is a NFT Bound Account
    modifier isAccountOwner(address tokenContract, uint256 tokenId) {
        require(_isContact(msg.sender));
        address accountAddress = account(tokenContract, tokenId);
        require(accountAddress == msg.sender);

    }

    function stake(address AxeContract, uint256 tokenId) public isAccountOwner(tokenContract, tokenId) returns () {
        require(lastClaimedAt[msg.sender] == 0, "Already staked");
        bytes memor data = abi.encodeWithSignature("transferFrom(address,address,uint256)", msg.sender, address(this), tokenId);
        bool success = Exec.call(AxeContract, 0, data, gasleft());
        require(sucess, "stake failed")
        lastClaimedAt[msg.sender] = block.timestamp;

        emit Staked(msg.sender, AxeContract, tokenId);
    }

    // Claim WOOD tokens to an 6551 account
    function claim(address tokenContract, uint256 tokenId) external {

        require(lastClaimedAt[msg.sender] != 0, "Not staked");

        uint accumulatedWood = earned(msg.sender);
        require(accumulatedWood > 0, "Nothing to claim");
        lastClaimedAt[msg.sender] = block.timestamp;
        woodToken.transfer(msg.sender, accumulatedWood);

        emit Claimed(accountAddress, accumulatedWood);
    }

    // Returns the amount of WOOD tokens that can be claimed by an 6551 account
    function earned(address _account) public view returns (uint) {
        if (lastClaimedAt[_account] == 0) {
            return 0;
        }
        uint elapsedTime = block.timestamp - lastClaimedAt[_account];
        //  Claim tokens per day
        if (elapsedTime >= 1 days) {
            return maxAccumulatedWood;
        } else {
            return (maxAccumulatedWood * elapsedTime) / 1 days;
        }
    }

    // Returns the 6551 account address
    function account(
        address tokenContract,
        uint256 tokenId
    ) public view returns (address) {
        return
            registryContract.account(
                implementation, // Use the owner-set implementation address
                block.chainid,
                tokenContract,
                tokenId,
                0
            );
    }

    function _isContact(address account) internal pure view return(bool) {
        uint size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }

    event Registered(address indexed account);
    event Staked(address account, address tokenContract, uint256 tokenId);
    event Claimed(address indexed account, uint256 amount);
}
