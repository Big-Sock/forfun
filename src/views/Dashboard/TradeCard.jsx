import React from "react";
import styled from "styled-components";

export const TradeCard = ({ trade }) => {
  return (
    <Container>
      <ColorTab isBuy={trade.isBuy} />
      <Wrapper>
        <Info>
          <StockName>{trade.symbol}</StockName>
          <OrderDate>{new Date(trade.timestamp).toDateString()}</OrderDate>
        </Info>
        <Price>{trade.price.toString().substring(0, 8)} ETH</Price>
      </Wrapper>
    </Container>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: calc(90% - 5px);
`;

const ColorTab = styled.div`
  background-color: ${(props) => (props.isBuy ? "#2eb476" : "#de3a3a")};
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  height: 100%;
  width: 12px;
`;

const Info = styled.div`
  text-align: left;
  display: flex;
  flex-direction: column;
  min-height: 40px;
  margin-left: 20px;
  width: 100%;
`;

const StockName = styled.p`
  font-size: 16px;
  line-height: 25px;
  margin: 0;
`;

const OrderDate = styled.p`
  font-size: 13px;
  margin: 0;
  line-height: 21px;
`;

const Price = styled.div`
  font-size: 20px;
  margin: 0;
  margin-right: -6px;
  height: auto;
  justify-self: right;
  align-self: center;
  line-height: 30px;
  white-space: nowrap;
  @media only screen and (min-width: 992px) and (max-width: 1050px) {
    font-size: 18px;
  }
`;

const Container = styled.div`
  margin: 5px 0;
  min-height: 70px;
  width: 90%;
  font-size: 24px;
  font-weight: bold;
  color: white;
  display: flex;
  flex-direction: row;

  justify-content: flex-start;
  align-items: center;

  background-color: #1d1d21;
  border-bottom: solid 1px #2d2d34;
  border-radius: 5px;
`;
