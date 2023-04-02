import React from "react";
// import PropTypes from "prop-types";
import styled from "styled-components";

import { ReactComponent as MinIcon } from "./svg/min-icon.svg";
import { ReactComponent as MaxIcon } from "./svg/max-icon.svg";
import { ReactComponent as CloseIcon } from "./svg/close-icon.svg";

import Button from "../UI/button";

const StyledHeader = styled.span`
  margin: auto;
  margin-left: 0;

  color: #f2f2f2;
  font-weight: bold;
`;

const StyledButton = styled(Button)`
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  margin-top: 0;

  -webkit-app-region: no-drag;

  &:hover {
    ${(props) => props.hover}
  }

  svg {
    height: 100%;
    width: 100%;

    transform: scale(125%);
  }
`;

const StyledTitleBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;

  height: 3rem;

  padding-left: 1rem;
  padding-right: 1rem;

  background-color: #181a1d7f;

  z-index: 1;

  -webkit-app-region: drag;
`;

const TitleBar = () => {
  return (
    <StyledTitleBar>
      <StyledHeader>Bruh Player</StyledHeader>
      <StyledButton
        onClick={() => {
          window.app.minimize();
        }}
      >
        <MinIcon />
      </StyledButton>
      <StyledButton
        onClick={() => {
          window.app.maximize();
        }}
      >
        <MaxIcon />
      </StyledButton>
      <StyledButton
        onClick={() => {
          window.app.close();
        }}
        hover={`background-color: #cc0000;`}
      >
        <CloseIcon />
      </StyledButton>
    </StyledTitleBar>
  );
};

export default TitleBar;
