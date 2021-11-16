import React from "react";
import styled from "styled-components";
import Container from "../Container";

const Modal = ({ children }) => {
  return (
    <Container size="sm">
      <StyledModal>{children}</StyledModal>
    </Container>
  );
};

const StyledModal = styled.div`
  border-radius: 8px;
  position: relative;
  width: 100%;
  height: 100%;
  max-width: calc(90vw - 32px);
  border: solid 1px gray;
  background-color: #17171a;
  padding: 15px;
  font-size: 16px;
  font-weight: normal;
`;

export default Modal;
