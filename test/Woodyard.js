const { expect } = require("chai");

describe("Woodyard", function () {
    let Woodyard;
    let woodToken;
    let registryContract;
    let woodyard;

    beforeEach(async function () {
        // Deploy the necessary contracts
        Woodyard = await ethers.getContractFactory("Woodyard");
        woodToken = await ethers.getContractAt("IERC20", "<WOOD_TOKEN_ADDRESS>");
        registryContract = await ethers.getContractAt(
            "ERC6551Registry",
            "<REGISTRY_CONTRACT_ADDRESS>"
        );

        // Deploy the Woodyard contract
        woodyard = await Woodyard.deploy(
            woodToken.address,
            registryContract.address,
            "<IMPLEMENTATION_ADDRESS>"
        );

        // Wait for the contract to be deployed
        await woodyard.deployed();
    });

    it("Should register an account", async function () {
        const tokenContract = "<TOKEN_CONTRACT_ADDRESS>";
        const tokenId = "<TOKEN_ID>";

        await woodyard.register(tokenContract, tokenId);

        // Assert that the account is registered by checking the last claimed timestamp
        const accountAddress = await woodyard.account(tokenContract, tokenId);
        const lastClaimedAt = await woodyard.lastClaimedAt(accountAddress);

        expect(lastClaimedAt.toNumber()).to.be.greaterThan(0);
    });

    it("Should claim WOOD tokens to an account", async function () {
        // Register an account first
        const tokenContract = "<TOKEN_CONTRACT_ADDRESS>";
        const tokenId = "<TOKEN_ID>";

        await woodyard.register(tokenContract, tokenId);

        // Claim WOOD tokens
        const accountAddress = await woodyard.account(tokenContract, tokenId);
        const initialBalance = await woodToken.balanceOf(accountAddress);

        await woodyard.claim(tokenContract, tokenId);

        // Assert that the WOOD tokens are claimed and transferred to the account
        const finalBalance = await woodToken.balanceOf(accountAddress);
        expect(finalBalance).to.be.greaterThan(initialBalance);
    });

    it("Should calculate the earned WOOD tokens", async function () {
        // Register an account first
        const tokenContract = "<TOKEN_CONTRACT_ADDRESS>";
        const tokenId = "<TOKEN_ID>";

        await woodyard.register(tokenContract, tokenId);

        // Calculate the earned WOOD tokens
        const accountAddress = await woodyard.account(tokenContract, tokenId);
        const elapsedTime = 1 * 24 * 60 * 60; // 1 day in seconds

        // Increase the time to simulate elapsed time
        await ethers.provider.send("evm_increaseTime", [elapsedTime]);

        const earnedTokens = await woodyard.earned(accountAddress);

        // Assert that the earned tokens are calculated correctly
        expect(earnedTokens.toNumber()).to.equal("<EXPECTED_EARNED_TOKENS>");
    });
});
