import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";

import NotPictureIcon from "../svg/not-picture.svg";

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
  
  span {
    color: #f2f2f2;
    font-size: large;
    margin: 0.25rem;
    width: 100%
    
  }
  
  div {
    display: flex;
    flex-direction: column;
    
    width: 100%
    
    
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
  const [metadata, setMetadata] = useState();

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
      return setInfo((prevState) => ({
        ...prevState,
        picture: URL.createObjectURL(blob),
      }));
    } else {
      return setInfo((prevState) => ({
        ...prevState,
        picture: NotPictureIcon,
      }));
    }
  };

  useEffect(() => {
    setMetadata(props.metadata);

    if (metadata) {
      getPicture(metadata.tags?.picture);
      setInfo((prevState) => ({
        ...prevState,
        artist: metadata.tags?.artist,
        title: metadata.tags?.title,
        titleSrc: metadata.titleSrc,
      }));
    }
  }, [props.metadata, metadata]);

  return (
    <StylesMediaInfo>
      <StyledDisk isPlay={props.isPlay}>
        <SVGDisk src={info.picture} />
      </StyledDisk>
      <div>
        <span>
            {info.artist ? `${info.artist} - ` : null}
            {info.title ?? info.titleSrc}
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
