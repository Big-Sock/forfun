import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import React from "react";
import styled from "styled-components";
import Toggle from "../../components/Toggle";

export const ValueToggle = (props) => {

  return (
    <ValueContainer>
      <ValueSwitch>
        <ValueIcon>
          <AttachMoneyIcon style={{ height: "100%" }} />
        </ValueIcon>
        <Toggle
          checked={props.useEthValue}
          onClick={() => props.setUseEthValue(!props.useEthValue)}
        />
        <ValueIcon>
          <EthLogo viewBox="0 0 24 24">
            <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
          </EthLogo>
        </ValueIcon>
      </ValueSwitch>
      <ValueTitle
        onChange={(e) => props.setSelectStock(JSON.parse(e.target.value))}
        value={JSON.stringify(props.selectStock)}
      >
        {props.stocks.map((stock) => {
          return <option key={stock.ticker} value={JSON.stringify(stock)}>{stock.ticker === 'VOO' ? 'S&P 500' : stock.ticker}</option>;
        })}
      </ValueTitle>
      <ValueVal>
        {props.useEthValue
          ? `${props.stockEthVal.toLocaleString(undefined, {
              minimumFractionDigits: 6,
              maximumFractionDigits: 6,
            })} ETH`
          : `$${props.stockUsdVal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
      </ValueVal>
    </ValueContainer>
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
  margin-top: 5px;
`;

const ValueTitle = styled.select`
  font-size: 20px;
  margin-top: 20px;
`;

const ValueSwitch = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: row;
`;

const ValueContainer = styled.div`
  flex: 1;
  border-radius: 2px;
  border: solid 1px #2d2d34;
  background-color: #17171a;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  position: relative;
  margin-bottom: 10px;
  @media only screen and (min-width: 991px) {
    margin: 5px 5px 0 0;
  }
`;
