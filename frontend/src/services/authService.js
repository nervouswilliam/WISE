// You can use fetch, but axios is common with React
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
// const supabase = createClient(supabaseUrl, supabaseAnonKey)

import { supabase } from '../supabaseClient';

// const login = async (name, password) => {
//   const response = await axios.post(`${BASE_URL}/auth/login`, { name, password });
//   const sessionId = response.data.output_schema["session-id"]
//   console.log(sessionId)
//   return sessionId;
// };

const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data.session.access_token
}

// const signup = async (formData) => {
//   const response = await axios.post(`${BASE_URL}/user/sign-up`, formData)
//   return response.data;
// }


const signup = async (formData) => {
  const { email, password, name, countryCode, phoneNumber, imageUrl } = formData;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        countryCode,
        phoneNumber,
        imageUrl, // custom metadata
      },
    },
  });

  if (error) throw error;
  return data.user;
};

const whoami = async() => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  return user;
}

async function validateToken() {
  try {
    const response = await axios.get(`${BASE_URL}/auth/who-am-i`, {
      headers: { Authorization: localStorage.getItem("token") },
    });
    return response.status === 200; // valid token
  } catch (err) {
    if (err.response && err.response.status === 401) {
      return false; // invalid/expired token
    }
    throw err; // some other error
  }
}

// const logout = async () => {
//   console.log(localStorage.getItem("token"))
//   const response = await axios.delete(
//     `${BASE_URL}/auth/logout`,
//     {
//       headers:{
//         "Authorization": localStorage.getItem("token")
//       }
//     }
//   );
//   localStorage.removeItem("token");
//   localStorage.removeItem("isAuthenticated");
// };

const logout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error.message);
  } else {
    console.log('Signed out successfully');
  }

};

const updateUser = async(user) =>{
    console.log("Updating user with data:", user);
    const { data, error } = await supabase.auth.updateUser({
      data:{...user}
    });

    if (error) throw error;
    return data;
}

export default {
  login,
  logout,
  signup,
  whoami,
  validateToken,
  updateUser, 
};
