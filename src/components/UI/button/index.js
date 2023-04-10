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

  user-select: none;

  &:hover {
    background-color: #61656b;
  }

  &:disabled {
    background-color: #818489;
  }

  &:active:not(:disabled) {
    background-color: #2e3238;
  }

  svg {
    height: 1.5rem;
    width: 1.5rem;

    fill: #f2f2f2;
  }

  &[data-title] {
    position: relative;
  }
  
  &[data-title]:hover:after {
    opacity: 1;
    
    transition: all 0.25s ease-out 0.25s;
  }
  
  &[data-title]:after {
    content: attr(data-title);
    position: absolute;
    top: -100%;

    font-size: medium;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;

    padding-right: 0.5rem;
    padding-left: 0.5rem;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    
    color: #fafafa;
    white-space: nowrap;
    border-radius: 0.25rem;
    box-shadow: 0px 0px 1rem #2e3238;
    background-color: #393e46;
    opacity: 0;
    z-index: 99999;

    transition: all 0.25s ease-out;
  }
`;

const Button = (props) => {
  return <StyledButton {...props}></StyledButton>;
};
export default Button;
