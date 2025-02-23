import { AgentControlled } from "./AgentController";
import { forwardRef } from "react";

interface AgentContextProps {
  controlId: string;
  context: string;
}

// Forward the ref to the div
const AgentContextBase = forwardRef<HTMLDivElement, AgentContextProps>(
  ({ context }, ref) => {
    return <div ref={ref} style={{ display: "none" }} data-context={context} />;
  }
);

export const AgentContext = AgentControlled(AgentContextBase);
