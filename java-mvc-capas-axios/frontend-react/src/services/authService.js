import api from './api';

export const registerCliente = async (payload) => {
  const response = await api.post('/auth/register', payload);
  return response.data;
};

export const loginCliente = async (payload) => {
  const response = await api.post('/auth/login', payload);
  return response.data;
};

export const logoutCliente = async () => {
  await api.post('/auth/logout');
};

export const fetchClienteActual = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
