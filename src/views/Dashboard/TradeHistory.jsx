import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import useWallet from "use-wallet";
import { Trades } from "./Trades";

export const TradeHistory = (props) => {
  const [trades, setTrades] = useState();

  const { account } = useWallet();

  const getRecentOrders = useCallback(async () => {
    const trades = await axios.post(`/api/orders/my-recent`, {
      address: account,
    });
    setTrades(trades.data);
  }, [account]);

  useEffect(() => {
    getRecentOrders();
  }, [getRecentOrders]);

  return (
    <TradeHistoryContainer>
      <Wrapper>
        <Title>Trades</Title>
      </Wrapper>
      <Divider />
      <Trades trades={trades} selectedStock={props.selectStock.ticker} />
    </TradeHistoryContainer>
  );
};

const TradeHistoryContainer = styled.div`
  height: 45%;
  padding: 0 0 30px;
  margin-left: 2%;
  border-radius: 5px;
  border: solid 1px #2d2d34;
  background-color: #17171a;
  box-sizing: border-box;
  overflow: hidden;

  @media only screen and (max-width: 991px) {
    height: 40vmax;
    margin-left: 0;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 24px;
  text-align: left;
  margin-left: 20px;
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background-color: #2d2d34;
`;

export default TradeHistory;
