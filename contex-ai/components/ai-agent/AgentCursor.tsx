"use client";

import React from "react";
import { useAgentStore } from "@/hooks/AgentControlStore";
import { Pointer } from 'lucide-react';

export function AgentCursor() {
  const { x, y } = useAgentStore((s) => s.cursor);

  return (
    <div
      style={{
        position: "fixed",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 9999,
        transition: 'left 0.1s ease-out, top 0.1s ease-out', // smooth movement
      }}
    >
      <Pointer 
        size={24}  // adjust size as needed
        color="white"  // adjust color as needed
        strokeWidth={1.5}  // adjust stroke thickness as needed
        fill="rgba(255, 255, 255, 0.1)"  // optional: adds a slight fill
      />
    </div>
  );
}