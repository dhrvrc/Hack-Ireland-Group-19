"use client";

import React, { useState, useRef, useEffect } from "react";

export function AgentVoiceRecorder({
  onTranscribed,
}: {
  onTranscribed: (text: string) => void;
}) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("getUserMedia not supported");
      return;
    }
    setRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };
    mediaRecorder.start();
  }

  function stopRecording() {
    setRecording(false);
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
  }

  async function sendToWhisper() {
    const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
    const formData = new FormData();
    formData.append("file", audioBlob, "speech.webm");

    const res = await fetch("/api/agent/whisper", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    console.log("Transcribed text from Whisper:", data.text);

    onTranscribed(data.text);
    await readOutResponse(data.text);
  }

  async function readOutResponse(text: string) {
    const response = await fetch("/api/agent/elevenlabs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      console.error("Failed to fetch audio from ElevenLabs");
      return;
    }

    const audioData = await response.arrayBuffer();
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(audioData);
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
  }

  return (
    <div>
      {!recording ? (
        <button onClick={startRecording}>Start Recording</button>
      ) : (
        <button onClick={stopRecording}>Stop Recording</button>
      )}
      <button disabled={recording} onClick={sendToWhisper}>
        Send to Whisper
      </button>
    </div>
  );
}
