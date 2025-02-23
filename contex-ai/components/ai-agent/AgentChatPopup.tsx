// src/components/chat/AgentChatPopup.tsx
"use client";

import { useState } from "react";
import { useAgentStore } from "@/hooks/AgentControlStore";

interface AgentChatPopupProps {
  onClose: () => void;
}

export function AgentChatPopup({ onClose }: AgentChatPopupProps) {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [input, setInput] = useState("");

  // We'll use queueActions to feed the parsed results into our agent store
  const queueActions = useAgentStore((s) => s.queueActions);

  const sendMessage = async () => {
    const userText = input.trim();
    if (!userText) return;
    setInput("");

    // Show the user's message
    setMessages((msgs) => [...msgs, { role: "user", content: userText }]);

    try {
      // Call our parse API in the App Router
      const res = await fetch("/api/agent", {
        method: "POST",
        body: JSON.stringify({ userCommand: userText }),
      });
      const data = await res.json();

      // data.actions => array of agent actions
      if (data.actions) {
        queueActions(data.actions);

        // Show what GPT returned
        setMessages((msgs) => [
          ...msgs,
          { role: "assistant", content: JSON.stringify(data.actions, null, 2) },
        ]);
      }
    } catch (err) {
      console.error("Error calling parse route:", err);
      // Maybe display an error in the chat
    }
  };

  return (
    <div className="fixed bottom-20 right-4 w-80 bg-white border border-gray-300 rounded-md shadow-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-blue-600 text-white">
        <h3 className="font-semibold">AI Agent</h3>
        <button className="text-white" onClick={onClose}>
          ×
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-2 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2">
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

      {/* Input box */}
      <div className="p-2 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            className="flex-1 text-black border border-gray-300 rounded px-2 py-1"
            placeholder="Type your request..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
