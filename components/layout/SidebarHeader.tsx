"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { GalleryVerticalEnd, ChevronsUpDown, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { fetchBusinesses } from "@/lib/firebase";
import { useUser } from "@clerk/nextjs";
import { SidebarMenuButton, useSidebar } from "../ui/sidebar";
import { useBusinessContext } from "@/app/context/BusinessContext";
import Link from "next/link";

// Company information object
export const company = {
  name: "Nexus Beings",
  logo: GalleryVerticalEnd,
  plan: " ",
};


export function SidebarHeader() {
  // State variables
  const { selectedBusiness, setSelectedBusiness } = useBusinessContext();

  const router = useRouter();

  const [businesses, setBusinesses] = useState<string[]>([]);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertContent, setAlertContent] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Hooks
  const { user } = useUser();
  const { isMobile } = useSidebar();

  // this is used to persist the refresh of the browser so that user doesn't have to select the bussiness again after refresh
  useEffect(() => {
    const savedBusiness = sessionStorage.getItem("selectedBusiness");
    if (savedBusiness) {
      setSelectedBusiness(savedBusiness);
    }
  }, [setSelectedBusiness]);


  // Load businesses when the user changes
  useEffect(() => {
    const loadBusinesses = async () => {
      if (user) {
        setLoading(true);
        try {
          const fetchedBusinesses = await fetchBusinesses(user.id);
          setBusinesses(fetchedBusinesses);
        } catch (error) {
          console.error("Failed to fetch businesses:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadBusinesses();
  }, [user]);

  // Function to handle business selection
  const handleBusinessSelect = (business: string) => {
    setSelectedBusiness(business);
    setDropdownOpen(false); // Close dropdown after selection
    sessionStorage.setItem("selectedBusiness", business); // Save to localStorage
  };

  // Function to show alert dialog
  const showAlertDialog = (title: string, description: string) => {
    setAlertContent({ title, description });
    setAlertDialogOpen(true);


  };

  // Function to handle alert dialog close
  const handleAlertClose = () => {
    setAlertDialogOpen(false);
  };

  return (
    <div className="flex gap-2 py-2">
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <company.logo className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{company.name}</span>
              <span className="truncate text-xs">{company.plan}</span>
              <span className="truncate text-sm text-muted-foreground">
                {/* {selectedBusiness} */}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          align="start"
          side={isMobile ? "bottom" : "right"}
          sideOffset={4}
        >
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            {loading ? "Loading businesses..." : "Select a Business"}
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            {businesses.length > 0 ? (
              businesses.map((business) => (
                <DropdownMenuItem
                  key={business}
                  onSelect={(event) => {
                    event.preventDefault();
                    handleBusinessSelect(business);
                  }}
                >
                  {business}
                </DropdownMenuItem>
              ))
            ) : (
              !loading && <DropdownMenuItem disabled>No businesses available</DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
          // onClick={() => {
          //   router.push("/dashboard/AddBusiness"); 
          //   // Perform client-side navigation and redirect to the add bussiness page
          // }}
          >
            <Link href='/dashboard/AddBusiness'>
              <div className="flex items-center gap-2">
                <Plus className="size-4" />
                <span>Add Business</span>
              </div>
            </Link>
          
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={alertDialogOpen} onOpenChange={handleAlertClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertContent.title}</AlertDialogTitle>
            <AlertDialogDescription>{alertContent.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleAlertClose}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}