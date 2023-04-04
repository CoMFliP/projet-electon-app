import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import AudioVisualisator from "../audioVisualisator";
import AudioInput from "../audioInput";
// import Button from "../UI/button";

import PlayList from "../playlist";
import MediaInfo from "./mediaInfo";
import ControlPanel from "./controlPanel";

const WindowPlayer = styled.div`
  display: flex;
  flex-direction: column;

  width: 80%;
  height: 100%;

  margin: auto;

  margin-top: 3rem;
  margin-bottom: 3rem;

  z-index: 1;

  padding: 1rem;
  border-radius: 0.5rem;

  background-color: #181a1d7f;
`;

const MediaPlayer = ({ openDialog, src, setSrc }) => {
  const audioChannel = useRef();

  const [player, setPlayer] = useState({
    src: src,
    isPlay: false,
    isCanPlay: false,
    currentTime: 0,
    currentId: 0,
    duration: 0,
    volume: 100,
    isMute: false,
    info: null,
    visualisation: {
      isEnabled: true,
      theme: "default",
    },
  });

  const [list, setList] = useState([{}]);

  let timer;

  useEffect(() => {
    setPlayer((prevState) => ({ ...prevState, src: src }));
  }, [src]);

  useLayoutEffect(() => {
    audioChannel.current.addEventListener("loadedmetadata", async () => {
      var data = "No Data";
      try {
        data = await window.file.getMetadata(
          audioChannel.current.currentSrc.replace("safe-file://", "")
        );
      } catch (error) {
        data = "No Data";
      }

      setPlayer((prevState) => ({
        ...prevState,
        info: {
          ...data,
          titleSrc:
            audioChannel.current.currentSrc.split("\\")[
              audioChannel.current.currentSrc.split("\\").length - 1
            ],
        },
      }));

      clearInterval(timer);
      timer = setInterval(() => {
        setPlayer((prevState) => ({
          ...prevState,
          currentTime: Math.floor(audioChannel.current.currentTime),
        }));
      });
      setPlayer((prevState) => ({
        ...prevState,
        isPlay: true,
        isCanPlay: true,
        duration: Math.floor(audioChannel.current.duration),
      }));
    });

    audioChannel.current.addEventListener("ended", () => {
      setPlayer((prevState) => ({
        ...prevState,
        isPlay: false,
        currentTime: 0,
      }));
      audioChannel.current.currentTime = 0;
    });

    return () => {
      audioChannel.current.replaceWith(audioChannel.current.cloneNode(true));
    };
  }, []);

  return (
    <>
      <AudioInput src={player.src} ref={audioChannel} />
      <WindowPlayer>
        <MediaInfo metadata={player.info} isPlay={player.isPlay} />
        <ControlPanel
          audioChannel={audioChannel}
          player={player}
          setPlayer={setPlayer}
          list={list}
          setList={setList}
        />
        {/* <div className={styles.line}>
          <Button onClick={openDialog}>Open File</Button>
          <Button
            onClick={() => {
              if (player.isCanPlay) {
                setList([
                  ...list,
                  {
                    id: list.length,
                    title: player.info.title,
                    // duration: calculateTime(player.duration),
                    src: audioChannel.current.currentSrc,
                    isPlaying: false,
                  },
                ]);
              }
            }}
          >
            Add to Playlist
          </Button>
        </div> */}
        <PlayList list={list} onClick={openDialog} onDrop={setSrc}/>
      </WindowPlayer>
      <AudioVisualisator
        audioChannel={audioChannel}
        isEnabled={player.visualisation.isEnabled}
        theme={player.visualisation.theme}
      />
    </>
  );
};

MediaPlayer.propTypes = {
  openDialog: PropTypes.func.isRequired,
  setSrc: PropTypes.func.isRequired,
  src: PropTypes.string.isRequired,
};

export default MediaPlayer;
