import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import MediaPlayer from "..";

import Button from "../..//UI/button";
import Input from "../..//UI/input";
import SVGIcon from "../../UI/svgIcon";

const StyledContolPanel = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;

  width: 100%;
  height: min-content;

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

  transition: all 1s linear;
`;

const ControlPanel = {
  Event: {
    play(_event, player, setPlayer) {
      player.isPlay
        ? setPlayer((prevState) => ({ ...prevState, isPlay: false }))
        : setPlayer((prevState) => ({ ...prevState, isPlay: true }));
    },

    stop(_event, player, setPlayer, list, setList) {
      setPlayer((prevState) => ({
        ...prevState,
        info: {},
        src: "",
        currentId: -1,
        currentTime: 0,
        duration: 0,
        isAutoPlay: false,
        isPlay: false,
        onLoad: false,
      }));

      let newList = [...list];

      newList[player.currentId] = {
        ...list[player.currentId],
        isPlaying: false,
      };

      setList(newList);
    },

    prev(_event, player, setPlayer, list, setList) {
      MediaPlayer.setTrack(null, setPlayer, list, player.currentId - 1);

      let newList = [...list];

      newList[player.currentId] = {
        ...list[player.currentId],
        isPlaying: false,
      };

      setList(newList);
    },

    next(_event, player, setPlayer, list, setList) {
      MediaPlayer.setTrack(null, setPlayer, list, player.currentId + 1);

      let newList = [...list];

      newList[player.currentId] = {
        ...list[player.currentId],
        isPlaying: false,
      };

      setList(newList);
    },

    visual(_event, player, setPlayer) {
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
    },

    mute(_event, player, setPlayer) {
      player.isMute
        ? setPlayer((prevState) => ({
            ...prevState,
            isMute: false,
          }))
        : setPlayer((prevState) => ({
            ...prevState,
            isMute: true,
          }));
    },
    volume(event, setPlayer) {
      setPlayer((prevState) => ({ ...prevState, volume: event.target.value }));
    },

    timeline(event, audio, setPlayer) {
      setPlayer((prevState) => ({
        ...prevState,
        currentTime: event.target.value,
      }));
      audio.currentTime = event.target.value;
    },
  },

  Element({ audioChannel, player, setPlayer, list, setList }) {
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
      const loadToList = async () => {
        let tempList = [];
        let errLog = [];

        let playlist = [];

        for (const file of fileList) {
          if (file.split(".")[file.split(".").length - 1] == "bruh") {
            let res = await MediaPlayer.readPlaylist(file);
            playlist = JSON.parse(res.toString());
          } else {
            playlist = [...playlist, file];
          }
        }

        for (const path of playlist) {
          console.log(path[0])
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
      if (list.length > 0) {
        setPlayer((prevState) => ({
          ...prevState,
          isCanPlay: true,
        }));
      } else {
        setPlayer((prevState) => ({
          ...prevState,
          isCanPlay: false,
        }));
      }
    }, [list, player.currentId, player.isDeleted]);

    useEffect(() => {
      if (!player.onLoad) {
        audioChannel.current.load();
        setPlayer((prevState) => ({ ...prevState, onLoad: true }));
      }
    }, [player.onLoad, player.src, player.currentId]);

    useEffect(() => {
      if (player.isAutoPlay && player.isCanPlay) {
        if (player.currentId == -1) {
          MediaPlayer.setTrack(null, setPlayer, list, 0);
        }

        setPlayer((prevState) => ({
          ...prevState,
          isPlay: true,
        }));

        let newList = [...list];
        newList[player.currentId] = {
          ...list[player.currentId],
          isPlaying: true,
        };
        setList(newList);
      }
    }, [player.isAutoPlay, player.isCanPlay, player.onLoad]);

    useEffect(() => {
      if (player.isPlay && player.currentId != -1) {
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

    useEffect(() => {
      audioChannel.current.volume = player.volume / 100;
    }, [player.volume]);

    useEffect(() => {
      audioChannel.current.load();
    }, []);

    const handlePlayPause = (event) => {
      if (player.currentId == -1) {
        MediaPlayer.setTrack(event, setPlayer, list, 0);
      } else {
        ControlPanel.Event.play(event, player, setPlayer);
      }
    };
    const handleStop = (event) => {
      ControlPanel.Event.stop(event, player, setPlayer, list, setList);
    };
    const handlePrev = (event) => {
      ControlPanel.Event.prev(event, player, setPlayer, list, setList);
    };
    const handleNext = (event) => {
      ControlPanel.Event.next(event, player, setPlayer, list, setList);
    };
    const handleVisual = (event) => {
      ControlPanel.Event.visual(event, player, setPlayer);
    };

    const handleMute = (event) => {
      ControlPanel.Event.mute(event, player, setPlayer);
    };
    const handleVolume = (event) => {
      ControlPanel.Event.volume(event, setPlayer);
    };

    const handleTimeline = (event) => {
      ControlPanel.Event.timeline(event, audioChannel.current, setPlayer);
    };

    return (
      <StyledContolPanel>
        <StyledButtonsControl>
          <Button
            data-title={player.isPlay ? "Pause" : "Play"}
            onClick={handlePlayPause}
            disabled={player.isCanPlay ? false : true}
          >
            {player.isPlay ? <SVGIcon icon="pause" /> : <SVGIcon icon="play" />}
          </Button>
          <Button
            data-title="Stop"
            onClick={handleStop}
            disabled={player.isAutoPlay && player.isCanPlay ? false : true}
          >
            <SVGIcon icon="stop" />
          </Button>
          <Button
            data-title="Previous track"
            onClick={handlePrev}
            disabled={list.length > 1 && player.currentId > 0 ? false : true}
          >
            <SVGIcon icon="back" />
          </Button>
          <Button
            data-title="Next track"
            onClick={handleNext}
            disabled={
              list.length > 1 && player.currentId + 1 < list.length
                ? false
                : true
            }
          >
            <SVGIcon icon="next" />
          </Button>
          <Button
            data-title={
              player.visualisation.isEnabled
                ? "Visualisaton ON"
                : "Visualisaton OFF"
            }
            onClick={handleVisual}
          >
            <SVGIcon icon="visual" />
            {player.visualisation.isEnabled ? `✅` : `❌`}
          </Button>
          <Button
            data-title="Open file"
            onClick={() => MediaPlayer.dialog.open(setFileList)}
          >
            <SVGIcon icon="open-file" />
          </Button>
          <Button
            data-title="Save Playlist"
            onClick={() => MediaPlayer.dialog.save(list)}
          >
            <SVGIcon icon="save-file" />
          </Button>
          <StyledVolumeControl>
            <Button
              data-title={player.isMute ? "Enable sound" : "Mute"}
              onClick={handleMute}
            >
              {player.isMute || player.volume == 0 ? (
                <SVGIcon icon="volume-mute" />
              ) : player.volume > 0 && player.volume <= 33 ? (
                <SVGIcon icon="volume-low" />
              ) : player.volume > 33 && player.volume <= 66 ? (
                <SVGIcon icon="volume-medium" />
              ) : (
                <SVGIcon icon="volume-high" />
              )}
            </Button>
            <Input
              type="range"
              value={player.volume}
              max="100"
              step="1"
              onChange={handleVolume}
              disabled={player.isMute}
              content={player.volume}
            />
          </StyledVolumeControl>
        </StyledButtonsControl>

        <StyledTimelineControl>
          <Input
            type="range"
            value={player.currentTime}
            max={player.duration === undefined ? 0 : player.duration}
            onChange={handleTimeline}
            content={`${MediaPlayer.calculateTime(
              player.currentTime
            )} / ${MediaPlayer.calculateTime(player.duration)}`}
          />
        </StyledTimelineControl>
      </StyledContolPanel>
    );
  },
};

ControlPanel.Element.propTypes = {
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
