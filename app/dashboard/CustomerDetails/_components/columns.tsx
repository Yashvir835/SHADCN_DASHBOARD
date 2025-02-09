"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteCustomer } from "@/lib/firebase" // Function to delete the customer
import { useBusinessContext } from "@/app/context/BusinessContext"
import { useUser } from "@clerk/nextjs"

export interface Customer {
  id: string
  firstName: string
  lastName: string
  phoneNumber: string
  email?: string
  createdAt: string
}
// const selectedBusiness = sessionStorage.getItem("selectedBusiness");

export const columns = (onRefresh: () => void): ColumnDef<Customer>[] => [
  
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          First Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("firstName")}</div>,
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    cell: ({ row }) => <div>{row.getValue("lastName")}</div>,
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => <div>{row.getValue("phoneNumber")}</div>,
  },
  // {
  //   accessorKey: "email",
  //   header: "Email",
  //   cell: ({ row }) => <div>{row.getValue("email") || "N/A"}</div>,
  // },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("createdAt")}</div>,
  },
  {
    accessorKey: "Actions",
    cell: ({ row }) => {
      const customer = row.original
      const { selectedBusiness } = useBusinessContext()
      const { user } = useUser()

      return (
        
        <div className="flex space-x-4">
          <Button
            variant="destructive"
            size="sm"
            onClick={async () => {

              if (user && selectedBusiness) {
                
                await deleteCustomer(user.id, selectedBusiness, customer.id)
                onRefresh() // Trigger refresh function after deletion
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
]
