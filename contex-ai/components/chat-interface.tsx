"use client";

import * as React from "react";
import { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ChatInterface() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add the user’s message and a placeholder assistant message
    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [
      ...prev,
      userMessage,
      { role: "assistant", content: "..." },
    ]);
    setLoading(true);

    try {
      // Send prompt to your backend
      const response = await axios.post(
        "http://127.0.0.1:8000/prompts/",
        { prompt: input },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Server response:", response.data);

      // Replace "..." with the actual response (stringified)
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1
            ? {
                role: "assistant",
                // Use JSON.stringify to avoid "[object Object]"
                content: JSON.stringify(response.data) || "No response received.",
              }
            : msg
        )
      );
    } catch (error) {
      console.error("Error fetching response:", error);
      // Show an error in place of the assistant's last placeholder message
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1
            ? {
                role: "assistant",
                content: "Error fetching response. Please try again.",
              }
            : msg
        )
      );
    }

    setLoading(false);
    setInput("");
  };

  return (
    <div className="h-full flex flex-col p-4 bg-gradient-to-b from-purple-900 to-black text-white">
      <Card className="flex-1 mb-4 p-4 overflow-hidden bg-gray-900 border-gray-700 shadow-lg">
        <ScrollArea className="h-full">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <span
                className={`inline-block p-2 rounded-lg text-white ${
                  message.role === "user" ? "bg-purple-800" : "bg-gray-700"
                }`}
              >
                {message.content}
              </span>
            </div>
          ))}
          {loading && (
            <div className="text-left mb-4">
              <span className="inline-block p-2 rounded-lg text-white bg-gray-700">
                ...
              </span>
            </div>
          )}
        </ScrollArea>
      </Card>

      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
          className="flex-1 bg-gray-800 text-white placeholder-gray-400 border-gray-600 focus:ring-purple-500 focus:border-purple-500"
        />
        <Button
          type="submit"
          className="bg-purple-700 text-white hover:bg-purple-600 border border-gray-500"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </Button>
      </form>
    </div>
  );
}
