"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface Business {
  id: string
  business: string
  description: string
  dateAdded: string
  documentUrl?: string | string[]
  imageUrl?: string
}

export const columns: ColumnDef<Business>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.getValue("imageUrl") as string | undefined
      return (
        <Avatar>
          <AvatarImage src={imageUrl} alt={row.getValue("business")} />
          <AvatarFallback>{(row.getValue("business") as string).charAt(0)}</AvatarFallback>
        </Avatar>
      )
    },
  },
  {
    accessorKey: "business",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Business
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("business")}</div>,
  },
  {
    accessorKey: "dateAdded",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Added
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("dateAdded")}</div>,
  },
  // {
  //   accessorKey: "description",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Description
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     )
  //   },
  //   cell: ({ row }) => <div>{row.getValue("description")}</div>,
  // },
  {
    accessorKey: "documentUrl",
    header: "Document",
    cell: ({ row }) => {
      const documentUrls = row.getValue("documentUrl") as string | string[] | undefined
      if (!documentUrls) return null

      if (typeof documentUrls === 'string') {
        return (
          <Button variant="link" onClick={() => window.open(documentUrls, '_blank')}>
            doc1
          </Button>
        )
      }

      return (
        <div className="flex flex-wrap gap-2">
          {documentUrls.map((url, index) => (
            <Button key={index} variant="link" onClick={() => window.open(url, '_blank')}>
              {`doc${index + 1}`}
            </Button>
          ))}
        </div>
      )
    },
  },
]

