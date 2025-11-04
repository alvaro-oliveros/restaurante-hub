import api from './api';

const metodoPagoService = {
  // Obtener métodos de pago de un cliente
  obtenerPorCliente: async (clienteId) => {
    const response = await api.get(`/clientes/${clienteId}/metodos-pago`);
    return response.data;
  },

  // Obtener método de pago por ID
  obtenerPorId: async (id) => {
    const response = await api.get(`/clientes/0/metodos-pago/${id}`);
    return response.data;
  },

  // Crear método de pago
  crear: async (clienteId, metodoPago) => {
    const response = await api.post(`/clientes/${clienteId}/metodos-pago`, metodoPago);
    return response.data;
  },

  // Actualizar método de pago
  actualizar: async (clienteId, id, metodoPago) => {
    const response = await api.put(`/clientes/${clienteId}/metodos-pago/${id}`, metodoPago);
    return response.data;
  },

  // Eliminar método de pago
  eliminar: async (clienteId, id) => {
    await api.delete(`/clientes/${clienteId}/metodos-pago/${id}`);
  },
};

export default metodoPagoService;
