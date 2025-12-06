import { Link, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import {
  Home,
  Newspaper,
  Search,
  Mail,
  User,
  ChevronsUpDown,
  LogOut,
  AlertCircle,
  HelpCircle,
  Send,
  Bell,
} from "lucide-react"
import { getHelpRequests } from "@/services/api"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const userMenuItems = [
  {
    title: "Home",
    icon: Home,
    url: "/user/dashboard",
  },
  {
    title: "Samachar",
    icon: Newspaper,
    url: "/user/samachar",
  },
  {
    title: "Lost & Found",
    icon: Search,
    url: "/user/lost-found",
  },
  {
    title: "Invitation",
    icon: Mail,
    url: "/user/invitation",
  },
  {
    title: "Help Requests",
    icon: Bell,
    url: "/user/help-requests",
    showNotification: true,
  },
]

const actionButtons = [
  {
    title: "Add Problem",
    icon: AlertCircle,
    url: "/user/add-problem",
    bgColor: "bg-red-500 hover:bg-red-600 text-white",
  },
  {
    title: "Ask Help",
    icon: HelpCircle,
    url: "/user/ask-help",
    bgColor: "bg-green-500 hover:bg-green-600 text-white",
  },
  {
    title: "Send Request",
    icon: Send,
    url: "/user/send-request",
    bgColor: "bg-blue-500 hover:bg-blue-600 text-white",
  },
]

export function UserSidebar() {
  const location = useLocation()
  const [pendingHelpRequestsCount, setPendingHelpRequestsCount] = useState(0)

  useEffect(() => {
    const fetchHelpRequestsCount = async () => {
      try {
        const data = await getHelpRequests()
        const pendingCount = (data || []).filter(r => r.status !== "resolved").length
        setPendingHelpRequestsCount(pendingCount)
      } catch (error) {
        console.error("Error fetching help requests count:", error)
        setPendingHelpRequestsCount(0)
      }
    }

    fetchHelpRequestsCount()
    // Refresh count every 30 seconds
    const interval = setInterval(fetchHelpRequestsCount, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">U</span>
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">User Dashboard</span>
            <span className="truncate text-xs text-muted-foreground">
              Community Portal
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userMenuItems.map((item) => {
                const Icon = item.icon
                const hasNotification = item.showNotification && pendingHelpRequestsCount > 0
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url || location.pathname.startsWith(item.url + "/")}
                    >
                      <Link to={item.url} className="relative">
                        <Icon />
                        <span>{item.title}</span>
                        {hasNotification && (
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                            {pendingHelpRequestsCount > 9 ? '9+' : pendingHelpRequestsCount}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {actionButtons.map((button) => {
                const Icon = button.icon
                return (
                  <SidebarMenuItem key={button.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === button.url || location.pathname.startsWith(button.url + "/")}
                      className={`${button.bgColor} border-0`}
                    >
                      <Link to={button.url}>
                        <Icon />
                        <span>{button.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/avatars/user.png" alt="User" />
                    <AvatarFallback className="rounded-lg">US</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">User Name</span>
                    <span className="truncate text-xs text-muted-foreground">
                      user@example.com
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src="/avatars/user.png" alt="User" />
                      <AvatarFallback className="rounded-lg">US</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">User Name</span>
                      <span className="truncate text-xs text-muted-foreground">
                        user@example.com
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/user/profile">
                    <User />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userProfile');
                    window.location.href = '/login';
                  }}
                >
                  <LogOut />
                  Log out
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

