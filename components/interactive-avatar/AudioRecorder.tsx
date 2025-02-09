import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@nextui-org/react";

interface AudioRecorderProps {
  onStartRecording: () => void;
  onStopRecording: (blob: Blob) => void;
  isRecording: boolean;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onStartRecording, onStopRecording, isRecording }) => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const initAudioContext = async () => {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(context);
      const analyserNode = context.createAnalyser();
      analyserNode.minDecibels = -90;
      analyserNode.maxDecibels = -10;
      analyserNode.smoothingTimeConstant = 0.85;
      setAnalyser(analyserNode);
    };

    initAudioContext();

    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  const startRecording = async () => {
    if (!audioContext || !analyser) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        onStopRecording(audioBlob);
      };

      mediaRecorderRef.current.start();
      onStartRecording();

      detectSilence(analyser, 100, -50, 1500);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const detectSilence = (analyser: AnalyserNode, minDecibels: number, threshold: number, silenceDelay: number) => {
    const data = new Uint8Array(analyser.frequencyBinCount);
    const silence = () => {
      analyser.getByteFrequencyData(data);
      return data.every(v => v < threshold);
    };

    let silenceStart = performance.now();
    const monitor = () => {
      if (silence()) {
        if (!silenceTimeoutRef.current) {
          silenceTimeoutRef.current = setTimeout(() => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
              mediaRecorderRef.current.stop();
            }
          }, silenceDelay);
        }
      } else {
        silenceStart = performance.now();
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        requestAnimationFrame(monitor);
      }
    };

    monitor();
  };

  return (
    <Button
      onClick={startRecording}
      disabled={isRecording}
      className="bg-gradient-to-tr from-indigo-500 to-indigo-300 text-white"
    >
      {isRecording ? 'Recording...' : 'Start Recording'}
    </Button>
  );
};

export default AudioRecorder;

