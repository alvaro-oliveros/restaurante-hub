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

  obtenerCanales: async () => {
    const response = await api.get('/admin/reportes/canales');
    return response.data;
  },

  obtenerStockBajo: async () => {
    const response = await api.get('/admin/reportes/stock/bajo');
    return response.data;
  },

  obtenerTendenciaVentas: async () => {
    const response = await api.get('/admin/reportes/ventas/tendencia');
    return response.data;
  },

  obtenerClientesYZonas: async () => {
    const response = await api.get('/admin/reportes/clientes-zonas');
    return response.data;
  },

  obtenerVentasPorHora: async () => {
    const response = await api.get('/admin/reportes/ventas/horas');
    return response.data;
  },

  obtenerPagosPorMetodo: async () => {
    const response = await api.get('/admin/reportes/pagos');
    return response.data;
  },

  obtenerHeatmapDelivery: async (inicio = null, fin = null) => {
    const response = await api.get('/admin/reportes/delivery/heatmap', {
      params: { inicio, fin },
    });
    return response.data;
  },
};

export default reporteService;
