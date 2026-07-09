import { supabase } from '../supabaseClient';

const getExpenseList = async (user) => {
  const { data, error } = await supabase
    .from('expenses')
    .select()
    .eq('user_id', user.id)
    .order('expense_date', { ascending: false });

  if (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }
  return data;
};

const addExpense = async (expenseData) => {
  const { data, error } = await supabase
    .from('expenses')
    .insert([expenseData])
    .select();

  if (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
  return data;
};

const updateExpense = async (id, expenseData, user) => {
  const { data, error } = await supabase
    .from('expenses')
    .update(expenseData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select();

  if (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
  return data;
};

const deleteExpense = async (id, user) => {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

export default {
  getExpenseList,
  addExpense,
  updateExpense,
  deleteExpense,
};
