const hre = require("hardhat");

async function main() {
  const aethAddress = process.env.AETH_TOKEN_ADDRESS;
  const walletManagerAddress = process.env.WALLET_MANAGER_ADDRESS;

  if (!aethAddress || !walletManagerAddress) {
    console.error("❌ Please set contract addresses in .env file");
    process.exit(1);
  }

  console.log("🔍 Verifying contracts on Ronin Explorer...\n");

  // Verify AeloriaToken
  console.log("Verifying AeloriaToken at:", aethAddress);
  try {
    await hre.run("verify:verify", {
      address: aethAddress,
      constructorArguments: [],
    });
    console.log("✅ AeloriaToken verified!\n");
  } catch (error) {
    console.log("⚠️  Verification failed or already verified:", error.message, "\n");
  }

  // Verify WalletManager
  console.log("Verifying WalletManager at:", walletManagerAddress);
  try {
    await hre.run("verify:verify", {
      address: walletManagerAddress,
      constructorArguments: [aethAddress],
    });
    console.log("✅ WalletManager verified!\n");
  } catch (error) {
    console.log("⚠️  Verification failed or already verified:", error.message, "\n");
  }

  console.log("✅ Verification complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
