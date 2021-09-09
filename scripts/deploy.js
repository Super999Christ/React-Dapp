async function main() {
  const waveContractFactory = await ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({value: ethers.utils.parseEther("0.1")});
  await waveContract.deployed()
  console.log("WavePortal address:", waveContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });