import React, { useState, useEffect, useLayoutEffect } from "react";

import styles from "./index.module.scss";

import AudioVisualisator from "../audioVisualisator";
import Button from "../button";
import Input from "../input";

const MediaPlayer = ({ audioChannel }) => {
  const [player, setPlayer] = useState({
    isPlay: false,
    isCanPlay: false,
    currentTime: 0,
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

  useLayoutEffect(() => {
    audioChannel.current.addEventListener("loadedmetadata", async () => {
      var data = await window.file.getMetadata(
        audioChannel.current.currentSrc.replace("safe-file://", "")
      );

      let parseData = (data) => {
        var obj = new Object();

        if (data.tags) {
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

      setPlayer((prevState) => ({
        ...prevState,
        isPlay: false,
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
  }, [player.isPlay]);

  useEffect(() => {
    if (player.isMute) {
      audioChannel.current.muted = true;
    } else {
      audioChannel.current.muted = false;
    }
  }, [player.isMute]);


  return (
    <>
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
            {player.isPlay ? "| |" : "▶"}
          </Button>
          <Button
            onClick={() => {
              player.visualisation.isEnabled == true
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
            {player.isMute ? "🔇" : "🔈"}
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
