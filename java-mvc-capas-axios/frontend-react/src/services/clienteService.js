import api from './api';

const clienteService = {
  // Obtener todos los clientes
  obtenerTodos: async () => {
    const response = await api.get('/clientes');
    return response.data;
  },

  // Obtener cliente por ID
  obtenerPorId: async (id) => {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },

  // Crear cliente
  crear: async (cliente) => {
    const response = await api.post('/clientes', cliente);
    return response.data;
  },

  // Actualizar cliente
  actualizar: async (id, cliente) => {
    const response = await api.put(`/clientes/${id}`, cliente);
    return response.data;
  },

  // Eliminar cliente
  eliminar: async (id) => {
    await api.delete(`/clientes/${id}`);
  },

  // Buscar por email
  buscarPorEmail: async (email) => {
    const response = await api.get(`/clientes/email?email=${email}`);
    return response.data;
  },
};

export default clienteService;
