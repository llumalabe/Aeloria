const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Aeloria Contracts to Ronin Network...\n");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy AeloriaToken
  console.log("\n📝 Deploying AeloriaToken...");
  const AeloriaToken = await ethers.getContractFactory("AeloriaToken");
  
  const rewardPool = deployer.address; // For demo, using deployer address
  const treasuryWallet = deployer.address;
  const teamWallet = deployer.address;
  
  const token = await AeloriaToken.deploy(rewardPool, treasuryWallet, teamWallet);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ AeloriaToken deployed to:", tokenAddress);

  // Deploy AeloriaCharacter
  console.log("\n📝 Deploying AeloriaCharacter NFT...");
  const AeloriaCharacter = await ethers.getContractFactory("AeloriaCharacter");
  const character = await AeloriaCharacter.deploy();
  await character.waitForDeployment();
  const characterAddress = await character.getAddress();
  console.log("✅ AeloriaCharacter deployed to:", characterAddress);

  // Deploy AeloriaItem
  console.log("\n📝 Deploying AeloriaItem NFT...");
  const AeloriaItem = await ethers.getContractFactory("AeloriaItem");
  const item = await AeloriaItem.deploy();
  await item.waitForDeployment();
  const itemAddress = await item.getAddress();
  console.log("✅ AeloriaItem deployed to:", itemAddress);

  // Deploy AeloriaMarketplace
  console.log("\n📝 Deploying AeloriaMarketplace...");
  const AeloriaMarketplace = await ethers.getContractFactory("AeloriaMarketplace");
  const marketplace = await AeloriaMarketplace.deploy(deployer.address);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("✅ AeloriaMarketplace deployed to:", marketplaceAddress);

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 Deployment Complete!");
  console.log("=".repeat(60));
  console.log("\n📋 Contract Addresses:\n");
  console.log(`AeloriaToken:       ${tokenAddress}`);
  console.log(`AeloriaCharacter:   ${characterAddress}`);
  console.log(`AeloriaItem:        ${itemAddress}`);
  console.log(`AeloriaMarketplace: ${marketplaceAddress}`);
  console.log("\n" + "=".repeat(60));
  console.log("\n💡 Next Steps:");
  console.log("1. Update .env files with these contract addresses");
  console.log("2. Verify contracts on Ronin Explorer");
  console.log("3. Test minting characters and items");
  console.log("\n" + "=".repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
