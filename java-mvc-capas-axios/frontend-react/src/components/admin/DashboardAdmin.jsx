import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mesaService from '../../services/mesaService';
import pedidoService from '../../services/pedidoService';
import productoService from '../../services/productoService';
import reporteService from '../../services/reporteService';
import './DashboardAdmin.css';

function DashboardAdmin() {
  const navigate = useNavigate();
  const [resumenMesas, setResumenMesas] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [ventasHora, setVentasHora] = useState(null);
  const [pagosMetodo, setPagosMetodo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
    const interval = setInterval(() => cargarDatos(), 15000); // refresco ligero
    return () => clearInterval(interval);
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [mesasData, pedidosData, productosData, ventasPorHora, pagosPorMetodo] = await Promise.all([
        mesaService.obtenerResumenEstados(),
        pedidoService.obtenerTodos(),
        productoService.obtenerTodos(),
        reporteService.obtenerVentasPorHora(),
        reporteService.obtenerPagosPorMetodo()
      ]);

      setResumenMesas(mesasData);
      setPedidos(pedidosData);
      setProductos(productosData);
      setVentasHora(ventasPorHora);
      setPagosMetodo(pagosPorMetodo);
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

  const obtenerHoraPico = () => {
    if (!ventasHora?.horas?.length) return '--';
    const maxHora = ventasHora.horas.reduce((prev, curr) =>
      Number(curr.total || 0) > Number(prev.total || 0) ? curr : prev
    );
    return `${maxHora.hora}:00`;
  };

  const obtenerMetodoPrincipal = () => {
    if (!pagosMetodo?.metodos?.length) return '--';
    const mayor = pagosMetodo.metodos.reduce((prev, curr) =>
      Number(curr.total || 0) > Number(prev.total || 0) ? curr : prev
    );
    return mayor.medioPago;
  };

  const formatearMedioPago = (medio) => {
    if (!medio) return '--';
    switch (medio) {
      case 'TARJETA_CREDITO': return 'Tarjeta Crédito';
      case 'TARJETA_DEBITO': return 'Tarjeta Débito';
      case 'YAPE': return 'Yape';
      case 'PLIN': return 'Plin';
      case 'EFECTIVO': return 'Efectivo';
      default: return medio.replace(/_/g, ' ');
    }
  };

  const obtenerPedidosPendientes = () => {
    return pedidos
      .filter(p =>
        p.estado === 'PENDIENTE' ||
        p.estado === 'CONFIRMADO' ||
        p.estado === 'EN_PREPARACION' ||
        p.estado === 'LISTO' ||
        p.estado === 'RECOGIDO' ||
        p.estado === 'SERVIDO'
      )
      .sort((a, b) => {
        const fa = a.fechaPedido ? new Date(a.fechaPedido).getTime() : 0;
        const fb = b.fechaPedido ? new Date(b.fechaPedido).getTime() : 0;
        if (fb !== fa) return fb - fa;
        return (b.id || 0) - (a.id || 0);
      });
  };

  const obtenerProductosPopulares = () => {
    return productos
      .filter(p => (p.vecesVendido || 0) > 0)
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
      case 'SERVIDO': return '#6b7280';
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
      case 'SERVIDO': return 'Servido';
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
            <div className="kpi-value kpi-value--compact">S/. {calcularIngresosDia().toFixed(2)}</div>
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
              {resumenMesas?.ocupadas || 0} / {resumenMesas?.totalMesas || 0}
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

        <div className="kpi-card horas">
          <div className="kpi-icon">🕒</div>
          <div className="kpi-content">
            <div className="kpi-label">Hora Pico</div>
            <div className="kpi-value">{obtenerHoraPico()}</div>
          </div>
        </div>

        <div className="kpi-card pagos">
          <div className="kpi-icon">💳</div>
          <div className="kpi-content">
            <div className="kpi-label">Método Principal</div>
            <div className="kpi-value kpi-value--wrap kpi-value--multiline">{formatearMedioPago(obtenerMetodoPrincipal())}</div>
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
              Ocupación: {resumenMesas.totalMesas > 0
                ? ((resumenMesas.ocupadas / resumenMesas.totalMesas) * 100).toFixed(0)
                : 0}%
            </div>
            <div className="bar">
              <div
                className="bar-fill"
                style={{
                  width: `${resumenMesas.totalMesas > 0
                    ? (resumenMesas.ocupadas / resumenMesas.totalMesas) * 100
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
              <>
                {obtenerPedidosPendientes().slice(0, 10).map((pedido) => (
                  <div
                    key={pedido.id}
                    className="pedido-item pedido-item--clickable"
                    onClick={() => navigate(`/admin/pedidos?pedidoId=${pedido.id}`)}
                  >
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
                ))}
                {obtenerPedidosPendientes().length > 10 && (
                  <button className="btn-ver-mas" onClick={() => navigate('/admin/pedidos')}>
                    Ver todos los pedidos activos
                  </button>
                )}
              </>
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
