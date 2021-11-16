import React from "react";
import { NavLink } from 'react-router-dom';
import styled from "styled-components";
import Logo from "../../../assets/img/forest.png";
import { NavDrawer } from "./components/NavDrawer";
import AccountButton from "./components/AccountButton";
import { Nav } from "./components/Nav";

const TopBar = () => {
  return (
    <StyledTopBar>

      <AccountButton />

    </StyledTopBar >
  );
};

const StyledTopBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

export default TopBar;
