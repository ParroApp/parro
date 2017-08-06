import React from 'react';
import PropTypes from 'prop-types';

const speak = (message) => {
  // Cancel any queued utterances
  window.speechSynthesis.cancel();

  const voices = window.speechSynthesis.getVoices();

  // If it's not yet ready, register a callback to re-invoke this method
  // when it is.
  if (voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      if (window.speechSynthesis.getVoices().length > 0) {
        speak(message)
      }
    };
    return;
  }

  const utterance = new window.SpeechSynthesisUtterance();

  utterance.voice = voices.find(voice => (
    voice.name === 'Google US English'
  ));

  utterance.lang = 'en';
  utterance.text = message;
  utterance.pitch = 1;
  utterance.rate = 0.9;

  window.speechSynthesis.speak(utterance);
};

export default speak;
