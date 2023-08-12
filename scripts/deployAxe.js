const hre = require("hardhat");

async function main() {
    // Deploy the Wood contract
    const Axe = await hre.ethers.getContractFactory("Axe");
    const axe = await Axe.deploy();


    console.log(`Axe deployed to: ${axe.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
