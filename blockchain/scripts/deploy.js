async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance));

  const voteChainFactory = await ethers.getContractFactory("VoteChain");
  const voteChain = await voteChainFactory.deploy();

  await voteChain.waitForDeployment();

  console.log("VoteChain deployed to:", await voteChain.getAddress());

  // Write contract address to backend .env
  const fs = require('fs');
  const envPath = '../backend/.env';
  
  // Read existing env file or create new one
  let envContent = '';
  try {
    envContent = fs.readFileSync(envPath, 'utf8');
  } catch (error) {
    // If file doesn't exist, start with empty content
    envContent = '';
  }
  
  // Update or add CONTRACT_ADDRESS
  const contractAddress = await voteChain.getAddress();
  const regex = /^CONTRACT_ADDRESS=.*$/m;
  if (regex.test(envContent)) {
    envContent = envContent.replace(regex, `CONTRACT_ADDRESS=${contractAddress}`);
  } else {
    envContent += `\nCONTRACT_ADDRESS=${contractAddress}`;
  }
  
  // Update CHAIN_ID
  const network = await ethers.provider.getNetwork();
  const chainId = Number(network.chainId);
  const chainIdRegex = /^CHAIN_ID=.*$/m;
  if (chainIdRegex.test(envContent)) {
    envContent = envContent.replace(chainIdRegex, `CHAIN_ID=${chainId}`);
  } else {
    envContent += `\nCHAIN_ID=${chainId}`;
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log("Contract address and chain ID written to backend/.env");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });