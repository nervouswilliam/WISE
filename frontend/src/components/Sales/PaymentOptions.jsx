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
import transactionService from '../../services/transactionService';

function PaymentOptions({user, cartItems,totals}) {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cashReceived, setCashReceived] = useState('');
  const [totalAmount] = useState(totals);
  const [cardType, setCardType] = useState('');
  const [chequeNumber, setChequeNumber] = useState('');
  const [giftCode, setGiftCode] = useState('');

  const handleEndSale = async () => {
    // let paymentData = { method: paymentMethod };

    // if (paymentMethod === 'Cash') {
    //   const change = Math.max(0, cashReceived - totalAmount);
    //   paymentData = { ...paymentData, cashReceived, change };
    // } else if (paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') {
    //   paymentData = { ...paymentData, cardType };
    // } else if (paymentMethod === 'Cheque') {
    //   paymentData = { ...paymentData, chequeNumber };
    // } else if (paymentMethod === 'Gift Card') {
    //   paymentData = { ...paymentData, giftCode };
    // }

    // const response = await transactionService.addTransaction();
    // const currentTransactionId = response[0].id;

    // console.log('Payment data:', paymentData);
    // const { data, error } = await transactionService.addPaymentTransaction(paymentData, totalAmount, currentTransactionId);

    // if (error) {
    //   console.error('Error inserting payment:', error);
    //   alert('Failed to record payment');
    // } else {
    //   console.log('Payment recorded:', data);
    //   alert('Payment successfully recorded!');
    // }

    for (const item of cartItems) {
      const paymentData = {
        _card_type: paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card' ? cardType : null,
        _cash_received: paymentMethod === 'Cash' ? cashReceived : null,
        _cheque_number: paymentMethod === 'Cheque' ? chequeNumber : null,
        _gift_code: paymentMethod === 'Gift Card' ? giftCode : null,
        _payment_method: paymentMethod,
        _price_per_unit: item.price,
        _product_id: item.id,
        _quantity: item.quantity,
        _reason: 'Sale of product',
        _transaction_type_id: 1,
        _user_id: user.id
      };

      const { data, error } = await supabase.rpc('complete_sale', paymentData);

      if (error) {
        console.error('Error completing sale for product', item.name, error);
      } else {
        console.log('Transaction completed for product', item.name, data);
      }
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
