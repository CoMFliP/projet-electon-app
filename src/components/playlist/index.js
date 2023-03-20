import React, { useState, useEffect } from "react";

import styles from "./index.module.css";

import Track from "./track";

const PlayList = ({ list }) => {
  const listItems = list.map((track, index) =>
    index != 0 ? (
      <Track
        key={index}
        position={track.id}
        title={track.title}
        duration={track.duration}
        isPlaying={track.isPlaying}
      />
    ) : null
  );
  return <div className={styles.playlist}>{listItems}</div>;
};

export default PlayList;
