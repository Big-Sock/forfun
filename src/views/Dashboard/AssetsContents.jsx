import React from "react";
import styled from "styled-components";
import { AssetsCard } from "./AssetsCard";

export const AssetsContents = ({ assets, setSelectStock }) => {
  return (
    <Container>
      <TitleBar>
        <Name>Name</Name>
        <Price>Price</Price>
        <Change>Change</Change>
        <Balance>Balance</Balance>
        <Trade>Trade</Trade>
      </TitleBar>
      <Divider />

      <Assets>
        {assets ? (
          assets.map((assets) => <AssetsCard assets={assets} setSelectStock={setSelectStock}/>)
        ) : (
          <p>Unable to get assets data</p>
        )}
      </Assets>
    </Container>
  );
};
const Assets = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
`;

const Name = styled.div`
  margin-left:5%;
  width: 15%;
  text-align: left;
`;

const Price = styled.div`
  width: 20%;
`;

const Change = styled.div`
  width: 20%;
`;

const Balance = styled.div`
  width: 20%;
`;

const Trade = styled.div`
  width: 20%;
  @media only screen and (max-width: 650px) {
    display: none;
  }
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
  font-family: "Sophia Nubian Bold";
  color: #c1c1c1;
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background-color: #2d2d34;
  margin-bottom: 5px;
`;

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;
