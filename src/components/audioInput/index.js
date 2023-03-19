import React, { forwardRef } from "react";

const AudioInput = forwardRef((props, ref) => {
  return <audio {...props} preload="metadata" ref={ref}></audio>;
});

export default AudioInput;
