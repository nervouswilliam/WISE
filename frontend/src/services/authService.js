// You can use fetch, but axios is common with React
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const login = async (name, password) => {
  const response = await axios.post(`${BASE_URL}/auth/login`, { name, password });
  const sessionId = response.data.output_schema["session-id"]
  console.log(sessionId)
  return sessionId;
};

const signup = async (formData) => {
  const response = await axios.post(`${BASE_URL}/user/sign-up`, formData)
  return response.data;
}

const whoami = async() => {
  const response = await axios.get(
    `${BASE_URL}/auth/who-am-i`,
    {
      headers:{
        "Authorization": localStorage.getItem("token")
      }
    })
    console.log(response.data)
    return response.data;
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

const logout = async () => {
  console.log(localStorage.getItem("token"))
  const response = await axios.delete(
    `${BASE_URL}/auth/logout`,
    {
      headers:{
        "Authorization": localStorage.getItem("token")
      }
    }
  );
  localStorage.removeItem("token");
  localStorage.removeItem("isAuthenticated");
};

const updateUser = async(user) =>{

}

export default {
  login,
  logout,
  signup,
  whoami,
  validateToken,
  updateUser, 
};
