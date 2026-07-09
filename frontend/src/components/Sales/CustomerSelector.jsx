import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import customerService from '../../services/customerService';

// Optional "who's this sale for" picker above checkout - leaving it empty just means a
// walk-in/anonymous sale, same as before this existed.
function CustomerSelector({ user, value, onChange }) {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!inputValue.trim()) {
      setOptions(value ? [value] : []);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const timeout = setTimeout(async () => {
      const results = await customerService.searchCustomer(user, inputValue.trim());
      if (!cancelled) {
        setOptions(results);
        setLoading(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [inputValue]);

  return (
    <Autocomplete
      size="small"
      options={options}
      value={value}
      onChange={(e, newValue) => onChange(newValue)}
      inputValue={inputValue}
      onInputChange={(e, newInputValue) => setInputValue(newInputValue)}
      getOptionLabel={(c) => c?.name || ''}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Customer (optional)"
          placeholder="Search by name, phone, or email..."
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={16} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}

export default CustomerSelector;
