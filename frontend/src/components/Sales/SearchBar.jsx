import React from 'react';
import { Box, TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function SearchBar({ searchQuery, onSearchChange }) {
    return (
        <Box>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Scan or search item..."
                value={searchQuery}
                onChange={onSearchChange}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton edge="end">
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        </Box>
    );
}

export default SearchBar;