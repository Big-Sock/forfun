import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useWallet } from "use-wallet";
import useModal from "../../hooks/useModal";
import {
    approveSTONKStaking, checkSTONKStakingApproved,




    claimSTONK,
    getSTONKAPY, getSTONKBalance,


    getSTONKStaked,
    stakeSTONK,
    unstakeSTONK
} from "../../web3/utils";
import StakeModal from "./StakeModal";
import UnstakeModal from "./UnstakeModal";

const Stake_LP = () => {
  const { account, connect, ethereum } = useWallet();

  const [approved, setApproved] = useState(false);
  const [balance, setBalance] = useState(0);
  const [currStaked, setCurrStaked] = useState(0);
  const [rewardsAvailable, setRewardsAvailable] = useState(0);
  const [apy, setAPY] = useState(0)

  const claim = () => {
    claimSTONK(() => {
      checkStake();
    });
  };

  const unstake = (amount) => {
    unstakeSTONK(amount, () => {
      checkStake();
    });
  };

  const stake = (amount) => {
    stakeSTONK(amount, () => {
      checkStake();
    });
  };

  const [onPresentStake] = useModal(
    <StakeModal max={balance} onConfirm={stake} tokenName={"STONK"} />
  );

  const [onPresentUnstake] = useModal(
    <UnstakeModal max={currStaked} onConfirm={unstake} tokenName={"STONK"} />
  );

  const handleApprove = async () => {
    if (!account) {
      // return;
      connect("injected");
      return;
    }
    await approveSTONKStaking(() => {
      setApproved(true);
    });
  };

  const checkStake = async () => {
    console.log("checkin");
    getSTONKStaked((res) => {
      setCurrStaked(res.currStaked);
      setRewardsAvailable(res.rewardsAvailable);
    });
  };

  useEffect(() => {
    if (!apy) {
      getSTONKAPY((res) => {
        setAPY(res)
      })
    }
    if (account) {
      checkSTONKStakingApproved((res) => {
        console.log("checked Approved", res);
        if (res) setApproved(true);
      })
      getSTONKBalance((res) => {
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
      <PoolContainer>
        <PoolTitle>
         <APY>{apy}% APY</APY>
          STONK
            <LPLink target="_" href="https://app.uniswap.org/#/swap?outputCurrency=0x35b55c25731e9b05b1d8480ba39463d52c9d0211">get STONK</LPLink>
        </PoolTitle>
        <PoolInfo>
          <Line>
            Your Balance:
              <ShadedLine>
              {parseFloat(balance).toFixed(2)} STONK
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
      </PoolContainer>
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
  border: solid 1px #2d2d34;
  background-color: #17171a;
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
width: 120px;
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
  justify-content: space-between;
`;

export default Stake_LP;
