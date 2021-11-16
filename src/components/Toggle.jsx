import React from "react";
import styled from "styled-components";

const Toggle = (props) => {
  return (
    <ToggleLabel>
      <SmallLabel>{props.label}</SmallLabel>
      <ToggleInput
        name={props.name}
        type="checkbox"
        checked={props.checked}
        onClick={props.onClick}
      />
      <ToggleSlider />
    </ToggleLabel>
  );
};


const SmallLabel = styled.div`
  // width: 80px;
  font-size: 6px;
  transform: scale(2) translateY(-5px);
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 17px;

  &::before {
    position: absolute;
    border-radius: 50%;
    content: "";
    height: 13px;
    width: 13px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  &:checked + ${ToggleSlider} {
    &::before {
      transform: translateX(13px);
    }
  }
  &:focus + ${ToggleSlider} {
    box-shadow: 0 0 1px #2196f3;
  }
`;

const ToggleLabel = styled.label`
  float: right;
  position: relative;
  width: 30px;
  height: 17px;
`;

export default Toggle
