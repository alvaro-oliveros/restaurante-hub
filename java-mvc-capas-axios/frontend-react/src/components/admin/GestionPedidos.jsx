import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import pedidoService from '../../services/pedidoService';

function GestionPedidos() {
  const [searchParams] = useSearchParams();
  const [pedidos, setPedidos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [touches, setTouches] = useState({});
  const [vista, setVista] = useState('activos'); // activos | historico

  useEffect(() => {
    cargarPedidos();
  }, [filtroEstado]);

  // Si viene ?pedidoId= desde dashboard, abrir detalle
  useEffect(() => {
    const pedidoId = searchParams.get('pedidoId');
    if (pedidoId) {
      // cargar lista y luego abrir
      cargarPedidos(Number(pedidoId), 'fromDashboard');
      pedidoService.obtenerPorId(pedidoId)
        .then(setPedidoSeleccionado)
        .catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarPedidos = async (pedidoTocadoId = null, marca = null) => {
    try {
      const nuevoTouchMap = { ...touches };
      if (pedidoTocadoId) {
        nuevoTouchMap[pedidoTocadoId] = marca || Date.now();
        setTouches(nuevoTouchMap);
      }

      if (filtroEstado === 'TODOS') {
        const data = await pedidoService.obtenerTodos();
        setPedidos(ordenarPedidos(data, nuevoTouchMap));
      } else {
        const data = await pedidoService.obtenerPorEstado(filtroEstado);
        setPedidos(ordenarPedidos(data, nuevoTouchMap));
      }
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    }
  };

  const ordenarPedidos = (lista, touchMap = touches) => {
    return lista
      .slice()
      .sort((a, b) => {
        const touchA = touchMap[a.id] || 0;
        const touchB = touchMap[b.id] || 0;
        if (touchA !== touchB) return touchB - touchA;
        const idA = Number(a.id) || 0;
        const idB = Number(b.id) || 0;
        if (idA !== idB) return idB - idA; // más alto primero
        const fechaA = a.fechaPedido ? new Date(a.fechaPedido).getTime() : 0;
        const fechaB = b.fechaPedido ? new Date(b.fechaPedido).getTime() : 0;
        if (fechaA !== fechaB) return fechaB - fechaA;
        return 0;
      });
  };

  const cerrarDetalle = () => setPedidoSeleccionado(null);

  const siguienteEstado = (estado, tipo) => {
    // Flujo presencial usa SERVIDO (antes ENTREGADO)
    const ordenPresencial = ['PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'LISTO', 'SERVIDO', 'PAGADO'];
    const ordenDelivery = ['PENDIENTE', 'EN_PREPARACION', 'LISTO', 'RECOGIDO', 'ENTREGADO'];
    const orden = tipo === 'DELIVERY' ? ordenDelivery : ordenPresencial;
    const idx = orden.indexOf(estado);
    if (idx === -1 || idx === orden.length - 1) return estado;
    return orden[idx + 1];
  };

  const avanzarEstado = async (pedido) => {
    const next = siguienteEstado(pedido.estado, pedido.tipo);
    if (next === pedido.estado) return;
    await actualizarEstado(pedido.id, next, pedido);
  };

  const cancelarPedido = async (pedido) => {
    const ok = window.confirm(`¿Cancelar el pedido #${pedido.id}?`);
    if (!ok) return;
    await actualizarEstado(pedido.id, 'CANCELADO', pedido);
  };

  const actualizarEstado = async (id, nuevoEstado, pedidoObj = null) => {
    try {
      const marca = Date.now();
      await pedidoService.actualizarEstado(id, nuevoEstado);
      setTouches((prev) => ({ ...prev, [id]: marca }));
      await cargarPedidos(id, marca);

      // si el modal está abierto, actualiza el estado localmente para reflejarlo al instante
      setPedidoSeleccionado((prev) => prev && prev.id === id ? { ...prev, estado: nuevoEstado } : prev);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  const esActivo = (estado) => {
    return estado === 'PENDIENTE' || estado === 'CONFIRMADO' || estado === 'EN_PREPARACION' || estado === 'LISTO' || estado === 'RECOGIDO' || estado === 'SERVIDO';
  };

  const pedidosFiltrados = pedidos.filter((p) => {
    const coincideEstado = filtroEstado === 'TODOS' || p.estado === filtroEstado;
    const coincideVista = vista === 'activos' ? esActivo(p.estado) : (!esActivo(p.estado));
    return coincideEstado && coincideVista;
  });

  return (
    <div className="gestion-pedidos">
      <h3>Gestión de Pedidos</h3>

      <div className="tabs-vista">
        <button
          className={vista === 'activos' ? 'tab active' : 'tab'}
          onClick={() => setVista('activos')}
        >
          Activos
        </button>
        <button
          className={vista === 'historico' ? 'tab active' : 'tab'}
          onClick={() => setVista('historico')}
        >
          Entregados / Cancelados
        </button>
      </div>

      <div className="filtros">
        <label>Filtrar por estado:</label>
        <select className="select-estado" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="TODOS">Todos</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="CONFIRMADO">Confirmado</option>
          <option value="EN_PREPARACION">En Preparación</option>
          <option value="LISTO">Listo</option>
          <option value="SERVIDO">Servido</option>
          <option value="RECOGIDO">Recogido</option>
          <option value="ENTREGADO">Entregado</option>
          <option value="PAGADO">Pagado</option>
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
          {pedidosFiltrados.map((pedido) => (
            <tr key={pedido.id}>
              <td>{pedido.id}</td>
              <td>{new Date(pedido.fechaPedido).toLocaleString('es-PE')}</td>
              <td>{pedido.clienteId}</td>
              <td>{pedido.tipo}</td>
              <td>S/ {pedido.total?.toFixed(2)}</td>
          <td>
            <select
              className="select-estado"
              value={pedido.estado}
              onChange={(e) => actualizarEstado(pedido.id, e.target.value)}
            >
              <option value="PENDIENTE">Pendiente</option>
              {pedido.tipo === 'PRESENCIAL' && (
                <>
                  <option value="CONFIRMADO">Confirmado</option>
                  <option value="EN_PREPARACION">En Preparación</option>
                  <option value="LISTO">Listo</option>
                  <option value="SERVIDO">Servido</option>
                  <option value="PAGADO">Pagado</option>
                </>
              )}
              {pedido.tipo === 'DELIVERY' && (
                <>
                  <option value="EN_PREPARACION">En Preparación</option>
                  <option value="LISTO">Listo</option>
                  <option value="RECOGIDO">Recogido</option>
                  <option value="ENTREGADO">Entregado</option>
                </>
              )}
                  <option value="CANCELADO">Cancelado</option>
                </select>
              </td>
              <td>
                <div className="acciones-pedido">
                  <button className="btn-avanzar" onClick={() => avanzarEstado(pedido)}>
                    Avanzar estado
                  </button>
                  <button className="btn-detalle" onClick={() => setPedidoSeleccionado(pedido)}>
                    Ver detalle
                  </button>
                  <button className="btn-cancelar" onClick={() => cancelarPedido(pedido)}>
                    Cancelar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {pedidoSeleccionado && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Pedido #{pedidoSeleccionado.id}</h3>
            <p>Cliente: {pedidoSeleccionado.clienteId} · Mesa: {pedidoSeleccionado.numeroMesa || '-'}</p>
            <p>Estado: {pedidoSeleccionado.estado} · Tipo: {pedidoSeleccionado.tipo}</p>

            <div className="modal-resumen">
              {pedidoSeleccionado.detalles?.length ? pedidoSeleccionado.detalles.map((d) => (
                <div key={d.id || `${d.productoId}-${d.nombreProducto}`} className="modal-item">
                  <span>{d.nombreProducto || d.productoId} x {d.cantidad}</span>
                  <span>S/ {(d.precioUnitario * d.cantidad).toFixed(2)}</span>
                </div>
              )) : (
                <div className="modal-item">Sin detalles</div>
              )}
              <div className="modal-total">
                <div>
                  <span>Subtotal</span>
                  <span>S/ {(pedidoSeleccionado.subtotal || 0).toFixed(2)}</span>
                </div>
                <div>
                  <span>IGV</span>
                  <span>S/ {(pedidoSeleccionado.igv || 0).toFixed(2)}</span>
                </div>
                <div className="modal-total-final">
                  <span>Total</span>
                  <span>S/ {(pedidoSeleccionado.total || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                <button className="btn-secundario" onClick={() => avanzarEstado(pedidoSeleccionado)}>
                  Avanzar estado
                </button>
                <button className="btn-secundario" onClick={() => cancelarPedido(pedidoSeleccionado)}>
                  Cancelar
                </button>
              </div>
              <button className="btn-secundario" onClick={cerrarDetalle}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionPedidos;
