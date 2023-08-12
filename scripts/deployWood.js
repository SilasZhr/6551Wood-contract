const hre = require("hardhat");

async function main() {
  // Deploy the Wood contract
  const Wood = await hre.ethers.getContractFactory("Wood");
  const wood = await Wood.deploy();


  console.log(`Wood deployed to: ${wood.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
