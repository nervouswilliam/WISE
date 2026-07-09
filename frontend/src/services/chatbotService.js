import { supabase } from '../supabaseClient';

// Talks to the `chatbot` Supabase Edge Function (supabase/functions/chatbot). `invoke`
// automatically attaches the current session's access token, which the function uses to
// run every query under this user's own RLS policies - see the function for details.
const askChatbot = async (message) => {
  const { data, error } = await supabase.functions.invoke('chatbot', {
    body: { message },
  });

  if (error) {
    console.error('Error calling chatbot:', error);
    throw error;
  }

  return data.reply;
};

export default { askChatbot };
