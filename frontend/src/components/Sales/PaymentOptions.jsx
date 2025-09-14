import React from 'react';
import { Box, Typography, Button, Grid, Divider } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import DoneIcon from '@mui/icons-material/Done';

function PaymentOptions() {
  const handlePaymentClick = (method) => {
    // Implement your payment logic here
    console.log(`Payment method selected: ${method}`);
  };

  return (
    <Box>
      <Typography variant="body1" sx={{ mb: 2 }}>
        ADD PAYMENT
      </Typography>
      <Grid container spacing={1}>
        {/* Cash Button */}
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<LocalAtmIcon />}
            onClick={() => handlePaymentClick('Cash')}
          >
            Cash
          </Button>
        </Grid>
        {/* Credit Card Button */}
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<CreditCardIcon />}
            onClick={() => handlePaymentClick('Credit Card')}
          >
            Credit Card
          </Button>
        </Grid>
        {/* Debit Card Button */}
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<CreditCardIcon />}
            onClick={() => handlePaymentClick('Debit Card')}
          >
            Debit Card
          </Button>
        </Grid>
        {/* Cheque Button */}
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<AccountBalanceWalletIcon />}
            onClick={() => handlePaymentClick('Cheque')}
          >
            Cheque
          </Button>
        </Grid>
        {/* Gift Card Button */}
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<ConfirmationNumberIcon />}
            onClick={() => handlePaymentClick('Gift Card')}
          >
            Gift Card
          </Button>
        </Grid>
      </Grid>
      <Divider sx={{ my: 3 }} />
      {/* End Sale Button */}
      <Button
        fullWidth
        variant="contained"
        color="primary"
        startIcon={<DoneIcon />}
        sx={{ p: 1.5 , backgroundColor: "#6f42c1"}}
        onClick={() => console.log('End Sale')}
      >
        End Sale
      </Button>
    </Box>
  );
}

export default PaymentOptions;