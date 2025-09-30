import axios from 'axios';

import { type UserContextType } from "@/contexts/UserContext"

export const login = async (email: String, password: string, userContext: UserContextType) => {
  const {user, setUser} = userContext;

  try {
    const response = await axios.post('/auth/login', {
        email: email,
        password: password
    })
    .then(response => {
        setUser(response.data);
        console.log(response.data);
    })
    .catch(error => {
        console.error('Error:', error); // Handle errors
    });

    return response;
  } catch (error) {
    console.warn('Error logging in', error);
    return null;
  }
};

export const register = async (username: String, email: String, password: String, password_conf: String, userContext: UserContextType) => {
  const {user, setUser} = userContext;

  try {
    const response = await axios.post('/auth/register', {
        username: username,
        email: email,
        password: password,
        password_conf: password_conf
    })
    .then(response => {
        setUser(response.data);
        console.log(response.data);
    })
    .catch(error => {
        console.error('Error:', error); // Handle errors
    });

    return response;
  } catch (error) {
    console.warn('Error logging in', error);
    return null;
  }
};