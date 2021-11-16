import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import useWallet from "use-wallet";

const Farms = () => {
  const [orders, setOrders] = useState([]);
  const { account } = useWallet();

  const updateMyOrders = useCallback(async () => {
    let orders = [];
    orders = await axios.post(`/api/orders/my-recent`, {
      address: account,
    });

    const formattedOrders = orders.data.map((order) => {
      return (
        <Container>
          <ColorTab isBuy={order.isBuy} />
          <Wrapper>
            <Info>
              <StockName>w{order.symbol}</StockName>
              <OrderDate>{new Date(order.timestamp).toDateString()}</OrderDate>
            </Info>
            <Price>{order.price.toString().substring(0, 8)} ETH</Price>
          </Wrapper>
        </Container>
      );
    });
    setOrders(formattedOrders);
  }, [account]);

  useEffect(() => {
    console.log(account)
    if (account) {
      updateMyOrders();
    }
  }, [account, updateMyOrders]);

  return (
    <RecentTrades>
      <Title>Trades</Title>
      <Divider/>
      {orders.length ? orders : "No Trades Made!"}
    </RecentTrades>
  );
};

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background-color: #2d2d34;
  margin-bottom: 10px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const ColorTab = styled.div`
  background-color: ${(props) => (props.isBuy ? "#2eb476" : "#de3a3a")};
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  height: 66px;
  min-width: 12px;
`;

const Info = styled.div`
  text-align: left;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin-top: 10px;
  margin-bottom: 10px;
  min-height: 40px;
  margin-left: 20px;
  width: 100%;
`;

const StockName = styled.p`
  font-size: 18px;
  line-height: 25px;
  margin: 0;
  font-family: SophiaNubian-Bold, sans-serif;
  @media only screen and (max-width: 450px) {
    font-size: 16px;
  }
`;

const OrderDate = styled.p`
  font-size: 15px;
  margin: 0;
  line-height: 21px;
  color: #c1c1c1;
  @media only screen and (max-width: 450px) {
    font-size: 14px;
  }
`;

const Price = styled.div`
  font-size: 20px;
  margin-right: 20px;
  height: auto;
  justify-self: right;
  align-self: center;
  line-height: 30px;
  white-space: nowrap;
  font-family: SophiaNubian-Bold, sans-serif;
  @media only screen and (max-width: 450px) {
    font-size: 16px;
  }

`;

const Container = styled.div`
  margin: 5px 0;
  min-height: 50px;
  width: 90%;
  font-size: 18px;
  color: white;
  display: flex;
  flex-direction: row;

  justify-content: flex-start;
  align-items: center;

  background-color: #1d1d21;
  border-bottom: solid 1px #2d2d34;
  border-radius: 5px;
`;

const Title = styled.div`
  text-align: left;
  align-self: flex-start;
  width: 80%;
  margin: 10px 0 10px 30px;
  font-size: 25px;
  font-family: "Sophia Nubian Bold", sans-serif;
`;

const RecentTrades = styled.div`
  flex: 1;
  border-radius: 5px;
  padding-bottom: 15px;
  border: solid 1px #2d2d34;
  background-color: #17171a;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;

`;

export default Farms;
