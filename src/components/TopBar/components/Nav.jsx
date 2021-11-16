import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const Nav = () => {
  return (
    <StyledNav>
      <StyledLink exact activeClassName="active" to="/">
        Info
      </StyledLink>
      <StyledLink exact activeClassName="active" to="/dashboard">
        Dashboard
      </StyledLink>
      <StyledLink exact activeClassName="active" to="/trade">
        Trading
      </StyledLink>
      <StyledLink exact activeClassName="active" to="/stake">
        Staking
      </StyledLink>
      <StyledLink exact activeClassName="active" to="/community">
        Governance
      </StyledLink>
      <StyledLink exact activeClassName="active" to="/verify-backing">
        Verification
      </StyledLink>
      {/* <StyledLink exact activeClassName="active" to="/presale">
        Presale
      </StyledLink> */}
      {/*<StyledLink exact activeClassName="active" to="/demo">*/}
      {/*  Demo*/}
      {/*</StyledLink>*/}
    </StyledNav>
  );
};

const StyledNav = styled.nav`
  justify-content: right;
  align-items: center;
  display: flex;
  margin: 2px 0 2px 10px;
  height: 100%;
  @media only screen and (max-width: 1337px) {
    justify-content: flex-end;
    margin-right: 15px;
  }
  @media only screen and (max-width: 991px) {
    display: none;
  }
`;

const StyledLink = styled(NavLink)`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  line-height: 1;
  letter-spacing: 0.5px;

  color: white;
  text-decoration: none;
  transition: all 0.1s linear;
  margin-right: 20px;
  padding: 6px 10px;

  @media only screen and (max-width: 1337px) {
    margin-right: 0;
  }

  @media only screen and (max-width: 500px) {
    padding: 5px 6px;
    font-size: 16px;
  }
  @media only screen and (max-width: 400px) {
    font-size: 14px;
  }
  @media only screen and (max-width: 359px) {
    padding: 4px 4px;
    font-size: 13px;
  }

  &:hover {
    color: #3c5bd8;
    &:after {
      background-color: rgba(256, 256, 256, 0.05);
    }
  }

  &.active {
    border-radius: 5px;
    background-color: #3c5bd8;
    @media only screen and (max-width: 500px) {
      border-radius: 5px;
    }

    &:hover {
      color: white;
    }
  }
`;
