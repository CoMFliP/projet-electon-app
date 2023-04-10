import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { ReactComponent as PlayIcon } from "./svg/audio-play.svg";
import { ReactComponent as PauseIcon } from "./svg/audio-pause.svg";
import { ReactComponent as StopIcon } from "./svg/audio-stop.svg";
import { ReactComponent as NextIcon } from "./svg/audio-next.svg";
import { ReactComponent as BackIcon } from "./svg/audio-back.svg";
import { ReactComponent as VisualisatorIcon } from "./svg/audio-visualisator.svg";
import { ReactComponent as OpenFileIcon } from "./svg/audio-open-file.svg";
import { ReactComponent as VolumeMuteIcon } from "./svg/audio-volume-mute.svg";
import { ReactComponent as VolumeLowIcon } from "./svg/audio-volume-low.svg";
import { ReactComponent as VolumeMediumIcon } from "./svg/audio-volume-medium.svg";
import { ReactComponent as VolumeHighIcon } from "./svg/audio-volume-high.svg";
import { ReactComponent as LoadingIcon } from "./svg/audio-loading-spinner.svg";
import { ReactComponent as MinIcon } from "./svg/min-icon.svg";
import { ReactComponent as MaxIcon } from "./svg/max-icon.svg";
import { ReactComponent as CloseIcon } from "./svg/close-icon.svg";
import { ReactComponent as DragDropIcon } from "./svg/drag-drop-icon.svg";
import { ReactComponent as DeleteIcon } from "./svg/delete-icon.svg";
import { ReactComponent as SaveIcon } from "./svg/save-file-icon.svg";
import { ReactComponent as ClearIcon } from "./svg/clear-playlist-icon.svg";

const StyledError = styled.div`
  color: #cc0000;
  border: #cc0000 1px solid;
  border-radius: 0.25rem;

  padding-right: 0.5rem;
  padding-left: 0.5rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;

  background-color: #f2f2f2;

  user-select: none;
`;

const renderSVG = (icon) => {
  switch (icon) {
    case "play":
      return <PlayIcon />;
    case "pause":
      return <PauseIcon />;
    case "stop":
      return <StopIcon />;
    case "next":
      return <NextIcon />;
    case "back":
      return <BackIcon />;

    case "visual":
      return <VisualisatorIcon />;

    case "open-file":
      return <OpenFileIcon />;

    case "volume-mute":
      return <VolumeMuteIcon />;
    case "volume-low":
      return <VolumeLowIcon />;
    case "volume-medium":
      return <VolumeMediumIcon />;
    case "volume-high":
      return <VolumeHighIcon />;

    case "loading":
      return <LoadingIcon />;

    case "minimize":
      return <MinIcon />;
    case "maximize":
      return <MaxIcon />;
    case "close":
      return <CloseIcon />;

    case 'drag-drop':
      return <DragDropIcon />

    case 'delete':
      return <DeleteIcon />
    case 'save-file':
      return <SaveIcon />

    case 'clear':
      return <ClearIcon />

    default:
      return <StyledError>ERR: Icon Not Found</StyledError>;
  }
};

const SVGIcon = ({ icon }) => {
  return <>{renderSVG(icon)}</>;
};

SVGIcon.propTypes = {
  icon: PropTypes.string.isRequired,
};

export default SVGIcon;
