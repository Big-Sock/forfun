import React, { useEffect, useState } from "react";
import styled from "styled-components";
import useModal from "../../hooks/useModal";
import { fetchStockBalance } from "../../web3/utils";
import { TradeModal } from "./TradeModal";

export const AssetsCard = ({ assets: asset, setSelectStock }) => {
  const [stockBalance, setStockBalance] = useState(0);
  useEffect(() => {
    fetchStockBalance(asset, (res) => {
      setStockBalance(res);
    });
  }, [asset]);
  const [tradeModal] = useModal(<TradeModal stock={asset} />);

  const formattedPercent = () => {
    let percent = Math.round(asset.percent_change * 1000) / 1000;
    let string = percent.toString();
    if (percent > 0) {
      return "+" + string.substring(0, 4) + "%";
    } else {
      return string.substring(0, 5) + "%";
    }
  };

  const formattedPrice = () => {
    const options = { style: "currency", currency: "USD" };
    return new Intl.NumberFormat("en-US", options).format(asset.price);
  };

  return (
    <>
      {asset ? (
        <Container onClick={() => setSelectStock(asset)}>
          <Wrapper>
            <StockName>{asset.ticker}</StockName>
            <Price>{formattedPrice()}</Price>
            <Percent percent={asset.percent_change}>
              {formattedPercent()}
            </Percent>{" "}
            <Balance>{stockBalance}</Balance>
            <Trade>
              <Button onClick={tradeModal}>Trade</Button>
            </Trade>
          </Wrapper>
        </Container>
      ) : (
        <Container>
          <Wrapper>
            <p>Unable to get asset data</p>
          </Wrapper>
        </Container>
      )}
    </>
  );
};

const Button = styled.button`
  padding: 3px 15px 3px 15px;
  background-color: #3c5bd8;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 22px;
  cursor: pointer;
  transition: all 0.1s linear;
  opacity: 0.9;
  &:hover {
    opacity: 1;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  font-size: 22px;
  color: #c1c1c1;
  line-height: 25px;
  @media only screen and (max-width: 450px) {
    font-size: 18px;
  }
`;

const StockName = styled.div`
  margin-left: 2%;
  width: 15%;
  text-align: left;
  @media only screen and (max-width: 650px) {
    margin-left: 0%;
  }
`;

const Price = styled.div`
  margin: 0;
  width: 20%;
`;

const Percent = styled.div`
  margin: 0;
  color: ${(props) => (props.percent >= 0 ? "#2eb476" : "#de3a3a")};
  width: 20%;
`;

const Balance = styled.div`
  margin: 0;
  width: 20%;
`;

const Trade = styled.div`
  margin: 0;
  width: 20%;
  @media only screen and (max-width: 650px) {
    display: none;
  }
`;

const Container = styled.div`
  margin: 5px 0;
  min-height: 50px;

  width: 95%;

  font-size: 24px;
  font-weight: bold;
  color: white;
  display: flex;
  flex-direction: row;

  justify-content: flex-start;
  align-items: center;
  cursor: ${(props) => (props.onClick ? "pointer" : "default")};
  background-color: #1d1d21;
  border: none;
  border-bottom: solid 1px #2d2d34;
  border-radius: 5px;
`;
