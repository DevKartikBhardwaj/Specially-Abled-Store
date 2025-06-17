export const createSpeechToText = (onResultCallback, onEndCallback) => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert('Speech Recognition is not supported in this browser.');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false; // <-- Auto-stops on silence
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    let finalTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const result = event.results[i];
      finalTranscript += result[0].transcript;
    }
    onResultCallback(finalTranscript.trim());
  };

  recognition.onend = () => {
    if (onEndCallback) onEndCallback();
  };

  return {
    start: () => recognition.start(),
    stop: () => recognition.stop(),
    abort: () => recognition.abort(),
    recognition,
  };
};

export const cleanAndFormatText = (text) => {
  const replaced = text
    .toLowerCase()
    .replace(/at the rate/g, '@')
    .replace(/dot/g, '.');

  const noSpaces = replaced.replace(/\s+/g, '');

  return noSpaces;
};
