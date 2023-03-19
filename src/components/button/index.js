import React from "react";

import styles from "./index.module.scss";

const button = (props) => {
  return <button className={styles.button} {...props}></button>;
};
export default button;
