import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";

import styles from "./index.module.css";

import { ReactComponent as VinylDisk } from "../../../svg/vinyl-disk.svg";

const MediaInfo = (props) => {
  const [metadata, setMetadata] = useState(props.metadata);

  useEffect(() => {
    setMetadata(props.metadata);
  }, [props.metadata]);

  return (
    <div className={styles.info}>
      <VinylDisk />
      <span className={styles.title}>{metadata.title}</span>
    </div>
  );
};

MediaInfo.propTypes = {
  metadata: PropTypes.object.isRequired,
};

export default MediaInfo;
