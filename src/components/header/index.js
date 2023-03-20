import React from "react";

import styles from "./index.module.css";

const header = (props) => {
  return (
    <p className={styles.header}>
      {props.content}
    </p>
  );
};
export default header;
