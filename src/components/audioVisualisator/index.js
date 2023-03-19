import React, { useState, useEffect, useLayoutEffect, useRef } from "react";

import styles from "./index.module.scss";

const AudioVisualisator = (props) => {
  const [sizeWindow, setSizeWindow] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  const canvasRef = useRef();
  const audioChannel = props.audioChannel;

  var ctx;
  var src;
  var analyser;

  // useEffect(() => {
  // console.log(props.isEnabled);
  // }, [props.isEnabled]);

  useLayoutEffect(() => {
    window.addEventListener("resize", () => {
      setSizeWindow({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    });

    initCanvas();
    if (!src) initContext();
    frequencyBarGraph();

    return () => {
      window.removeEventListener("resize", () => {
        setSizeWindow({
          height: window.innerHeight,
          width: window.innerWidth,
        });
      });
    };
  }, []);

  useEffect(() => {
    initCanvas();

    console.log(src);

    if (analyser !== undefined) frequencyBarGraph();
  }, [sizeWindow.height, sizeWindow.width]);

  const initCanvas = () => {
    canvasRef.current.width = sizeWindow.width;
    canvasRef.current.height = sizeWindow.height;
    ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const initContext = () => {
    const context = new AudioContext();
    analyser = context.createAnalyser();
    src = context.createMediaElementSource(audioChannel.current);
    src.connect(analyser);
    analyser.connect(context.destination);
  };

  const frequencyBarGraph = () => {
    analyser.fftSize = 512;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

    function renderFrame() {
      var x = 0;

      var HEIGHT = canvasRef.current.height;
      var WIDTH = canvasRef.current.width;

      var barWidth = 16;
      var barHeight;

      requestAnimationFrame(renderFrame);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "#282c34";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // console.log(en);
      for (var i = 8; i < bufferLength; i++) {
        barHeight = dataArray[i];

        var grd = ctx.createLinearGradient(0, 0, 0, HEIGHT);
        var alpha = barHeight / 255 + 0.2;
        grd.addColorStop(0, `rgba(0, 0, 255, ${alpha})`);
        grd.addColorStop(0.5, `rgba(255, 0, 0, ${alpha})`);
        grd.addColorStop(0.75, `rgba(255, 255, 0, ${alpha})`);
        grd.addColorStop(1, `rgba(0, 255, 0, ${alpha})`);
        ctx.fillStyle = grd;
        ctx.strokeStyle = grd;

        // ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;

        ctx.beginPath();
        ctx.roundRect(
          x,
          HEIGHT - barHeight * (HEIGHT / 255),
          barWidth,
          barHeight * (HEIGHT / 255),
          [5, 5, 0, 0]
        );
        ctx.stroke();
        ctx.fill();

        x += barWidth;

        if (x > WIDTH) {
          break;
        }
      }
    }
    renderFrame();
  };

  return <canvas className={styles.canvas} ref={canvasRef}></canvas>;
};

export default AudioVisualisator;
