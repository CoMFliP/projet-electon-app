import React, { useRef } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

import MediaPlayer from "../../mediaPlayer";
import ControlPanel from "../../mediaPlayer/controlPanel";
import SVGIcon from "../svgIcon";

const Option = styled.div`
  color: #f2f2f2;
  font-size: medium;

  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;

  padding-right: 0.5rem;
  padding-left: 0.5rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;

  border-radius: 0.25rem;

  & > * {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }

  &:hover {
    background-color: #61656b;
  }

  &:disabled {
    background-color: #818489;
  }

  &:active:not(:disabled) {
    background-color: #2e3238;
  }
`;

const StyledContextMenu = styled.div`
  position: fixed;
  width: max-content;

  padding: 0.25rem;
  border-radius: 0.25rem;
  background-color: #393e46;

  z-index: 99999;
  user-select: none;

  top: ${(props) => `${props.param.mouseY}px`};
  left: ${(props) => `${props.param.mouseX}px`};

  box-shadow: 0px 0px 1rem #181a1d7f;

  ${(props) =>
    props.param.isActive
      ? css`
          transform: scale(1);
          transform-origin: top left;
          transition: transform 0.1s ease-in-out;

          & > ${Option} {
            transition: opacity 0.1s ease-out 0.1s,
              background-color 0.25s ease-out;
            opacity: 1;
          }
        `
      : css`
          transform: scale(0);
          transform-origin: top left;
          transition: transform 0.1s ease-in-out 0.1s;

          & > ${Option} {
            transition: opacity 0.1s ease-out, background-color 0.25s ease-out;
            opacity: 0;
          }
        `}

  svg {
    height: 1rem;
    width: 1rem;

    fill: #f2f2f2;
  }
`;

const ContextMenu = ({ param, player, setPlayer, list, setList }) => {
  const refContextMenu = useRef();

  const listItems = param.data?.map((data, index) => (
    <Option key={index} onClick={(event) => commandOption(event, data.command)}>
      <SVGIcon icon={data.icon} />
      <span>{data.msg}</span>
    </Option>
  ));

  const normalizePosition = (param) => {
    let normalizedX = param.mouseX;
    let normalizedY = param.mouseY;

    if (
      param.mouseX + refContextMenu.current?.clientWidth >
      window.innerWidth
    ) {
      normalizedX = window.innerWidth - refContextMenu.current.clientWidth - 16;
    }

    if (
      param.mouseY + refContextMenu.current?.clientHeight >
      window.innerHeight
    ) {
      normalizedY =
        window.innerHeight - refContextMenu.current.clientHeight - 16;
    }

    return { ...param, mouseX: normalizedX, mouseY: normalizedY };
  };

  const commandOption = (_event, command) => {
    const splitCmd = command.split(" ");
    const trackID = parseInt(splitCmd[1]);
    var newList = [...list];

    switch (splitCmd[0]) {
      case "play":
        MediaPlayer.setTrack(null, setPlayer, list, trackID);

        newList[player.currentId] = {
          ...list[player.currentId],
          isPlaying: false,
        };

        setList(newList);
        break;

      case "delete":
        if (player.currentId == trackID) {
          ControlPanel.Event.stop(null, player, setPlayer, list, setList);
        }

        setPlayer((prevState) => ({
          ...prevState,
          currentId:
            player.currentId < trackID
              ? player.currentId
              : player.currentId - 1,
        }));

        newList[player.currentId] = {
          ...list[player.currentId],
          isPlaying: true,
        };

        newList[trackID] = { ...list[trackID], isShow: false };
        setList(newList);

        setTimeout(() => {
          list.splice(trackID, 1);
          setList(list);
        }, 250);

        break;
      case "clear":
        ControlPanel.Event.stop(null, player, setPlayer, list, setList);

        setList([]);

        break;
      default:
        break;
    }
  };
  return (
    <StyledContextMenu param={normalizePosition(param)} ref={refContextMenu}>
      {listItems}
    </StyledContextMenu>
  );
};

ContextMenu.propTypes = {
  param: PropTypes.object.isRequired,
  player: PropTypes.object.isRequired,
  setPlayer: PropTypes.func.isRequired,
  list: PropTypes.array.isRequired,
  setList: PropTypes.func.isRequired,
};

export default ContextMenu;
