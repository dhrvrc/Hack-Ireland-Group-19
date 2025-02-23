"use client";

import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";

// Utility functions to extract and sanitize JSX from the message content
const extractJSX = (code: string): string => {
  const match = code.match(/return\s*\(([\s\S]+?)\)\s*;?\s*$/m);
  if (match && match[1]) {
    return match[1].trim();
  }
  return code;
};

const sanitizeJSX = (code: string): string => {
  const bodyMatch = code.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (bodyMatch && bodyMatch[1]) {
    return bodyMatch[1].trim();
  }
  return code.replace(/<\/?(html|head|body)[^>]*>/gi, '');
};

export function ChatInterface() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>(() => {
    const saved = localStorage.getItem("chatMessages");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Echo the user message as a purple bubble
    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [
      ...prev,
      userMessage,
      { role: "assistant", content: "..." } // placeholder for assistant response
    ]);
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/prompts/",
        { prompt: input },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Server response:", response.data);

      // Look for JSX wrapped in ```jsx ... ```
      const extractedCode = response.data.response.match(/```jsx\n([\s\S]*?)\n```/);
      const formattedResponse = extractedCode
        ? extractedCode[1]
        : response.data.response;

      // Replace the placeholder assistant message with the actual response
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1
            ? { role: "assistant", content: formattedResponse }
            : msg
        )
      );
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1
            ? { role: "assistant", content: "Error fetching response. Please try again." }
            : msg
        )
      );
    }

    setLoading(false);
    setInput("");
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="h-full flex flex-col p-4 bg-gradient-to-b from-purple-900 to-black text-white">
      <Card className="flex-1 mb-4 p-4 overflow-hidden bg-gray-900 border-gray-700 shadow-lg">
        <ScrollArea className="h-full">
          {messages.map((message, index) => {
            if (message.role === "user") {
              return (
                <div key={index} className="mb-4 text-right">
                  <span className="inline-block text-sm p-2 rounded-lg text-white bg-purple-800">
                    {message.content}
                  </span>
                </div>
              );
            }
            // For assistant messages containing code markers, display code block with a copy button on the left.
            if (message.role === "assistant" && (message.content.includes("export default") || message.content.includes("<"))) {
              return (
                <div key={index} className="mb-4 text-left">
                  <div className="relative bg-gray-800 rounded-lg p-2 pt-16">
                    <SyntaxHighlighter language="jsx" style={dracula} className="rounded-lg text-sm p-3">
                      {message.content}
                    </SyntaxHighlighter>
                    <Button
                      onClick={() => handleCopy(message.content)}
                      className="absolute top-2 left-2 z-10 bg-gray-700 text-white hover:bg-gray-600 p-1 rounded"
                      variant="ghost"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            }
            // For plain text assistant messages, show a copy button on the left as well.
            return (
              <div key={index} className="relative mb-4 text-left">
                <span className="inline-block text-sm p-2 rounded-lg text-white bg-gray-700 pt-16">
                  {message.content}
                </span>
                <Button
                  onClick={() => handleCopy(message.content)}
                  className="absolute top-2 left-2 z-10 bg-gray-700 text-white hover:bg-gray-600 p-1 rounded"
                  variant="ghost"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
          {loading && (
            <div className="text-left mb-4">
              <span className="inline-block p-2 rounded-lg text-white bg-gray-700">...</span>
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
        <Button type="submit" className="bg-purple-700 text-white hover:bg-purple-600 border border-gray-500" disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </Button>
      </form>
    </div>
  );
}
