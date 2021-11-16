import React from 'react'
import styled from 'styled-components'

const ModalActions = ({ children }) => {
  const l = React.Children.toArray(children).length
  return (
    <StyledModalActions>
      {React.Children.map(children, (child, i) => (
        <>
          <StyledModalAction>
            {child}
          </StyledModalAction>
          {i < l - 1 && <StyledSpacer />}
        </>
      ))}
    </StyledModalActions>
  )
}

const StyledModalActions = styled.div`
  align-items: center;
  background-color: #f7f2f4;
  display: flex;
  height: 96px;
  margin-top: 10px;
  padding: 0 24px;
`

const StyledModalAction = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`

const StyledSpacer = styled.div`
  width: 24px;
`

export default ModalActions