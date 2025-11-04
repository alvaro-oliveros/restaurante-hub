import api from './api';

const direccionService = {
  // Obtener direcciones de un cliente
  obtenerPorCliente: async (clienteId) => {
    const response = await api.get(`/clientes/${clienteId}/direcciones`);
    return response.data;
  },

  // Obtener dirección por ID
  obtenerPorId: async (id) => {
    const response = await api.get(`/clientes/0/direcciones/${id}`);
    return response.data;
  },

  // Crear dirección
  crear: async (clienteId, direccion) => {
    const response = await api.post(`/clientes/${clienteId}/direcciones`, direccion);
    return response.data;
  },

  // Actualizar dirección
  actualizar: async (clienteId, id, direccion) => {
    const response = await api.put(`/clientes/${clienteId}/direcciones/${id}`, direccion);
    return response.data;
  },

  // Eliminar dirección
  eliminar: async (clienteId, id) => {
    await api.delete(`/clientes/${clienteId}/direcciones/${id}`);
  },
};

export default direccionService;
