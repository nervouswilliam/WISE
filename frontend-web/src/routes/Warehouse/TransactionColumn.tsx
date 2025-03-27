"use client"
 
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, CheckCircle2Icon, LoaderIcon, MoreHorizontal, Package, RefreshCcw, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export type transactions = {
    id: string,
    product_id: string,
    product_name: string,
    price_per_unit: number,
    quantity: number,
    total_price: number,
    transaction_type: "sale" | "restock" | "adjustment" | "procurement",
    reason: string;
}

function ActionCell({ transaction }: { transaction: transactions }) {
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
                onClick={() => navigator.clipboard.writeText(transaction.id)}
              >
                Copy Product ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate(`/transaction/${transaction.id}`)}>
                    View Transaction
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate(`/product/${transaction.id}`)}>
                    View Product
              </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const getTransactionIcon = (type: string) => {
    switch (type) {
      case "sale":
        return <CheckCircle2Icon className="text-green-500 dark:text-green-400" />;
      case "restock":
        return <RefreshCcw className="text-blue-500 dark:text-blue-400" />;
      case "adjustment":
        return <Settings className="text-yellow-500 dark:text-yellow-400" />;
      case "procurement":
        return <Package className="text-purple-500 dark:text-purple-400" />;
    }
  };

export const TransactionColumns : ColumnDef<transactions>[] = [
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
        accessorKey: "product_id",
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="!text-white !bg-[#7142B0]"
              >
                Product ID
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
        },
    },
    {
        accessorKey: "product_name",
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="!text-white !bg-[#7142B0]"
              >
                Product Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
        },
    },
    {
        accessorKey: "price_per_unit",
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="!text-white !bg-[#7142B0]"
              >
                Price Per Unit
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
        accessorKey: "quantity",
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="!text-white !bg-[#7142B0]"
              >
                Quantity
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
        },
    },
    {
        accessorKey: "total_price",
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="!text-white !bg-[#7142B0]"
              >
                Total Price
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
        accessorKey: "transaction_type",
        header: "transaction type",
        cell: ({ row }) => (
            <Badge
              variant="outline"
              className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
            >
              {getTransactionIcon(row.original.transaction_type)}
            </Badge>
          ),
    },
    {
        header: "actions",
        id: "actions",
        cell: ({ row }) => <ActionCell transaction={row.original} />
      }
]