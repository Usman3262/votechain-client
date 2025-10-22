// File structure validation script for VoteChain
const fs = require('fs');
const path = require('path');

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function validateConfiguration() {
  console.log('VoteChain Project Validation');
  console.log('===========================\n');

  // Check frontend structure
  console.log('1. Frontend Structure Validation:');
  const frontendFiles = [
    'package.json',
    'src/App.tsx',
    'src/main.tsx',
    'src/context/AuthContext.tsx',
    'src/context/Web3Context.tsx',
    'src/components/ProtectedRoute.tsx',
    'src/components/ui/WalletButton.tsx',
    'src/components/ui/CandidateCard.tsx',
    'src/pages/Home.tsx',
    'src/pages/auth/Login.tsx',
    'src/pages/auth/Register.tsx',
    'src/pages/auth/PendingApproval.tsx',
    'src/pages/Dashboard.tsx',
    'src/pages/Vote.tsx',
    'src/pages/admin/AdminDashboard.tsx',
    'src/pages/admin/CreateElection.tsx',
    'src/services/api.ts',
    'src/services/contract.ts'
  ];

  let frontendOk = true;
  for (const file of frontendFiles) {
    const exists = checkFileExists(file);
    console.log(`   ${exists ? '✓' : '❌'} ${file}`);
    if (!exists) frontendOk = false;
  }
  console.log(`   Frontend: ${frontendOk ? '✓ COMPLETE' : '❌ INCOMPLETE'}\n`);

  // Check backend structure
  console.log('2. Backend Structure Validation:');
  const backendFiles = [
    'backend/package.json',
    'backend/server.js',
    'backend/config/db.js',
    'backend/models/User.js',
    'backend/models/Election.js',
    'backend/models/Vote.js',
    'backend/controllers/authController.js',
    'backend/controllers/adminController.js',
    'backend/controllers/electionController.js',
    'backend/controllers/relayerController.js',
    'backend/middleware/auth.js',
    'backend/routes/auth.js',
    'backend/routes/admin.js',
    'backend/routes/election.js',
    'backend/routes/vote.js',
    'backend/services/blockchainService.js',
    'backend/services/signatureService.js'
  ];

  let backendOk = true;
  for (const file of backendFiles) {
    const exists = checkFileExists(file);
    console.log(`   ${exists ? '✓' : '❌'} ${file}`);
    if (!exists) backendOk = false;
  }
  console.log(`   Backend: ${backendOk ? '✓ COMPLETE' : '❌ INCOMPLETE'}\n`);

  // Check blockchain structure
  console.log('3. Blockchain Structure Validation:');
  const blockchainFiles = [
    'blockchain/package.json',
    'blockchain/contracts/VoteChain.sol',
    'blockchain/hardhat.config.js',
    'blockchain/scripts/deploy.js',
    'blockchain/test/VoteChain.js'
  ];

  let blockchainOk = true;
  for (const file of blockchainFiles) {
    const exists = checkFileExists(file);
    console.log(`   ${exists ? '✓' : '❌'} ${file}`);
    if (!exists) blockchainOk = false;
  }
  console.log(`   Blockchain: ${blockchainOk ? '✓ COMPLETE' : '❌ INCOMPLETE'}\n`);

  // Check documentation
  console.log('4. Documentation Validation:');
  const docFiles = [
    'README.md',
    'docs/VoteChain_Project_Report.md'
  ];

  let docsOk = true;
  for (const file of docFiles) {
    const exists = checkFileExists(file);
    console.log(`   ${exists ? '✓' : '❌'} ${file}`);
    if (!exists) docsOk = false;
  }
  console.log(`   Documentation: ${docsOk ? '✓ COMPLETE' : '❌ INCOMPLETE'}\n`);

  // Check environment files
  console.log('5. Environment Configuration Validation:');
  const envFiles = [
    '.env.example',
    'backend/.env.example'
  ];

  let envOk = true;
  for (const file of envFiles) {
    const exists = checkFileExists(file);
    console.log(`   ${exists ? '✓' : '❌'} ${file}`);
    if (!exists) envOk = false;
  }
  console.log(`   Environment: ${envOk ? '✓ COMPLETE' : '❌ INCOMPLETE'}\n`);

  // Check deployment script
  console.log('6. Deployment Script Validation:');
  const deployScripts = [
    'deploy.bat'
  ];

  let deployOk = true;
  for (const file of deployScripts) {
    const exists = checkFileExists(file);
    console.log(`   ${exists ? '✓' : '❌'} ${file}`);
    if (!exists) deployOk = false;
  }
  console.log(`   Deployment: ${deployOk ? '✓ COMPLETE' : '❌ INCOMPLETE'}\n`);

  // Final summary
  console.log('FINAL VALIDATION SUMMARY');
  console.log('========================');
  console.log(`Frontend:      ${frontendOk ? '✓' : '❌'}`);
  console.log(`Backend:       ${backendOk ? '✓' : '❌'}`);
  console.log(`Blockchain:    ${blockchainOk ? '✓' : '❌'}`);
  console.log(`Documentation: ${docsOk ? '✓' : '❌'}`);
  console.log(`Environment:   ${envOk ? '✓' : '❌'}`);
  console.log(`Deployment:    ${deployOk ? '✓' : '❌'}`);
  
  const allOk = frontendOk && backendOk && blockchainOk && docsOk && envOk && deployOk;
  console.log(`\nOverall Status: ${allOk ? '✓ ALL SYSTEMS READY' : '❌ MISSING COMPONENTS'}`);
  
  if (allOk) {
    console.log('\n🎉 VoteChain project is fully configured and ready for deployment!');
    console.log('\nNext steps:');
    console.log('1. Set up your environment variables');
    console.log('2. Start a local Hardhat node: cd blockchain && npx hardhat node');
    console.log('3. Deploy the smart contract: npx hardhat run scripts/deploy.js --network localhost');
    console.log('4. Start the backend: cd backend && npm run dev');
    console.log('5. Start the frontend: npm run dev');
    console.log('6. Register an account and set admin privileges for testing');
  } else {
    console.log('\n⚠️  Please complete the missing components before deployment.');
  }
  
  return allOk;
}

// Run validation
validateConfiguration();