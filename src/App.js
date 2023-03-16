import logo from "./logo.svg";
import { useEffect, useState } from "react";

import MediaPlayer from './components/mediaPlayer'
import Header from "./components/header";
import Button from "./components/button";

import styles from "./App.module.scss";

function App() {
  const [filePath, setFile] = useState();

  const openDialog = () => {
    window.dialog.open();
    window.dialog.getFilePath(setFile);
  };

  useEffect(() => {
    return () => {
      window.dialog.removeEventListener();
    };
  }, []);

  useEffect(() => {
    console.log(filePath);
  }, [filePath]);

  return (
    <div className={styles.app}>
      <Header content="YT Player" />
      <Button onClick={openDialog} content={"Open File"} />
      <Button onClick={openDialog} content={"Open URL (YouTube)"} />
      <MediaPlayer src={filePath} />
    </div>
  );
}

export default App;
