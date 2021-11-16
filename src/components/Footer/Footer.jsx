import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { SocialMedias } from "./components/SocialMedias";

export const Footer = () => (
  <StyledFooter>
    <StyledLink exact activeClassName="active" to="/terms">
      Terms of Service
    </StyledLink>
    <BottomRow>
      <Copyright>Contact Us: info@stockswap.com</Copyright>
      <SocialMedias />
      <Copyright>Copyright © StockSwap 2021</Copyright>
    </BottomRow>
  </StyledFooter>
);

const BottomRow = styled.div`
  display: flex;
  width: calc(100% - 6vw);
  margin: 0 3vw 20px 3vw;
  @media only screen and (max-width: 900px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const StyledFooter = styled.footer`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  background-color: #0e0e10;
`;

const Copyright = styled.div`
  flex: 1;
  font-size: 20px;
  color: #3c5bd8;
  margin: 10px 0;

  @media only screen and (max-width: 900px) {
    margin: 20px 0;
  }
`;

const StyledLink = styled(NavLink)`
  font-size: 20px;
  margin: 30px 0;
  line-height: 1;
  letter-spacing: 0.5px;
  color: #3c5bd8;
  transition: all 0.1s linear;
  text-decoration: underline;
  @media only screen and (max-width: 900px) {
    margin: 30px 0 10px 0;
  }
  &:hover {
    color: white;

    &:after {
      background-color: rgba(256, 256, 256, 0.05);
    }
  }
  &.active {
    text-decoration: underline;
    color: white;
  }
`;
