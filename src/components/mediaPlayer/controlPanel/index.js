import React, { useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Button from "../..//UI/button";
import Input from "../..//UI/input";

import { ReactComponent as PlayIcon } from "./svg/audio-play.svg";
import { ReactComponent as PauseIcon } from "./svg/audio-pause.svg";
import { ReactComponent as StopIcon } from "./svg/audio-stop.svg";
import { ReactComponent as NextIcon } from "./svg/audio-next.svg";
import { ReactComponent as BackIcon } from "./svg/audio-back.svg";
import { ReactComponent as VisualisatorIcon } from "./svg/audio-visualisator.svg";
import { ReactComponent as VolumeMuteIcon } from "./svg/audio-volume-mute.svg";
import { ReactComponent as VolumeLowIcon } from "./svg/audio-volume-low.svg";
import { ReactComponent as VolumeMediumIcon } from "./svg/audio-volume-medium.svg";
import { ReactComponent as VolumeHighIcon } from "./svg/audio-volume-high.svg";

const StyledContolPanel = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;

  width: 100%;

  color: #f2f2f2;

  & > * {
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
  }
`;

const StyledButtonsControl = styled.div`
  display: flex;
`;
const StyledVolumeControl = styled.div`
  display: flex;

  align-items: center;
  justify-content: center;
  margin-left: auto;

  width: 15rem;
`;
const StyledTimelineControl = styled.div`
  display: flex;
  align-items: center;

  width: 100%;
`;

const ControlPanel = ({ audioChannel, player, setPlayer, list, setList }) => {
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

  useEffect(() => {
    if (player.isPlay) {
      audioChannel.current.play();
    } else {
      audioChannel.current.pause();
    }
  }, [player.isPlay, player.currentId, player.src]);

  useEffect(() => {
    if (player.isMute) {
      audioChannel.current.muted = true;
    } else {
      audioChannel.current.muted = false;
    }
  }, [player.isMute]);

  return (
    <StyledContolPanel>
      <StyledButtonsControl>
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
            player.isPlay &&
              setPlayer((prevState) => ({
                ...prevState,
                isPlay: false,
                currentTime: 0,
              }));
            audioChannel.current.pause();
            audioChannel.current.currentTime = 0;
          }}
          disabled={player.isCanPlay ? false : true}
        >
          <StopIcon />
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
            list.length > 1 && player.currentId + 1 < list.length ? false : true
          }
        >
          <NextIcon />
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
          <VisualisatorIcon />
          {player.visualisation.isEnabled ? `✅` : `❌`}
        </Button>
        <StyledVolumeControl>
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
            content={player.volume}
          />
        </StyledVolumeControl>
      </StyledButtonsControl>

      <StyledTimelineControl>
        <Input
          type="range"
          value={player.currentTime}
          max={player.duration === null ? 0 : player.duration}
          onChange={handleChangeTime}
          content={`${calculateTime(player.currentTime)} / ${calculateTime(
            player.duration
          )}`}
        />
      </StyledTimelineControl>
    </StyledContolPanel>
  );
};

ControlPanel.propTypes = {
  audioChannel: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]).isRequired,
  player: PropTypes.object.isRequired,
  setPlayer: PropTypes.func.isRequired,
  list: PropTypes.array.isRequired,
  setList: PropTypes.func.isRequired,
};

export default ControlPanel;
