import {
    useEffect,
    useRef,
    forwardRef,
    RefObject,
    ComponentType,
    PropsWithChildren,
  } from "react";
  import { useAgentStore } from "@/hooks/AgentControlStore";
  
  // Props that the HOC needs
  export interface AgentControlProps {
    controlId: string;
    onUniversalClick?: () => void;
    onUniversalInput?: (value: string) => void;
    context?: string;
    "data-hovered"?: boolean;
    className?: string;
  }
  
  // Use Record<string, any> to allow any additional props
  export function AgentControlled<P extends Record<string, any>>(
    WrappedComponent: ComponentType<PropsWithChildren<P>>
  ) {
    type CombinedProps = AgentControlProps & PropsWithChildren<P>;
  
    return forwardRef<any, CombinedProps>((props) => {
      const { controlId, onUniversalClick, onUniversalInput, context, ...rest } =
        props;
      const elementRef = useRef<HTMLElement>(null);
  
      // Add state subscription
      const componentState = useAgentStore(
        (state) => state.components[controlId]?.state
      );
  
      // Add click handler
      const handleClick = () => {
        useAgentStore.getState().trigger(controlId, "click");
        onUniversalClick?.();
      };
  
      useEffect(() => {
        if (elementRef.current) {
          useAgentStore.getState().register(
            controlId,
            elementRef as RefObject<HTMLElement>,
            {
              onClick: onUniversalClick,
              onInput: onUniversalInput,
            },
            context
          );
  
          // Update position on mount
          useAgentStore.getState().updatePos(controlId);
  
          return () => {
            useAgentStore.getState().unregister(controlId);
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