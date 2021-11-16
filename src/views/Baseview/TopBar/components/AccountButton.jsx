import React from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import { useWallet } from "use-wallet";
import isMobile from "../../../../utils/isMobile";

const AccountButton = () => {
  const { account, connect } = useWallet();

  const unlock = () => {
    if (isMobile() && !window.ethereum) {
      Swal.fire("Mobile use requires MetaMask browser.");
      return;
    } else if (!window.ethereum) {
      Swal.fire("Our site requires the MetaMask extension to function properly!")
      return;
    }
    connect("injected");
  };

  return (
    <StyledAccountButton  onClick={unlock}>
      {!account ? (
        <Button disabled={false}>
          Connect Wallet
        </Button>
      ) : (
        <StyledAccountInfo>
          <Oval />
          <StyledA
            href={`https://etherscan.io/address/${account}`}
            target={`_blank`}
          >
            {`${account.substring(0, 6)}...${account.substring(
              account.length - 4
            )}`}
          </StyledA>
        </StyledAccountInfo>
      )}
    </StyledAccountButton>
  );
};

const Button = styled.button`
  border: none;
  background-color: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  font-size: 16px;
  font-family: "Sophia Nubian Bold", sans-serif;
  cursor: pointer;
  
`;

const StyledAccountButton = styled.div`
  padding: 6px 10px 6px 10px;
  box-shadow: rgba(28, 15, 65, 0.2) 0px 4px 8px 0px, rgba(28, 15, 65, 0.2) 0px 6px 10px 0px;
  border-radius: 10px;
  height: 30px;
  cursor: pointer;
  transition: all 0.1s linear;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.9;    
  width: 165px;
  &:hover {
    opacity: 1;
    box-shadow: rgba(28, 15, 65, 0.3) 0px 4px 8px 0px, rgba(28, 15, 65, 0.3) 0px 6px 10px 0px;
  }

`;

const Oval = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 5px;
  margin-right: 10px;
`;

const StyledAccountInfo = styled.div`
  margin: 0 2px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledA = styled.a`
  font-size: 16px;
  color: gray;
  line-height: 1;
  text-decoration: none !important;
  transition: all 0.1s linear;
  opacity: 0.85;
  &:hover {
    opacity: 1;
  }
`;

export default AccountButton;
