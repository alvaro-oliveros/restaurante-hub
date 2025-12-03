import api from './api';

const pedidoService = {
  // Obtener todos los pedidos
  obtenerTodos: async () => {
    const response = await api.get('/pedidos');
    return response.data;
  },

  // Obtener pedido por ID
  obtenerPorId: async (id) => {
    const response = await api.get(`/pedidos/${id}`);
    return response.data;
  },

  // Obtener pedidos por cliente
  obtenerPorCliente: async (clienteId) => {
    const response = await api.get(`/pedidos/cliente/${clienteId}`);
    return response.data;
  },

  // Obtener pedidos por estado
  obtenerPorEstado: async (estado) => {
    const response = await api.get(`/pedidos/estado/${estado}`);
    return response.data;
  },

  // Obtener historial de un pedido
  obtenerHistorial: async (id) => {
    const response = await api.get(`/pedidos/${id}/historial`);
    return response.data;
  },

  // Crear pedido
  crear: async (pedido) => {
    const response = await api.post('/pedidos', pedido);
    return response.data;
  },

  // Actualizar estado del pedido
  actualizarEstado: async (id, estado) => {
    const response = await api.put(`/pedidos/${id}/estado`, { estado });
    return response.data;
  },

  // Cancelar pedido
  cancelar: async (id) => {
    const response = await api.put(`/pedidos/${id}/cancelar`);
    return response.data;
  },
};

export default pedidoService;
