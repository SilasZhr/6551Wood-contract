// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./interfaces/IERC6551Registry.sol";

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

    // Register an 6551 account to Woodyard
    function register(address tokenContract, uint256 tokenId) external {
        address accountAddress = account(tokenContract, tokenId);
        require(lastClaimedAt[accountAddress] == 0, "Already registered");
        lastClaimedAt[accountAddress] = block.timestamp;

        emit Registered(accountAddress);
    }

    function stake() returns () {}

    // Claim WOOD tokens to an 6551 account
    function claim(address tokenContract, uint256 tokenId) external {
        address accountAddress = account(tokenContract, tokenId);

        require(lastClaimedAt[accountAddress] != 0, "Not registered");

        uint accumulatedWood = earned(accountAddress);
        require(accumulatedWood > 0, "Nothing to claim");
        lastClaimedAt[accountAddress] = block.timestamp;
        woodToken.transfer(accountAddress, accumulatedWood);

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

    event Registered(address indexed account);
    event Claimed(address indexed account, uint256 amount);
}
