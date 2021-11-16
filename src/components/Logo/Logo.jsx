import React from "react";
import styled from "styled-components";
import logo from "../../assets/img/logo.png";

const Logo = () => {
  return (
    <LogoContainer>
      <StyledLogo src={logo} alt="logo" height="40px" />
      <StyledText>StockSwap</StyledText>
    </LogoContainer>
  );
};

const LogoContainer = styled.div`
  align-items: center;
  display: flex;
`;

const StyledLogo = styled.img`
  height: 120px;
  margin-top: 50px;
  cursor: pointer;
  @media only screen and (max-width: 767px) {
    height: 80px;
    margin-top: 0;
  }
`;

const StyledText = styled.span`
  font-size: 24px;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  color: #ffffff;
  @media only screen and (max-width: 767px) {
    margin-left: 2px;
    font-size: 27px;
    /* width: 50vw; */
  }
`;

export default Logo;
