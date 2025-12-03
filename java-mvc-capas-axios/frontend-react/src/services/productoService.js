import api from './api';

const productoService = {
  // Obtener todos los productos
  obtenerTodos: async () => {
    const response = await api.get('/productos');
    return response.data;
  },

  // Obtener producto por ID
  obtenerPorId: async (id) => {
    const response = await api.get(`/productos/${id}`);
    return response.data;
  },

  // Crear producto
  crear: async (producto) => {
    const response = await api.post('/productos', producto);
    return response.data;
  },

  // Actualizar producto
  actualizar: async (id, producto) => {
    const response = await api.put(`/productos/${id}`, producto);
    return response.data;
  },

  // Eliminar producto
  eliminar: async (id) => {
    await api.delete(`/productos/${id}`);
  },

  // Buscar por nombre
  buscarPorNombre: async (nombre) => {
    const response = await api.get(`/productos/buscar?nombre=${nombre}`);
    return response.data;
  },

  // Obtener productos disponibles para delivery
  obtenerDelivery: async () => {
    const response = await api.get('/productos/delivery');
    return response.data;
  },

  // Obtener productos disponibles para salón/local
  obtenerLocales: async () => {
    const response = await api.get('/productos/local');
    return response.data;
  },
};

export default productoService;
