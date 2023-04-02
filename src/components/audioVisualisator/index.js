import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Canvas = styled.canvas`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  background-color: transparent;
`;

const AudioVisualisator = ({ audioChannel, isEnabled }) => {
  const [sizeWindow, setSizeWindow] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  const [param, setParam] = useState({
    isEnabled: null,
  });

  const [analyser, setAnalyser] = useState();
  const [reqAnimation, setReqAnimation] = useState();
  const [ctx, setCtx] = useState();

  const canvasRef = useRef();

  var src;

  useEffect(() => {
    setParam((prevState) => ({ ...prevState, isEnabled: isEnabled }));
  }, [isEnabled]);

  useLayoutEffect(() => {
    window.addEventListener("resize", () => {
      setSizeWindow({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    });

    initCanvas();
    if (!src) initContext();

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
  }, [sizeWindow.height, sizeWindow.width]);

  useEffect(() => {
    cancelAnimationFrame(reqAnimation);
    frequencyBarGraph();
  }, [param]);

  const initCanvas = () => {
    canvasRef.current.width = sizeWindow.width;
    canvasRef.current.height = sizeWindow.height;
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    setCtx(ctx);
  };

  const initContext = () => {
    const context = new AudioContext();
    const analyser = context.createAnalyser();

    src = context.createMediaElementSource(audioChannel.current);
    src.connect(analyser);
    analyser.connect(context.destination);

    setAnalyser(analyser);
  };

  const frequencyBarGraph = () => {
    if (!analyser) {
      return;
    }

    analyser.fftSize = 512;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

    function renderFrame() {
      var x = 0;

      var HEIGHT = canvasRef.current.height;
      var WIDTH = canvasRef.current.width;

      var barWidth = 16;
      var barHeight;

      setReqAnimation(requestAnimationFrame(renderFrame));
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "#222831";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      if (!param.isEnabled) {
        return;
      }

      for (var i = 8; i < bufferLength; i++) {
        barHeight = dataArray[i];

        var grd = ctx.createLinearGradient(0, 0, 0, HEIGHT);
        var alpha = barHeight / 255 + 0.2;
        grd.addColorStop(0, `rgba(0, 0, 255, ${alpha})`);
        grd.addColorStop(0.5, `rgba(255, 0, 0, ${alpha})`);
        grd.addColorStop(0.75, `rgba(255, 255, 0, ${alpha})`);
        grd.addColorStop(1, `rgba(0, 255, 0, ${alpha})`);

        ctx.strokeStyle = grd;
        ctx.fillStyle = grd;

        // if (param.isEnabled) {
        // } else {
          // ctx.strokeStyle = `rgb(${barHeight + 200}, 50, 50)`;
          // ctx.fillStyle = `rgb(${barHeight + 50}, 50, 50)`;
        // }

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

  return <Canvas ref={canvasRef}></Canvas>;
};

AudioVisualisator.propTypes = {
  audioChannel: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]).isRequired,
  isEnabled: PropTypes.bool.isRequired,
};

export default AudioVisualisator;
