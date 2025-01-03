"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MdOutlineNavigateNext } from "react-icons/md"
import { GrFormPrevious } from "react-icons/gr"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
    ColumnDef,
    flexRender,
    ColumnFiltersState,
    SortingState,
    getPaginationRowModel,
    getCoreRowModel,
    VisibilityState,
    getSortedRowModel,
    useReactTable,
    getFilteredRowModel,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ScrollBar } from "@/components/ui/scroll-area"

import { Filter, X } from 'lucide-react'

// Define the props interface for the DataTable component
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

// Main DataTable component
export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    // State hooks for managing table state
    const [sorting, setSorting] = React.useState<SortingState>([])
    // const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    // Initialize the table instance
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        // onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            // columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    // Function to get unique values for a given column
    const getUniqueValues = (columnId: string) => {
        const uniqueValues = new Set<string>()
        data.forEach((row: any) => {
            uniqueValues.add(row[columnId])
        })
        return Array.from(uniqueValues)
    }

    // Function to clear all active filters
    const clearAllFilters = () => {
        table.getAllColumns().forEach((column) => {
            if (column.getCanFilter()) {
                column.setFilterValue(undefined)
            }
        })
    }

    // Get all columns with active filters
    const activeFilters = table.getAllColumns().filter(column => column.getFilterValue() != null)

    return (
        <div>
            {/* Table controls section */}
            <div className="flex flex-col md:flex-row items-center py-4 space-y-4 md:space-y-0 md:space-x-4">
                {/* Product name filter input */}
                {/* <Input
                    placeholder="Filter by Product name..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="w-full md:max-w-sm"
                /> */}
                {/* Column visibility dropdown */}
                {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full md:w-auto">
                            Select Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu> */}
                {/* Filter dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full md:w-auto">
                            <Filter className="mr-2 h-4 w-4" />
                            Filter
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        {['category'].map((columnId) => (
                            <DropdownMenuSub key={columnId}>
                                <DropdownMenuSubTrigger className="capitalize">
                                    {columnId}
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                    {getUniqueValues(columnId).map((value) => (
                                        <DropdownMenuItem
                                            key={value}
                                            onClick={() => table.getColumn(columnId)?.setFilterValue(value)}
                                        >
                                            {value}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                {/* Clear filters button (only shown when filters are active) */}
                {activeFilters.length > 0 && (
                    <Button
                        variant="outline"
                        onClick={clearAllFilters}
                        className="w-full md:w-auto"
                    >
                        <X className="mr-2 h-4 w-4" />
                        Clear Filters
                    </Button>
                )}
            </div>
            {/* Active filters display */}
            {activeFilters.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {activeFilters.map((column) => {
                        const filterValue = column.getFilterValue()
                        return (
                            <div key={column.id} className="flex items-center gap-1 bg-muted text-muted-foreground px-2 py-1 rounded-md">
                                <span className="text-sm font-medium capitalize">{column.id}: {filterValue as string}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto p-0 text-muted-foreground hover:text-foreground"
                                    onClick={() => column.setFilterValue(undefined)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )
                    })}
                </div>
            )}
            {/* Table content */}
            <ScrollArea className="md:h-[calc(100dvh-200px)] lg:h-[calc(100dvh-375px)] xl:h-[calc(100dvh-440px)] 
      xl:w-auto lg:w-[calc(100dvw-10px)] sm:w-[calc(100dvw-20px)] 
      rounded-md border p-2 md:p-4 overflow-auto">
                <div className="rounded-md border  p-4 md:px-6">
                    <Table>
                        {/* Table header */}
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        {/* Table body */}
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <ScrollBar orientation="horizontal" />
                <ScrollBar orientation="vertical" />
            </ScrollArea>
            {/* Pagination controls */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    Selected {" "}
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) entries.
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <GrFormPrevious />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <MdOutlineNavigateNext />
                </Button>
            </div>
        </div>
    )
}

