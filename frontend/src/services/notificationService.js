import { supabase } from '../supabaseClient';
const getNotifications = async (userId, recent) => {
    console.log("Fetching notifications for user:", userId);
    const { data, error } = await supabase
        .from('notifications')
        .select()
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(recent);
    return { data, error };
};

const getNotificationList = async (userId) => {
    const { data, error } = await supabase
        .from('notifications')
        .select()
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    return { data, error };
};

const markNotificationAsRead = async (notificationId) => {
    const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
    return { data, error };
};

const deleteNotification = async (notificationId) => {
    const { data, error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
    return { data, error };
};
export default {
    getNotifications,
    getNotificationList,
    markNotificationAsRead,
    deleteNotification,
};