import { useState, useEffect } from 'react';
import pedidoService from '../../services/pedidoService';

function HistorialPedidos({ clienteId }) {
  const [pedidos, setPedidos] = useState([]);

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

  return (
    <div className="historial-pedidos">
      <h3>Historial de Pedidos</h3>
      <div className="pedidos-lista">
        {pedidos.length === 0 ? (
          <p>No tienes pedidos realizados</p>
        ) : (
          pedidos.map((pedido) => (
            <div key={pedido.id} className="pedido-card">
              <div className="pedido-header">
                <h4>Pedido #{pedido.id}</h4>
                <span style={{ color: getEstadoColor(pedido.estado) }}>
                  {pedido.estado}
                </span>
              </div>
              <p>Fecha: {new Date(pedido.fechaPedido).toLocaleDateString('es-PE')}</p>
              <p>Tipo: {pedido.tipo}</p>
              <p>Total: S/ {pedido.total?.toFixed(2)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HistorialPedidos;
