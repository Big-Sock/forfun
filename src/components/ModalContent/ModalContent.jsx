import React from 'react'
import styled from 'styled-components'

const ModalContent = ({ children }) => {
  return <StyledModalContent>{children}</StyledModalContent>
}

const StyledModalContent = styled.div`
  padding: 24px;
  @media (max-width: 400 px) {
    flex: 1;
    overflow: auto;
  }
`

export default ModalContent
