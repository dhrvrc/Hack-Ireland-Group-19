import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { AgentControlled } from "@/components/ui/agent-ui/AgentController";

export const AgentSelect = AgentControlled(Select);
export const AgentSelectContent = AgentControlled(SelectContent);
export const AgentSelectItem = AgentControlled(SelectItem as any);
export const AgentSelectTrigger = AgentControlled(SelectTrigger);
export const AgentSelectValue = AgentControlled(SelectValue);
