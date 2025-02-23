// src/components/agent/AgentController.tsx
import {
  useEffect,
  useRef,
  forwardRef,
  RefObject,
  ComponentType,
  PropsWithChildren,
  RefCallback,
} from "react";
import { useAgentStore } from "@/hooks/AgentControlStore";

export interface AgentControlProps {
  controlId: string;
  onUniversalClick?: () => void;
  onUniversalInput?: (value: string) => void;
  context?: string;
  className?: string;
}

// Merges multiple refs into one
function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]): RefCallback<T> {
  return (value: T) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref && "current" in ref) {
        (ref as React.MutableRefObject<T>).current = value;
      }
    });
  };
}

// HOC that "registers" a component with our Agent store
export function AgentControlled<P extends Record<string, any>>(
  WrappedComponent: ComponentType<PropsWithChildren<P>>
) {
  type CombinedProps = AgentControlProps & PropsWithChildren<P>;

  return forwardRef<any, CombinedProps>((props, ref) => {
    const { controlId, onUniversalClick, onUniversalInput, context, ...rest } =
      props;

    const localRef = useRef<HTMLElement>(null);
    const combinedRef = mergeRefs(ref, localRef);

    const componentState = useAgentStore(
      (state) => state.components[controlId]?.state
    );

    const handleClick = () => {
      useAgentStore.getState().trigger(controlId, "click");
      onUniversalClick?.();
    };

    // Register with the store on mount
    useEffect(() => {
      if (localRef.current) {
        useAgentStore.getState().register(
          controlId,
          localRef as RefObject<HTMLElement>,
          {
            onClick: onUniversalClick,
            onInput: onUniversalInput,
          },
          context
        );
        // Update position once on mount
        useAgentStore.getState().updatePos(controlId);

        return () => {
          useAgentStore.getState().unregister(controlId);
        };
      }
    }, [controlId, onUniversalClick, onUniversalInput, context]);

    return (
      <WrappedComponent
        ref={combinedRef}
        onClick={handleClick}
        data-hovered={componentState?.isHovered}
        {...(rest as unknown as PropsWithChildren<P>)}
      />
    );
  });
}
