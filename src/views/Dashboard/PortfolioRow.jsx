import React from "react";
import styled from "styled-components";

const Community = ({ quantityOwned, gains, price, ticker }) => {
  return (
    <BalanceField>
      <BalanceToken>{ticker}</BalanceToken>
      <Numbers>
        <BalanceAmount>
          {Number(quantityOwned).toLocaleString(undefined, {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          })}
          @
          {Number(price).toLocaleString(undefined, {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          })}
        </BalanceAmount>
        <Gains positive={gains > 0}>
          {gains > 0 && "+"}
          {Number(gains).toLocaleString(undefined, {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          })}
          %
        </Gains>
      </Numbers>
    </BalanceField>
  );
};

const Numbers = styled.div`
  display: flex;
`;

const Gains = styled.div`
  flex: 1;
  height: 30px;
  font-size: 12px;
  margin-left: 10px;
  display: flex;
  align-items: center;
  color: ${(props) => (props.positive ? "#00ff00" : "#ff0000")};
`;

const BalanceAmount = styled.div`
  flex: 1;
  height: 30px;
  display: flex;
  align-items: center;
`;

const BalanceToken = styled.div`
  width: 150px;
  margin-left: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BalanceField = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: calc(33% - 5px);
  align-items: center;
  font-size: 18px;
  width: 100%;
`;

export default Community;
