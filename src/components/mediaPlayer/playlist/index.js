import React, { useLayoutEffect, useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

import MediaPlayer from "..";

import Track from "./track";
import Loading from "../../UI/loading";
import ContextMenu from "../../UI/contextMenu";
import SVGIcon from "../../UI/svgIcon";

const StyledPlaylist = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;

  margin-top: 0.5rem;
  width: 100%;
  height: 100%;

  background-color: transparent;
  border-radius: 0.25rem;
  overflow: overlay;

  color: transparent;

  transition: all 0.25s ease-out;

  &::-webkit-scrollbar {
    width: 1rem;
    left: 1rem;
  }

  &::-webkit-scrollbar-thumb {
    background-clip: border-box;
    border: 4px solid transparent;
    border-radius: 1rem;
    box-shadow: inset 0 0 0 10px;
  }

  &::-webkit-scrollbar-button {
    width: 0;
    height: 0;
    display: none;
  }

  &:hover {
    color: #61656b;
  }
`;

const DragDropArea = styled.div`
  position: absolute;
  display: flex;

  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 100%;
  height: 100%;

  transition: opacity 0.25s ease-out;

  background-color: #181a1d7f;

  ${(props) =>
    props.statusDragDrop || props.isLoading
      ? css`
          pointer-events: all;
          opacity: 1;
        `
      : css`
          pointer-events: none;
          opacity: 0;
        `}
`;

const DragDropContent = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  font-size: xx-large;
  font-weight: bold;

  user-select: none;

  border: #818489 1rem dashed;
  border-radius: 2rem;

  color: #fafafa;

  svg {
    width: 10rem;
    height: 10rem;

    stroke: #fafafa;
    pointer-events: none;
  }

  & > * {
    margin: 1rem;
  }
`;

const PlayList = ({ player, setPlayer, list, setList }) => {
  const refPlaylist = useRef();

  const [fileList, setFileList] = useState([]);
  const [paramContextMenu, setParamContextMenu] = useState({
    mouseX: 0,
    mouseY: 0,
    isActive: false,
    data: null,
  });
  const [onDragDrop, setOnDragDrop] = useState(false);

  useEffect(() => {
    const loadToList = async () => {
      let tempList = [];
      let errLog = [];

      let playlist = [];

      for (const file of fileList) {
        if (file.path.split(".")[file.path.split(".").length - 1] == "bruh") {
          let res = await MediaPlayer.readPlaylist(file.path);
          playlist = JSON.parse(res.toString());
        } else {
          playlist = [...playlist, file.path];
        }
      }

      for (const path of playlist) {
        const readerFile = async (filePath) => {
          const data = await MediaPlayer.getMetadata(filePath);
          const duration = await MediaPlayer.getDuration(
            `safe-file://${filePath}`
          );

          const dataFile = {
            src: `safe-file://${filePath}`,
            artist: data.tags?.artist ? `${data.tags.artist} - ` : null,
            title:
              data.tags?.title ??
              filePath.split("\\")[filePath.split("\\").length - 1],
            picture: data.tags?.picture,
            duration: duration,
            isPlaying: false,
            isShow: true,
          };
          tempList = [...tempList, ...[dataFile]];
        };

        try {
          await readerFile(path);
        } catch (error) {
          errLog = [
            ...errLog,
            {
              msg: error,
            },
          ];
          continue;
        }
      }
      setList([...list, ...tempList]);

      return new Promise((_resolve, reject) => {
        for (const err of errLog) {
          reject(err.msg);
        }
      });
    };

    setPlayer((prevState) => ({ ...prevState, isLoading: true }));

    loadToList()
      .catch((rej) => {
        console.error(`ERR: `, rej);
      })
      .finally(() => {
        setPlayer((prevStat) => ({ ...prevStat, isLoading: false }));
      });
  }, [fileList]);

  useEffect(() => {
    setPlayer((prevStat) => ({ ...prevStat, isLoading: false }));
  }, [list]);

  useLayoutEffect(() => {
    const handleClick = () => {
      setParamContextMenu((prevState) => ({
        ...prevState,
        isActive: false,
      }));
    };
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  const handleContextMenu = (event, index) => {
    event.preventDefault();
    setParamContextMenu((prevState) => ({
      ...prevState,
      isActive: false,
    }));

    setTimeout(() => {
      setParamContextMenu((prevState) => ({
        ...prevState,
        mouseX: event.clientX,
        mouseY: event.clientY,
        isActive: true,
        data: [
          { id: 0, icon: "play", msg: "Play track", command: `play ${index}` },
          {
            id: 1,
            icon: "delete",
            msg: "Delete track",
            command: `delete ${index}`,
          },
          {
            id: 2,
            icon: "clear",
            msg: "Clear playlist",
            command: `clear`,
          },
        ],
      }));
    }, 200);
  };

  const handleDoubleClick = (event, index) => {
    MediaPlayer.setTrack(event, setPlayer, list, index);

    var newList = [...list];
    newList[player.currentId] = {
      ...list[player.currentId],
      isPlaying: false,
    };

    setList(newList);
  };

  const handleDragEnter = () => {
    setOnDragDrop(true);
  };

  const handleOnDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setFileList(event.dataTransfer.files);
    setOnDragDrop(false);
  };

  const handleOnDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragLeave = () => {
    setOnDragDrop(false);
  };

  const listItems = list.map((track, index) => (
    <Track
      key={index}
      id={index + 1}
      artist={track.artist}
      title={track.title}
      duration={MediaPlayer.calculateTime(track.duration)}
      isPlaying={track.isPlaying}
      isShow={track.isShow}
      onContextMenu={(event) => {
        handleContextMenu(event, index);
      }}
      onDoubleClick={(event) => {
        handleDoubleClick(event, index);
      }}
    />
  ));

  return (
    <>
      <StyledPlaylist
        ref={refPlaylist}
        onDragEnter={handleDragEnter}
        onDrop={handleOnDrop}
        onDragOver={handleOnDragOver}
      >
        {listItems}
        <DragDropArea
          onDragLeave={handleDragLeave}
          statusDragDrop={onDragDrop}
          isLoading={player.isLoading}
        >
          {onDragDrop ? (
            <DragDropContent>
              Drag and Drop Here
              <SVGIcon icon="drag-drop" />
            </DragDropContent>
          ) : (
            <Loading isLoading={player.isLoading} />
          )}
        </DragDropArea>
      </StyledPlaylist>
      <ContextMenu
        param={paramContextMenu}
        player={player}
        setPlayer={setPlayer}
        list={list}
        setList={setList}
      />
    </>
  );
};

PlayList.propTypes = {
  player: PropTypes.object.isRequired,
  setPlayer: PropTypes.func.isRequired,
  list: PropTypes.array.isRequired,
  setList: PropTypes.func.isRequired,
};

export default PlayList;
