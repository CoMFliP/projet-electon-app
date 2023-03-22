import React from "react";
import PropTypes from "prop-types";

import styles from "./index.module.css";

import Track from "./track";

const PlayList = ({ list }) => {
  const listItems = list.map((track, index) =>
    index != 0 ? (
      <Track
        key={index}
        id={track.id}
        title={track.title}
        duration={track.duration}
        isPlaying={track.isPlaying}
      />
    ) : null
  );
  return <div className={styles.playlist}>{listItems}</div>;
};

PlayList.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      duration: PropTypes.string,
      isPlaying: PropTypes.bool,
    })
  ).isRequired,
};

export default PlayList;
