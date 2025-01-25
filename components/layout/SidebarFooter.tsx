import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { ChevronsUpDown } from 'lucide-react';
import { VscAccount } from "react-icons/vsc";
import { HiOutlineInboxStack } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdLogout } from "react-icons/md";

export function SidebarFooter() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="h-12">
              <Avatar className="h-8 w-8 items-center p-1 border-2 rounded-lg">
                <AvatarImage src="/avatars/02.png" />
                <AvatarFallback>JO</AvatarFallback>
              </Avatar>
              <span>
                <span className="font-extrabold">John</span>
                <p>demo@gmail.com</p>
              </span>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="flex items-center gap-2 min-w-[200px]">
              <SidebarMenuButton className="h-12">
                <Avatar className="h-8 w-8 items-center p-1 border-2 bg-stone-300 rounded-lg">
                  <AvatarImage src="/avatars/02.png" />
                  <AvatarFallback>JO</AvatarFallback>
                </Avatar>
                <span>
                  <span className="font-extrabold">John</span>
                  <p>demo@gmail.com</p>
                </span>
              </SidebarMenuButton>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="h-0.5 my-4 bg-zinc-300" />
            <DropdownMenuItem className="text-xl">
              <VscAccount style={{ width: "25px", height: "25px" }} />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xl">
              <HiOutlineInboxStack style={{ width: "25px", height: "25px" }} />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xl">
              <IoIosNotificationsOutline style={{ width: "25px", height: "25px" }} />
              Notifications
            </DropdownMenuItem>
            <DropdownMenuSeparator className="h-0.5 my-4 bg-zinc-300" />
            <DropdownMenuItem className="text-xl">
              <MdLogout style={{ width: "25px", height: "25px" }} />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

