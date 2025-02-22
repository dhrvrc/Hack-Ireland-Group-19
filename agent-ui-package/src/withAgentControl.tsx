import React, { useEffect, useRef, forwardRef, RefObject, ComponentType, PropsWithChildren } from "react";
import { useAgentStore } from "@/stores/agentStore";

export interface AgentControlProps {
  controlId: string;
  onUniversalClick?: () => void;
  onUniversalInput?: (value: string) => void;
  context?: string;
  "data-hovered"?: boolean;
  className?: string;
}

export function withAgentControl<P extends Record<string, any>>(
  WrappedComponent: ComponentType<PropsWithChildren<P>>
) {
  type CombinedProps = AgentControlProps & PropsWithChildren<P>;

  return forwardRef<any, CombinedProps>((props) => {
    const { controlId, onUniversalClick, onUniversalInput, context, ...rest } = props;
    const elementRef = useRef<HTMLElement>(null);

    const componentState = useAgentStore((state) => state.components[controlId]?.state);

    const handleClick = () => {
      useAgentStore.getState().triggerInteraction(controlId, "click");
      onUniversalClick?.();
    };

    useEffect(() => {
      if (elementRef.current) {
        useAgentStore.getState().registerComponent(
          controlId,
          elementRef as RefObject<HTMLElement>,
          {
            click: onUniversalClick,
            input: onUniversalInput,
          },
          context
        );

        useAgentStore.getState().updatePosition(controlId);

        return () => {
          useAgentStore.getState().unregisterComponent(controlId);
        };
      }
    }, [controlId, onUniversalClick, onUniversalInput, context]);

    return (
      <WrappedComponent
        ref={elementRef}
        onClick={handleClick}
        data-hovered={componentState?.isHovered}
        {...(rest as unknown as PropsWithChildren<P>)}
      />
    );
  });
}
