import axios from 'axios';

export const getUser = async () => {
  try {
    const response = await axios.get(`/api/user`);
    return response.data;
  } catch (error) {
    console.warn('Error fetching user, not authenticating:', error);
    return null;
  }
};