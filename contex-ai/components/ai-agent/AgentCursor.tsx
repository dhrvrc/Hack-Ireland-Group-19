// src/components/agent/AgentCursor.tsx
"use client";

import React from "react";
import { useAgentStore } from "@/hooks/AgentControlStore";

/**
 * A simple "dot" that is absolutely positioned
 * at the (x,y) from the agent store's "cursor".
 */
export function AgentCursor() {
  const { x, y } = useAgentStore((s) => s.cursor);

  return (
    <div
      style={{
        position: "fixed",
        left: x,
        top: y,
        width: 20,
        height: 20,
        backgroundColor: "rgba(255, 0, 0, 0.7)",
        borderRadius: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 9999, // on top of everything
        // optional transition if you want smoother movement
        // transition: 'left 0.1s, top 0.1s'
      }}
    />
  );
}
