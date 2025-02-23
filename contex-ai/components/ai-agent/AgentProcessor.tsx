// src/components/agent/AgentBrain.tsx
"use client";

import { useEffect } from "react";
import { useAgentStore } from "@/hooks/AgentControlStore";

/**
 * The "Brain" automatically starts executing actions
 * whenever there's something in the queue and we're not already executing.
 */
export function AgentProcessor() {
  const actions = useAgentStore((s) => s.actions);
  const isExecuting = useAgentStore((s) => s.isExecuting);
  const runNextAction = useAgentStore((s) => s.runNextAction);
  const setExecuting = useAgentStore((s) => s.setExecuting);

  useEffect(() => {
    if (actions.length > 0 && !isExecuting) {
      // start the process
      setExecuting(true);
      runNextAction();
    }
    // We re-run whenever `actions.length` or `isExecuting` changes
  }, [actions, isExecuting, setExecuting, runNextAction]);

  // This component doesn't render anything visible
  return null;
}
