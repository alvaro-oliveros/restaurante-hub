import { useState, useEffect } from 'react';
import reporteService from '../../services/reporteService';

function Reportes() {
  const [estadisticas, setEstadisticas] = useState(null);
  const [ventasDelDia, setVentasDelDia] = useState(null);
  const [ventasDelMes, setVentasDelMes] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const stats = await reporteService.obtenerEstadisticasGenerales();
      const ventasDia = await reporteService.obtenerVentasDelDia();
      const ventasMes = await reporteService.obtenerVentasDelMes();

      setEstadisticas(stats);
      setVentasDelDia(ventasDia);
      setVentasDelMes(ventasMes);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    }
  };

  return (
    <div className="reportes">
      <h3>Reportes y Estadísticas</h3>

      <div className="dashboard-grid">
        {estadisticas && (
          <div className="stats-card">
            <h4>Estadísticas Generales</h4>
            <p>Total Clientes: <strong>{estadisticas.totalClientes}</strong></p>
            <p>Total Productos: <strong>{estadisticas.totalProductos}</strong></p>
            <p>Total Pedidos: <strong>{estadisticas.totalPedidos}</strong></p>
            <hr />
            <p>Pedidos Pendientes: <strong>{estadisticas.pedidosPendientes}</strong></p>
            <p>En Preparación: <strong>{estadisticas.pedidosEnPreparacion}</strong></p>
            <p>Listos: <strong>{estadisticas.pedidosListos}</strong></p>
          </div>
        )}

        {ventasDelDia && (
          <div className="stats-card">
            <h4>Ventas del Día</h4>
            <p>Total Pedidos: <strong>{ventasDelDia.totalPedidos}</strong></p>
            <p>Total Ventas: <strong>S/ {ventasDelDia.totalVentas?.toFixed(2)}</strong></p>
          </div>
        )}

        {ventasDelMes && (
          <div className="stats-card">
            <h4>Ventas del Mes</h4>
            <p>Período: <strong>{ventasDelMes.mesAnio}</strong></p>
            <p>Total Pedidos: <strong>{ventasDelMes.totalPedidos}</strong></p>
            <p>Total Ventas: <strong>S/ {ventasDelMes.totalVentas?.toFixed(2)}</strong></p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reportes;
