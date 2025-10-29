const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying Aeloria Smart Contracts to Ronin Network...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("📍 Deploying contracts with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "RON\n");

  // Deploy AETH Token
  console.log("📜 Deploying AeloriaToken (AETH)...");
  const AeloriaToken = await hre.ethers.getContractFactory("AeloriaToken");
  const aethToken = await AeloriaToken.deploy();
  await aethToken.waitForDeployment();
  const aethAddress = await aethToken.getAddress();
  console.log("✅ AeloriaToken deployed to:", aethAddress);

  // Get initial supply
  const initialSupply = await aethToken.totalSupply();
  console.log("   Initial supply:", hre.ethers.formatEther(initialSupply), "AETH\n");

  // Deploy WalletManager
  console.log("📜 Deploying WalletManager...");
  const WalletManager = await hre.ethers.getContractFactory("WalletManager");
  const walletManager = await WalletManager.deploy(aethAddress);
  await walletManager.waitForDeployment();
  const walletManagerAddress = await walletManager.getAddress();
  console.log("✅ WalletManager deployed to:", walletManagerAddress);
  
  // Get withdrawal fee
  const fee = await walletManager.AETH_WITHDRAWAL_FEE();
  console.log("   AETH withdrawal fee:", Number(fee) / 100, "%\n");

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      AeloriaToken: {
        address: aethAddress,
        initialSupply: hre.ethers.formatEther(initialSupply),
      },
      WalletManager: {
        address: walletManagerAddress,
        aethTokenAddress: aethAddress,
        withdrawalFee: `${Number(fee) / 100}%`,
      },
    },
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  const filename = `${hre.network.name}-${Date.now()}.json`;
  const filepath = path.join(deploymentsDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("📝 Deployment info saved to:", filename);
  console.log("\n" + "=".repeat(60));
  console.log("🎉 Deployment Complete!");
  console.log("=".repeat(60));
  console.log("\n📋 Contract Addresses:");
  console.log("   AETH Token:     ", aethAddress);
  console.log("   Wallet Manager: ", walletManagerAddress);
  console.log("\n🔗 Add these addresses to your .env file:");
  console.log(`   AETH_TOKEN_ADDRESS=${aethAddress}`);
  console.log(`   WALLET_MANAGER_ADDRESS=${walletManagerAddress}`);
  console.log("\n⚠️  Don't forget to:");
  console.log("   1. Update frontend with contract addresses");
  console.log("   2. Update backend with contract addresses");
  console.log("   3. Verify contracts on block explorer (optional)");
  console.log("\n" + "=".repeat(60) + "\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
