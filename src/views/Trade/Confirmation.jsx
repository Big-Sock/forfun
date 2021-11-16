import React from "react";
import styled from "styled-components";

export const Confirmation = ({
  kyc,
  ecp,
  setEcp,
  setStep,
  selfieImgName,
  dlImgName,
}) => {
  const resetSignature = () => {
    setEcp({ ...ecp, sign: ""})
  };
  
  return (
    <Container>
      <Title>Is this information correct?</Title>
      <EditWrapper>
        <SubTitle>KYC Data</SubTitle>
        <button
          onClick={() => {
            resetSignature();
            setStep(1);
          }}
        >
          Edit
        </button>
      </EditWrapper>

      <InformationContainer>
        <Row>
          <Question>Full Name:</Question>
          <Answer>{kyc.name}</Answer>
        </Row>
        <Row>
          <Question>Date of Birth:</Question>
          <Answer>{kyc.birth}</Answer>
        </Row>
        <Row>
          <Question>Email:</Question>
          <Answer>{kyc.email}</Answer>
        </Row>
        <Row>
          <Question>Physical Address:</Question>
          <Answer>{kyc.KYCaddress}</Answer>
        </Row>
        <Row>
          <Question>{kyc.usePassport ? "Passport " : "Driver's License "} Number:</Question>
          <Answer>{kyc.dlNum}</Answer>
        </Row>
        <Row>
          <Question>{kyc.usePassport ? "Country:" : "DL State:"}</Question>
          <Answer>{kyc.dlState}</Answer>
        </Row>
        <Row>
          <Question>Selfie:</Question>
          <Answer>{selfieImgName}</Answer>
        </Row>
        <Row>
          <Question>ID Image:</Question>
          <Answer>{dlImgName}</Answer>
        </Row>
      </InformationContainer>

      <EditWrapper>
        <SubTitle>ECP Data</SubTitle>
        <button
          onClick={() => {
            resetSignature();
            setStep(2);
          }}
        >
          Edit
        </button>
      </EditWrapper>

      <InformationContainer>
        <Row>
          <Question>Full Name:</Question>
          <Answer>{ecp.ECPname}</Answer>
        </Row>
        <Row>
          <Question>Principal Occupation:</Question>
          <Answer>{ecp.job}</Answer>
        </Row>
        <Row>
          <Question>Physical Address:</Question>
          <Answer>{ecp.ECPaddress}</Answer>
        </Row>
        <Row>
          <Question>Signature:</Question>
          <Answer>{ecp.sign}</Answer>
        </Row>
      </InformationContainer>
    </Container>
  );
};

const Row = styled.div`
  width: 90%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 5px 0; 
`

const EditWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Title = styled.h3`
  padding: 0 20px;
  margin-bottom: 10px;
`;

const SubTitle = styled.h4`
  padding: 5px 20px;
  margin: 15px;
  border-bottom: 2px solid white;
`;

const Question = styled.div`
  text-align: left;
  width: 50%;
  
`;

const Answer = styled.div`
  display: flex;
  justify-content: flex-end;
  text-align: right;
  align-items: flex-end;
  width: 75%;
  @media only screen and (max-width: 991px) {
    width: 100%;
    word-break: break-word;
  }

`;

const InformationContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const Container = styled.div`
  margin-top: 3vh;
  width: 90%;
  border: 1px solid #2d2d34;
  border-radius: 5px;
  background-color: #17171a;
  align-items: center;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  box-sizing: border-box;
  @media only screen and (min-width: 1338px) {
    width: 50%;
  }
`;
