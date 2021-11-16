import axios from "axios";
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CountDown } from "../Countdown";
import { TradeMaker } from "./TradeMaker";

export const TradeSection = (
  {
    setIsRegistering,
    formsCompleted,
    approved,
    page,
    setPage,
    tradeProps,

  }) => {

  const [open, setOpen] = useState(false);
  const [marketTime, setMarketTime] = useState(null);

  useEffect(() => {
    axios.get(`/api/stocks/status`).then((res) => {
      setOpen(res.data.is_open);
      setMarketTime(
        res.data.is_open ? res.data.next_close : res.data.next_open
      );
    });
  }, []);

  const formattedPercent =  (percentChange) => {
    let number = Math.round(percentChange * 1000)/1000
    let string = number.toString()
    if (number > 0) {
      return "+" + string.substring(0, 4) + "%"
    } else {
      return string.substring(0,5) + "%"
    }
  }
  const formattedPrice = (price) => {
    const options = { style: 'currency', currency: 'USD' };
    return new Intl.NumberFormat('en-US', options).format(price)
  }

  return (
    <OutsideDiv>
      <Container>
        <TopBar>
          <Option
            className="Buy"
            active={page === "Buy"}
            onClick={(e) => setPage("Buy")}
          >
            Buy</Option>
          <Option
            className="Sell"
            active={page === "Sell"}
            onClick={(e) => setPage("Sell")}>
            Sell</Option>
        </TopBar>
        <TradeMaker
          {...tradeProps}
          approved={approved}
          formattedPercent={formattedPercent}
          formattedPrice={formattedPrice}
          formsCompleted={formsCompleted}
          setIsRegistering={setIsRegistering}
          isBuy={page === "Buy"}
        />
      </Container>
      <MarketTime>
        {marketTime && <CountDown open={open} endTime={marketTime}/>}
      </MarketTime>

    </OutsideDiv>


  );
};

const MarketTime = styled.div`
  width: 100%;
  margin-top: 10px;
  z-index: 1000;

`

const Option = styled.div`
  padding: 15px 0;
  border: 1px solid ${(props) => (props.active ? "#3c5bd8" : "#2d2d34")};
  border-radius: ${(props) => props.className === "Buy" ? "5px 0 0 0px" : " 0 5px 0px 0"};
  width: 50%;
  color: white;
  cursor: pointer;
  font-family: "Sophia Nubian Bold", sans-serif;
  transition: all 0.2s linear;
  font-size: 18px;
  text-align: center;

  &:hover {
    border-color: #3c5bd8;

  }
`;

const TopBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #17171a;

  justify-content: center;
  color: #c1c1c1;
  font-size: 15px;
  width: 100%;
  z-index: 1000;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;

  box-sizing: border-box;
  background-color: #17171a;
  border-radius: 5px;
  width: 100%;
  margin: 0 10px;

`;

const OutsideDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;

  box-sizing: border-box;

  margin: 0 10px;
  min-width: 360px;
  max-width: 450px;
  width: 30%;
  height: 100%;
  @media only screen and (max-width: 991px) {
    width: 90%;
    margin-bottom: 10px;
    min-width: 0;
    max-width: none;

  }
`

