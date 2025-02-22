"use client";

import type React from "react";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ChatInterface() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: { role: "user" | "assistant"; content: string } = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setLoading(true);

    try {
      // Send GET request with input as a query parameter
      const response = await axios.get("http://localhost:3000/api/chat-request", {
        params: { message: input },
      });

      // Update messages with the assistant's response
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.reply || "No response received." },
      ]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error fetching response. Please try again." },
      ]);
    }

    setLoading(false);
    setInput("");
  };

  return (
    <div className="h-full flex flex-col p-4 bg-gradient-to-b from-purple-900 to-black text-white">
      <Card className="flex-1 mb-4 p-4 overflow-hidden bg-gray-900 border-gray-700 shadow-lg">
        <ScrollArea className="h-full">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
              <span
                className={`inline-block p-2 rounded-lg text-white ${
                  message.role === "user" ? "bg-purple-800" : "bg-gray-700"
                }`}
              >
                {message.content}
              </span>
            </div>
          ))}
          {loading && <p className="text-gray-400 text-sm">Fetching response...</p>}
        </ScrollArea>
      </Card>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your AI-native component..."
          className="flex-1 bg-gray-800 text-white placeholder-gray-400 border-gray-600 focus:ring-purple-500 focus:border-purple-500"
        />
        <Button type="submit" className="bg-purple-700 text-white hover:bg-purple-600 border border-gray-500" disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </Button>
      </form>
    </div>
  );
}
