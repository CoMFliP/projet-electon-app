import React from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";

import SVGIcon from "../svgIcon";

const rotate = keyframes`
    to {
        transform: rotate(360deg);
    }
`;

const StyledLoading = styled.div`
  transition: all 0.25s ease-out;
  opacity: ${(props) => (props.isLoading ? 1 : 0)};

  margin: auto;

  padding: 0.75rem;
  border-radius: 0.25rem;

  svg {
    animation: ${rotate} 2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    height: 3rem;
    width: 3rem;

    stroke: #f2f2f2;
  }
`;

const Loading = ({ isLoading }) => {
  return (
    <StyledLoading isLoading={isLoading}>
      <SVGIcon icon="loading" />
    </StyledLoading>
  );
};

Loading.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};

export default Loading;
