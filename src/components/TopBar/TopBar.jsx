import React from "react";
import { NavLink } from 'react-router-dom';
import styled from "styled-components";
import Logo from "../../assets/img/forest.png";
import { NavDrawer } from "../NavDrawer";
import AccountButton from "./components/AccountButton";
import { Nav } from "./components/Nav";

const TopBar = () => {
  return (
    <StyledTopBar>
      <StyledTopBarInner>
        <NavLeft>
          <LogoLink exact activeClassName="active" to=".">
            <LogoImage src={Logo}/>
          </LogoLink>

          <Name>
            <LogoLink exact activeClassName="active" to=".">STOCKSWAP</LogoLink>
            <Beta>beta</Beta>
          </Name>
        </NavLeft>

        <NavRight>
          <Nav/>
          <AccountButton/>
        </NavRight>

        <HamburgerWrapper>
          <NavDrawer/>
        </HamburgerWrapper>
      </StyledTopBarInner>
    </StyledTopBar>
  );
};
const HamburgerWrapper = styled.div`
  display: flex;
  
  @media only screen and (min-width: 991px) {
    display: none;
  }
`

const Beta = styled.div`
font-size: 12px;
align-items: baseline;
margin-left: 5px;
opacity: .6;
`

const LogoLink = styled(NavLink)`
  text-decoration: none;
`

const LogoImage = styled.img`
  object-fit: cover;
  width: 50px;
  height: 50px;
  margin-right: 5px;
  
`
const Name = styled.h1`
  font-size: 25px;
  display: flex;
  flex-direction: row;
  @media only screen and (max-width: 1337px) {
    font-size: 28px;
  }
`

const NavLeft = styled.div`
  display: flex;
  margin-right: 0;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  
`;

const NavRight = styled.div`
  display: flex;
  height: 100%;
  margin: 0 5px;
  align-items: center;
  justify-content: right;
  @media only screen and (max-width: 1337px) {
    display: none;
  }
`;
const StyledTopBar = styled.div`
  color: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 20px;
`;

const StyledTopBarInner = styled.div`
  align-items: center;
  width: 90%;
  display: flex;
  justify-content: space-between;
  @media only screen and (max-width: 991px) {
    justify-content: space-between;
  }
`;
export default TopBar;
