import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import useWallet from "use-wallet";
import BaseView from "../BaseView";
import { Approval } from "./Approval";
import Forms from "./Forms";
import Market from "./Market";

const Trade = () => {
  const { account } = useWallet();
  const [formsCompleted, setFormsCompleted] = useState(false);

  const [kycSubmitted, setKYCSubmitted] = useState(false);
  const [ecpSubmitted, setECPSubmitted] = useState(false);

  const [retrieved, setRetrieved] = useState(false);
  const [approved, setApproved] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [pendingApproval, setPendingApproval] = useState({kyc: false, ecp: false});

  const getData = useCallback(() => {
    axios.get(`/api/forms/kyc-status/${account}`).then((res) => {
      setFormsCompleted(res.data.ecp && res.data.kyc);
      setApproved(res.data.approved);
      if (res.data.approved) {
        setPendingApproval({kyc: false, ecp: false})
      }
      setRetrieved(true);
    });
  }, [account]);

  useEffect(() => {
    if (!retrieved && account) {
      getData();
    }
  }, [account, getData, retrieved]);

  //TODO: This is very hard to read
  let content;
  if (!account) {
    content = <Market approved={false} />;
  } else if (!isRegistering && !approved) {
    content = (
      <Market approved={false} formsCompleted={formsCompleted} setIsRegistering={setIsRegistering} />
    );
  } else if (isRegistering && !approved) {
    content = (
      <>
        <Title>Please fill out all forms to access trading</Title>
        <SubTitle>
          All data is encrypted before being stored on our secure server
        </SubTitle>
        <Container>
          {!kycSubmitted && !ecpSubmitted ? (
            <Forms
              getData={getData}
              setKYCSubmitted={setKYCSubmitted}
              setECPSubmitted={setECPSubmitted}
              setPendingApproval={setPendingApproval}
              pendingApproval={pendingApproval}
            />
          ) : (
            <Approval
              kycSubmitted={kycSubmitted}
              ecpSubmitted={ecpSubmitted}
              pendingApproval={pendingApproval}
              approved={approved}
            />
          )}
          <Button onClick={() => setIsRegistering(false)}>
            Return to Trade View
          </Button>
        </Container>
      </>
    );
  } else {
    content = <Market approved={true} />;
  }
  return <BaseView>{content}</BaseView>;
};

const Button = styled.button`
  width: 60%;
  padding: 10px 0;
  margin: 20px 0;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s linear;
  &:hover {
    background-color: #444;
    color: white;
    cursor: pointer;
  }
`;

const Title = styled.h1`
  margin: 5px;
`;

const SubTitle = styled.h4`
  margin: 0;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;

`;

export default Trade;
