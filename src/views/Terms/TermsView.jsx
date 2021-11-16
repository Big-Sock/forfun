import React from "react";
import styled from "styled-components";
import { BaseView } from "../BaseView";
import { Terms } from "./Terms";

export const TermsView = () => {
  return (
    <BaseView>
      <Container>
        <Terms />
      </Container>
    </BaseView>
  );
};

const Container = styled.div`
  font-size: 20px;
  text-align: left;
  border: 2px solid rgba(256, 256, 256, 0.5);
  background-color: rgba(180, 180, 180, 0.3);
  padding: 30px;
  margin: 60px;
`;
