import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getTransactionsByPeriod = async(period) => {
    const response = await axios.get(
        `${BASE_URL}/transaction/list?period=${period}`,
        {
            headers:{
                "Authorization": localStorage.getItem("token")
            }
        }
    );
    return response.data
}

const addTransaction = async(transactionData) => {
    const response = await axios.post(
        `${BASE_URL}/transaction/information`, 
        transactionData, 
        {
            headers: {
                "Authorization": localStorage.getItem("token"),
                "Content-Type": "application/json"
            }
        }
    );
}
export default {
    getTransactionsByPeriod,
    addTransaction,
}