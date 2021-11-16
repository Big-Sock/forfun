// LIVE
const liveAddresses = {
  HoldingAddress: "0x99E12094c228F550809F20Ba196DCc95E6b8faeA",
  RewardTokenAddress: "0x35b55c25731E9b05B1d8480ba39463d52C9D0211",
  WStockAddress: "0x15C5f0F18FEb8a9F5808cCD2fC4ac279d9D89bB8",
  PrivateSaleAddress: "0x09CFF6610bC8031CF2c2bcD12B9EeB68A762b02f",
  GMETokenAddress: "0xF775fd477eA93C0E76C556F274c4290d46ee2BDb",
  TSLATokenAddress: "0xac45140E18122f882cA3ed92F72082fdea21da61",
  AAPLTokenAddress: "0x4B6f1Cb37fBC07B2ea6A4866598119a67294931f",
  network: "wss://mainnet.infura.io/ws/v3/6ccf1a93211c4d81954db7a9f33302bf",
};

const testAddresses = {
  HoldingAddress: "0xF739D434F243E56e695aD937ABF70a5C2a0a6AC9",
  RewardTokenAddress: "0x1820e4eB3031D27cb30b3040DA17A7697Ee72d23",
  WStockAddress: "0x498CfC506698F9798de7b70a1e3d7F46e010c925",
  PrivateSaleAddress: "0x7D0773fbb3a166BF40755D02450B6e7a396e17ac",
  GMETokenAddress: "0xbFc1B92cf1DAA3251a06E1e7f7FA4f263a0085B2",
  TSLATokenAddress: "0x2DA334020E4aFd8c29dA09aFA1555eD46fe4d507",
  AAPLTokenAddress: "0x6e844C6C98D02dfEC57B37e8F1bFBBda522327ef",
  network: "https://goerli.infura.io/v3/274e5929f1c74c08b44478e6e4abef8d",
};

module.exports = process.env.PRODUCTION === "1" ? liveAddresses : testAddresses;
