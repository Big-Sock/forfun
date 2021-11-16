import DoneOutlineIcon from "@material-ui/icons/DoneOutline";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import loading from "../../assets/img/loading.gif";

//TODO: this isn't great.
const Farms = ({ txId, status, close }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (txId === 0) {
      setIsLoading(false);
      setTimeout(() => {
        close();
      }, 5000);
    }
  }, [close, status, txId]);

  let icon = <Loading src={loading} />;
  let message = status;
  if (!isLoading) {
    icon = <DoneOutlineIcon style={{ height: "100%", width: "auto" }} />;
    message = "trade complete!";
  } else if (error) {
    icon = <ErrorOutlineIcon style={{ height: "100%", width: "auto" }} />;
    message = "error! -check metamask";
  }

  return (
    <Container>
      <Modal>
        <Icon>{icon}</Icon>
        <Info>{message}</Info>
      </Modal>
    </Container>
  );
};

const Loading = styled.img`
  height: 100%;
  width: auto;
  position: relative;
`;

const Info = styled.div`
  flex: 1;
  width: 50%;
  text-align: center;
`;

const Icon = styled.div`
  height: 80%;
`;

const Modal = styled.div`
  width: 100%;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Container = styled.div`
  position: relative;
  height: 30px;
  width: 200px;
  padding: 10px;
  border-radius: 8px;
  border: 2px solid rgba(256, 256, 256, 0.6);
  background-color: rgba(0, 0, 0, 0.1);
  color: white;
`;

export default Farms;
