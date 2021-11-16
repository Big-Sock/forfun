import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useWallet } from "use-wallet";
import useModal from "../../hooks/useModal";
// import {
//   approveBDTStaking,
//   claimBDTDC,
//   getBdtStaked,
//   stakeBDT,
//   unstakeBDT
// } from "../../web3/utils";
import StakeModal from "./StakeModal";
import UnstakeModal from "./UnstakeModal";

const Stake_GME = () => {
  const { account, connect, ethereum } = useWallet();

  const [allowance, setAllowance] = useState(0);
  const [balance, setBalance] = useState(0);
  const [currStaked, setCurrStaked] = useState(0);
  const [rewardsAvailable, setRewardsAvailable] = useState(0);

  /*const onClaimUnstake = () => {
		onPresentUnstake()
		onReward();
	}*/

  const claim = () => {
    // claimBDTDC(() => {
    //   checkStake();
    // });
  };

  const unstake = (amount) => {
    // unstakeBDT(amount, () => {
    //   checkStake();
    // });
  };

  const stake = (amount) => {
    // stakeBDT(amount, () => {
    //   checkStake();
    // });
  };

  const [onPresentStake] = useModal(
    <StakeModal max={balance} onConfirm={stake} tokenName={"wGME"} />
  );

  const [onPresentUnstake] = useModal(
    <UnstakeModal max={currStaked} onConfirm={unstake} tokenName={"wGME"} />
  );

  const handleApprove = async () => {
    if (!account) {
      // return;
      connect("injected");
      return;
    }
    // await approveBDTStaking((res) => {
    //   setBalance(res.balance);
    //   setAllowance(res.allowance);
    // });
  };

  const checkStake = async () => {
    console.log("checkin");
    // getBdtStaked((res) => {
    //   if (res.balance) {
    //     setBalance(res.balance);
    //   }
    //   if (res.allowance) {
    //     setBalance(res.balance);
    //     setAllowance(res.allowance);
    //     setCurrStaked(res.currStaked);
    //     setRewardsAvailable(res.rewardsAvailable);
    //   }
    // });
  };

  useEffect(() => {
    if (account) {
      // checkStake();
      // setInterval(function () {
      //   checkStake();
      // }, 6000);
    }
  }, [account]);

  return (
      <Container>
        <PoolContainer>
          <PoolTitle>wGME</PoolTitle>
          <PoolInfo>
            <Line>
              Your Balance:
              <ShadedLine>
                {parseFloat(balance).toFixed(2)} wGME
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
          </PoolInfo>
          <PoolActions>
            {/* {!allowance ? (
              <StyledButton style={{ width: "100%" }} onClick={handleApprove}>
                {account ? "Approve" : "Connect"}
              </StyledButton>
            ) : (
              <>
                <StyledButton onClick={onPresentStake}>Stake</StyledButton>
                <StyledButton onClick={claim}>Claim</StyledButton>
                <StyledButton onClick={onPresentUnstake}>Unstake</StyledButton>
              </>
            )} */}
                      <StyledButton disabled>Coming Soon!</StyledButton>
          </PoolActions>
        </PoolContainer>
      </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin-top: 40px;
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

export default Stake_GME;
