import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  display: flex;

  color: #f2f2f2;
  font-size: large;
  
  background-color: #393e46;
  border-radius: 0.5rem;
  border: solid 0px;

  padding: 0.5rem;

  margin: 0.25rem;
  width: max-content;
  height: max-content;

  white-space: nowrap;
  text-align: center;

  transition: all 0.25s ease-out;

  justify-content: center;
  align-items: center;

  :hover {
    background-color: #61656b;
  }

  :disabled {
    background-color: #818489;
  }

  :active:not(:disabled) {
    background-color: #2e3238;
  }

  svg {
    height: 1.5rem;
    width: 1.5rem;

    fill: #f2f2f2;
  }
`;

const Button = (props) => {
  return <StyledButton {...props}></StyledButton>;
};
export default Button;
