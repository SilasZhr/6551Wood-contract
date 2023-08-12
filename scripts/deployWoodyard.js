const hre = require("hardhat");
require("dotenv").config();


async function main() {
  // Deploy the Woodyard contract
  const Woodyard = await hre.ethers.getContractFactory("Woodyard");
  
  // Replace the following placeholders with actual addresses and values
  const woodTokenAddress = process.env.WOOD_TOKEN_ADDRESS;
  const registryContractAddress =process.env.REGISTRY_CONTRACT_ADDRESS;
  const implementationAddress = process.env.IMPLEMENTATION_ADDRESS;

  const woodyard = await Woodyard.deploy(
    woodTokenAddress,
    registryContractAddress,
    implementationAddress
  );

  console.log(`Woodyard deployed to: ${woodyard.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
