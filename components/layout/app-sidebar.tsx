'use client'
import { useState } from 'react';
import Link from "next/link";
import { ChevronRight } from 'lucide-react';
import { Navitems, iconMap } from "@/constants/home";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarHeader } from './SidebarHeader';
import { SidebarFooter } from './SidebarFooter';
import { useBusinessContext } from "@/app/context/BusinessContext";

export function AppSidebar() {
  const { selectedBusiness } = useBusinessContext();


  return (
    <Sidebar className="bg-off-white w-[275px]" variant="sidebar" collapsible="icon">
      <SidebarHeader />
      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm mb-2">
            {selectedBusiness ? `${selectedBusiness} Overview` : "Overview"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Navitems.map((item) => (
                <SidebarMenuItem key={item.title} className="hover:bg-light-beige hover:text-darker-beige">
                  {item.title === "Account" ? (
                    <Collapsible defaultOpen className="group/collapsible">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton asChild>
                          <div className="flex items-center gap-2 hover:text-black cursor-pointer">
                            <span className="text-lg">{iconMap[item.icon]}</span>
                            <span className="text-lg">{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                          </div>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <Link href={subItem.url} className="flex items-center gap-2 hover:text-black">
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
      <SidebarFooter />
    </Sidebar>
  );
}

