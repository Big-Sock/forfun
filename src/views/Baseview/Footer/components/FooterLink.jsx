import React from "react";
import styled from "styled-components";

export const FooterLink = (props) => {
  return (
    <StyledLink href={props.link} target="_blank" rel="noopener noreferrer">
      <SocialIcon src={props.icon} />
      {props.text}
    </StyledLink>
  );
};

const SocialIcon = styled.img`
  height: 30px;
  width: 30px;
  margin-right: 10px;
`;

const StyledLink = styled.a`
  margin: 5px;
  font-size: 20px;
  line-height: 1;
  text-decoration: underline;
  display: flex;
  align-items: center;
  transition: all 0.2s ease-in-out;
  color: #ffffff;
  padding-left: 16px;
  padding-right: 16px;
  &:hover {
    color: #ffcb46;
  }
`;
