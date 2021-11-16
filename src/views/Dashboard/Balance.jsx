import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import TradingViewWidget, { Themes } from "react-tradingview-widget";
import styled from "styled-components";
import { useWallet } from "use-wallet";
import Toggle from "../../components/Toggle";
import { fetchTokenValues } from "../../web3/utils";

export const Balance = (props) => {
  const history = useHistory();
  const { account, connect } = useWallet();
  const [stockUsdVal, setStockUsdVal] = useState(0);
  const [stockEthVal, setStockEthVal] = useState(0);
  const [useEthValue, setUseEthValue] = useState(false);

  const updateTokenValues = useCallback(() => {
    fetchTokenValues(props.selectStock, (res) => {
      if (res === "error") {
        history.push("/");
        return;
      }
      setStockUsdVal(res.stockUsdVal);
      setStockEthVal(res.stockEthVal);
    });
  }, [history, props.selectStock]);

  useEffect(() => {
    if (props.selectStock.ticker) {
      updateTokenValues();
    }
  }, [
    account,
    props.selectStock.ticker,
    stockUsdVal,
    props.stocks.length,
    updateTokenValues,
  ]);

  return (
    <BalanceContainer>
      <ValueContainer>
        <ValueTitle
          onChange={(e) => props.setSelectStock(JSON.parse(e.target.value))}
          value={JSON.stringify(props.selectStock)}
        >
          {props.stocks.map((stock) => {
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

      <PriceHistory>
        <TradingViewWidget
          symbol={props.selectStock.ticker}
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
      </PriceHistory>
    </BalanceContainer>
  );
};

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
  flex: 1;
  border-radius: 2px;

  background-color: #17171a;
  color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  position: relative;
`;

const BalanceContainer = styled.div`
  height: 45%;
  display: flex;
  flex-direction: column;
  margin-left: 1%;
  border-radius: 5px 5px 0 0;
  border: solid 1px #2d2d34;
  background-color: #17171a;
  box-sizing: border-box;
  @media only screen and (max-width: 991px) {
    height: 50vmax;
    margin-left: 0;
    margin-bottom: 10px;
  }
`;

const PriceHistory = styled.div`
  border-radius: 2px;
  border: solid 1px #2d2d34;
  background-color: #17171a;
  color: white;
  height: 100%;
`;
