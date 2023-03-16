import React from "react";

import styles from "./index.module.scss";

const button = (props) => {
  return (
    <button
      className={styles.button}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.content}
    </button>
  );
};
export default button;
