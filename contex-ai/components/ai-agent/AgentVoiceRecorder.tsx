"use client";

import React, { useState, useRef } from "react";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }

  type SpeechRecognition = any;
  type SpeechRecognitionEvent = any;
  type SpeechRecognitionErrorEvent = any;
}

export function AgentVoiceRecorder({
  onTranscribed,
}: {
  onTranscribed: (text: string) => void;
}) {
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  async function startRecording() {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Web Speech API not supported");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setRecording(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      console.log("Transcribed text from Web Speech API:", transcript);
      onTranscribed(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      setRecording(false);
    };

    recognition.start();
  }

  function stopRecording() {
    setRecording(false);
    recognitionRef.current?.stop();
  }

  return (
    <div>
      {!recording ? (
        <button onClick={startRecording}>Start Recording</button>
      ) : (
        <button onClick={stopRecording}>Stop Recording</button>
      )}
    </div>
  );
}
