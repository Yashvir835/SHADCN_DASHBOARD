"use client"

import { useState, useEffect, useCallback } from 'react';

export function useSpeechRecognition(language: string = 'en-US') {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);

  const startListening = useCallback(() => {
    setTranscript('');
    setIsListening(true);
    // Create speech recognition instance
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = language;
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const text = event.results[last][0].transcript;
      setTranscript(text);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    return recognition;
  }, [language]);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
  };
} 