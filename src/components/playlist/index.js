import React, { useRef, useLayoutEffect } from "react";
import PropTypes from "prop-types";

import Track from "./track";
import styled from "styled-components";

const StyledPlaylist = styled.div`
  overflow: hidden;

  height: 100%;
  width: 100%;
  background-color: #181a1d7f;
  border-radius: 0.25rem;
  overflow: overlay;

  &::-webkit-scrollbar {
    width: 1rem;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #414754;
    border-radius: 0.25rem;
  }
`;

const PlayList = ({ list, onClick, onDrop }) => {
  const refPlaylist = useRef();

  useLayoutEffect(() => {
    refPlaylist.current.addEventListener("drop", (event) => {
      event.preventDefault();
      event.stopPropagation();

      for (const f of event.dataTransfer.files) {
        // Using the path attribute to get absolute file path
        console.log("File Path of dragged files: ", f.path);
      }
    });

    refPlaylist.current.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    refPlaylist.current.addEventListener("dragenter", () => {
      console.log("File is in the Drop Space");
    });

    refPlaylist.current.addEventListener("dragleave", () => {
      console.log("File has left the Drop Space");
    });

    refPlaylist.current.addEventListener("click", () => {
      onClick();
    });

    return () => {
      refPlaylist.current.replaceWith(refPlaylist.current.cloneNode(true));
    };
  }, []);

  const listItems = list.map((track, index) =>
    index != 0 ? (
      <Track
        key={index}
        id={track.id}
        title={track.title}
        duration={track.duration}
        isPlaying={track.isPlaying}
      />
    ) : null
  );
  return <StyledPlaylist ref={refPlaylist}>{listItems}</StyledPlaylist>;
};

PlayList.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      duration: PropTypes.string,
      isPlaying: PropTypes.bool,
    })
  ).isRequired,
  onClick: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
};

export default PlayList;
