import React from "react";
import styled from "styled-components";
import BaseView from "../BaseView";
import Stake_COIN from './Stake_COIN';
import Stake_LP from "./Stake_LP";
import Stake_STONK from './Stake_STONK';

const Stake = () => {

  return (
    <BaseView>
      <ButtonText>Stake to Earn Stonk</ButtonText>
      <Container>
        <Stake_COIN/>
        <Stake_LP />
        <Stake_STONK />
        {/* <Stake_TSLA />
          <Stake_GME />
          <Stake_AAPL /> */}
      </Container>
    </BaseView>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 925px;
  margin-bottom: 40px;
  @media only screen and (max-width: 991px) {
      flex-direction: column;
      align-items: center;
      width: 90vw;
  }
`;

const ButtonText = styled.div`
  margin-top: 43px;
  font-size: 35px;
  @media only screen and (max-width: 500px) {
  font-size: 30px;
  }
`;

const ButtonSubText = styled.div`
  font-size: 17px;
`;

export default Stake;
