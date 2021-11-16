import React from "react";
import styled from "styled-components";
import Input from "../Input/input";
// import { fetchStakingFee } from "../../web3/utils"

const TokenInput = ({ max, symbol, onChange, onSelectMax, value }) => {
  //   const [feeRate, setFeeRate] = useState(0);

  // useEffect(() => {
  //   fetchStakingFee((res) => {
  //     setFeeRate(res);
  //   })
  // }, [])

  return (
    <StyledTokenInput>
      <TopContainer>
        {/* <FeeRate>
          Staking Fee: {feeRate > 0 ? feeRate * 100 : "--"} %
      </FeeRate> */}
        <StyledMaxText>
          {max.toLocaleString({ maximumFractionDigits: 4 })} {symbol} Available
        </StyledMaxText>
      </TopContainer>
      <Input
        endAdornment={
          <StyledTokenAdornmentWrapper>
            <StyledTokenSymbol>{symbol}</StyledTokenSymbol>
            <StyledSpacer />
            <div>
              <StyledButton onClick={onSelectMax}>Max</StyledButton>
            </div>
          </StyledTokenAdornmentWrapper>
        }
        onChange={onChange}
        placeholder="0"
        value={value}
        type="number"
      />
    </StyledTokenInput>
  );
};

const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledButton = styled.button`
  width: 60px;
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

const StyledTokenInput = styled.div`
  font-size: 14px;
`;

const StyledSpacer = styled.div`
  width: 16px;
`;

const StyledTokenAdornmentWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-end;
`;

const StyledMaxText = styled.div`
  align-items: center;
  color: black;
  display: flex;
  font-size: 16px;
  height: 44px;
  justify-content: flex-end;
`;

const StyledTokenSymbol = styled.span`
  color: #0d87b3;
  font-size: 16px;
  margin-left: 10px;
`;

export default TokenInput;
