import axios from '../lib/axios';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  shopName: string;
  address: string;
  phone?: string;
}

const authApi = {
  login: async (data: LoginData) => {
    const response = await axios.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await axios.post('/auth/register', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await axios.get('/auth/profile');
    return response.data;
  },
};

export default authApi;