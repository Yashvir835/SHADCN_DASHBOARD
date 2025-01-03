"use client"
import Link from "next/link"
import * as React from "react"
import { Check, ChevronsUpDown,Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

const items = [
  {
    title: 'Dashboard',
    url: "/",
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [],
  },
  {
    title: 'Employee',
    url: '/dashboard/employee',
    icon: 'user',
    shortcut: ['e', 'e'],
    isActive: false,
    items: [],
  },
  {
    title: 'Product',
    url: '/dashboard/product',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [],
  },
  {
    title: 'Profile',
    url: '/dashboard/profile',
    icon: 'usePen',
    shortcut: ['m', 'm'],
    isActive: false,
    items: [],
  },
  {
    title: 'Login',
    url: '/dashboard/login',
    icon: 'login',
    shortcut: ['l', 'l'],
    isActive: false,
    items: [],
  },
  
  //  {
  //   title: 'Kanban',
  //   url: '/dashboard/kanban',
  //   icon: 'kanban',
  //   shortcut: ['k', 'k'],
  //   isActive: false,
  //   items: [],
  // },
];

export function ComboboxDemo() {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        handleClose()
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDropdownOpen])

  const handleClose = () => {
    setIsDropdownOpen(false)
  }

  return (
    <div className="hidden md:block ">
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={isDropdownOpen}
        className="w-[200px] justify-between"
        onClick={() => setIsDropdownOpen(true)}
      >
        {value ? items.find((item) => item.url === value)?.title : "🔍 Search..."}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
      {isDropdownOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className=" p-6 rounded-lg  w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2" ref={dropdownRef}>
            <Command>
              <CommandInput placeholder="Type a command or Search..." />
              <CommandList>
                <CommandEmpty>No item found.</CommandEmpty>
                <CommandGroup>
                  {items.map((item) => (
                    <CommandItem
                      key={item.url}
                      value={item.url}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue)
                        handleClose()
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === item.url ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <Link href={item.url} className="flex items-center gap-2 hover:text-black w-full">
                        <span className="font-normal text-xl flex-grow">{item.title}</span>
                        <span className="text-lg text-gray-500">
                          {item.shortcut ? item.shortcut.join(', ') : 'No shortcut'}
                        </span>
                      </Link>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
            <Button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
