"use client";

import { useState, useRef } from "react";
import { useAgentStore } from "@/hooks/AgentControlStore";

interface AgentChatPopupProps {
  onClose: () => void;
}

export function AgentChatPopup({ onClose }: AgentChatPopupProps) {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Our Zustand store references
  const { components, queueActions } = useAgentStore();

  // 1) A helper function to parse user commands
  async function parseUserCommand(commandText: string) {
    // Collect page contexts
    const allPageContexts = Object.values(components)
      .filter((c) => c.context)
      .map((c) => c.context)
      .join("\n");

    // Post to /api/agent
    const res = await fetch("/api/agent", {
      method: "POST",
      body: JSON.stringify({
        userCommand: commandText,
        pageContext: allPageContexts,
      }),
    });
    const data = await res.json();
    // data: { assistantMessage: string, actions: AgentAction[] }

    // queue the actions
    if (data.actions) {
      queueActions(data.actions);
    }

    // Return the text message for TTS
    return data.assistantMessage || "";
  }

  // 2) A function to speak a string using ElevenLabs
  async function speakText(text: string) {
    if (!text) return;
    try {
      const res = await fetch("/api/agent/elevenlabs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      const ttsData = await res.json();
      if (ttsData.audio) {
        const audioSrc = `data:audio/mpeg;base64,${ttsData.audio}`;
        const audio = new Audio(audioSrc);
        audio.play().catch((err) => console.error("Audio playback error:", err));
      }
    } catch (err) {
      console.error("Error with TTS:", err);
    }
  }

  // 3) Called when user manually types input
  const handleSend = async () => {
    const userText = input.trim();
    if (!userText) return;
    setInput("");

    // Add user message to the chat
    setMessages((msgs) => [...msgs, { role: "user", content: userText }]);

    // Parse & get the assistant reply
    const assistantReply = await parseUserCommand(userText);

    // Add assistant message to chat (the text part)
    setMessages((msgs) => [
      ...msgs,
      { role: "assistant", content: assistantReply },
    ]);

    // Then speak it
    await speakText(assistantReply);
  };

  // 4) Called when user speech is transcribed via Whisper
  const handleTranscribedVoice = async (spokenText: string) => {
    if (!spokenText) return;

    // Put user message in chat
    setMessages((msgs) => [...msgs, { role: "user", content: spokenText }]);

    // Parse & get the reply
    const assistantReply = await parseUserCommand(spokenText);

    // Add assistant message to chat
    setMessages((msgs) => [
      ...msgs,
      { role: "assistant", content: assistantReply },
    ]);

    // TTS
    await speakText(assistantReply);
  };

  // 5) Start recording voice
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
      handleTranscribedVoice(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      setRecording(false);
    };

    recognition.start();
  }

  // 6) Stop recording voice
  function stopRecording() {
    setRecording(false);
    recognitionRef.current?.stop();
  }

  return (
    <div className="fixed bottom-20 left-4 w-80 bg-white border border-gray-300 rounded-md shadow-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-blue-600 text-white">
        <h3 className="font-semibold">AI Agent</h3>
        <button onClick={onClose} className="text-white">
          ×
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-2 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2">
            <div
              className={
                msg.role === "user"
                  ? "text-blue-800 font-semibold"
                  : "text-green-600 font-semibold"
              }
            >
              {msg.role === "user" ? "You:" : "Assistant:"}
            </div>
            <div className="ml-4 text-black whitespace-pre-line">
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input / Buttons */}
      <div className="p-2 border-t border-gray-200">
        <div className="flex flex-col gap-2">
          {/* The normal text input */}
          <div className="flex gap-2">
            <input
              className="flex-1 text-black border border-gray-300 rounded px-2 py-1"
              placeholder="Type your request..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
            >
              Send
            </button>
          </div>

          {/* The voice recorder */}
          <div className="flex justify-center mt-2">
            <button
              onClick={recording ? stopRecording : startRecording}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
            >
              {recording ? "Stop Recording" : "Start Recording"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
