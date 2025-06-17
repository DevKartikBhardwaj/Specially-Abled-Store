import React from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';

const SpeakOnHover = ({ text, children }) => {
  const { speak, cancel } = useSpeechSynthesis();

  const handleMouseEnter = () => speak({ text });
  const handleMouseLeave = () => cancel();
  const handleFocus = () => speak({ text });
  const handleBlur = () => cancel();

  return (
    <div
      tabIndex={0}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
    </div>
  );
};

export default SpeakOnHover;

