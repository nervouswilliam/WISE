import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { supabase } from '../supabaseClient';

// const getTransactionsByPeriod = async(period) => {
//     const response = await axios.get(
//         `${BASE_URL}/transaction/list?period=${period}`,
//         {
//             headers:{
//                 "Authorization": localStorage.getItem("token")
//             }
//         }
//     );
//     return response.data
// }

const getTransactionsByPeriod = async (user,period) => {
  const now = new Date();
  const startDate = new Date();

  // Adjust startDate depending on the selected period
  switch (period) {
    case 'daily':
      startDate.setHours(0, 0, 0, 0); // start of today
      break;
    case 'weekly':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'monthly':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'quarterly':
      startDate.setMonth(now.getMonth() - 3);
      break;
    case 'yearly':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    case 'all':
    default:
      // No filter — return all transactions for the user
      const { data: allData, error: allError } = await supabase
        .from('view_transaction')
        .select()
        .eq('user_id', user.id);

      if (allError) {
        console.error('Error fetching all transactions:', allError);
        return [];
      }
      return allData;
  }

  // Fetch transactions within the date range
  const { data, error } = await supabase
    .from('view_transaction')
    .select()
    .eq('user_id', user.id)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', now.toISOString());

  if (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }

  return data;
};


// const addTransaction = async(transactionData) => {
//     const response = await axios.post(
//         `${BASE_URL}/transaction/information`, 
//         transactionData, 
//         {
//             headers: {
//                 "Authorization": localStorage.getItem("token"),
//                 "Content-Type": "application/json"
//             }
//         }
//     );
// }

const addTransaction = async(transactionData) => {
    const { data, error } = await supabase
        .from('transactions') 
        .insert([transactionData]) 
        .select(); 

    if (error) {
        console.error("Error inserting transaction:", error);
        throw error;
    }
}

const addPaymentTransaction = async(paymentData, totalAmount, currentTransactionId) => {
    const { data, error } = await supabase
    .from('payments') // name of your table
    .insert([
        {
        ...paymentData,
        total_amount: totalAmount, // include total sale amount
        created_at: new Date(),
        transaction_id: currentTransactionId, // optional link to transaction
        },
    ]);
}
export default {
    getTransactionsByPeriod,
    addTransaction,
    addPaymentTransaction
}