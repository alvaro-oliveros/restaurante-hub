import api from './api';

const mesaService = {
  // Obtener todas las mesas
  obtenerTodas: async () => {
    const response = await api.get('/mesas');
    return response.data;
  },

  // Obtener mesa por ID
  obtenerPorId: async (id) => {
    const response = await api.get(`/mesas/${id}`);
    return response.data;
  },

  // Obtener mesas por estado
  obtenerPorEstado: async (estado) => {
    const response = await api.get(`/mesas/estado/${estado}`);
    return response.data;
  },

  // Obtener mesas por capacidad
  obtenerPorCapacidad: async (capacidad) => {
    const response = await api.get(`/mesas/capacidad/${capacidad}`);
    return response.data;
  },

  // Obtener resumen de estados
  obtenerResumenEstados: async () => {
    const response = await api.get('/mesas/resumen-estados');
    return response.data;
  },

  // Crear mesa
  crear: async (mesa) => {
    const response = await api.post('/mesas', mesa);
    return response.data;
  },

  // Actualizar mesa
  actualizar: async (id, mesa) => {
    const response = await api.put(`/mesas/${id}`, mesa);
    return response.data;
  },

  // Actualizar solo el estado
  actualizarEstado: async (id, estado) => {
    const response = await api.patch(`/mesas/${id}/estado`, { estado });
    return response.data;
  },

  // Eliminar mesa
  eliminar: async (id) => {
    await api.delete(`/mesas/${id}`);
  },
};

export default mesaService;
