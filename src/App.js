import logo from "./logo.svg";
import { useEffect, useState, useRef } from "react";

import MediaPlayer from "./components/mediaPlayer";
import Header from "./components/header";
import Button from "./components/button";

import styles from "./App.module.css";

function App() {
  const [filePath, setFile] = useState();

  const openDialog = () => {
    window.dialog.open();
    window.dialog.getPath(setFile);
  };

  useEffect(() => {
    return () => {
      window.dialog.removeEventListener();
    };
  }, []);

  return (
    <div className={styles.app}>
      <div className={styles.header}>
        <Header content="Bruh Player" />
      </div>
      <MediaPlayer className={styles.mediaplayer} openDialog={openDialog} src={filePath}/>
    </div>
  );
}

export default App;
