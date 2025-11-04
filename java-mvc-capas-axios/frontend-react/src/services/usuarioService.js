import api from './api';

const usuarioService = {
  // Obtener todos los usuarios
  obtenerTodos: async () => {
    const response = await api.get('/admin/usuarios');
    return response.data;
  },

  // Obtener usuario por ID
  obtenerPorId: async (id) => {
    const response = await api.get(`/admin/usuarios/${id}`);
    return response.data;
  },

  // Crear usuario
  crear: async (usuario) => {
    const response = await api.post('/admin/usuarios', usuario);
    return response.data;
  },

  // Actualizar usuario
  actualizar: async (id, usuario) => {
    const response = await api.put(`/admin/usuarios/${id}`, usuario);
    return response.data;
  },

  // Eliminar usuario
  eliminar: async (id) => {
    await api.delete(`/admin/usuarios/${id}`);
  },

  // Buscar por username
  buscarPorUsername: async (username) => {
    const response = await api.get(`/admin/usuarios/username?username=${username}`);
    return response.data;
  },
};

export default usuarioService;
