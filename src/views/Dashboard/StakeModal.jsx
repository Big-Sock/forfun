import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const StakeModal = (props) => {
  return (
    // <ModalBackground>
    <Container>
      <TopBar>
        <Option>Buy</Option>
        <Option>Sell</Option>
        <Option active>Stake</Option>
      </TopBar>
      <CloseWrapper style={{ fontSize: "30px" }} />

      <Title>Quick Stake</Title>
      <SubTitle>Stake your wStocks and earn STONK</SubTitle>
      <Info>
        <LeftColumn>
          <StockName>wS&P 500</StockName>
          <APY>577.80% APY</APY>
        </LeftColumn>
        <RightColumn>
          <Value defaultValue={"0.00"} />
          <ETH>0.00000000 ETH</ETH>
          <USD>0.00 $USD</USD>
        </RightColumn>
      </Info>
      <Divider />
      <Button>Stake</Button>
      <BottomText>
        Stake quickly or go to the{" "}
        <StakeLink
          exact
          activeClassName="active"
          to="/stake"
          onClick={props.onDismiss}
        >
          Staking Page
        </StakeLink>{" "}
        for more info and options.
      </BottomText>
    </Container>
    // </ModalBackground>
  );
};

const CloseWrapper = styled(CloseIcon)`
  color: #7c7c8d;
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  transition: all 0.1s linear;
  opacity: 0.5;

  &:hover {
    opacity: 1;
  }
`;

const Divider = styled.div`
  width: 85%;
  margin-top: 20px;
  height: 1px;
  background-color: #2d2d34;
`;

const StockName = styled.div`
  font-size: 18px;
  border-radius: 5px;
  padding: 2px 7px;
  background-color: #3c5bd8;
  width: 60%;
  margin-bottom: 11px;
`;

const APY = styled.div`
  font-size: 15px;
  width: 60%;
`;

const Value = styled.input`
  background-color: #17171a;
  border: none;
  color: #c1c1c1;
  font-size: 64px;
  margin-bottom: 20px;
  height: 52px;
  width: 125px;

  &:focus {
    outline: none;
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
  width: 45%;
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-left: 30px;
`;

const RightColumn = styled.div`
  width: 45%;
  display: flex;
  flex-direction: column;
  text-align: right;
  align-items: flex-end;
  margin-right: 30px;
`;

const StakeLink = styled(NavLink)`
  color: #3c5bd8;
  font-size: 15px;
  text-decoration: underline;

  &:hover {
    color: white;
    text-decoration: none;
  }
`;

const Option = styled.p`
  margin: 20px 5px 0;
  color: ${(props) => (props.active ? "#3c5bd8" : "#c1c1c1")};
`;

const Button = styled.button`
  margin-top: 40px;
  padding: 8px 35px 8px 35px;
  border-radius: 10px;
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

  &:hover {
    opacity: 1;
  }
`;
const Info = styled.div`
  height: 160px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
`;

const BottomText = styled.div`
  font-size: 15px;
  margin: 30px 56px 30px;
  text-align: center;
`;

const TopBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 70%;

  justify-content: space-around;
  color: #c1c1c1;
  font-size: 15px;
`;

const Title = styled.h3`
  font-size: 25px;
  margin: 31px 0 0 0;
`;

const SubTitle = styled.p`
  font-size: 15px;
  margin: 15px 0 50px 0;
  color: #c1c1c1;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  color: white;

  background-color: #17171a;
  border-radius: 10px;
  border: 1px solid #2d2d34;
  width: 400px;
  height: 530px;
  opacity: 100%;
  z-index: 1000000000;
`;
