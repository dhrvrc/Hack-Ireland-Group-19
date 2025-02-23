// src/hooks/AgentControlStore.ts
import { create } from "zustand";
import type { RefObject } from "react";

/**
 * Each component has a state (hovered/pressed),
 * a bounding-box position, event handlers, and an optional "context" string.
 */
interface ComponentState {
  isHovered: boolean;
  isPressed: boolean;
}

interface ComponentData {
  state: ComponentState;
  position: { x: number; y: number; width: number; height: number } | null;
  handlers: {
    onClick?: () => void;
    onInput?: (value: string) => void;
  };
  ref: RefObject<HTMLElement>;
  context?: string;
}

/**
 * Actions the AI agent can perform:
 *  - click / hover a registered element
 *  - type into an input
 *  - navigate to a URL
 */
export interface AgentAction {
  type: "click" | "hover" | "type" | "navigate";
  targetId: string; // must match the "controlId" used in AgentController
  text?: string; // used for "type" actions
  navigateUrl?: string; // used for "navigate" actions
}

/**
 * Our Zustand store interface.
 * Includes both the "registry" of agent-controlled components
 * and the queue of actions to be executed by the agent.
 */
interface AgentStore {
  // 1) Registry of "agent-controlled" components
  components: Record<string, ComponentData>;

  // 2) Agent cursor
  cursor: { x: number; y: number };

  // 3) Queue of agent actions
  actions: AgentAction[];
  isExecuting: boolean;

  // -- Methods --

  // Register/unregister an element so the agent can manipulate it
  register: (
    id: string,
    ref: RefObject<HTMLElement>,
    handlers: ComponentData["handlers"],
    context?: string
  ) => void;
  unregister: (id: string) => void;

  // Update the bounding box position of a component
  updatePos: (id: string) => void;

  // Directly trigger a "click" or "hover" event on a component
  trigger: (id: string, event: "click" | "hover") => void;

  // Add actions to the queue
  queueActions: (newActions: AgentAction[]) => void;
  // Pop the next action from the queue and process it
  runNextAction: () => Promise<void>;
  // Sets isExecuting to start/stop execution
  setExecuting: (val: boolean) => void;

  // Move the cursor from its current location to (targetX,targetY)
  moveCursor: (targetX: number, targetY: number) => Promise<void>;
}

export const useAgentStore = create<AgentStore>((set, get) => ({
  // Initial state
  components: {},
  cursor: { x: 100, y: 100 },
  actions: [],
  isExecuting: false,

  // Register a component in the store
  register: (id, ref, handlers, context) => {
    set((state) => ({
      components: {
        ...state.components,
        [id]: {
          state: { isHovered: false, isPressed: false },
          position: null,
          handlers,
          ref,
          context,
        },
      },
    }));
    // Immediately calculate the component's position
    get().updatePos(id);
  },

  // Remove a component from the store
  unregister: (id) => {
    set((state) => {
      const updated = { ...state.components };
      delete updated[id];
      return { components: updated };
    });
  },

  // Update bounding box
  updatePos: (id) => {
    const comp = get().components[id];
    if (comp?.ref.current) {
      const rect = comp.ref.current.getBoundingClientRect();
      set((state) => ({
        components: {
          ...state.components,
          [id]: {
            ...state.components[id],
            position: {
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2,
              width: rect.width,
              height: rect.height,
            },
          },
        },
      }));
    }
  },

  // Trigger a click or hover event
  trigger: (id, event) => {
    const comp = get().components[id];
    if (comp) {
      if (event === "click" && comp.handlers.onClick) {
        comp.handlers.onClick();
      }
      // update the store's "pressed"/"hovered" state
      set((state) => ({
        components: {
          ...state.components,
          [id]: {
            ...comp,
            state: {
              isPressed: event === "click",
              isHovered: event === "hover",
            },
          },
        },
      }));
    }
  },

  // Append new actions to the queue
  queueActions: (newActions) => {
    set((state) => ({
      actions: [...state.actions, ...newActions],
    }));
  },

  // Indicate whether the agent is currently "executing" the queue
  setExecuting: (val) => {
    set({ isExecuting: val });
  },

  // Move the cursor with a simple "stepped" animation
  moveCursor: async (targetX, targetY) => {
    return new Promise<void>((resolve) => {
      const steps = 20;
      let currentStep = 0;
      const start = get().cursor;
      const dx = (targetX - start.x) / steps;
      const dy = (targetY - start.y) / steps;

      const interval = setInterval(() => {
        currentStep++;
        set((state) => ({
          cursor: {
            x: state.cursor.x + dx,
            y: state.cursor.y + dy,
          },
        }));

        if (currentStep === steps) {
          clearInterval(interval);
          resolve();
        }
      }, 25); // ~ 25ms per step => ~ 0.5s total
    });
  },

  // Execute the next action in the queue
  runNextAction: async () => {
    const { actions } = get();
    if (!actions.length) return;

    const nextAction = actions[0];
    // remove the first action from the queue
    set({ actions: actions.slice(1) });

    // find the target comp
    const comp = get().components[nextAction.targetId];

    if (comp && comp.position) {
      const { x, y } = comp.position;

      // move cursor first
      await get().moveCursor(x, y);

      // now perform the specified action
      switch (nextAction.type) {
        case "click":
          get().trigger(nextAction.targetId, "click");
          break;

        case "hover":
          get().trigger(nextAction.targetId, "hover");
          break;

        case "type":
          if (comp.handlers?.onInput && nextAction.text) {
            // call onInput handler
            comp.handlers.onInput(nextAction.text);
          }
          break;

        case "navigate":
          // up to you to implement actual navigation
          // e.g. router.push(nextAction.navigateUrl)
          // or window.location.href = nextAction.navigateUrl
          console.log("Navigating to: ", nextAction.navigateUrl);
          break;
      }
    }

    // If there are still actions left, keep going
    if (get().actions.length) {
      // small pause before next action
      await new Promise((r) => setTimeout(r, 300));
      await get().runNextAction();
    } else {
      // queue is done
      get().setExecuting(false);
    }
  },
}));
