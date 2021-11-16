import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useWallet } from "use-wallet";
import Swal from "sweetalert2";
import {
  approveStonk,
  approveWStock,
  fetchEthBalance, fetchRewardBalance, fetchStockBalance, fetchTokenValues, getAllowance,
  getStocks,
  submitBuyOrder,
  submitSellOrder
} from "../../web3/utils";
import axios from "axios";
import { NavLink, useHistory } from "react-router-dom";
import PendingModal from "../Trade/PendingModal";
import { TradeSection } from "../Trade/TradeSection/TradeSection";
import isMobile from "../../utils/isMobile";

export const TradeModal = ({ stock, onDismiss }) => {

  const { account, connect } = useWallet();
  const history = useHistory();

  const [buyAmount, setBuyAmount] = useState(0);
  const [sellAmount, setSellAmount] = useState(0);
  const [stockAllowance, setStockAllowance] = useState(0);
  const [stonkAllowance, setSTONKAllowance] = useState(0);
  const [ethBalance, setEthBalance] = useState(0);
  const [stockBalance, setStockBalance] = useState(0);
  const [rewardBalance, setRewardBalance] = useState(0);
  const [ethUsdVal, setEthUsdVal] = useState(0);
  const [stockUsdVal, setStockUsdVal] = useState(0);
  const [stockEthVal, setStockEthVal] = useState(0);
  const [stocks, setStocks] = useState([]);
  const [selectStock, setSelectStock] = useState({});

  const [pendingTxId, setPendingTxId] = useState(null);
  const [pendingTxStatus, setPendingTxStatus] = useState(null);

  const [page, setPage] = useState("Buy")
  const [retrieved, setRetrieved] = useState(false);

  const [formsCompleted, setFormsCompleted] = useState(false);

  const [approved, setApproved] = useState(false);
  const [inReview, setInReview] = useState(false);


  const unlock = () => {
    if (isMobile() && !window.ethereum) {
      Swal.fire("Mobile use requires MetaMask browser.");
      return;
    } else if (!window.ethereum) {
      Swal.fire(
        "Our site requires the MetaMask extension to function properly!"
      );
      return;
    }
    connect("injected");
  };

  const getData = useCallback(() => {
    axios.get(`/api/forms/kyc-status/${account}`).then((res) => {
      setFormsCompleted(res.data.ecp && res.data.kyc);
      setApproved(res.data.approved);
      setInReview(res.data.inReview)
      setRetrieved(true);
    });
  }, [account]);

  useEffect(() => {
    if (!retrieved && account) {
      getData();
    }
  }, [account, getData, retrieved]);

  const getAllStocks = () => {
    getStocks((res) => {

      setStocks(res);
      setSelectStock(stock);
    });
  };

  const submitBuy = (e) => {
    e.preventDefault();
    if (buyAmount < 1) {
      Swal.fire("quantity must be 1 or more");
      return;
    }
    if (buyAmount * stockUsdVal > 10000) {
      Swal.fire("10000$ limit on trades");
      return;
    }
    submitBuyOrder(selectStock, buyAmount, (res) => {
      setPendingTxId(res.txId);
      setPendingTxStatus(res.status);
      fetchBalances();
    });
  };

  const submitSell = (e) => {
    e.preventDefault();
    if (sellAmount < 1) {
      Swal.fire("quantity must be 1 or more");
      return;
    }
    if (sellAmount * stockUsdVal > 10000) {
      Swal.fire("10000$ limit on trades");
      return;
    }
    if (parseInt(stockBalance) < parseInt(sellAmount)) {
      Swal.fire("insufficient balance");
      return;
    }
    submitSellOrder(selectStock, sellAmount, (res) => {
      setPendingTxId(res.txId);
      setPendingTxStatus(res.status);
      fetchBalances();
    });
  };

  const clearPendingTx = () => {
    localStorage.removeItem("pendingTrade");
    setPendingTxStatus(null);
    setPendingTxId(null);
  };

  const approve = (e) => {
    e.preventDefault();
    approveWStock(selectStock, (res) => {
      setStockAllowance(parseInt(res[0]));
      // setRewardAllowance(parseInt(res[1]))
    });
    approveStonk((res) => {
      setSTONKAllowance(parseInt(res[0]));
      // setRewardAllowance(parseInt(res[1]))
    });
  };

  const fetchBalances = useCallback(() => {
    fetchEthBalance((res) => {
      setEthBalance(res);
    });
    fetchStockBalance(selectStock, (res) => {
      setStockBalance(res);
    });
    fetchRewardBalance((res) => {
      setRewardBalance(res);
    });
  }, [selectStock]);

  const updateTokenValues = useCallback(() => {
    fetchTokenValues(selectStock, (res) => {
      if (res === "error") {
        history.push("/");
        return;
      }
      setEthUsdVal(res.ethUsdVal)
      setStockUsdVal(res.stockUsdVal);
      setStockEthVal(res.stockEthVal);
    });
  }, [history, selectStock]);

  const checkAllowance = useCallback(() => {
    getAllowance(selectStock, (res) => {
      setStockAllowance(parseInt(res[0]));
      setSTONKAllowance(parseInt(res[1]));
    });
  }, [selectStock]);

  useEffect(() => {
    if (!stocks.length) {
      getAllStocks();
    }
    if (selectStock.ticker) {
      updateTokenValues();
    }
    if (account && selectStock.ticker) {
      checkAllowance();
      fetchBalances();
    }
  }, [
    account,
    checkAllowance,
    fetchBalances,
    selectStock.ticker,
    stockUsdVal,
    stocks.length,
    updateTokenValues,
  ]);

  const handleBuyAmount = (e) => {
    const newBuy = e.target.value;
    if (newBuy >= 0) {
      setBuyAmount(newBuy)
    } else {
      Swal.fire("Value must be a positive integer!")
    }
  }

  const handleSellAmount = (e) => {
    const newSell = e.target.value;
    if (newSell >= 0) {
      setSellAmount(newSell)
    } else {
      Swal.fire("Value must be a positive integer!")
    }
  }

  const tradeProps = {
    submitBuy,
    buyAmount,
    handleBuyAmount,
    submitSell,
    sellAmount,
    handleSellAmount,
    approve,
    selectStock,
    setSelectStock,
    stockAllowance,
    stonkAllowance,
    ethBalance,
    stockBalance,
    rewardBalance,
    stocks,
    ethUsdVal,
    stockUsdVal,
    stockEthVal,
  }

  return (
   <>
     {pendingTxStatus && (
       <PendingModal
         txId={pendingTxId}
         status={pendingTxStatus}
         close={clearPendingTx}
       />
     )}

     {retrieved && account && (
       approved ? (
         <TradeSection
           formsCompleted={formsCompleted}
           approved={approved}
           page={page}
           setPage={setPage}
           tradeProps={tradeProps}
         />
       ) : (
         inReview ? (
           <Registration>
             <Info className="registered">Thank you for registering, you will receive an email when approved.</Info>
           </Registration>
         ) : (
           <Registration>
             <Info>Please register to trade.</Info>
             <TradeLink
               exact activeClassName="active"
               to="/trade"
               onClick={onDismiss}
             >
               <Button>To Trade Page</Button>
             </TradeLink>
           </Registration>
         )
       )
     )}
     {!account && (
       <Registration>
         <Button onClick={unlock} className="connect">Connect Wallet</Button>
       </Registration>
     )}

   </>
  );
};


const Info = styled.div`
  font-size: 25px;
  text-align: center;
  margin: ${(props) => (props.className === "registered" ? "0 0 0 0": "0 0 20px 0")};

`

const TradeLink = styled(NavLink)`
  text-decoration: none;
  
`

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  background-color: #3c5bd8;
  font-size: 25px;
  border: none;
  cursor: pointer;
  color: white;
  transition: all 0.1s linear;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.9;
  // margin: ${(props) => (props.className === "connect" ? "20px 10px": "10px 10px 20px 10px")};
  font-family: "Sophia Nubian Bold", sans-serif;

  &:hover {
    opacity: 1;
  }
`

const Registration = styled.div`
  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  background-color: #17171a;
  border-radius: 5px;
  border: 1px solid #2d2d34;
  box-sizing: border-box;
  z-index: 1000;
  padding: 20px 10px;
  //margin: 0 10px;
  min-width: 360px;
  max-width: 450px;
  width: 30%;
  @media only screen and (max-width: 991px) {
    width: 90%;
    margin-bottom: 10px;
    min-width: 0;
    max-width: none;

  }
`
