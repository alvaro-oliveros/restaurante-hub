import { useState, useEffect } from 'react';
import pedidoService from '../../services/pedidoService';

function GestionPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('TODOS');

  useEffect(() => {
    cargarPedidos();
  }, [filtroEstado]);

  const cargarPedidos = async () => {
    try {
      if (filtroEstado === 'TODOS') {
        const data = await pedidoService.obtenerTodos();
        setPedidos(data);
      } else {
        const data = await pedidoService.obtenerPorEstado(filtroEstado);
        setPedidos(data);
      }
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    }
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      await pedidoService.actualizarEstado(id, nuevoEstado);
      await cargarPedidos();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  return (
    <div className="gestion-pedidos">
      <h3>Gestión de Pedidos</h3>

      <div className="filtros">
        <label>Filtrar por estado:</label>
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="TODOS">Todos</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="CONFIRMADO">Confirmado</option>
          <option value="EN_PREPARACION">En Preparación</option>
          <option value="LISTO">Listo</option>
          <option value="ENTREGADO">Entregado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
      </div>

      <table className="pedidos-tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Tipo</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id}>
              <td>{pedido.id}</td>
              <td>{new Date(pedido.fechaPedido).toLocaleString('es-PE')}</td>
              <td>{pedido.clienteId}</td>
              <td>{pedido.tipo}</td>
              <td>S/ {pedido.total?.toFixed(2)}</td>
              <td>{pedido.estado}</td>
              <td>
                <select
                  value={pedido.estado}
                  onChange={(e) => actualizarEstado(pedido.id, e.target.value)}
                >
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="CONFIRMADO">Confirmado</option>
                  <option value="EN_PREPARACION">En Preparación</option>
                  <option value="LISTO">Listo</option>
                  <option value="ENTREGADO">Entregado</option>
                  <option value="CANCELADO">Cancelado</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GestionPedidos;
