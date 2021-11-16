import React from "react";
import styled from "styled-components";
import useModal from "../../hooks/useModal";
import { StakeModal } from "./StakeModal";
import { TradeModal } from "./TradeModal";
export const PortfolioCard = ({ portfolio }) => {
  const [stakeModal] = useModal(<StakeModal />);
  const [tradeModal] = useModal(<TradeModal />);
  return (
    <Container>
      <Wrapper>
        <Title>wS&P 500</Title>
        <Title>$383.49/0.00000000 ETH</Title>
        <Title>4.00</Title>
        <Title>80.00%</Title>
        <Title>
          <Button onClick={stakeModal}>Stake</Button>
        </Title>
        <Title>
          <Button onClick={stakeModal}>Trade</Button>
        </Title>
      </Wrapper>
    </Container>
  );
};

const Button = styled.button`
  padding: 3px 15px 3px 15px;
  background-color: #3c5bd8;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 19px;
  cursor: pointer;
  transition: all 0.1s linear;
  opacity: 0.9;
  &:hover {
    opacity: 1;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 100%;
`;

const Title = styled.p`
  font-size: 19px;
  margin: 0;
  line-height: 26px;
`;

const Container = styled.div`
  margin: 5px 0;
  height: 50px;

  width: 95%;

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
