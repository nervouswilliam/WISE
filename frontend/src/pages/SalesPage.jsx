import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import SearchBar from '../components/Sales/SearchBar';
import CartTable from '../components/Sales/CartTable';
import SalesSummary from '../components/Sales/SalesSummary';
import PaymentOptions from '../components/Sales/PaymentOptions';
import SearchResultsList from '../components/Sales/SearchResultsList';
import productService from '../services/productService';

function SalesPage({ user }) {
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

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Fetch and filter products based on search query
    useEffect(() => {
        const handleSearch = async () => {
            if (searchQuery.length > 0) {
                try {
                    const response = await productService.searchProduct(user, searchQuery);
                    setSearchResults(response);
                } catch (error) {
                    console.error('Error fetching search results:', error);
                    setSearchResults([]);
                }
            } else {
                setSearchResults([]);
            }
        };

        const timeoutId = setTimeout(() => handleSearch(), 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Calculate totals whenever cartItems change
    useEffect(() => {
        const newSubtotal = cartItems.reduce((acc, item) => acc + item.subtotal, 0);
        setTotals(prevTotals => ({
            ...prevTotals,
            subtotal: newSubtotal,
            total: newSubtotal - prevTotals.discounts,
        }));
    }, [cartItems]);

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

    const handleRemoveFromCart = (productId) => {
        setCartItems(cartItems.filter(item => item.id !== productId));
    };

    const handleUpdateQty = (productId, newQty) => {
        if (newQty < 1) return; // prevent zero or negative qty

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId
                    ? {
                        ...item,
                        qty: newQty,
                        subtotal: newQty * item.selling_price,
                    }
                    : item
            )
        );
    };
    return (
        <Container
            maxWidth="xl"
            sx={{
                height: 'calc(100vh - 64px)',
                display: 'flex',
                flexDirection: 'column',
                p: { xs: 1, sm: 2 },
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    flexGrow: 1,
                    gap: isMobile ? 2 : 3,
                    overflow: 'hidden',
                }}
            >
                {/* LEFT SECTION (Search + Cart) */}
                <Box
                    sx={{
                        flex: isMobile ? '1 1 auto' : 2,
                        display: 'flex',
                        flexDirection: 'column',
                        order: isMobile ? 1 : 0,
                    }}
                >
                    <Box sx={{ mb: 2 }}>
                        <SearchBar
                            searchQuery={searchQuery}
                            onSearchChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <SearchResultsList
                            products={searchResults}
                            onAddToCart={handleAddToCart}
                        />
                    </Box>

                    <Box
                        sx={{
                            flexGrow: 1,
                            overflowY: 'auto',
                            borderRadius: 2,
                            bgcolor: '#fafafa',
                            p: 1,
                        }}
                    >
                        <CartTable
                            cartItems={cartItems}
                            onRemoveItem={handleRemoveFromCart}
                            onUpdateQty={handleUpdateQty}
                        />
                    </Box>
                </Box>

                {/* RIGHT SECTION (Summary + Payment) */}
                <Box
                    sx={{
                        flex: isMobile ? '1 1 auto' : 1,
                        display: 'flex',
                        flexDirection: 'column',
                        order: isMobile ? 2 : 1,
                    }}
                >
                    <Box sx={{ mb: 2 }}>
                        <SalesSummary totals={totals} />
                    </Box>
                    <Box>
                        <PaymentOptions
                            user={user}
                            cartItems={cartItems}
                            totals={totals}
                        />
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}

export default SalesPage;
