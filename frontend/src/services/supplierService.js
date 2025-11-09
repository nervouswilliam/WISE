import { supabase } from '../supabaseClient';

const editSupplier = async (id, data) => {
    const { data: updatedData, error } = await supabase
        .from('suppliers')
        .update(data)
        .eq('id', id)
        .select();
    return { updatedData, error };
};

const addSupplier = async (data) => {
    const { data: newData, error } = await supabase
        .from('suppliers')
        .insert(data)
        .select();

    return { newData, error };
};

const getSupplierList = async (user) => {
    const { data, error } = await supabase
        .from('suppliers')
        .select()
        .eq('user_id', user.id);
    return { data, error };
};

const getSupplierDetail = async (id) => {
    const { data, error } = await supabase
        .from('suppliers')
        .select()
        .eq('id', id)
        .single();

    return { data, error };
};

const getSupplierId = async(supplierName, user) => {
    const { data, error } = await supabase
        .from('suppliers')
        .select()
        .eq('name', supplierName)
        .eq('user_id', user.id)
        .single();

    if (error) {
        console.error("Error fetching category ID:", error);
        return null;
    }

    return data.id;
}

const deleteSupplier = async (id) => {
    const { data, error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);

    return { data, error };
};

export default {
    editSupplier,
    addSupplier,
    getSupplierDetail,
    getSupplierList,
    getSupplierId,
    deleteSupplier,
};
