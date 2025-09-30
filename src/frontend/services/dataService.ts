import axios from 'axios';

export const getBattle = async (battleId: String) => {
  try {
    const response = await axios.get(`/api/data/${battleId}`)
    .then(response => {
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

export const getBattles = async () => {
  try {
    const response = await axios.get('/api/data')
    .then(response => {
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

export const sendLog = async (data: any) => {
  try {
    const response = await axios.post('/api/data', data)
    .then(response => {
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