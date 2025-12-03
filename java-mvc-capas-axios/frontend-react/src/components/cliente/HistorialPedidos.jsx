import { useState, useEffect } from 'react';
import pedidoService from '../../services/pedidoService';
import SeguimientoPedido from '../common/SeguimientoPedido';

function HistorialPedidos({ clienteId }) {
  const [pedidos, setPedidos] = useState([]);
  const [seguimientosAbiertos, setSeguimientosAbiertos] = useState({});

  useEffect(() => {
    cargarPedidos();
  }, [clienteId]);

  const cargarPedidos = async () => {
    try {
      const data = await pedidoService.obtenerPorCliente(clienteId);
      setPedidos(data);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    }
  };

  const getEstadoColor = (estado) => {
    const colores = {
      PENDIENTE: '#ffa500',
      CONFIRMADO: '#2196f3',
      EN_PREPARACION: '#ff9800',
      LISTO: '#4caf50',
      ENTREGADO: '#8bc34a',
      CANCELADO: '#f44336',
    };
    return colores[estado] || '#000';
  };

  const toggleSeguimiento = (pedidoId) => {
    setSeguimientosAbiertos((prev) => ({
      ...prev,
      [pedidoId]: !prev[pedidoId],
    }));
  };

  return (
    <div className="historial-pedidos">
      <h3>Historial de Pedidos</h3>
      <div className="pedidos-lista">
        {pedidos.length === 0 ? (
          <p>No tienes pedidos realizados</p>
        ) : (
          pedidos.map((pedido) => (
            <div key={pedido.id} className="pedido-card pedido-card--full">
              <div className="pedido-header">
                <div>
                  <h4>Pedido #{pedido.id}</h4>
                  <p className="pedido-meta">Fecha: {new Date(pedido.fechaPedido).toLocaleDateString('es-PE')} · Tipo: {pedido.tipo}</p>
                </div>
                <span className="pedido-estado" style={{ color: getEstadoColor(pedido.estado) }}>
                  {pedido.estado}
                </span>
              </div>
              <div className="pedido-body">
                <p><strong>Total:</strong> S/ {pedido.total?.toFixed(2)}</p>
                <button
                  type="button"
                  className="btn-secundario"
                  onClick={() => toggleSeguimiento(pedido.id)}
                >
                  {seguimientosAbiertos[pedido.id] ? 'Ocultar seguimiento' : 'Ver seguimiento'}
                </button>
              </div>
              {seguimientosAbiertos[pedido.id] && (
                <SeguimientoPedido pedidoId={pedido.id} refrescarCada={8000} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HistorialPedidos;
