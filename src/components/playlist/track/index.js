import React, { useState, useEffect } from "react";

import styles from "./index.module.css";

const Track = (props) => {
  const [track, setTrack] = useState({
    isPlaying: props.isPlaying,
    position: props.position,
    title: props.title,
    duration: props.duration,
  });

  useEffect(() => {
    setTrack((prevState) => ({ ...prevState, isPlaying: props.isPlaying }));
  }, [props.isPlaying]);

  return (
    <div className={styles.track}>
      <div className={track.isPlaying ? styles.active : styles.disactive}>
        <span>{track.position}.</span>
        <span>{track.title}</span>
        <span>{track.duration}</span>
      </div>
    </div>
  );
};

export default Track;
