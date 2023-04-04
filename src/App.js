import React, { useEffect, useState } from "react";
import styled from "styled-components";

import MediaPlayer from "./components/mediaPlayer";
import TitleBar from "./components/titlebar";

const StylesApp = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  text-align: center;
  background-color: #222831;
`;

function App() {
  const [filePath, setFile] = useState("");

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
    <StylesApp>
      <TitleBar />
      <MediaPlayer openDialog={openDialog} src={filePath} setSrc={setFile} />
    </StylesApp>
  );
}

export default App;
