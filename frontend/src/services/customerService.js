import { supabase } from '../supabaseClient';

const getCustomerList = async (user) => {
    const { data, error } = await supabase
        .from('customers')
        .select()
        .eq('user_id', user.id)
        .order('name', { ascending: true });
    return { data, error };
};

const searchCustomer = async (user, query) => {
    const { data, error } = await supabase
        .from('customers')
        .select()
        .eq('user_id', user.id)
        .or(`name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%`)
        .order('name', { ascending: true });

    if (error) {
        console.error('Error searching customers:', error);
        return [];
    }
    return data;
};

const getCustomerDetail = async (id) => {
    const { data, error } = await supabase
        .from('customers')
        .select()
        .eq('id', id)
        .single();
    return { data, error };
};

const addCustomer = async (customerData) => {
    const { data, error } = await supabase
        .from('customers')
        .insert([customerData])
        .select();
    return { data, error };
};

const editCustomer = async (id, customerData) => {
    const { data, error } = await supabase
        .from('customers')
        .update(customerData)
        .eq('id', id)
        .select();
    return { data, error };
};

const deleteCustomer = async (id) => {
    const { data, error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);
    return { data, error };
};

// Purchase history for a customer. Queries the raw transactions table for the
// customer_id link (not the view, whose exact column set we can't assume), then
// pulls totals/type for those same transaction ids from view_transaction.
const getPurchaseHistory = async (user, customerId) => {
    const { data: txRows, error: txError } = await supabase
        .from('transactions')
        .select('id, created_at')
        .eq('customer_id', customerId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (txError || !txRows || txRows.length === 0) {
        if (txError) console.error('Error fetching customer transactions:', txError);
        return [];
    }

    const txIds = txRows.map((t) => t.id);
    const { data: txDetails, error: detailsError } = await supabase
        .from('view_transaction')
        .select('transaction_id, total_amount, transaction_type, created_at')
        .eq('user_id', user.id)
        .in('transaction_id', txIds)
        .order('created_at', { ascending: false });

    if (detailsError) {
        console.error('Error fetching customer transaction details:', detailsError);
        return [];
    }
    return txDetails || [];
};

export default {
    getCustomerList,
    searchCustomer,
    getCustomerDetail,
    addCustomer,
    editCustomer,
    deleteCustomer,
    getPurchaseHistory,
};
