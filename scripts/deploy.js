async function main() {
  const waveContractFactory = await ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({value: ethers.utils.parseEther("0.1")});
  await waveContract.deployed()
  console.log("WavePortal address:", waveContract.address);

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy();

  console.log("Token deployed to:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });