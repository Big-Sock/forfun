import React from "react";
import styled from "styled-components";
import { TradeCard } from "./TradeCard";

export const Trades = ({ trades, selectedStock }) => {
  if (!trades || !trades.length) {
    return <p>No Recent Trades</p>;
  }

  const filteredTrades = trades.filter((trade) => {
    return trade.symbol === selectedStock;
  });

  if (!filteredTrades.length) {
    return <p>No Recent Trades for {selectedStock}</p>;
  }

  return (
    <TradesContainer>
      {filteredTrades.map((trade) => (
        <TradeCard trade={trade} />
      ))}
    </TradesContainer>
  );
};

const TradesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 0;
  height: 80%;
  overflow-y: scroll;
`;
