import logo from "./logo.svg";
import { useEffect, useState, useRef } from "react";

import AudioInput from "./components/audioInput";

import MediaPlayer from "./components/mediaPlayer";
import Header from "./components/header";
import Button from "./components/button";

import styles from "./App.module.scss";

function App() {
  const [filePath, setFile] = useState();

  const openDialog = () => {
    window.dialog.open();
    window.dialog.getPath(setFile);
  };

  const audioRef = useRef();

  useEffect(() => {
    return () => {
      window.dialog.removeEventListener();
    };
  }, []);

  return (
    <div className={styles.app}>
      <div className={styles.header}>
        <Header content="YT Player" />
      </div>
      <AudioInput src={filePath} ref={audioRef} />
      <MediaPlayer className={styles.mediaplayer} audioChannel={audioRef} openDialog={openDialog}/>
    </div>
  );
}

export default App;
