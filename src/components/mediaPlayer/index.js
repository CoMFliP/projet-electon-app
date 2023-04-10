import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import AudioVisualisator from "../audioVisualisator";
import AudioInput from "../audioInput";

import PlayList from "./playlist";
import MediaInfo from "./mediaInfo";
import ControlPanel from "./controlPanel";

const WindowPlayer = styled.div`
  display: flex;
  flex-direction: column;

  width: 80%;
  height: 100%;
  overflow: hidden;

  margin: auto;

  margin-top: 3rem;
  margin-bottom: 3rem;

  z-index: 1;

  padding: 1rem;
  border-radius: 0.5rem;

  background-color: #181a1d7f;
`;

const MediaPlayer = {
  calculateTime(secs) {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
  },

  getDuration(path) {
    return new Promise((resolve, reject) => {
      const audio = new Audio(path);
      audio.addEventListener("loadedmetadata", () => {
        resolve(audio.duration);
      });

      audio.addEventListener("error", () => {
        reject(`${path}: Unsupported or corrupted file format`);
      });
    });
  },

  async getMetadata(path) {
    return await window.file.getMetadata(path);
  },

  async readPlaylist(path) {
    return await window.file.read(path);
  },

  dialog: {
    open(setPaths) {
      window.dialog.open();
      window.dialog.getPaths(setPaths);
    },

    save(content) {
      let newArr = [];

      for (let line of content) {
        newArr = [...newArr, line.src.replace("safe-file://", "")];
      }
      window.dialog.save(newArr);
    },
  },
  setTrack(_event, setPlayer, list, index) {
    setPlayer((prevState) => ({
      ...prevState,
      src: list[index].src,
      currentId: index,
      isAutoPlay: true,
      isPlay: false,
      onLoad: false,
      info: {
        atrist: list[index].artist,
        title: list[index].title,
        fileName: list[index].title,
        picture: list[index].picture,
      },
      duration: list[index].duration,
    }));
  },

  Element() {
    const audioChannel = useRef();

    useEffect(() => {
      return () => {
        window.dialog.removeEventListener();
      };
    }, []);
    const [player, setPlayer] = useState({
      info: {},
      src: "",
      currentId: -1,
      currentTime: 0,
      duration: 0,
      volume: 100,
      isCanPlay: false,
      isAutoPlay: true,
      isPlay: false,
      isMute: false,
      isLoading: false,
      onLoad: false,
      isRepeat: false,
      isRepeatPlaylist: false,
      visualisation: {
        isEnabled: true,
        theme: "default",
      },
    });

    const [list, setList] = useState([]);

    let timer;

    const handleCanPlay = () => {
      setPlayer((prevState) => ({
        ...prevState,
        isCanPlay: true,
      }));
    };

    const handleLoadedMetadata = () => {
      clearInterval(timer);

      timer = setInterval(() => {
        setPlayer((prevState) => ({
          ...prevState,
          currentTime: Math.floor(audioChannel.current.currentTime),
        }));
      });
    };

    const handleEnded = () => {
      if (list.length > 1 && player.currentId + 1 < list.length) {
        MediaPlayer.setTrack(null, setPlayer, list, player.currentId + 1);

        let newList = [...list];

        newList[player.currentId] = {
          ...list[player.currentId],
          isPlaying: false,
        };

        setList(newList);
      } else if (player.isRepeatPlaylist) {
        MediaPlayer.setTrack(null, setPlayer, list, 0);

        let newList = [...list];

        newList[player.currentId] = {
          ...list[player.currentId],
          isPlaying: false,
        };

        setList(newList);
      } else if (!player.isRepeatPlaylist) {
        ControlPanel.Event.stop(null, player, setPlayer, list, setList);
      }
    };

    return (
      <>
        <AudioInput
          src={player.src}
          ref={audioChannel}
          onCanPlay={handleCanPlay}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />
        <WindowPlayer>
          <MediaInfo metadata={player.info} isPlay={player.isPlay} />
          <ControlPanel.Element
            audioChannel={audioChannel}
            player={player}
            setPlayer={setPlayer}
            list={list}
            setList={setList}
          />
          <PlayList
            player={player}
            setPlayer={setPlayer}
            list={list}
            setList={setList}
          />
        </WindowPlayer>
        <AudioVisualisator
          audioChannel={audioChannel}
          isPlay={player.isPlay}
          isAutoPlay={player.isAutoPlay}
          isEnabled={player.visualisation.isEnabled}
          theme={player.visualisation.theme}
        />
      </>
    );
  },
};

export default MediaPlayer;
