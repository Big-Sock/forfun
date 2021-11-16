import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { BaseView } from "./BaseView";

export const NotFoundView = () => {
  return (
    <BaseView>
      <SubText>There's nothing here</SubText>
      <h1>404</h1>
      <StyledLinkContainer>
        <StyledLink exact to="/">
          Take me home!
        </StyledLink>
      </StyledLinkContainer>
    </BaseView>
  );
};

const StyledLinkContainer = styled.div`
  margin-top: 2vh;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledLink = styled(NavLink)`
  font-size: 30px;
  text-decoration: none;
  display: flex;
  align-items: center;
  border: 2px solid #fff;
  border-radius: 5px;
  padding: 12px;
  width: fit-content;
  &:hover {
    background-size: 12px, 100%;
    font-size: 32px;
  }
`;

const SubText = styled.div`
  font-size: 60px;
  margin-top: 10vh;
`;
