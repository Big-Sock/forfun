import React from 'react'
import styled from 'styled-components'

const ModalTitle = ({ text }) => (
  <StyledModalTitle>
    {text}
  </StyledModalTitle>
)

const StyledModalTitle = styled.div`
  align-items: center;
  color: white;
  font-family: "PlatNomor";
  text-align: center;
  display: flex;
  font-size: 40px;
  letter-spacing: 1px;
  height: 50px;
  justify-content: center;
  margin-top: 8px;
  @media only screen and (max-width: 991px) {
    font-size: 24px;
  }
`

export default ModalTitle