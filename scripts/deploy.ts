import { network } from "hardhat";

// 1. Framework/Plugin ke mutabiq network config se ethers extract karna
const { ethers } = await network.create({
  network: "sepolia"
});

async function main() {
  console.log("Deploying TestToken contract...");

  // 2. Contract Factory hasil karna (Aapka contract name 'TestToken' hai)
  const TestTokenFactory = await ethers.getContractFactory("TestToken");

  // 3. Contract deploy karna (Constructor mein koi arguments nahi hain)
  const testToken = await TestTokenFactory.deploy();

  // 4. Deployment complete hone ka wait karna
  await testToken.waitForDeployment();

  // 5. Deployed Address print karna
  console.log(`TestToken successfully deployed to: ${await testToken.getAddress()}`);
}

// Script ko execute karna aur errors handle karna
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });