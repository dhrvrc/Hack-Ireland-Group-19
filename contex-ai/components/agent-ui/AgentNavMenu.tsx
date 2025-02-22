import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuContent,
    NavigationMenuTrigger,
    NavigationMenuLink,
    NavigationMenuIndicator,
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu"

  import { AgentControlled } from "@/components/agent-ui/AgentController"

export const AgentNavigationMenu = AgentControlled(NavigationMenu);
export const AgentNavigationMenuList = AgentControlled(NavigationMenuList);
export const AgentNavigationMenuItem = AgentControlled(NavigationMenuItem);
export const AgentNavigationMenuContent = AgentControlled(NavigationMenuContent);
export const AgentNavigationMenuTrigger = AgentControlled(NavigationMenuTrigger);
export const AgentNavigationMenuLink = AgentControlled(NavigationMenuLink);
export const AgentNavigationMenuIndicator = AgentControlled(NavigationMenuIndicator);
export const AgentNavigationMenuViewport = AgentControlled(NavigationMenuViewport);
