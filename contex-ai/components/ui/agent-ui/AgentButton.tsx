import { Button } from "@/components/ui/button";
import { AgentControlled } from "@/components/ui/agent-ui/AgentController";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface AgentButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  size?: "icon" | "default" | "sm" | "lg";
}

export const AgentButton = AgentControlled(
  forwardRef<HTMLButtonElement, AgentButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
      return (
        <Button
          ref={ref}
          className={cn(buttonVariants({ variant, size }), className)}
          {...props}
        />
      );
    }
  )
);