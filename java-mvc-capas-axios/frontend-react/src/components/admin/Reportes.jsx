import { useState, useEffect } from 'react';
import reporteService from '../../services/reporteService';
import MapaDelivery from './MapaDelivery';
import './Reportes.css';

function Reportes() {
  const [estadisticas, setEstadisticas] = useState(null);
  const [ventasDelDia, setVentasDelDia] = useState(null);
  const [ventasDelMes, setVentasDelMes] = useState(null);
  const [canales, setCanales] = useState(null);
  const [stockBajo, setStockBajo] = useState(null);
  const [tendencia, setTendencia] = useState(null);
  const [clientesZonas, setClientesZonas] = useState(null);
  const [ventasHora, setVentasHora] = useState(null);
  const [pagosMetodo, setPagosMetodo] = useState(null);
  const [heatmapDelivery, setHeatmapDelivery] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [
        stats,
        ventasDia,
        ventasMes,
        canalesData,
        stock,
        tendenciaData,
        clientesData,
        ventasPorHora,
        pagosPorMetodo,
        heatmap,
      ] = await Promise.all([
        reporteService.obtenerEstadisticasGenerales(),
        reporteService.obtenerVentasDelDia(),
        reporteService.obtenerVentasDelMes(),
        reporteService.obtenerCanales(),
        reporteService.obtenerStockBajo(),
        reporteService.obtenerTendenciaVentas(),
        reporteService.obtenerClientesYZonas(),
        reporteService.obtenerVentasPorHora(),
        reporteService.obtenerPagosPorMetodo(),
        reporteService.obtenerHeatmapDelivery(),
      ]);

      setEstadisticas(stats);
      setVentasDelDia(ventasDia);
      setVentasDelMes(ventasMes);
      setCanales(canalesData);
      setStockBajo(stock);
      setTendencia(tendenciaData);
      setClientesZonas(clientesData);
      setVentasHora(ventasPorHora);
      setPagosMetodo(pagosPorMetodo);
      setHeatmapDelivery(heatmap);
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

        {canales && (
          <div className="stats-card canales-card">
            <h4>Ingresos por Canal</h4>
            <div className="barra-row">
              <div className="barra-label">Delivery</div>
              <div className="barra-track">
                <div
                  className="barra-fill delivery"
                  style={{ width: `${Math.min(100, (canales.delivery.totalVentas || 0) / ( (canales.delivery.totalVentas || 0) + (canales.presencial.totalVentas || 0) || 1) * 100)}%` }}
                ></div>
              </div>
              <div className="barra-valor">
                S/ {canales.delivery.totalVentas?.toFixed(2)} ({canales.delivery.totalPedidos} pedidos)
              </div>
            </div>
            <div className="barra-row">
              <div className="barra-label">Presencial</div>
              <div className="barra-track">
                <div
                  className="barra-fill local"
                  style={{ width: `${Math.min(100, (canales.presencial.totalVentas || 0) / ( (canales.delivery.totalVentas || 0) + (canales.presencial.totalVentas || 0) || 1) * 100)}%` }}
                ></div>
              </div>
              <div className="barra-valor">
                S/ {canales.presencial.totalVentas?.toFixed(2)} ({canales.presencial.totalPedidos} pedidos)
              </div>
            </div>
          </div>
        )}

        {ventasHora && (
          <div className="stats-card">
            <h4>Ventas por Hora (hoy)</h4>
            {ventasHora.horas.filter((h) => Number(h.total || 0) > 0).length === 0 ? (
              <p className="helper-text">Aún no hay ventas en el horario de hoy.</p>
            ) : (
              <div className="hora-list">
                {ventasHora.horas
                  .filter((h) => Number(h.total || 0) > 0)
                  .map((item) => (
                    <div key={item.hora} className="hora-item">
                      <span>{item.hora}</span>
                      <div className="hora-bar">
                        <div
                          className="hora-bar-fill"
                          style={{ width: `${Math.min(100, Number(item.total || 0) * 2)}%` }}
                        ></div>
                        <strong>S/ {Number(item.total || 0).toFixed(2)}</strong>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {pagosMetodo && (
          <div className="stats-card">
            <h4>Pagos por Método</h4>
            <div className="pagos-list">
              {pagosMetodo.metodos.map((metodo) => (
                <div key={metodo.medioPago} className="pago-item">
                  <div className="medio">{metodo.medioPago}</div>
                  <div className="detalle">
                    <span>{metodo.pedidos} pedidos</span>
                    <strong>S/ {Number(metodo.total || 0).toFixed(2)}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tendencia && (
          <div className="stats-card">
            <h4>Tendencia Semanal</h4>
            <ul className="trend-list">
              {tendencia.tendencia.map((item) => (
                <li key={item.fecha}>
                  <strong>{new Date(item.fecha).toLocaleDateString()}</strong>: S/ {Number(item.total).toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {stockBajo && (
          <div className="stats-card">
            <h4>Productos con Stock Bajo</h4>
            <ul>
              {stockBajo.items.map((item) => (
                <li key={item.id}>
                  {item.nombre} — {item.cantidad} unidades (Delivery: {item.disponibleDelivery ? 'SI' : 'NO'})
                </li>
              ))}
            </ul>
          </div>
        )}

        {clientesZonas && (
          <div className="stats-card">
            <h4>Clientes y Zonas Activas</h4>
            <p><strong>Clientes frecuentes</strong></p>
            <ul>
              {clientesZonas.topClientes.map((cliente) => (
                <li key={cliente.clienteId}>
                  {cliente.nombre} — {cliente.pedidos} pedidos
                </li>
              ))}
            </ul>
            <p><strong>Zonas de delivery</strong></p>
            <ul>
              {clientesZonas.topZonas.map((zona) => (
                <li key={zona.direccion}>
                  {zona.direccion} — {zona.ordenes} pedidos
                </li>
              ))}
            </ul>
          </div>
        )}

        {heatmapDelivery && (
          <div className="stats-card mapa-card">
            <h4>Zonas con más delivery (últimos 30 días)</h4>
            <MapaDelivery data={heatmapDelivery} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Reportes;
