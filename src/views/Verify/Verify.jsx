import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import { useWallet } from "use-wallet";
import isMobile from "../../utils/isMobile";
import { fetchStockTotalSupply, getStocks } from "../../web3/utils";
import { BaseView } from "../BaseView";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const VerifyBacking = () => {
  const [stockInfo, setStockInfo] = useState([]);
  const { account, connect } = useWallet();

  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 990);

  const updateWindow = () => {
    setIsDesktop(window.innerWidth > 990);
  };

  useEffect(() => {
    window.addEventListener("resize", updateWindow);
    return () => window.removeEventListener("resize", updateWindow);
  });

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

  const addStockInfo = async (stock, realInfo) => {
    fetchStockTotalSupply(stock, (totalSupply) => {
      const info = {
        ticker: stock.ticker,
        totalSupply,
        real: realInfo,
      };
      setStockInfo((prevState) => {
        return [...prevState, info];
      });
    });
  };

  const fetchStockInfo = useCallback(() => {
    getStocks(async (stocks) => {
      axios.get(`/api/stocks/portfolio`).then((realStocks) => {
        setStockInfo([]);
        for (const stock of stocks) {
          const realStock = realStocks.data.find(
            (x) => x.symbol === stock.ticker
          );
          if (realStock) addStockInfo(stock, realStock);
        }
      });
    });
  }, []);

  useEffect(() => {
    if (account) {
      fetchStockInfo();
    }
  }, [fetchStockInfo, account]);

  if (!account) {
    return (
      <BaseView>
        {isDesktop ? (
          <Container>
            <ApproveContainer>
              <ApproveButton onClick={unlock}>Connect Wallet</ApproveButton>
            </ApproveContainer>
          </Container>
        ) : (
          <></>
        )}
      </BaseView>
    );
  }

  return (
    <BaseView>
      <Container>
        {stockInfo.map((info) => {
          return (
            <InfoContainer>
              <InfoRow>
                <InfoCell>
                  <Header>Symbol</Header>
                  <Info>{info.ticker}</Info>
                </InfoCell>
                <InfoCell>
                  <Header>Value</Header>
                  <Info>{formatter.format(info.real.market_value)}</Info>
                </InfoCell>
              </InfoRow>
              <Divider />
              <InfoRow>
                <InfoCell>
                  <Header>wSTOCK</Header>
                  <Info>{Number(info.totalSupply)}</Info>
                </InfoCell>
                <InfoCell>
                  <Header>Stock</Header>
                  <Info>{info.real.qty}</Info>
                </InfoCell>
              </InfoRow>
            </InfoContainer>
          );
        })}
      </Container>
      <ViewRaw target="_" href={"/api/stocks/portfolio"}>
        View and Confirm API data
      </ViewRaw>
    </BaseView>
  );
};

const ViewRaw = styled.a`
  cursor: pointer;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: white;
`;

const ApproveButton = styled.button`
  width: 100%;
  padding: 10px 0;
  /* border: 2px solid white; */
  border: none;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s linear;
  &:hover {
    background-color: #444;
    color: white;
    cursor: pointer;
  }
`;

const ApproveContainer = styled.div`
  max-width: 80vw;
  border: 2px solid rgba(256, 256, 256, 0.5);
  border-radius: 2px;
  background-color: rgba(256, 256, 256, 0.2);
  color: white;
  width: 400px;
  margin: 25vh 0 0 0;
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Header = styled.div`
  font-size: 28px;
  font-weight: bold;
`;

const Info = styled.div`
  color: white;
`;

const InfoCell = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
  border-radius: 2px;
  border: solid 1px #2d2d34;
  background-color: #17171a;
  color: white;
  padding: 20px 0px;
  flex: 1;
  position: relative;
  font-size: 20px;
  width: 300px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: "center";
  flex: 1;
  margin: 10px;
`;

const Container = styled.div`
  width: 100%;
  margin: 5vh auto;
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  font-size: 20px;
  color: white;
`;

export default VerifyBacking;
