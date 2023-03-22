import React, { forwardRef } from "react";

const AudioInput = forwardRef((props, ref) => {
  return <audio {...props} preload="metadata" ref={ref}></audio>;
});

AudioInput.displayName = "AudioInput";

export default AudioInput;
