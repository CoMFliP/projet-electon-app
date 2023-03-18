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

  const [metadata, setMetadata] = useState();

  const audioRef = useRef();
  const canvasRef = useRef();
  let timer;

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
  };

  const onLoadedMetadata = async () => {
    var data = await window.file.getMetadata(
      props.src.replace("safe-file://", "")
    );

    console.log(data);

    var src;

    if (!src) {
      var context = new AudioContext();
      var src = context.createMediaElementSource(audioRef.current);
      var analyser = context.createAnalyser();
      src.connect(analyser);
      analyser.connect(context.destination);
    }

    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;
    var ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    analyser.fftSize = 512;

    var bufferLength = analyser.frequencyBinCount;

    var dataArray = new Uint8Array(bufferLength);

    var WIDTH = canvasRef.current.width;
    var HEIGHT = canvasRef.current.height;

    var barWidth = (WIDTH / bufferLength) * 4;
    var barHeight;
    var x = 0;

    function renderFrame() {
      x = 0;
      requestAnimationFrame(renderFrame);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "#282c34";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      for (var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;

        var grd = ctx.createLinearGradient(0, 0, 0, HEIGHT);
        grd.addColorStop(0, `rgba(0, 0, 255, ${barHeight / 100})`);
        grd.addColorStop(0.5, `rgba(255, 0, 0, ${barHeight / 100})`);
        grd.addColorStop(0.75, `rgba(255, 255, 0, ${barHeight / 100})`);
        grd.addColorStop(1, `rgba(0, 255, 0, ${barHeight / 100})`);
        ctx.fillStyle = grd;

        // ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;

        ctx.strokeStyle = "#0000";

        ctx.fillRect(
          x,
          HEIGHT - barHeight * 4.2,
          barWidth,
          barHeight * 4.2
        );

        x += barWidth + 1;
      }
    }

    renderFrame();

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
    <>
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
            disabled={props.src != null ? false : true}
          >
            {isPlay ? "| |" : "▶"}
          </Button>
          <Button
            onClick={() => {
              isMute ? setMute(false) : setMute(true);
            }}
          >
            {isMute ? "🔇" : "🔈"}
          </Button>
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
      <canvas className={styles.canvas} ref={canvasRef}></canvas>
    </>
  );
};
export default MediaPlayer;
