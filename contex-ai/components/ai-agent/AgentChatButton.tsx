// src/components/chat/AgentChatButton.tsx
"use client";

import { useState } from "react";
import { AgentChatPopup } from "@/components/ai-agent/AgentChatPopup";

export function AgentChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-4 left-4 w-14 h-14 rounded-full bg-blue-600 text-white
                   flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
      >
        {isOpen ? "×" : "AI"}
      </button>

      {isOpen && <AgentChatPopup onClose={() => setIsOpen(false)} />}
    </>
  );
}
