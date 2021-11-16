import axios from "axios";
import { BigNumber, constants, Contract, providers, utils } from "ethers";
import Swal from "sweetalert2";
import PrivateSaleABI from "./abi/PrivateSale.abi";
import RewardTokenABI from "./abi/RewardToken.abi";
import StakingPoolABI from "./abi/StakingPool.abi";
import StockTokenABI from "./abi/StockToken.abi";
import WStockABI from "./abi/WStock.abi";
import addresses from "./constants";

const {
  StonkTokenAddress,
  WStockAddress,
  PrivateSaleAddress,
  LPStakingAddress,
  StonkLPAddress,
  COINTokenAddress,
  COINStakingAddress,
  STONKStakingAddress,
} = addresses;

export const connectProvider = async () => {
  let provider;
  let walletAddress;

  provider = new providers.Web3Provider(window.ethereum);
  walletAddress = window.ethereum.selectedAddress;
  if (!provider) {
    console.log("provider not found");
    console.log(provider);
    throw Error("provider not found");
  }
  if (!walletAddress) {
    console.log("userWallet not found");
    console.log(walletAddress);
    throw Error("userWallet not found");
  }
  return { provider, walletAddress };
};


export const approveWStock = async (stock, callback) => {
  const { provider, walletAddress } = await connectProvider();
  const signer = provider.getSigner();
  // const rcontract = new Contract(StonkTokenAddress, RewardTokenABI, signer)
  const scontract = new Contract(stock.address, StockTokenABI, signer);
  // let rres = rcontract.approve(WStockAddress, constants.MaxUint256)
  //     .then((r) => r.wait())
  //     .then(() => {
  //         const Allowance = rcontract.allowance(walletAddress, WStockAddress).then(r => (utils.formatEther(r)))
  //         return Allowance;
  //     })
  let sres = scontract
    .approve(WStockAddress, constants.MaxUint256)
    .then((r) => r.wait())
    .then(() => {
      const Allowance = scontract
        .allowance(walletAddress, WStockAddress)
        .then((r) => utils.formatEther(r));
      return Allowance;
    });
  Promise.all([sres]).then((res) => {
    callback(res);
  });
};

export const approveStonk = async (callback) => {
  const { provider, walletAddress } = await connectProvider();
  const signer = provider.getSigner();
  const scontract = new Contract(StonkTokenAddress, RewardTokenABI, signer);
  let sres = scontract
    .approve(WStockAddress, constants.MaxUint256)
    .then((r) => r.wait())
    .then(() => {
      const Allowance = scontract
        .allowance(walletAddress, WStockAddress)
        .then((r) => utils.formatEther(r));
      return Allowance;
    });
  Promise.all([sres]).then((res) => {
    callback(res);
  });
};

export const getAllowance = async (stock, callback) => {
  const { provider, walletAddress } = await connectProvider();
  const signer = provider.getSigner();

  const rcontract = new Contract(StonkTokenAddress, RewardTokenABI, signer);
  const scontract = new Contract(stock.address, StockTokenABI, signer);
  let rres = rcontract
    .allowance(walletAddress, WStockAddress)
    .then((r) => utils.formatEther(r));
  let sres = scontract
    .allowance(walletAddress, WStockAddress)
    .then((r) => utils.formatEther(r));
  Promise.all([sres, rres]).then((res) => {
    callback(res);
  });
};

export const fetchStockBalance = async (stock, callback) => {
  try {
    const { provider, walletAddress } = await connectProvider();
    const signer = provider.getSigner();
    const contract = new Contract(stock.address, StockTokenABI, signer);
    const balance = await contract
      .balanceOf(walletAddress)
      .then((r) => utils.formatEther(r));
    callback(balance);
  } catch {
    callback(0);
  }
};

export const fetchEthBalance = async (callback) => {
  const { provider, walletAddress } = await connectProvider();
  const balance = await provider
    .getBalance(walletAddress)
    .then((r) => utils.formatEther(r));
  callback(balance);
};
