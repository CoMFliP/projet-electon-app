import React, { useState, useEffect, useRef } from "react";

import styles from "./index.module.scss";

import Button from "../button";
import Input from "../input";

const MediaPlayer = (props) => {
  const [isPlay, setPlayable] = useState(false);

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const [volume, setVolume] = useState(100);
  const [isMute, setMute] = useState(false);

  const audioRef = useRef();
  let timer;

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
  };

  const onLoadedMetadata = () => {
    setPlayable(false);
    clearInterval(timer);
    timer = setInterval(() => {
      setCurrentTime(Math.floor(audioRef.current.currentTime));
      setDuration(Math.floor(audioRef.current.duration));
    });
  };

  const onEnded = () => {
    setPlayable(false);
    setCurrentTime(0);
    audioRef.current.currentTime = 0;
  };

  const handleChangeVolume = (e) => {
    setVolume(e.target.value);
    audioRef.current.volume = e.target.value / 100;
  };

  const handleChangeTime = (e) => {
    setCurrentTime(e.target.value);
    audioRef.current.currentTime = e.target.value;
  };

  useEffect(() => {
    if (isPlay) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlay]);

  useEffect(() => {
    if (isMute) {
      audioRef.current.muted = true;
    } else {
      audioRef.current.muted = false;
    }
  }, [isMute]);

  return (
    <div className={styles.player}>
      <audio
        src={props.src}
        preload="metadata"
        ref={audioRef}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
      ></audio>
      <div className={styles.line}>
        <span className={styles.title}>
          {props.src != null
            ? props.src.split("\\")[props.src.split("\\").length - 1]
            : "No Data"}
        </span>
      </div>
      <div className={styles.line}>
        <Button
          onClick={() => {
            isPlay ? setPlayable(false) : setPlayable(true);
          }}
          content={isPlay ? '| |' : "▶"}
          disabled={props.src != null ? false : true}
        />
        <Button
          onClick={() => {
            isMute ? setMute(false) : setMute(true);
          }}
          content={isMute ? "🔇" : "🔈"}
        />
        <Input
          type="range"
          value={volume}
          max="100"
          step="1"
          onChange={handleChangeVolume}
          disabled={isMute}
        />
        <span className={styles.value}>{volume}</span>
      </div>
      <div className={styles.line}>
        <span className={styles.value} className="time">
          {calculateTime(currentTime)}
        </span>
        <Input
          type="range"
          value={currentTime}
          max={duration}
          onChange={handleChangeTime}
        />
        <span className={styles.value} className="time">
          {calculateTime(duration)}
        </span>
      </div>
    </div>
  );
};
export default MediaPlayer;
