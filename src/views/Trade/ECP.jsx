import React from "react";
import styled from "styled-components";

export const ECP = ({ ecp, setEcp }) => {
  const handleChange = (e) => {
    const newEcp = { ...ecp };
    newEcp[e.target.name] = e.target.value;
    setEcp(newEcp);
  };

  return (
    <Container>
      <Title>ECP Certification</Title>
      <Divider />
      <Content>
        <BulletPoint>
          I qualify as an Eligible Contract Participant (ECP) according to
          section 18 of 7 U.S. Code § 1a (
          <a target="_" href="https://www.law.cornell.edu/uscode/text/7/1a">
            https://www.law.cornell.edu/uscode/text/7/1a
          </a>
          ), part xi of which states that an ECP is an individual who has
          amounts invested on a discretionary basis, the aggregate of which is
          in excess of (I) $10,000,000; or (II) $5,000,000 and who enters into
          the agreement, contract, or transaction in order to manage the risk
          associated with an asset owned or liability incurred, or reasonably
          likely to be owned or incurred, by the individual
        </BulletPoint>
        <BulletPoint>
          I understand that this is a written representation which StockSwap
          Inc. will be able to use in the event of litigation.
        </BulletPoint>
        <BulletPoint>
          I agree to communicate with StockSwap Inc. regarding any material
          changes which could affect my status as an ECP.
        </BulletPoint>
        <BulletPoint>
          I understand that StockSwap must retain a copy of this information.
        </BulletPoint>
        <SignatureContainer>
          I certify that my true full name is:
          <Signature
            name="ECPname"
            onChange={handleChange}
            value={ecp.ECPname}
          />
        </SignatureContainer>
        <SignatureContainer>
          I certify that my principal occupation is:
          <Signature name="job" onChange={handleChange} value={ecp.job} />
        </SignatureContainer>
        <SignatureContainer>
          I certify that my physical address is:
          <Signature
            name="ECPaddress"
            onChange={handleChange}
            value={ecp.ECPaddress}
          />
        </SignatureContainer>
        <SignatureContainer>
          I certify that the above is all true and I qualify as an ECP.
          <Signature
            name="sign"
            onChange={handleChange}
            value={ecp.sign}
            placeholder={"Please enter your full legal name"}
          />
        </SignatureContainer>
      </Content>
    </Container>
  );
};

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background-color: rgba(256, 256, 256, 0.6);
  -webkit-align-self: center;
  -ms-flex-item-align: center;
  align-self: center;
  margin: 5px 0 20px 0;
`;

const SignatureContainer = styled.div`
  display: flex;
  flex-direction: row;
  text-align: left;
  display: inline;
  width: 100%;
  font-size: 18px;
`;

const Signature = styled.input`
  background-color: rgba(0, 0, 0, 0);
  border: none;
  border-bottom: 2px solid white;
  color: white;
  text-align: center;
  margin: 0 8px;
  margin-bottom: 2px;
  height: 24px;
  font-size: 16px;
  width: 100%;
  &:focus {
    outline: none;
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

const BulletPoint = styled.span`
  margin-bottom: 10px;
  text-align: left;
  font-size: 16px;
`;

const Title = styled.h3`
  margin: 5px;
`;

const Container = styled.div`
  margin-top: 3vh;
  width: 50%;
  border: 1px solid #2d2d34;
  border-radius: 5px;
  background-color: #17171a;
  align-items: center;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  box-sizing: border-box;
  @media only screen and (max-width: 767px) {
    width: 100%;
  }
`;

const Content = styled.div`
  display: flex;
  padding: 20px;

  flex-direction: column;
  align-items: flex-start;
`;

export default ECP;
