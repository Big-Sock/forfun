import React from "react";
import styled from "styled-components";
import Swal from "sweetalert2";

import Toggle from "../../components/Toggle.jsx";

export const KYC = ({
  kyc,
  setKyc,
  selfieImgName,
  setSelfieImgName,
  dlImgName,
  setDLImgName,
}) => {
  const handleChange = (e) => {
    const newKyc = { ...kyc };
    newKyc[e.target.name] = e.target.value;
    setKyc(newKyc);
  };

  const handlePassport = (e) => {
    const newKyc = { ...kyc };
    newKyc[e.target.name] = !newKyc[e.target.name];
    newKyc["KYCaddress"] = "";
    newKyc["dlNum"] = "";
    newKyc["dlState"] = "";
    newKyc["dlImg"] = "";
    setDLImgName("");
    setKyc(newKyc);
  };

  const handleImg = (e) => {
    if(e.target.files[0].size > 6291456 ){
      Swal.fire("File is too big!", "Please choose a file that is under 6 MB.", "warning");
      return;
    } else if (e.target.files[0].size === "undefined") {
      return;
    }
    const newKyc = { ...kyc };
    newKyc[e.target.name] = e.target.files[0];
    setKyc(newKyc);
    e.target.name === "selfieImg"
      ? setSelfieImgName(e.target.value.substring(12, e.target.value.length))
      : setDLImgName(e.target.value.substring(12, e.target.value.length));
  };

  return (
    <Container>
      <Title>
        KYC
        <div
          style={{ position: "absolute", transform: "translate(10vh, 10px)" }}
        >
          <Toggle
            name="usePassport"
            label="Passport"
            checked={kyc.usePassport}
            onClick={handlePassport}
          />
        </div>
      </Title>
      <Divider />
      <Content>
        <BulletPoint>
          Please enter the following information directly from your{" "}
          {kyc.usePassport ? "Passport" : "Driver's License"}:
        </BulletPoint>
        <SignatureRow>
          <SignatureContainer style={{ width: "46%" }}>
            Full Name:
            <Signature name="name" onChange={handleChange} value={kyc.name} />
          </SignatureContainer>
          <SignatureContainer style={{ width: "46%" }}>
            Date of Birth:
            <Signature
              type="date"
              name="birth"
              onChange={handleChange}
              value={kyc.birth}
            />
          </SignatureContainer>
        </SignatureRow>
        <SignatureContainer>
          Email:
          <Signature name="email" onChange={handleChange} value={kyc.email} />
        </SignatureContainer>
        <SignatureContainer>
          Physical Address (as written on the{" "}
          {kyc.usePassport ? "passport" : "driver's license"}):
          <Signature
            name="KYCaddress"
            onChange={handleChange}
            value={kyc.KYCaddress}
          />
        </SignatureContainer>
        <SignatureRow>
          <SignatureContainer style={{ width: "70%" }}>
            {kyc.usePassport ? "Passport" : "Driver's License"} Number:
            <Signature name="dlNum" onChange={handleChange} value={kyc.dlNum} />
          </SignatureContainer>
          <SignatureContainer style={{ width: "20%" }}>
            {kyc.usePassport ? "Country:" : "DL State:"}
            <Signature
              name="dlState"
              onChange={handleChange}
              value={kyc.dlState}
            />
          </SignatureContainer>
        </SignatureRow>
        <SignatureRow>
          <SignatureContainer>
            {selfieImgName ? (
              <p>Selfie Image: {selfieImgName}</p>
            ) : (
              <>
                <p>Upload Selfie:</p>
                <Upload name="selfieImg" type="file" accept=".png, .svg, .jpg, .jpeg, .gif" onChange={handleImg} />
              </>
            )}
          </SignatureContainer>
        </SignatureRow>
        <SignatureRow>
          <SignatureContainer>
            {dlImgName ? (
              <p>
                {kyc.usePassport ? "Passport" : "Driver's License"} Image:{" "}
                {dlImgName}
              </p>
            ) : (
              <>
                <p>
                  Upload {kyc.usePassport ? "Passport" : "Driver's License"}{" "}
                  Front:
                </p>
                <Upload name="dlImg" type="file" accept=".png, .svg, .jpg, .jpeg, .gif" onChange={handleImg} />
              </>
            )}
          </SignatureContainer>
        </SignatureRow>
      </Content>
    </Container>
  );
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  padding-top: 0px;
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background-color: rgba(256, 256, 256, 0.6);
  -webkit-align-self: center;
  -ms-flex-item-align: center;
  align-self: center;
  margin: 5px 0 20px 0;
`;

const SignatureRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 15px;
  @media only screen and (max-width: 1337px) {
    flex-direction: column;
  }
`;
const SignatureContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  text-align: left;
  display: inline;
  font-size: 18px;
  margin-top: 15px;
`;
const Signature = styled.input`
  background-color: rgba(0, 0, 0, 0);
  width: 100%;
  border: none;
  border-bottom: 2px solid white;
  color: white;
  text-align: center;
  margin: 0 8px;
  margin-bottom: 2px;
  height: 24px;
  font-size: 16px;

  &:focus {
    outline: none;
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

const Upload = styled.input`
  background-color: rgba(0, 0, 0, 0);
  width: 100%;
  border: none;
  margin: 5px;
  height: 24px;
  font-size: 16px;

  &:focus {
    outline: none;
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

const BulletPoint = styled.span`
  margin-bottom: 5px;
  text-align: left;
  font-size: 16px;
`;

const Title = styled.h3`
  margin: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
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

export default KYC;
