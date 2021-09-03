async function main() {
  const [owner, randoPerson] = await ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();
  console.log("Contract deployed to:", waveContract.address);
  console.log("Contract deployed by", owner.address);

  let waveTotal;
  waveTotal = await waveContract.totalWaves();

  let waveTxn = await waveContract.wave();
  await waveContract.wave();
  await waveContract.wave();
  await waveTxn.wait();

  waveTotal = await waveContract.totalWaves();

  await waveContract.showArray();

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1)
  })