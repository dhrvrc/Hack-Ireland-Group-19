"use client";

import * as React from "react";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import ReactJsxParser from "react-jsx-parser";
import parse from 'html-react-parser';

// Import external chart components and others
import { Line, Bar, Pie, Doughnut, Radar, PolarArea } from "react-chartjs-2";
import { PieChart } from "react-minimal-pie-chart";

// Define a comprehensive list of common components for dynamic rendering
const commonComponents = {
  // Your UI components
  Button,
  Input,
  Card,
  ScrollArea,
  Copy,
  // Chart components from react-chartjs-2
  Line,
  Bar,
  Pie,
  Doughnut,
  Radar,
  PolarArea,
  // Chart component from react-minimal-pie-chart
  PieChart,
  // Add more components as needed...
};

// Function to extract only the JSX inside a return statement (if available)
const extractJSX = (code: string): string => {
  const match = code.match(/return\s*\(([\s\S]+?)\)\s*;?\s*$/m);
  if (match && match[1]) {
    return match[1].trim();
  }
  return code;
};

// Sanitize the JSX code to remove problematic tags (like <html>, <head>, or <body>)
const sanitizeJSX = (code: string): string => {
  // If there's a <body> tag, extract its inner content
  const bodyMatch = code.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (bodyMatch && bodyMatch[1]) {
    return bodyMatch[1].trim();
  }
  // Otherwise remove any <html>, <head>, or <body> tags
  return code.replace(/<\/?(html|head|body)[^>]*>/gi, '');
};

export function ChatInterface() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >(() => {
    // Load saved messages from localStorage on component mount
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [];
  });

  // Add useEffect to save messages whenever they change
  React.useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [
      ...prev,
      userMessage,
      { role: "assistant", content: "..." },
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
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
              {message.role === "assistant" && message.content.includes("export default") ? (
                <div>
                  <div className="relative bg-gray-800 rounded-lg p-2">
                    <SyntaxHighlighter language="jsx" style={dracula} className="rounded-lg text-sm p-3">
                      {message.content}
                    </SyntaxHighlighter>
                    <Button
                      onClick={() => handleCopy(message.content)}
                      className="absolute top-2 right-2 bg-gray-700 text-white hover:bg-gray-600 p-1 rounded"
                      variant="ghost"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-4 p-2 bg-gray-800 rounded-lg">
                    {parse(sanitizeJSX(extractJSX(message.content)))}
                  </div>
                </div>
              ) : message.role === "assistant" && message.content.includes("<") ? (
                <div className="relative bg-gray-800 rounded-lg p-2">
                  <SyntaxHighlighter language="jsx" style={dracula} className="rounded-lg text-sm p-3">
                    {message.content}
                  </SyntaxHighlighter>
                  <Button
                    onClick={() => handleCopy(message.content)}
                    className="absolute top-2 right-2 bg-gray-700 text-white hover:bg-gray-600 p-1 rounded"
                    variant="ghost"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <span className={`inline-block text-sm p-2 rounded-lg text-white ${message.role === "user" ? "bg-purple-800" : "bg-gray-700"}`}>
                  {message.content}
                </span>
              )}
            </div>
          ))}
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
