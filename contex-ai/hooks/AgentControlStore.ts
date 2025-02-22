import { create } from 'zustand'
import type { RefObject } from 'react'

interface ComponentState {
  isHovered: boolean
  isPressed: boolean
}

interface ComponentData {
  state: ComponentState
  position: { x: number; y: number; width: number; height: number } | null
  handlers: {
    onClick?: () => void
    onInput?: (value: string) => void
  }
  ref: RefObject<HTMLElement>
  context?: string
}

interface AgentStore {
  components: Record<string, ComponentData>
  register: (
    id: string,
    ref: RefObject<HTMLElement>,
    handlers: ComponentData['handlers'],
    context?: string
  ) => void
  unregister: (id: string) => void
  updatePos: (id: string) => void
  trigger: (id: string, event: 'click' | 'hover') => void
}

export const useAgentStore = create<AgentStore>((set, get) => ({
  components: {},

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
    }))
    get().updatePos(id)
  },

  unregister: (id) => {
    set((state) => {
      const updated = { ...state.components }
      delete updated[id]
      return { components: updated }
    })
  },

  updatePos: (id) => {
    const comp = get().components[id]
    if (comp?.ref.current) {
      const rect = comp.ref.current.getBoundingClientRect()
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
      }))
    }
  },

  trigger: (id, event) => {
    const comp = get().components[id]
    if (event === 'click' && comp?.handlers.onClick) {
      comp.handlers.onClick()
    }
    set((state) => ({
      components: {
        ...state.components,
        [id]: {
          ...state.components[id],
          state: {
            isPressed: event === 'click',
            isHovered: event === 'hover',
          },
        },
      },
    }))
  },
}))
