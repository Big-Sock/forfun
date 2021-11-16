import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useWallet } from "use-wallet";
import { fetchStockBalance, getStocks } from "../../web3/utils";
import { BaseView } from "../BaseView";
import { AssetsContents } from "./AssetsContents";
import { Balance } from "./Balance";
import { NewsFeed } from "./NewsFeed";
import TradeHistory from "./TradeHistory";

export const Dashboard = () => {
  const { account } = useWallet();
  const [stocks, setStocks] = useState([]);
  const [selectStock, setSelectStock] = useState({});
  const [totalBalance, setTotalBalance] = useState(0);

  const addStockInfo = useCallback(
    async (stock) => {
      const ticker = stock.ticker;
      let res = await axios.post(`/api/orders/get-my-gains`, {
        address: account,
        stock: ticker,
      });
      res = await axios.get(`/api/stocks/${ticker}/last`);
      const price = res.data.price;
      await fetchStockBalance(stock, (res) => {
        if (res) {
          const info = {
            ticker,
            balance: res,
            price,
          };
          setTotalBalance((prevState, props) => {
            return prevState + info.price * info.balance;
          });
        }
      });
    },
    [account]
  );

  const fetchBalances = useCallback(() => {
    getStocks((stocks) => {
      if (stocks) {
        for (const stock of stocks) addStockInfo(stock);
      }
    });
  }, [addStockInfo]);

  useEffect(() => {
    if (account) {
      fetchBalances();
    }
  }, [account, fetchBalances]);

  const getAllStocks = () => {
    getStocks((res) => {
      if (res) {
        setStocks(res);
        setSelectStock(res[0]);
      }
    });
  };

  useEffect(() => {
    getAllStocks();
  }, []);

  return (
    <BaseView>
      <Container>
        <LeftCol>
          <Balance
            stocks={stocks}
            setStocks={setStocks}
            selectStock={selectStock}
            setSelectStock={setSelectStock}
          />
          <PortfolioContainer>
            <Title>
              Portfolio Balance: ${totalBalance ? totalBalance.toFixed(2) : 0}
            </Title>
            <Divider />
            <AssetsContents assets={stocks} setSelectStock={setSelectStock} />
          </PortfolioContainer>
        </LeftCol>

        <RightCol>
          <TradeHistory stocks={stocks} selectStock={selectStock} />
          <NewsFeed />
        </RightCol>
      </Container>
    </BaseView>
  );
};

const Title = styled.h1`
  font-size: 24px;
  text-align: left;
  margin-left: 5%;
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background-color: #2d2d34;
  //margin-bottom: 10px;
`;

const PortfolioContainer = styled.div`
  height: 60%;
  padding: 0 0 45px;
  margin-left: 1%;
  margin-top: 0.9%;

  border-radius: 5px;
  border: solid 1px #2d2d34;
  background-color: #17171a;
  box-sizing: border-box;
  overflow: hidden;

  @media only screen and (max-width: 991px) {
    max-height: 50vmax;
    margin-left: 0;
    margin-top: 0;
  }
`;

const LeftCol = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 65%;
  justify-content: center;

  @media only screen and (max-width: 991px) {
    width: 100%;
    margin-top: 10px;
  }
`;

const RightCol = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 30%;
  justify-content: center;
  @media only screen and (max-width: 991px) {
    width: 100%;
    margin-top: 10px;
  }
`;

const Container = styled.div`
  width: 90%;
  height: 100vh;
  max-width: 100vw;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  flex-direction: row;
  justify-content: center;

  margin-top: 2vh;
  margin-bottom: 5vh;

  align-items: center;
  font-size: 20px;
  color: white;

  @media only screen and (max-width: 991px) {
    flex-direction: column;
    height: auto;
  }
`;
