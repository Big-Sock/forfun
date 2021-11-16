import axios from "axios";
import React, { useState } from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import { connectProvider } from "../../web3/utils";
import { Confirmation } from "./Confirmation";
import ECP from "./ECP";
import KYC from "./KYC";

export const Forms = ({ getData, setKYCSubmitted, setECPSubmitted, setPendingApproval, pendingApproval }) => {

  const [step, setStep] = useState(1);
  const [kyc, setKyc] = useState({
    name: "",
    birth: "",
    email: "",
    KYCaddress: "",
    dlNum: "",
    dlState: "",
    selfieImg: "",
    dlImg: "",
    usePassport: false,
  });
  const [ecp, setEcp] = useState({
    ECPname: "",
    job: "",
    ECPaddress: "",
    sign: "",
  });
  const [selfieImgName, setSelfieImgName] = useState("");
  const [dlImgName, setDLImgName] = useState("");

  const next = () => {
    setStep(step + 1);
  };
  const previous = () => {
    setStep(step - 1);
  };
  const emptyFields = (obj) => {
    for (let key in obj) {
      if (obj[key] === null || obj[key] === "") {
        return true;
      }
    }
    return false;
  };

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const submit = async () => {
    if (emptyFields(kyc) || emptyFields(ecp)) {
      return;
    }

    let { selfieImg, dlImg, usePassport, ...data } = kyc;
    let convertedSelfie = await toBase64(selfieImg);
    let convertedDL = await toBase64(dlImg);

    let kycData = JSON.stringify({ ...data });
    let imgData = JSON.stringify({
      convertedSelfie,
      convertedDL,
    });
    let ecpData = JSON.stringify({ ...ecp });

    const { provider } = await connectProvider();
    const signer = provider.getSigner();

    let formsData = kycData + ecpData

    signer.signMessage(formsData).then((authorization) => {
      axios
        .post("/api/forms/forms-submit", {
          data:  {
            kycData, imgData, ecpData, formsData,
          },
          sig: authorization,
        })
        .then((res) => {
          setKYCSubmitted(true);
          setECPSubmitted(true);
          setPendingApproval({ kyc: true, ecp: true})
          getData();
        })
        .catch((err) => {
          const res = err.response;
          setPendingApproval({ kyc: false, ecp: false})
          Swal.fire(`Error: ${res.status}`, res.data, "error");
        });
    })

  };

  let component;
  switch (step) {
    case 1:
      component = (
        <>
          <KYC
            kyc={kyc}
            setKyc={setKyc}
            selfieImgName={selfieImgName}
            setSelfieImgName={setSelfieImgName}
            dlImgName={dlImgName}
            setDLImgName={setDLImgName}
          />
          <ButtonWrap>
            <Button
              onClick={() =>
                emptyFields(kyc)
                  ? alert("Please complete all parts of the form.")
                  : next()
              }
            >
              Next Page
            </Button>
          </ButtonWrap>
        </>
      );
      break;
    case 2:
      component = (
        <>
          <ECP ecp={ecp} setEcp={setEcp} />
          <ButtonWrap>
            <Button
              onClick={() =>
                emptyFields(ecp)
                  ? alert("Please complete all parts of the form.")
                  : next()
              }
            >
              Next Page
            </Button>
            <Button onClick={previous}>Previous Page</Button>
          </ButtonWrap>
        </>
      );
      break;
    case 3:
      component = (
        <>
          <Confirmation
            kyc={kyc}
            ecp={ecp}
            setEcp={setEcp}
            setStep={setStep}
            selfieImgName={selfieImgName}
            dlImgName={dlImgName}
          />
          <ButtonWrap>
            <SubmitButton onClick={submit}>Submit</SubmitButton>
          </ButtonWrap>
        </>
      );
      break;
    default:
      break;
  }

  return component;
};

const ButtonWrap = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin: 20px 0 10px 0;
  width: 50%;
`;
const Button = styled.button`
  width: 80%;
  padding: 10px 0;
  margin: 10px 0;
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

const SubmitButton = styled.button`
  margin: 20px auto 0 auto;
  width: 80%;
  padding: 10px 0;
  /* border: 2px solid white; */
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
export default Forms;
