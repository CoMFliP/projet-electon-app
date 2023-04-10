import React from "react";
import styled from "styled-components";

import Button from "../button";
import SVGIcon from "../svgIcon";

const StyledHeader = styled.span`
  margin: auto;
  margin-left: 0;

  color: #f2f2f2;
  font-weight: bold;

  user-select: none;

  &::after {
    content: "v0.9.57";
    font-weight: normal;
    margin-left: 0.5rem;
    color: #818489
  }
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
        <SVGIcon icon="minimize" />
      </StyledButton>
      <StyledButton
        onClick={() => {
          window.app.maximize();
        }}
      >
        <SVGIcon icon="maximize" />
      </StyledButton>
      <StyledButton
        onClick={() => {
          window.app.close();
        }}
        hover={`background-color: #cc0000;`}
      >
        <SVGIcon icon="close" />
      </StyledButton>
    </StyledTitleBar>
  );
};

export default TitleBar;
