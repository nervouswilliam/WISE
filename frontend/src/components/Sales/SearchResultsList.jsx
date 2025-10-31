import React from 'react';
import { Box, List, ListItem, ListItemText, Button, Paper } from '@mui/material';

function SearchResultsList({ products, onAddToCart }) {
    if (products.length === 0) {
        return null;
    }

    return (
        <Paper elevation={3} sx={{ mt: 1, maxHeight: 200, overflowY: 'auto' }}>
            <List>
                {products.map(product => (
                    <ListItem
                        key={product.id}
                        secondaryAction={
                            <Button variant="outlined" size="small" onClick={() => onAddToCart(product)}>
                                Add
                            </Button>
                        }
                    >
                        <ListItemText
                            primary={product.name}
                            secondary={`Stock: ${product.stock} | Price: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.selling_price.toFixed(2))}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
}

export default SearchResultsList;