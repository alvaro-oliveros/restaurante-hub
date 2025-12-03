import { useEffect, useState } from 'react';
import pedidoService from '../../services/pedidoService';

const estadoLabels = {
  PENDIENTE: 'Pendiente',
  CONFIRMADO: 'Confirmado',
  EN_PREPARACION: 'En preparación',
  LISTO: 'Listo para entregar',
  RECOGIDO: 'Recogido',
  ENTREGADO: 'Entregado',
  SERVIDO: 'Servido',
  PAGADO: 'Pagado',
  CANCELADO: 'Cancelado',
};

function SeguimientoPedido({ pedidoId, refrescarCada = 10000 }) {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const cargarHistorial = async () => {
    if (!pedidoId) return;
    try {
      setCargando(true);
      setError(null);
      const data = await pedidoService.obtenerHistorial(pedidoId);
      setEventos(data);
    } catch (err) {
      setError('No se pudo cargar el historial');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarHistorial();
    if (!pedidoId) return undefined;
    const id = setInterval(() => {
      cargarHistorial();
    }, refrescarCada);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pedidoId]);

  if (!pedidoId) return null;

  return (
    <div className="seguimiento-pedido">
      <div className="seguimiento-header">
        <h5>Seguimiento pedido #{pedidoId}</h5>
        <button type="button" onClick={cargarHistorial} className="btn-secundario btn-mini">Refrescar</button>
      </div>
      {cargando && <p>Cargando historial...</p>}
      {error && <p className="error-text">{error}</p>}
      {!cargando && !error && (
        <ul className="timeline">
          {eventos.map((ev, idx) => (
            <li key={`${ev.estado}-${ev.fechaCambio}-${idx}`} className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-content">
                <div className="timeline-title">{estadoLabels[ev.estado] || ev.estado}</div>
                <div className="timeline-date">
                  {ev.fechaCambio
                    ? new Date(ev.fechaCambio).toLocaleString('es-PE')
                    : ''}
                </div>
              </div>
            </li>
          ))}
          {eventos.length === 0 && <li className="timeline-item">Sin eventos aún.</li>}
        </ul>
      )}
    </div>
  );
}

export default SeguimientoPedido;
