
import { TooltipProvider } from "@/components/ui/tooltip"

export { useSidebar, SidebarProvider } from "./sidebar-context"
export { Sidebar } from "./sidebar"
export { 
  SidebarTrigger, 
  SidebarToggleButton,  // Renamed from SidebarMenuButton to fix duplicate export
  SidebarRail, 
  SidebarInset 
} from "./sidebar-controls"
export { 
  SidebarInput, 
  SidebarHeader, 
  SidebarFooter, 
  SidebarSeparator, 
  SidebarContent 
} from "./sidebar-structure"
export { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupAction, 
  SidebarGroupContent 
} from "./sidebar-group"
export { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,  // Keep this one as SidebarMenuButton
  SidebarMenuAction, 
  SidebarMenuBadge,
  sidebarMenuButtonVariants
} from "./sidebar-menu"
export {
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from "./sidebar-submenu"
export { SidebarMenuSkeleton } from "./sidebar-skeleton"

// Re-export TooltipProvider since it's used in the sidebar
export { TooltipProvider }
