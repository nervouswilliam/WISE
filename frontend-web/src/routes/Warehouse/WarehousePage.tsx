import { transactions, TransactionColumns } from "./TransactionColumn"
import { TableHelper } from "../helper/TableHelper"
import { apiService } from "../api"
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

async function getData(): Promise<transactions[]> {
  // Fetch data from your API here.
  try{
    const response = await apiService.get<transactions[]>("transactions/list");
    const errorCode = response?.error_schema.error_code;
    const outputSchema = response.output_schema;
    if(errorCode === "S001"){
      return outputSchema;
    }
    return [];
  } catch {
    console.error("Error Fetching Transactions");
    return [];
  }
}

export default function WarehousePage() {
  // const data = await getData()
  const [data, setData] = useState<transactions[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getData()
      .then(transaction => {
        setData(transaction);
      })
      .catch(
        error => {
        console.error("Failed to fetch products:", error);
        navigate("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // Empty dependency array means this only runs once on mount

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Typography 
          variant="h4" 
          component="div" 
          sx={{ 
            fontWeight: "bold",
            margin: 0,
            padding: 2,
            lineHeight: 1,
            fontFamily: "inherit", // This will inherit from your CSS
          }}
      >
        Warehouse
      </Typography>
      <Button className="!text-white !bg-[#7142B0]" onClick={() => navigate("/product/add")}>
        <Plus className="w-5 h-5" />
            Add Products
      </Button>
      <div className="container mx-auto py-10">
        {data.length === 0 ? (
            <p className="text-center text-gray-500 mt-2">No transactions available.</p>
        ) : (
            <TableHelper columns={TransactionColumns} data={data} />
        )}
      </div>
    </div>
  )
}