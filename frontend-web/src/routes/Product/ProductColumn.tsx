"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Product = {
  id: string
  name: string,
  price: number,
  stock: number,
  category_name: string,
  image_url: string;
  public_id: string;
}

function ActionCell({ product }: { product: Product }) {
    const navigate = useNavigate();
    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 !text-white !bg-[#7142B0]">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(product.id)}
              >
                Copy Product ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate(`/product/${product.id}`)}>
                    View Product
              </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const ProductColumn: ColumnDef<Product>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")
            }
            className="!text-white !bg-[#7142B0]"
          >
            ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")
            }
            className="!text-white !bg-[#7142B0]"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")
            }
            className="!text-white !bg-[#7142B0]"
          >
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(price)
 
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")
            }
            className="!text-white !bg-[#7142B0]"
          >
            Stock
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
    },
  },
  {
    accessorKey: "category_name",
    header: "Category",
  },

  {
    header: "actions",
    id: "actions",
    cell: ({ row }) => <ActionCell product={row.original} />
  }
]
