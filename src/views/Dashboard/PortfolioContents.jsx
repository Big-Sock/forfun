import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { PortfolioCard } from "./PortfolioCard";

export const PortfolioContents = () => {
  const [portfolio, setPortfolio] = useState([
    1234,
    123,
    423,
    42,
    24,
    23,
    234,
    24,
  ]);

  useEffect(() => {
    //Load more
  }, []);

  return (
    <Container>
      <TitleBar>
        <Name>Name</Name>
        <Balance>Balance</Balance>
        <OtherBalance>Balance</OtherBalance>
        <Allocation>Allocation</Allocation>
        <Stake>Stake</Stake>
        <Trade>Trade</Trade>
      </TitleBar>
      <Divider />

      {portfolio ? (
        portfolio.map((portfolio) => <PortfolioCard portfolio={portfolio} />)
      ) : (
        <p>Unable to get assets data</p>
      )}
    </Container>
  );
};

const Name = styled.div`
  width: 85px;
  color: white;
`;
const Balance = styled.div`
  width: 190px;
`;
const OtherBalance = styled.div`
  width: 33px;
`;
const Allocation = styled.div`
  width: 62px;
`;
const Stake = styled.div`
  width: 76px;
`;
const Trade = styled.div`
  width: 78px;
`;

const TitleBar = styled.div`
  width: 95%;
  margin-top: 5px;
  margin-bottom: 5px;

  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  font-size: 15px;
  color: #c1c1c1;
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background-color: #2d2d34;
  margin-bottom: 10px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
