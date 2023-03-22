import React from "react";

import styles from "./index.module.css";

const input = (props) => {
  return (
    <div className={styles.input}>
      <input
        type={props.type}
        value={props.value}
        max={props.max}
        step={props.step}
        onChange={props.onChange}
        disabled={props.disabled}
      />
      <div
        className={props.disabled ? styles.disabled : styles.active}
        style={{ width: (props.value / props.max) * 100 + "%" }}
      ></div>
    </div>
  );
};
export default input;
