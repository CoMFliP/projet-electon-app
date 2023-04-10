import React from "react";
import PropTypes from "prop-types";

import styled, { css, keyframes } from "styled-components";

const zoom = keyframes`
  from {
    opacity: 0;
    transform: scale(75%);
  }
  to {
    opacity: 1;
    transform: scale(98%);
  }
`;

const StyledTrack = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  animation: ${zoom} 0.25s ease-out;
  transition: all 0.25s ease-out;

  padding: 0.75rem;
  border-radius: 0.25rem;

  user-select: none;

  ${(props) =>
    props.isPlaying && props.isShow
      ? css`
          background-color: #818489;
          font-weight: bold;
          transform: scale(100%);
        `
      : !props.isPlaying && props.isShow
      ? css`
          background-color: #393e46;
          font-weight: normal;
          transform: scale(98%);
        `
      : !props.isShow &&
        css`
          background-color: #393e46;
          font-weight: normal;
          transform: scale(75%);
          opacity: 0;
        `}

  color: #f2f2f2;

  & > span {
    margin-left: 1rem;
    margin-right: 1rem;
  }

  &:hover {
    background-color: #61656b;
  }

  &:active {
    background-color: #2e3238;
  }
`;

const Track = (props) => {
  return (
    <StyledTrack
      isShow={props.isShow}
      isPlaying={props.isPlaying}
      onContextMenu={props.onContextMenu}
      onDoubleClick={props.onDoubleClick}
    >
      <span>#{props.id}</span>
      <span>
        {props.artist}
        {props.title}
      </span>
      <span>{props.duration}</span>
    </StyledTrack>
  );
};

Track.propTypes = {
  id: PropTypes.number.isRequired,
  artist: PropTypes.string,
  title: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  isShow: PropTypes.bool.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  onContextMenu: PropTypes.func,
  onDoubleClick: PropTypes.func,
};

export default Track;
