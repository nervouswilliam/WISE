import React, { useEffect, useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import SearchBar from '../components/Sales/SearchBar';
import CartTable from '../components/Sales/CartTable';
import SalesSummary from '../components/Sales/SalesSummary';
import PaymentOptions from '../components/Sales/PaymentOptions';
import SearchResultsList from '../components/Sales/SearchResultsList';
import productService from '../services/productService';

function SalesPage({user}) {
    const [cartItems, setCartItems] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [totals, setTotals] = useState({
        subtotal: 0,
        discounts: 0,
        total: 0,
        paid: 0,
        due: 0,
    });
    
    // Fetch and filter products based on search query
    useEffect(() => {
        const handleSearch = async () => {
            if (searchQuery.length > 0) {
                try {
                    const response = await productService.searchProduct(user, searchQuery);
                    setSearchResults(response);
                } catch (error) {
                    console.error("Error fetching search results:", error);
                    setSearchResults([]);
                }
            } else {
                setSearchResults([]);
            }
            setSearchResults([]);
        };

        const timeoutId = setTimeout(() => {
            handleSearch();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Calculate totals whenever cartItems change
    useEffect(() => {
        const newSubtotal = cartItems.reduce((acc, item) => acc + item.subtotal, 0);
        // You'll need more logic to calculate discounts, total, etc.
        setTotals(prevTotals => ({
            ...prevTotals,
            subtotal: newSubtotal,
            total: newSubtotal - prevTotals.discounts,
        }));
    }, [cartItems]);

    // Function to add a product from search results to the cart
    const handleAddToCart = (product) => {
        const existingItem = cartItems.find(item => item.id === product.id);
        if (existingItem) {
            setCartItems(cartItems.map(item =>
                item.id === product.id
                    ? { ...item, qty: item.qty + 1, subtotal: (item.qty + 1) * item.selling_price }
                    : item
            ));
        } else {
            setCartItems([...cartItems, { ...product, qty: 1, subtotal: product.selling_price }]);
        }
    };
    
    // Function to handle removing an item from the cart
    const handleRemoveFromCart = (productId) => {
      setCartItems(cartItems.filter(item => item.id !== productId));
    };

    return (
        <Container maxWidth="xl" sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', p: 2 }}>
            <Box sx={{ display: 'flex', flexGrow: 1, gap: 3 }}>
                <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ mb: 2 }}>
                        <SearchBar searchQuery={searchQuery} onSearchChange={e => setSearchQuery(e.target.value)} />
                        <SearchResultsList products={searchResults} onAddToCart={handleAddToCart} />
                    </Box>
                    <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                        <CartTable cartItems={cartItems} onRemoveItem={handleRemoveFromCart} />
                    </Box>
                </Box>
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ mb: 2 }}>
                        <SalesSummary totals={totals} />
                    </Box>
                    <Box>
                        <PaymentOptions user={user}cartItems={cartItems} totals={totals} />
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}

export default SalesPage;