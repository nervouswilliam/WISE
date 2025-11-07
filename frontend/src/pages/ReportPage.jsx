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
import transactionService from '../services/transactionService';

function ReportPage({user}) {
    const [period, setPeriod] = useState('all');
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handlePeriodChange = (e) => {
        setPeriod(e.target.value);
    };

    const handleClick = (row) => {
        navigate(`/report/${row.transaction_id}`);
    };

    const formatCurrency = (value) => {
        // Check if the value is a valid number
        if (typeof value !== 'number') return value;
        
        // Format as Indonesian Rupiah (IDR)
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 2,
        }).format(value);
    };

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const response = await transactionService.getTransactionsByPeriod(user, period);
                const fetchedTransactions = response.output_schema || response;
    
                const formattedTransactions = fetchedTransactions.map(transaction => {
                    // Safely get the date string and handle invalid values
                    const dateString = transaction.created_at;
    
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
                        ...transaction,
                        created_at: `${formattedDate} ${formattedTime}`.trim()
                    };
                });
                setTransactions(formattedTransactions);
            } catch (err) {
                console.error("Error fetching transactions:", err);
                setError("Failed to load transaction data.");
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, [period]);

    const columns = [
        { field: 'transaction_id', label: 'Transaction ID' },
        { field: 'total_amount', label: 'Total Amount', render: (value) => formatCurrency(value) },
        { field: 'transaction_type', label: 'Type' },
        { field: 'created_at', label: 'Date' },
    ];

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <FormControl variant="outlined" sx={{ minWidth: 150 }}>
                    <InputLabel id="period-select-label">Period</InputLabel>
                    <Select
                        labelId="period-select-label"
                        id="period-select"
                        value={period}
                        label="Period"
                        onChange={handlePeriodChange}
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="daily">Daily</MenuItem>
                        <MenuItem value="weekly">Weekly</MenuItem>
                        <MenuItem value="monthly">Monthly</MenuItem>
                        <MenuItem value="quarterly">Quarterly</MenuItem>
                        <MenuItem value="yearly">Yearly</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            
            <DynamicTable
                columns={columns}
                rows={transactions}
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
    );
}

export default ReportPage;