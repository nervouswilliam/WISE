import { supabase } from '../supabaseClient';

const getOrderListByUser = async (user) => {
    const { data, error } = await supabase
        .from('view_orders')
        .select()
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
    if (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
    return data;
};

const getOrderDetailsById = async (user, orderId) => {
    const { data, error } = await supabase
        .from('view_orders')
        .select()
        .eq('user_id', user.id)
        .eq('order_id', orderId);
    if (error) {
        console.error('Error fetching order details:', error);
        return null;
    }
    return data;
};

const addOrder = async (orderData) => {
    const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select();
    if (error) {
        console.error('Error adding order:', error);
        return null;
    }
    return data;
};

const addOrderItem = async (orderItemData) => {
    const { data, error } = await supabase
        .from('order_items')
        .insert([orderItemData])
        .select();
    if (error) {
        console.error('Error adding order item:', error);
        return null;
    }
    return data;
};

const updateOrderItems = async (order_id, order_items, user) => {
    const {data, error} = await supabase
        .from("orders")
        .update(order_items)
        .eq("id", order_id)
        .eq("user_id", user.id)
        .select();
    if (error) {
        console.log("error update order items", error)
        return null
    }
    return data;
}

const cancelOrder = async(order_id, user)=> {
    const {data, error} = await supabase
        .from("orders")
        .update({"status": "Cancelled"})
        .eq("id", order_id)
        .eq("user_id", user.id)
        .select();
    if (error) {
        console.log("Error cancel order", error)
        return null;
    }
    return data
}

export default {
    getOrderListByUser,
    getOrderDetailsById,
    addOrder,
    addOrderItem,
    updateOrderItems,
    cancelOrder,
};