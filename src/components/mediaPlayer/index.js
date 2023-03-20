import React, { useState, useEffect, useLayoutEffect, useRef } from "react";

import styles from "./index.module.css";

import AudioVisualisator from "../audioVisualisator";
import AudioInput from "../audioInput";
import Button from "../button";
import Input from "../input";
import PlayList from "../playlist";

import { ReactComponent as PlayIcon } from "../../svg/audio-play.svg";
import { ReactComponent as PauseIcon } from "../../svg/audio-pause.svg";
import { ReactComponent as NextIcon } from "../../svg/audio-next.svg";
import { ReactComponent as BackIcon } from "../../svg/audio-back.svg";
import { ReactComponent as VolumeMuteIcon } from "../../svg/audio-volume-mute.svg";
import { ReactComponent as VolumeLowIcon } from "../../svg/audio-volume-low.svg";
import { ReactComponent as VolumeMediumIcon } from "../../svg/audio-volume-medium.svg";
import { ReactComponent as VolumeHighIcon } from "../../svg/audio-volume-high.svg";

const MediaPlayer = ({ openDialog, src }) => {
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
    info: {
      title: "No Data",
    },
    visualisation: {
      isEnabled: true,
      theme: "default",
    },
  });

  const [list, setList] = useState([{}]);

  let timer;

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
  };

  const handleChangeVolume = (e) => {
    setPlayer((prevState) => ({ ...prevState, volume: e.target.value }));
    audioChannel.current.volume = e.target.value / 100;
  };

  const handleChangeTime = (e) => {
    setPlayer((prevState) => ({ ...prevState, currentTime: e.target.value }));
    audioChannel.current.currentTime = e.target.value;
  };

  const addToPlaylist = () => {
    if (player.isCanPlay) {
      setList([
        ...list,
        {
          id: list.length,
          title: player.info.title,
          duration: calculateTime(player.duration),
          src: audioChannel.current.currentSrc,
        },
      ]);
    }
  };

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
      } catch (error) {}

      let parseData = (data) => {
        var obj = new Object();

        if (data.tags?.artist && data.tags?.title) {
          obj = { ...obj, title: `${data.tags.artist} - ${data.tags.title}` };
        } else {
          obj = {
            ...obj,
            title:
              audioChannel.current.currentSrc.split("\\")[
                audioChannel.current.currentSrc.split("\\").length - 1
              ],
          };
        }

        return obj;
      };

      console.log(data);

      // audioChannel.current.play();

      setPlayer((prevState) => ({
        ...prevState,
        isPlay: true,
        isCanPlay: true,
        info: parseData(data),
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

    return () => {};
  }, []);

  useEffect(() => {
    if (player.isPlay) {
      audioChannel.current.play();
    } else {
      audioChannel.current.pause();
    }
  }, [player.isPlay, player.currentId, src]);

  useEffect(() => {
    if (player.isMute) {
      audioChannel.current.muted = true;
    } else {
      audioChannel.current.muted = false;
    }
  }, [player.isMute]);

  return (
    <>
      <AudioInput src={player.src} ref={audioChannel} />
      <div className={styles.player}>
        <div className={styles.line}>
          <span className={styles.title}>{player.info.title}</span>
        </div>
        <div className={styles.line}>
          <Button
            onClick={() => {
              player.isPlay
                ? setPlayer((prevState) => ({ ...prevState, isPlay: false }))
                : setPlayer((prevState) => ({ ...prevState, isPlay: true }));
            }}
            disabled={player.isCanPlay ? false : true}
          >
            {player.isPlay ? <PauseIcon /> : <PlayIcon />}
          </Button>
          <Button
            onClick={() => {
              player.visualisation.isEnabled === true
                ? setPlayer((prevState) => ({
                    ...prevState,
                    visualisation: {
                      ...prevState.visualisation,
                      isEnabled: false,
                    },
                  }))
                : setPlayer((prevState) => ({
                    ...prevState,
                    visualisation: {
                      ...prevState.visualisation,
                      isEnabled: true,
                    },
                  }));
            }}
          >
            {"⚠️"}
          </Button>
          <Button
            onClick={() => {
              setPlayer((prevState) => ({
                ...prevState,
                src: list[player.currentId - 1].src,
                currentId: player.currentId - 1,
              }));

              var newList = [...list];

              newList[player.currentId - 1] = {
                ...list[player.currentId - 1],
                isPlaying: true,
              };

              newList[player.currentId] = {
                ...list[player.currentId],
                isPlaying: false,
              };

              setList(newList);

              audioChannel.current.load();
            }}
            disabled={list.length > 1 && player.currentId > 1 ? false : true}
          >
            <BackIcon />
          </Button>
          <Button
            onClick={() => {
              setPlayer((prevState) => ({
                ...prevState,
                src: list[player.currentId + 1].src,
                currentId: player.currentId + 1,
              }));

              var newList = [...list];

              newList[player.currentId + 1] = {
                ...list[player.currentId + 1],
                isPlaying: true,
              };

              newList[player.currentId] = {
                ...list[player.currentId],
                isPlaying: false,
              };

              setList(newList);

              audioChannel.current.load();
            }}
            disabled={
              list.length > 1 && player.currentId + 1 < list.length
                ? false
                : true
            }
          >
            <NextIcon />
          </Button>
          <Button
            onClick={() => {
              player.isMute
                ? setPlayer((prevState) => ({
                    ...prevState,
                    isMute: false,
                  }))
                : setPlayer((prevState) => ({
                    ...prevState,
                    isMute: true,
                  }));
            }}
          >
            {player.isMute || player.volume == 0 ? (
              <VolumeMuteIcon />
            ) : player.volume > 0 && player.volume <= 33 ? (
              <VolumeLowIcon />
            ) : player.volume > 33 && player.volume <= 66 ? (
              <VolumeMediumIcon />
            ) : (
              <VolumeHighIcon />
            )}
          </Button>

          <Input
            type="range"
            value={player.volume}
            max="100"
            step="1"
            onChange={handleChangeVolume}
            disabled={player.isMute}
          />
          <span className={styles.value}>{player.volume}</span>
        </div>
        <div className={styles.line}>
          <span className={styles.value} className="time">
            {calculateTime(player.currentTime)}
          </span>
          <Input
            type="range"
            value={player.currentTime}
            max={player.duration === null ? 0 : player.duration}
            onChange={handleChangeTime}
          />
          <span className={styles.value} className="time">
            {calculateTime(player.duration)}
          </span>
        </div>
        <div className={styles.line}>
          <Button onClick={openDialog}>Open File</Button>
          <Button
            onClick={() => {
              if (player.isCanPlay) {
                setList([
                  ...list,
                  {
                    id: list.length,
                    title: player.info.title,
                    duration: calculateTime(player.duration),
                    src: audioChannel.current.currentSrc,
                    isPlaying: false,
                  },
                ]);
              }
            }}
          >
            Add to Playlist
          </Button>
        </div>
        <div className={styles.line}>
          <PlayList list={list} />
        </div>
      </div>
      <AudioVisualisator
        audioChannel={audioChannel}
        isEnabled={player.visualisation.isEnabled}
        theme={player.visualisation.theme}
      />
    </>
  );
};

export default MediaPlayer;
