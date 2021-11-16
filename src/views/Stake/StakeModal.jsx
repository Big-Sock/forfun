import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import Modal from "../../components/Modal";
import ModalActions from "../../components/ModalActions";
import ModalTitle from "../../components/ModalTitle";
import TokenInput from "../../components/TokenInput";

const DepositModal = ({ max, onConfirm, onDismiss, tokenName = "" }) => {
  const [val, setVal] = useState("");
  const [done, setDone] = useState(false);

  const fullBalance = useMemo(() => {
    // return getFullDisplayBalance(max)
    console.log(max);
    return max;
  }, [max]);

  const handleChange = useCallback(
    (e) => {
      setVal(e.currentTarget.value);
    },
    [setVal]
  );

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance);
  }, [fullBalance, setVal]);

  const confirm = useCallback(
    (value) => {
      if (!value || value <= 0) {
        return;
      }
      onConfirm(value);
      setDone(true);
    },
    [onConfirm]
  );

  return (
    <Modal>
      <ModalTitle text={`Stake Your Tokens`} />
      {done ? (
        <DoneMessage>
          Your transaction has been submitted to the contract. Please approve it
          via your web3 compatable wallet, and monitor the transaction status.
        </DoneMessage>
      ) : (
        <TokenInput
          value={val}
          onSelectMax={handleSelectMax}
          onChange={handleChange}
          max={parseFloat(fullBalance).toFixed(2)}
          symbol={tokenName}
        />
      )}

      {done ? (
        <ModalActions>
          <StyledButton
            style={{ width: "60%", minWidth: "120px" }}
            onClick={onDismiss}
          >
            Close
          </StyledButton>
        </ModalActions>
      ) : (
        <ModalActions>
          <StyledButton
            style={{ width: "60%", minWidth: "120px" }}
            onClick={onDismiss}
          >
            {" "}
            Cancel
          </StyledButton>
          <StyledButton
            style={{ width: "60%", minWidth: "120px" }}
            onClick={() => confirm(val)}
          >
            Confirm
          </StyledButton>
        </ModalActions>
      )}
    </Modal>
  );
};

const DoneMessage = styled.div`
  height: 120px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  text-align: center;
`;

const StyledButton = styled.button`
  width: 120px;
  padding: 10px 0;
  background-color: #666;
  color: white;
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

export default DepositModal;
