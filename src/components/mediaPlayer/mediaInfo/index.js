import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";

import NotPictureIcon from "../../UI/svgIcon/svg/not-picture.svg";
import Egg from "../../../media/bruh.mp3";

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const StylesMediaInfo = styled.div`
  display: flex;
  flex-direction: row;

  overflow-wrap: anywhere;

  height: min-content;

  padding: 1rem;

  font-weight: bold;

  user-select: none;

  span {
    color: #f2f2f2;
    font-size: large;
    margin: 0.25rem;
    width: 100%;
  }

  div {
    display: flex;
    flex-direction: column;

    justify-items: center;
    align-items: center;

    margin-left: 1rem;
    margin-right: 1rem;
  }
`;

const StyledDisk = styled.div`
  min-height: 8rem;
  min-width: 8rem;

  height: 8rem;
  width: 8rem;

  animation: ${rotate} 15s linear infinite;
  animation-play-state: ${(props) => (props.isPlay ? "running" : "paused")};

  svg {
    height: 100%;
    width: 100%;
  }
`;

const SVGDisk = ({ src }) => {
  return (
    <svg
      width="800px"
      height="800px"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
    >
      <defs>
        <mask id="mask_circle">
          <circle cx="50" cy="50" r="50" fill="white" />
          <circle cx="50" cy="50" r="12" fill="#000000" />
        </mask>
        <pattern
          id="img"
          patternUnits="userSpaceOnUse"
          width="100"
          height="100"
        >
          <image href={src} x="0" y="0" width="100" height="100" />
        </pattern>
      </defs>

      <circle
        cx="50"
        cy="50"
        r="46"
        fill="url(#img)"
        stroke="#222222"
        strokeWidth="1"
        mask="url(#mask_circle)"
      />
      <circle
        cx="50"
        cy="50"
        r="12"
        fill="none"
        stroke="#222222"
        strokeWidth="1"
      />
    </svg>
  );
};

SVGDisk.propTypes = {
  src: PropTypes.string.isRequired,
};

const MediaInfo = (props) => {
  const [info, setInfo] = useState({
    artist: "",
    title: "",
    picture: NotPictureIcon,
  });

  const getPicture = (picture) => {
    if (picture) {
      var blob = new Blob([new Uint8Array(picture.data)], {
        type: picture.format,
      });
      return URL.createObjectURL(blob);
    } else {
      return NotPictureIcon;
    }
  };

  useEffect(() => {
    setInfo((prevState) => ({
      ...prevState,
      artist: props.metadata.artist,
      title: props.metadata.title,
      fileName: props.metadata.fileName,
      picture: getPicture(props.metadata.picture),
    }));
  }, [props.metadata]);

  const handleClick = () => {
    const egg = new Audio(Egg);
    egg.currentTime = 0.5;
    egg.volume = 0.2;
    if (!info.fileName) {
      egg.play();
    }
  };

  return (
    <StylesMediaInfo>
      <StyledDisk isPlay={props.isPlay} onClick={handleClick}>
        <SVGDisk src={info.picture} />
      </StyledDisk>
      <div>
        <span>
          {info.artist ? `${info.artist} - ` : null}
          {info.title ?? info.fileName}
        </span>
      </div>
    </StylesMediaInfo>
  );
};

MediaInfo.propTypes = {
  metadata: PropTypes.object,
  isPlay: PropTypes.bool,
};

export default MediaInfo;
