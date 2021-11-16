import React, { useState } from "react";
import styled from "styled-components";
import PendingModal from "./PendingModal";
import { StockInfo } from "./StockInfo";

const Market = ({ formsCompleted, approved, setIsRegistering }) => {
  const [pendingTxId, setPendingTxId] = useState(null);
  const [pendingTxStatus, setPendingTxStatus] = useState(null);

  const [page, setPage] = useState("Buy");

  const clearPendingTx = () => {
    localStorage.removeItem("pendingTrade");
    setPendingTxStatus(null);
    setPendingTxId(null);
  };

  return (
    <>
      {pendingTxStatus && (
        <PendingModal
          txId={pendingTxId}
          status={pendingTxStatus}
          close={() => clearPendingTx()}
        />
      )}
      <LandingSection>
        <StockInfo
          setPendingTxId={setPendingTxId}
          setPendingTxStatus={setPendingTxStatus}
          setIsRegistering={setIsRegistering}
          formsCompleted={formsCompleted}
          approved={approved}
          page={page}
          setPage={setPage}
        />
      </LandingSection>
    </>
  );
};

const LandingSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 5vh auto 10vh;

  width: 85%;
  @media only screen and (max-width: 991px) {
    flex-direction: column-reverse;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
`;

export default Market;
