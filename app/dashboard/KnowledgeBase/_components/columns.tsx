"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Trash2, Download } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { deleteDocument } from "@/lib/firebase" // function to delete the documents
import { useBusinessContext } from "@/app/context/BusinessContext"
import { useUser } from "@clerk/nextjs"

export interface Document {
  id: string
  name: string
  url: string
  uploadDate: string
}

export const columns =(onRefresh:()=>void): ColumnDef<Document>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Document
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "uploadDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Upload Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("uploadDate")}</div>,
  },
  {
    accessorKey: "Actions",
    cell: ({ row }) => {
      const document = row.original
      const { selectedBusiness } = useBusinessContext()
      const { user } = useUser()

      return (
        <div className="flex space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(document.url, '_blank')}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={async () => {
              if (user && selectedBusiness) {
                await deleteDocument(user.id, selectedBusiness, document.name)
                onRefresh(); // Trigger onRefresh function


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

