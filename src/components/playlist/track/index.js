import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import styles from "./index.module.css";
const Track = (props) => {
  const [track, setTrack] = useState({
    id: props.id,
    title: props.title,
    duration: props.duration,
    isPlaying: props.isPlaying,
  });

  useEffect(() => {
    setTrack((prevState) => ({ ...prevState, isPlaying: props.isPlaying }));
  }, [props.isPlaying]);

  return (
    <div className={styles.track}>
      <div className={track.isPlaying ? styles.active : styles.disactive}>
        <span>{track.id}.</span>
        <span>{track.title}</span>
        <span>{track.duration}</span>
      </div>
    </div>
  );
};

Track.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  isPlaying: PropTypes.bool.isRequired,
};

export default Track;
