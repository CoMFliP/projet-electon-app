import React from "react";
import styled, { createGlobalStyle } from "styled-components";

import MediaPlayer from "./components/mediaPlayer";
import TitleBar from "./components/UI/titlebar";

const StylesApp = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  text-align: center;
  background-color: #222831;
`;

const GlobalStyle = createGlobalStyle`
  html,
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
      "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100vh;
    width: 100vw;
  }

  #root {
    width: 100%;
    height: 100%;
  }
`;

function App() {
  return (
    <StylesApp>
      <GlobalStyle />
      <TitleBar />
      <MediaPlayer.Element />
    </StylesApp>
  );
}

export default App;
