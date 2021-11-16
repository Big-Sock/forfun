import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import TradingViewWidget, { Themes } from "react-tradingview-widget";
import styled from "styled-components";
import Swal from "sweetalert2";
import { useWallet } from "use-wallet";
import Toggle from "../../components/Toggle";
import {
  approveStonk,
  approveWStock,
  fetchEthBalance,
  fetchRewardBalance,
  fetchStockBalance,
  fetchTokenValues,
  getAllowance,
  getStocks,
  submitBuyOrder,
  submitSellOrder,
} from "../../web3/utils";
import RecentTrades from "./RecentTrades";
import { TradeSection } from "./TradeSection/TradeSection";

export const StockInfo = ({
  setPendingTxId,
  setPendingTxStatus,
  setIsRegistering,
  formsCompleted,
  approved,
  page,
  setPage,
}) => {
  const history = useHistory();
  const { account } = useWallet();
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
  const [useEthValue, setUseEthValue] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [selectStock, setSelectStock] = useState({});

  const getAllStocks = () => {
    getStocks((res) => {
      if (res) {
        var stock = res[0];
        if (
          history.location &&
          history.location.state &&
          history.location.state.ticker
        ) {
          const match = res.filter((stock) => {
            return stock.ticker === history.location.state.ticker;
          });
          if (match && match[0]) {
            stock = match[0];
          }
        }
        setStocks(res);
        setSelectStock(stock);
      }
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
      setEthUsdVal(res.ethUsdVal);
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
      setBuyAmount(newBuy);
    } else {
      Swal.fire("Value must be a positive integer!");
    }
  };

  const handleSellAmount = (e) => {
    const newSell = e.target.value;
    if (newSell >= 0) {
      setSellAmount(newSell);
    } else {
      Swal.fire("Value must be a positive integer!");
    }
  };

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
  };

  return (
    <>
      <StockContainer>
        <PriceHistory>
          <ValueContainer>
            <ValueTitle
              onChange={(e) => setSelectStock(JSON.parse(e.target.value))}
              value={JSON.stringify(selectStock)}
            >
              {stocks.map((stock) => {
                return (
                  <option key={stock.ticker} value={JSON.stringify(stock)}>
                    {stock.ticker === "VOO" ? "S&P 500" : stock.ticker}
                  </option>
                );
              })}
            </ValueTitle>
            <ValueVal>
              {useEthValue
                ? `${stockEthVal.toLocaleString(undefined, {
                    minimumFractionDigits: 6,
                    maximumFractionDigits: 6,
                  })} ETH`
                : `$${stockUsdVal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
            </ValueVal>
            <ValueSwitch>
              <ValueIcon>
                <AttachMoneyIcon style={{ height: "100%" }} />
              </ValueIcon>
              <Toggle
                defaultChecked={useEthValue}
                onClick={() => setUseEthValue(!useEthValue)}
              />
              <ValueIcon>
                <EthLogo viewBox="0 0 24 24">
                  <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
                </EthLogo>
              </ValueIcon>
            </ValueSwitch>
          </ValueContainer>
          <Wrapper>
            <TradingViewWidget
              symbol={selectStock.ticker}
              theme={Themes.DARK}
              autosize
              save_image={false}
              style={"3"}
              range="1m"
              details={false}
              allow_symbol_change={false}
              hide_top_toolbar={true}
              hide_legend={true}
              toolbar_bg={"#17171a"}
            />
          </Wrapper>
        </PriceHistory>

        <Row>
          <RecentTrades />
        </Row>
      </StockContainer>
      <TradeSection
        setIsRegistering={setIsRegistering}
        formsCompleted={formsCompleted}
        approved={approved}
        page={page}
        setPage={setPage}
        tradeProps={tradeProps}
      />
    </>
  );
};

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`;

const EthLogo = styled.svg`
  height: 80%;
  fill: white;
`;

const ValueIcon = styled.div`
  height: 18px;
  width: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ValueVal = styled.div`
  font-size: 24px;
  margin-top: 10px;
  margin-bottom: 10px;
  @media only screen and (max-width: 991px) {
    font-size: 22px;
  }
`;

const ValueTitle = styled.select`
  font-size: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
`;

const ValueSwitch = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
`;

const ValueContainer = styled.div`
  background-color: #17171a;
  color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  @media only screen and (max-width: 1150px) {
    flex-direction: column;
  }
`;

const PriceHistory = styled.div`
  border-radius: 5px;
  border: solid 1px #2d2d34;
  background-color: #17171a;
  color: white;
  height: 50vh;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StockContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
  width: 75%;
  @media only screen and (max-width: 991px) {
    width: 90%;
  }
`;
