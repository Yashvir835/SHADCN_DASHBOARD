import Link from "next/link";
import { GalleryVerticalEnd, ChevronsUpDown, ChevronRight } from 'lucide-react';
import { Navitems, iconMap } from "@/constants/home";
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
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { VscAccount } from "react-icons/vsc";
import { HiOutlineInboxStack } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";

export const company = {
  name: 'Acme Inc',
  logo: GalleryVerticalEnd,
  plan: 'Enterprise',
};

export function AppSidebar() {
  return (
    <Sidebar className="bg-off-white w-[235px] " variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <div className="flex gap-2 py-2 ">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <company.logo className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{company.name}</span>
            <span className="truncate text-xs">{company.plan}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm mb-2">Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Navitems.map((item) => (
                <SidebarMenuItem key={item.title} className="hover:bg-light-beige hover:text-darker-beige">
                  {item.title === "Account" ? (
                    // This is for the Account Collapsable Content
                    <Collapsible defaultOpen className="group/collapsible">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton asChild>
                          <div className="flex items-center gap-2 hover:text-black cursor-pointer">
                            <span className="text-lg">{iconMap[item.icon]}</span>
                            <span className="text-lg">{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform  group-data-[state=open]/collapsible:rotate-90" />

                          </div>
                        </SidebarMenuButton>

                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title} >
                              <Link href={subItem.url} className="flex items-center gap-2 hover:text-black ">
                                <span className="text-lg">{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild>
                      <Link href={item.url as string} className="flex items-center gap-2 hover:text-black">
                        <span className="text-lg">{iconMap[item.icon]}</span>
                        <span className="text-lg">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-12">
                  <Avatar className="h-8 w-8 items-center  p-1 border-2  rounded-lg">
                    <AvatarImage src="/avatars/02.png" />
                    <AvatarFallback >JO</AvatarFallback>
                  </Avatar>
                  <span >
                    <span className="font-extrabold ">John</span>
                    <p>
                      demo@gmail.com
                    </p>
                  </span>
                  <ChevronsUpDown className="ml-auto" />

                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="flex items-center gap-2 min-w-[200px]">
                  <SidebarMenuButton className="h-12">
                    <Avatar className="h-8 w-8 items-center p-1 border-2 bg-stone-300 rounded-lg">
                      <AvatarImage src="/avatars/02.png" />
                      <AvatarFallback >JO</AvatarFallback>
                    </Avatar>
                    <span >
                      <span className="font-extrabold ">John</span>
                      <p>
                        demo@gmail.com
                      </p>
                    </span>
                  </SidebarMenuButton>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="h-0.5  my-4 bg-zinc-300" />

                <DropdownMenuItem className="text-xl">
                  <VscAccount style={{ width: "25px", height: "25px" }} />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xl">
                  <HiOutlineInboxStack style={{ width: "25px", height: "25px" }} />
                  Biling
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xl">
                  <IoIosNotificationsOutline style={{ width: "25px", height: "25px" }} />
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuSeparator className="h-0.5  my-4 bg-zinc-300" />
                <DropdownMenuItem className="text-xl">
                  <MdLogout style={{ width: "25px", height: "25px" }} />                 Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

    </Sidebar>
  );
}
