import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useWallet } from "use-wallet";
import useModal from "../../hooks/useModal";
import {
    approveCOINStaking, checkCOINStakingApproved,




    claimCOIN,
    getCOINAPY, getCOINBalance,


    getCOINStaked,
    stakeCOIN,
    unstakeCOIN
} from "../../web3/utils";
import StakeModal from "./StakeModal";
import UnstakeModal from "./UnstakeModal";

const Stake_COIN = () => {
  const { account, connect, ethereum } = useWallet();


  const [approved, setApproved] = useState(false);
  const [balance, setBalance] = useState(0);
  const [currStaked, setCurrStaked] = useState(0);
  const [rewardsAvailable, setRewardsAvailable] = useState(0);
  const [apy, setAPY] = useState(0)

  const claim = () => {
    claimCOIN(() => {
      checkStake();
    });
  };

  const unstake = (amount) => {
    unstakeCOIN(amount, () => {
      checkStake();
    });
  };

  const stake = (amount) => {
    stakeCOIN(amount, () => {
      checkStake();
    });
  };

  const [onPresentStake] = useModal(
    <StakeModal max={balance} onConfirm={stake} tokenName={"wCOIN"} />
  );

  const [onPresentUnstake] = useModal(
    <UnstakeModal max={currStaked} onConfirm={unstake} tokenName={"wCOIN"} />
  );

  const handleApprove = async () => {
    if (!account) {
      // return;
      connect("injected");
      return;
    }
    await approveCOINStaking(() => {
      setApproved(true);
    });
  };

  const checkStake = async () => {
    console.log("checkin");
    getCOINStaked((res) => {
      setCurrStaked(res.currStaked);
      setRewardsAvailable(res.rewardsAvailable);
    });
  };

  useEffect(() => {
    if (!apy) {
      getCOINAPY((res) => {
        setAPY(res);
      })
    }
    if (account) {
      checkCOINStakingApproved((res) => {
        console.log("checked Approved", res);
        if (res) setApproved(true);
      })
      getCOINBalance((res) => {
        setBalance(res);
      })
      if (approved) {
        checkStake();
        setInterval(function () {
          checkStake();
        }, 6000);
      }
    }
  }, [account, approved]);

  return (
    <Container>
      <BigPoolContainer>
        <PoolTitle>
          <APY>{apy}% APY</APY>
          wCOIN
            <LPLink href="/trade">get wCOIN</LPLink>
        </PoolTitle>
        <BigPoolInfo>
          <Line>
            Your Balance:
              <ShadedLine>
              {parseFloat(balance).toFixed(2)} wCOIN
              </ShadedLine>
          </Line>
          <Line>
            Currently Staked:
              <ShadedLine>{parseFloat(currStaked).toFixed(2)}</ShadedLine>
          </Line>
          <Line>
            Rewards Available:
              <ShadedLine>{rewardsAvailable} STONK</ShadedLine>
          </Line>
        </BigPoolInfo>
        <PoolActions>
          {!approved ? (
            <StyledButton style={{ width: "100%" }} onClick={handleApprove}>
              {account ? "Approve" : "Connect"}
            </StyledButton>
          ) : (
              <>
                <StyledButton onClick={onPresentStake}>Stake</StyledButton>
                <StyledButton onClick={claim}>Claim</StyledButton>
                <StyledButton onClick={onPresentUnstake}>Unstake</StyledButton>
              </>
            )}
          {/* <StyledButton disabled>Coming Soon!</StyledButton> */}
        </PoolActions>
      </BigPoolContainer>
    </Container>
  );
};

const APY = styled.div`
font-size: 16px;
position: absolute;
left: 20px;
`

const LPLink = styled.a`
font-size: 16px;
position: absolute;
right: 20px;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin-top: 40px;
  width: 100%;
  @media only screen and (max-width: 991px) {
  width: 100%;
  }
`;

const PoolTitle = styled.h3`
  border-bottom: 2px solid rgba(256, 256, 256, 0.7);
  margin-top: 0;
`;

const PoolContainer = styled.div`
  width: 400px;
  border: 2px solid rgba(256, 256, 256, 0.5);
  background-color: rgba(180, 180, 180, 0.3);
  font-size: 20px;
  border-radius: 2px;
  padding: 20px;
  @media only screen and (max-width: 991px) {
    width: calc(100% - 40px);
  }
`;

const BigPoolContainer = styled.div`
  width: 100%;
  height: 250px;
  // border: 2px solid #d4af37;
  box-shadow:
       inset 0 -5px 8px #d4af37,
             0 0  5px 2px #d4af37,
             0.3em 0.3em 1em #d4af37;
  font-size: 20px;
  border-radius: 2px;
  padding: 30px;
  border: solid 1px #d4af37;
  background-color: #17171a;
  @media only screen and (max-width: 991px) {
    width: calc(100% - 40px);
    height: 300px;
  }
`;

const PoolInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  text-align: left;
  font-size: 18px;
  line-height: 1;
  letter-spacing: 1px;
  color: #ffffff;
  margin-bottom: 10px;
`;

const BigPoolInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  text-align: left;
  font-size: 24px;
  line-height: 1.4;
  letter-spacing: 1px;
  color: #ffffff;
  margin-bottom: 20px;
`;

const ShadedLine = styled.div`
  text-align: right;
`;

const Line = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const StyledButton = styled.button`
  width: 200px;
  padding: 10px 0;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s linear;
  background-color: white;
  &:hover {
    background-color: #444;
    color: white;
    cursor: pointer;
  }
`;

const PoolActions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`;

export default Stake_COIN;
