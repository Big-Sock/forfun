import React from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import { useWallet } from "use-wallet";
import isMobile from "../../../utils/isMobile";

//TODO: these props really need cleaning up. eg. why separate buy/sell amounts?
export const TradeMaker = ({
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
  approved,
  ethBalance,
  stockBalance,
  stocks,
  ethUsdVal,
  stockUsdVal,
  stockEthVal,
  formattedPercent,
  formattedPrice,
  formsCompleted,
  setIsRegistering,
  isBuy,
}) => {
  const getNewEthBalance = () => {
    return isBuy
      ? parseFloat(ethBalance) - stockEthVal * parseInt(buyAmount)
      : parseFloat(ethBalance) + stockEthVal * parseInt(sellAmount);
  };
  const getNewStockBalance = () => {
    return isBuy
      ? parseInt(stockBalance) + parseInt(buyAmount)
      : parseInt(stockBalance) - parseInt(sellAmount);
  };

  const { account, connect } = useWallet();
  const unlock = () => {
    if (isMobile() && !window.ethereum) {
      Swal.fire("Mobile use requires MetaMask browser.");
      return;
    } else if (!window.ethereum) {
      Swal.fire(
        "Our site requires the MetaMask extension to function properly!"
      );
      return;
    }
    connect("injected");
  };

  const stonkFee = (
    selectStock.feeRate *
    stockEthVal *
    parseInt(isBuy ? buyAmount : sellAmount)
  ).toFixed(2);

  return (
    <Container>
      <SubTitle>
        {isBuy ? "Buy wStocks with Ether!" : "Sell wStocks for Ether!"}
      </SubTitle>
      <Info>
        <LeftColumn>
          <StockName
            onChange={(e) => setSelectStock(JSON.parse(e.target.value))}
            value={JSON.stringify(selectStock)}
          >
            {stocks.map((stock) => {
              return (
                <option key={stock.ticker} value={JSON.stringify(stock)}>
                  w{stock.ticker === "VOO" ? "S&P 500" : stock.ticker}
                </option>
              );
            })}
          </StockName>
          <PercentChange percentChange={selectStock.percent_change}>
            {formattedPercent(selectStock.percent_change)}
          </PercentChange>
        </LeftColumn>
        <RightColumn>
          <Value
            onChange={(e) => (isBuy ? handleBuyAmount(e) : handleSellAmount(e))}
            value={isBuy ? buyAmount : sellAmount}
            type="number"
            placeholder="0"
            step="1"
            min={selectStock.ticker === "SQQQ" ? "2" : "0"}
          />
          <ETH>
            {(stockEthVal * parseInt(isBuy ? buyAmount : sellAmount))
              .toString()
              .substring(0, 8)}{" "}
            ETH
          </ETH>
          <USD>
            {formattedPrice(stockUsdVal * (isBuy ? buyAmount : sellAmount))} USD
          </USD>
        </RightColumn>
      </Info>

      <StonkFeeCard>
        <div>STONK Fee:</div>
        <div>{stonkFee} STONK</div>
      </StonkFeeCard>
      <NewBalanceCard>
        <NewBalance>New Balance:</NewBalance>
        <NewBalance>
          <Item>
            {getNewStockBalance() < 0
              ? "Insufficient Stock"
              : getNewStockBalance() + " w" + selectStock.ticker}
          </Item>
          <Item>
            {getNewEthBalance() < 0
              ? "Insufficient Funds"
              : getNewEthBalance().toString().substring(0, 8) + " ETH"}
          </Item>
          <Item>
            {getNewEthBalance() < 0
              ? "Insufficient Funds"
              : formattedPrice(ethUsdVal * getNewEthBalance()) + " USD"}
          </Item>
        </NewBalance>
      </NewBalanceCard>

      {!approved ? (
        <>
          {!account && (
            <ApproveButton onClick={unlock}>Connect Wallet</ApproveButton>
          )}
          {account && !formsCompleted && (
            <ApproveButton onClick={() => setIsRegistering(true)}>
              Register to Begin Trading
            </ApproveButton>
          )}
          {account && formsCompleted && (
            <ApproveMessage>
              Your KYC and ECP certification are under review. Please check back
              soon!
            </ApproveMessage>
          )}
        </>
      ) : !stockAllowance || !stonkAllowance ? (
        <ApproveButton onClick={(e) => approve(e)}>
          {isBuy ? "Approve Buy" : "Approve Sell"}
        </ApproveButton>
      ) : (
        <>
          <ApproveButton
            onClick={(e) => (isBuy ? submitBuy(e) : submitSell(e))}
          >
            {isBuy ? "Buy" : "Sell"}
          </ApproveButton>
          <Item>Quotes may be different outside of regular trading hours</Item>
        </>
      )}
    </Container>
  );
};

const StockName = styled.select`
  font-size: 18px;
  border-radius: 5px;
  padding: 2px 5px;
  display: flex;
  flex-direction: row;
  justify-content: left;
  background-color: #3c5bd8;
  color: white;
  margin-bottom: 10px;
  width: fit-content;
  border: none;
  cursor: pointer;
`;

const Item = styled.div`
  margin-bottom: 5px;
`;

const NewBalance = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-bottom: 10px;
`;

const StonkFeeCard = styled.div`
  display: flex;
  justify-content: space-between;
  width: 85%;
  padding: 5px 15px;
  box-sizing: border-box;
  background-color: #1d1d21;
  border-radius: 5px;
  border: 1px solid #2d2d34;
  margin: 15px 0;
`;

const NewBalanceCard = styled.div`
  display: flex;
  justify-content: space-between;
  width: 85%;
  padding: 10px 15px;

  box-sizing: border-box;
  background-color: #1d1d21;
  border-radius: 5px;
  border: 1px solid #2d2d34;
  margin-bottom: 15px;
`;

const PercentChange = styled.div`
  font-size: 15px;
  width: 100%;
  text-align: left;
  color: ${(props) => (props.percentChange > 0 ? "#2eb476" : "#de3a3a")};
`;

const Value = styled.input`
  background-color: #17171a;
  border: none;
  color: #c1c1c1;
  font-size: 64px;
  margin-bottom: 30px;
  height: 52px;
  text-align: right;
  width: 100%;
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: grey;
    opacity: 0.5;
  }
`;

const ETH = styled.div`
  font-size: 18px;
  margin-bottom: 10px;
`;

const USD = styled.div`
  font-size: 18px;
`;

const LeftColumn = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  text-align: left;
  font-family: "Sophia Nubian Bold", sans-serif;
`;

const RightColumn = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  text-align: right;
  align-items: flex-end;
`;

const Info = styled.div`
  height: 160px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 85%;
`;

const SubTitle = styled.p`
  font-size: 18px;
  margin: 20px 0 40px 0;
  color: #c1c1c1;
`;

const ApproveButton = styled.button`
  width: 85%;
  padding: 15px 40px 15px 40px;
  border-radius: 5px;
  background-color: #3c5bd8;
  font-size: 25px;
  border: none;
  cursor: pointer;
  color: white;
  transition: all 0.1s linear;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.9;
  margin-bottom: 20px;
  font-family: "Sophia Nubian Bold", sans-serif;

  &:hover {
    opacity: 1;
  }
`;

const ApproveMessage = styled.div`
  margin: 10px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  color: white;
  box-sizing: border-box;
  width: 100%;

  background-color: #17171a;
  border-radius: 0 0 5px 5px;
  border: 1px solid #2d2d34;
  border-top: none;
`;
