import { useState, useEffect } from 'react';
import mesaService from '../../services/mesaService';
import pedidoService from '../../services/pedidoService';
import productoService from '../../services/productoService';
import './DashboardAdmin.css';

function DashboardAdmin() {
  const [resumenMesas, setResumenMesas] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [mesasData, pedidosData, productosData] = await Promise.all([
        mesaService.obtenerResumenEstados(),
        pedidoService.obtenerTodos(),
        productoService.obtenerTodos()
      ]);

      setResumenMesas(mesasData);
      setPedidos(pedidosData);
      setProductos(productosData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar el dashboard');
    } finally {
      setLoading(false);
    }
  };

  const calcularIngresosDia = () => {
    const hoy = new Date().toISOString().split('T')[0];
    return pedidos
      .filter(p => p.fechaPedido?.startsWith(hoy) && p.estado !== 'CANCELADO')
      .reduce((sum, p) => sum + (p.total || 0), 0);
  };

  const calcularPedidosDia = () => {
    const hoy = new Date().toISOString().split('T')[0];
    return pedidos.filter(p => p.fechaPedido?.startsWith(hoy)).length;
  };

  const obtenerPedidosPendientes = () => {
    return pedidos.filter(p =>
      p.estado === 'PENDIENTE' ||
      p.estado === 'CONFIRMADO' ||
      p.estado === 'EN_PREPARACION'
    );
  };

  const obtenerProductosPopulares = () => {
    return productos
      .filter(p => p.esPopular)
      .sort((a, b) => (b.vecesVendido || 0) - (a.vecesVendido || 0))
      .slice(0, 5);
  };

  const getEstadoPedidoColor = (estado) => {
    switch (estado) {
      case 'PENDIENTE': return '#fbbf24';
      case 'CONFIRMADO': return '#3b82f6';
      case 'EN_PREPARACION': return '#f97316';
      case 'LISTO': return '#10b981';
      case 'ENTREGADO': return '#6b7280';
      case 'CANCELADO': return '#ef4444';
      default: return '#9ca3af';
    }
  };

  const getEstadoPedidoTexto = (estado) => {
    switch (estado) {
      case 'PENDIENTE': return 'Pendiente';
      case 'CONFIRMADO': return 'Confirmado';
      case 'EN_PREPARACION': return 'En Preparación';
      case 'LISTO': return 'Listo';
      case 'ENTREGADO': return 'Entregado';
      case 'CANCELADO': return 'Cancelado';
      default: return estado;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Cargando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard Administrativo</h1>
        <p>Resumen en tiempo real</p>
      </div>

      {/* KPIs Principales */}
      <div className="kpis-grid">
        <div className="kpi-card ingresos">
          <div className="kpi-icon">💰</div>
          <div className="kpi-content">
            <div className="kpi-label">Ingresos Hoy</div>
            <div className="kpi-value">S/ {calcularIngresosDia().toFixed(2)}</div>
          </div>
        </div>

        <div className="kpi-card pedidos">
          <div className="kpi-icon">📋</div>
          <div className="kpi-content">
            <div className="kpi-label">Pedidos Hoy</div>
            <div className="kpi-value">{calcularPedidosDia()}</div>
          </div>
        </div>

        <div className="kpi-card mesas">
          <div className="kpi-icon">🪑</div>
          <div className="kpi-content">
            <div className="kpi-label">Mesas Ocupadas</div>
            <div className="kpi-value">
              {resumenMesas?.ocupadas || 0} / {resumenMesas?.total || 0}
            </div>
          </div>
        </div>

        <div className="kpi-card pendientes">
          <div className="kpi-icon">⏳</div>
          <div className="kpi-content">
            <div className="kpi-label">Pedidos Activos</div>
            <div className="kpi-value">{obtenerPedidosPendientes().length}</div>
          </div>
        </div>
      </div>

      {/* Estado de Mesas */}
      {resumenMesas && (
        <div className="seccion-card">
          <h2>Estado de Mesas</h2>
          <div className="mesas-resumen">
            <div className="mesa-estado-item disponible">
              <div className="estado-numero">{resumenMesas.disponibles}</div>
              <div className="estado-label">Disponibles</div>
            </div>
            <div className="mesa-estado-item ocupada">
              <div className="estado-numero">{resumenMesas.ocupadas}</div>
              <div className="estado-label">Ocupadas</div>
            </div>
            <div className="mesa-estado-item reservada">
              <div className="estado-numero">{resumenMesas.reservadas}</div>
              <div className="estado-label">Reservadas</div>
            </div>
            <div className="mesa-estado-item limpieza">
              <div className="estado-numero">{resumenMesas.enLimpieza}</div>
              <div className="estado-label">En Limpieza</div>
            </div>
          </div>

          <div className="ocupacion-bar">
            <div className="bar-label">
              Ocupación: {resumenMesas.total > 0
                ? ((resumenMesas.ocupadas / resumenMesas.total) * 100).toFixed(0)
                : 0}%
            </div>
            <div className="bar">
              <div
                className="bar-fill"
                style={{
                  width: `${resumenMesas.total > 0
                    ? (resumenMesas.ocupadas / resumenMesas.total) * 100
                    : 0}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        {/* Pedidos Activos */}
        <div className="seccion-card pedidos-activos">
          <h2>Pedidos Activos</h2>
          <div className="pedidos-lista">
            {obtenerPedidosPendientes().length > 0 ? (
              obtenerPedidosPendientes().slice(0, 5).map((pedido) => (
                <div key={pedido.id} className="pedido-item">
                  <div className="pedido-info">
                    <div className="pedido-id">Pedido #{pedido.id}</div>
                    <div className="pedido-mesa">
                      {pedido.numeroMesa ? `Mesa ${pedido.numeroMesa}` : 'Delivery'}
                    </div>
                  </div>
                  <div className="pedido-monto">S/ {pedido.total?.toFixed(2) || '0.00'}</div>
                  <div
                    className="pedido-estado-badge"
                    style={{ backgroundColor: getEstadoPedidoColor(pedido.estado) }}
                  >
                    {getEstadoPedidoTexto(pedido.estado)}
                  </div>
                </div>
              ))
            ) : (
              <div className="lista-vacia">No hay pedidos activos</div>
            )}
          </div>
        </div>

        {/* Productos Populares */}
        <div className="seccion-card productos-populares">
          <h2>Productos Más Vendidos</h2>
          <div className="productos-lista">
            {obtenerProductosPopulares().length > 0 ? (
              obtenerProductosPopulares().map((producto, index) => (
                <div key={producto.id} className="producto-item">
                  <div className="producto-ranking">{index + 1}</div>
                  <div className="producto-info">
                    <div className="producto-nombre">{producto.nombre}</div>
                    <div className="producto-ventas">{producto.vecesVendido || 0} vendidos</div>
                  </div>
                  <div className="producto-precio">S/ {producto.precio?.toFixed(2) || '0.00'}</div>
                </div>
              ))
            ) : (
              <div className="lista-vacia">No hay datos de productos populares</div>
            )}
          </div>
        </div>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="seccion-card">
        <h2>Estadísticas Generales</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-label">Total Pedidos</div>
            <div className="stat-value">{pedidos.length}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Pedidos Entregados</div>
            <div className="stat-value">
              {pedidos.filter(p => p.estado === 'ENTREGADO').length}
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Pedidos Cancelados</div>
            <div className="stat-value">
              {pedidos.filter(p => p.estado === 'CANCELADO').length}
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Productos Disponibles</div>
            <div className="stat-value">
              {productos.filter(p => p.disponible).length}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-footer">
        <button className="btn-refresh" onClick={cargarDatos}>
          🔄 Actualizar Datos
        </button>
      </div>
    </div>
  );
}

export default DashboardAdmin;
