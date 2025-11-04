import api from './api';

const reporteService = {
  // Obtener estadísticas generales
  obtenerEstadisticasGenerales: async () => {
    const response = await api.get('/admin/reportes/estadisticas');
    return response.data;
  },

  // Obtener ventas del día
  obtenerVentasDelDia: async () => {
    const response = await api.get('/admin/reportes/ventas/dia');
    return response.data;
  },

  // Obtener ventas del mes
  obtenerVentasDelMes: async () => {
    const response = await api.get('/admin/reportes/ventas/mes');
    return response.data;
  },

  // Obtener ventas por rango
  obtenerVentasPorRango: async (inicio, fin) => {
    const response = await api.get('/admin/reportes/ventas/rango', {
      params: { inicio, fin },
    });
    return response.data;
  },
};

export default reporteService;
