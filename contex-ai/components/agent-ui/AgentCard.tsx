import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
  } from "@/components/ui/card";
  import { AgentControlled } from "@/components/agent-ui/AgentController";
  
  export const AgentCard = AgentControlled(Card);
  export const AgentCardHeader = CardHeader;
  export const AgentCardContent = CardContent;
  export const AgentCardFooter = CardFooter;
  export const AgentCardTitle = AgentControlled(CardTitle);
  export const AgentCardDescription = AgentControlled(CardDescription);