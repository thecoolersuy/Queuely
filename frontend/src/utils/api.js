import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const apiCall = async (method, endpoint, options = {}) => {
  const { data, params, headers } = options;

  try {
    const response = await axios({
      method,
      url: `${BASE_URL}${endpoint}`,
      data,
      params,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
    return response;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        // Token is invalid or expired - logout user
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('token-changed'));
        window.location.href = '/';
      }
      throw error.response.data;
    } else if (error.request) {
      throw { message: 'No response from server' };
    } else {
      throw { message: error.message };
    }
  }
};