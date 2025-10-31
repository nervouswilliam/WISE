import React, { useEffect, useState } from "react";
import { Button, Box } from "@mui/material";
import DynamicTable from "../components/DynamicTable";
import productService from "../services/productService";
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import Add from "@mui/icons-material/Add";
import { supabase } from "../supabaseClient";

function WarehousePage({ user }) {
    const [product, setProduct] = useState([])
    const navigate = useNavigate()
    const user_id = user.id;
    const handleGetProductList = async () => {
        try{
            const data = await productService.getProductList(user_id)
            setProduct(data)
        } catch(err){
            console.error("Error fetching product data: ", err)
        }
    }

    useEffect(() => {
        handleGetProductList()
    }, [])

    const handleClick = (row) =>{
        navigate(`/product/${row.id}`);
    }

    const handleAddProducts = () =>{
        navigate(`/product/add`);
    }

    return(
        <>
            <Box
                sx={{
                    display: 'flex',            // Enable Flexbox
                    justifyContent: 'flex-end', // Align items to the right
                    width: '100%',              // Optional: Ensure the container spans the full width
                    mb: 2                       // Optional: Add some bottom margin
                }}
            >
                <Button
                    sx={{
                        backgroundColor: "#6f42c1",
                        color: "white"
                    }}
                    onClick={() => handleAddProducts()}
                >
                    <AddIcon />
                    Add Product
                </Button>
            </Box>
            <DynamicTable
                columns={[
                    { field: "id", label: "Product Id", sortable: true },
                    { field: "name", label: "Name", sortable: true },
                    { field: "price", label: "Price", sortable: true},
                    { field: "stock", label: "Stock", sortable: true}
                ]}
                rows={product.map((p) => ({
                    id: p.id,
                    name: p.name,
                    price: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(p.price),
                    stock: new Intl.NumberFormat('id-ID').format(p.stock)
                }))}
                actions={(row) => <Button variant="contained" onClick={() => handleClick(row)} sx={{backgroundColor: "#6f42c1"}}>VIEW</Button>}
            />
        </>
    );
}
export default WarehousePage;