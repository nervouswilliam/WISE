import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    CircularProgress,
    Alert,
    Button
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import DynamicTable from '../components/DynamicTable';
import orderService from '../services/orderService';
import Loading from '../components/loading';
import StatusPill from '../components/StatusPill';

function OrderPage({user}){
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleClick = (row) => {
        navigate(`/order/${row.order_id}`);
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await orderService.getOrderListByUser(user);
                const fetchedOrders = response.output_schema || response;
                const formattedOrders = fetchedOrders.map(order => {
                    const dateString = order.created_at;
    
                    let formattedDate = '';
                    let formattedTime = '';
    
                    // Only format if the date string is valid
                    if (dateString) {
                        const dateObject = new Date(dateString);
                        // Check if the dateObject is valid before formatting
                        if (!isNaN(dateObject.getTime())) {
                            formattedDate = dateObject.toLocaleDateString();
                            formattedTime = dateObject.toLocaleTimeString();
                        } else {
                            // Handle cases where the date string is invalid
                            console.warn("Invalid date string from API:", dateString);
                        }
                    }
    
                    return {
                        ...order,
                        created_at: `${formattedDate} ${formattedTime}`.trim()
                    };
                });
                setOrders(formattedOrders);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError("Failed to load orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    if (loading) {
        return <Loading />;
    }
    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    const columns = [
        { field: 'order_id', label: 'Order ID' },
        { field: 'product_name', label: 'Product Name' },
        { field: 'supplier_name', label: 'Supplier Name' },
        { field: 'quantity_ordered', label: 'Quantity Ordered'},
        { field: 'status', label: 'Status', render: (value, row) => <StatusPill status={value}/>, },
        { field: 'created_at', label: 'Date' },
    ];
    return(
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <DynamicTable
                columns={columns}
                rows={orders}
                actions={(row) => (
                          <Button
                            variant="contained"
                            onClick={() => handleClick(row)}
                            sx={{ backgroundColor: "#6f42c1" }}
                          >
                            VIEW
                          </Button>
                        )}
            />
        </Container>
    )
}

export default OrderPage;