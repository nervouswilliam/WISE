// import React from 'react';
// import { Box, Typography, Button, Grid, Divider } from '@mui/material';
// import CreditCardIcon from '@mui/icons-material/CreditCard';
// import LocalAtmIcon from '@mui/icons-material/LocalAtm';
// import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
// import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
// import DoneIcon from '@mui/icons-material/Done';

// function PaymentOptions() {
//   const handlePaymentClick = (method) => {
//     // Implement your payment logic here
//     console.log(`Payment method selected: ${method}`);
//   };

//   return (
//     <Box>
//       <Typography variant="body1" sx={{ mb: 2 }}>
//         ADD PAYMENT
//       </Typography>
//       <Grid container spacing={1}>
//         {/* Cash Button */}
//         <Grid item xs={6}>
//           <Button
//             fullWidth
//             variant="outlined"
//             startIcon={<LocalAtmIcon />}
//             onClick={() => handlePaymentClick('Cash')}
//           >
//             Cash
//           </Button>
//         </Grid>
//         {/* Credit Card Button */}
//         <Grid item xs={6}>
//           <Button
//             fullWidth
//             variant="outlined"
//             startIcon={<CreditCardIcon />}
//             onClick={() => handlePaymentClick('Credit Card')}
//           >
//             Credit Card
//           </Button>
//         </Grid>
//         {/* Debit Card Button */}
//         <Grid item xs={6}>
//           <Button
//             fullWidth
//             variant="outlined"
//             startIcon={<CreditCardIcon />}
//             onClick={() => handlePaymentClick('Debit Card')}
//           >
//             Debit Card
//           </Button>
//         </Grid>
//         {/* Cheque Button */}
//         <Grid item xs={6}>
//           <Button
//             fullWidth
//             variant="outlined"
//             startIcon={<AccountBalanceWalletIcon />}
//             onClick={() => handlePaymentClick('Cheque')}
//           >
//             Cheque
//           </Button>
//         </Grid>
//         {/* Gift Card Button */}
//         <Grid item xs={12}>
//           <Button
//             fullWidth
//             variant="outlined"
//             startIcon={<ConfirmationNumberIcon />}
//             onClick={() => handlePaymentClick('Gift Card')}
//           >
//             Gift Card
//           </Button>
//         </Grid>
//       </Grid>
//       <Divider sx={{ my: 3 }} />
//       {/* End Sale Button */}
//       <Button
//         fullWidth
//         variant="contained"
//         color="primary"
//         startIcon={<DoneIcon />}
//         sx={{ p: 1.5 , backgroundColor: "#6f42c1"}}
//         onClick={() => console.log('End Sale')}
//       >
//         End Sale
//       </Button>
//     </Box>
//   );
// }

// export default PaymentOptions;

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Divider,
  Select,
  MenuItem,
  TextField,
  Button,
  FormControl,
  InputLabel,
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';
import transactionService from '../../services/transactionService';
import Loading from '../loading';

function PaymentOptions({user, cartItems,totals}) {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [cashReceived, setCashReceived] = useState('');
  const [totalAmount] = useState(totals);
  const [cardType, setCardType] = useState('');
  const [chequeNumber, setChequeNumber] = useState('');
  const [giftCode, setGiftCode] = useState('');
  const navigate = useNavigate();

  const handleEndSale = async () => {
    setLoading(true);
    const items = cartItems.map(item => ({
      product_id: item.id,
      quantity: item.qty,
      price_per_unit: item.selling_price,
    }));

    const {data, error} = await supabase.rpc('complete_sale',{
      _user_id: user.id,
      _items: items,
      _payment_method: paymentMethod,
    })

    if (error) {
      console.error('Error completing sale:', error);
    } else {
      setLoading(false);
      console.log('Sale completed successfully:', data);
      navigate('/report/' + data);
    }


    if (loading) {
      return (
        <Loading/>
      );
    }

  };


  return (
    <Box>
      <Typography variant="body1" sx={{ mb: 2 }}>
        ADD PAYMENT
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Payment Method</InputLabel>
        <Select
          value={paymentMethod}
          label="Payment Method"
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <MenuItem value="Cash">Cash</MenuItem>
          <MenuItem value="Credit Card">Credit Card</MenuItem>
          <MenuItem value="Debit Card">Debit Card</MenuItem>
          <MenuItem value="Cheque">Cheque</MenuItem>
          <MenuItem value="Gift Card">Gift Card</MenuItem>
        </Select>
      </FormControl>

      {/* Conditional Inputs */}
      {paymentMethod === 'Cash' && (
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Cash Received"
            type="number"
            value={cashReceived}
            onChange={(e) => setCashReceived(e.target.value)}
          />
          <Typography sx={{ mt: 1 }}>
            Change: Rp {Math.max(0, Number(cashReceived) - Number(totalAmount)).toLocaleString()}
          </Typography>
        </Box>
      )}

      {(paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') && (
        <TextField
          fullWidth
          label="Card Type (e.g. Visa, MasterCard)"
          value={cardType}
          onChange={(e) => setCardType(e.target.value)}
          sx={{ mb: 2 }}
        />
      )}

      {paymentMethod === 'Cheque' && (
        <TextField
          fullWidth
          label="Cheque Number"
          value={chequeNumber}
          onChange={(e) => setChequeNumber(e.target.value)}
          sx={{ mb: 2 }}
        />
      )}

      {paymentMethod === 'Gift Card' && (
        <TextField
          fullWidth
          label="Gift Card Code"
          value={giftCode}
          onChange={(e) => setGiftCode(e.target.value)}
          sx={{ mb: 2 }}
        />
      )}

      <Divider sx={{ my: 3 }} />

      <Button
        fullWidth
        variant="contained"
        color="primary"
        startIcon={<DoneIcon />}
        sx={{ p: 1.5, backgroundColor: '#6f42c1' }}
        onClick={handleEndSale}
      >
        End Sale
      </Button>
    </Box>
  );
}

export default PaymentOptions;
