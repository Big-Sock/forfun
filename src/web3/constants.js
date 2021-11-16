export const isProduction = true;

const liveAddresses = {
  HoldingAddress: "0x99E12094c228F550809F20Ba196DCc95E6b8faeA",
  StonkTokenAddress: "0x35b55c25731E9b05B1d8480ba39463d52C9D0211",
  WStockAddress: "0x15C5f0F18FEb8a9F5808cCD2fC4ac279d9D89bB8",
  PrivateSaleAddress: "0x09CFF6610bC8031CF2c2bcD12B9EeB68A762b02f",
  GMETokenAddress: "0xF775fd477eA93C0E76C556F274c4290d46ee2BDb",
  TSLATokenAddress: "0xac45140E18122f882cA3ed92F72082fdea21da61",
  AAPLTokenAddress: "0x4B6f1Cb37fBC07B2ea6A4866598119a67294931f",
  COINTokenAddress: "0xeb69096E5f0f7782353dc53127d3c908eDA854A0",
  StonkLPAddress: "0x1816327b28e73c67604532a81158fd356302b775",
  provider: "https://mainnet.infura.io/v3/6ccf1a93211c4d81954db7a9f33302bf",
  LPStakingAddress: "0x61073d23e2b7D7207792fA860b32c378a0Ad597C",
  TSLAStakingAddress: "0x67F386dF19A50A910D960A74008118ca460bf82d", //DISABLED
  COINStakingAddress: "0xbde04877fC1B24f9c563974b376055706AeDf608",
  STONKStakingAddress: "0x86996AAdb0e7F559D4d0f6F6859a3b42820f679a",
};

const testAddresses = {
  HoldingAddress: "0xF739D434F243E56e695aD937ABF70a5C2a0a6AC9",
  StonkTokenAddress: "0x1820e4eB3031D27cb30b3040DA17A7697Ee72d23",
  WStockAddress: "0x498CfC506698F9798de7b70a1e3d7F46e010c925",
  PrivateSaleAddress: "0x7D0773fbb3a166BF40755D02450B6e7a396e17ac",
  GMETokenAddress: "0xbFc1B92cf1DAA3251a06E1e7f7FA4f263a0085B2",
  TSLATokenAddress: "0x2DA334020E4aFd8c29dA09aFA1555eD46fe4d507",
  AAPLTokenAddress: "0x6e844C6C98D02dfEC57B37e8F1bFBBda522327ef",
  network: "https://goerli.infura.io/v3/274e5929f1c74c08b44478e6e4abef8d",
};

export default isProduction ? liveAddresses : testAddresses;
