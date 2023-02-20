const hre = require("hardhat");

async function main() {
  const ExampStreamer = await hre.ethers.getContractFactory("Streamer");
  const exampleStreamer = await ExampStreamer.deploy();

  await exampleStreamer.deployed();

  console.log("Streamer deployed to:", exampleStreamer.address);


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
