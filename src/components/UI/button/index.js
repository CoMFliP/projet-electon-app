import React from "react";

import styles from "./index.module.css";

const button = (props) => {
  return <button className={styles.button} {...props}></button>;
};
export default button;
