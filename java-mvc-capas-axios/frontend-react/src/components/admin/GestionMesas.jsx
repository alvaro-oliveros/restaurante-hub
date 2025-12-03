import { useEffect, useState } from 'react';
import mesaService from '../../services/mesaService';

function GestionMesas() {
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [estadoFiltro, setEstadoFiltro] = useState('TODAS');
  const [touches, setTouches] = useState({});

  const estadoLabels = {
    DISPONIBLE: 'Disponible',
    OCUPADA: 'Ocupada',
    RESERVADA: 'Reservada',
    LIMPIEZA: 'En limpieza',
  };

  useEffect(() => {
    cargarMesas();
  }, [estadoFiltro]);

  const ordenarMesas = (lista, touchMap = touches) => {
    // Las mesas cambiadas recientemente arriba: usa updatedAt si viene del backend
    // o bien el toque local guardado en `touches`.
    return lista
      .slice()
      .sort((a, b) => {
        const touchA = touchMap[a.id] || 0;
        const touchB = touchMap[b.id] || 0;
        if (touchA !== touchB) return touchB - touchA;
        if (a.updatedAt && b.updatedAt && a.updatedAt !== b.updatedAt) {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        }
        // fallback: estado y luego id descendente
        if (a.estado !== b.estado) return a.estado.localeCompare(b.estado);
        return b.id - a.id;
      });
  };

  const cargarMesas = async (mesaTocadaId = null, marca = null) => {
    try {
      setLoading(true);
      const nuevoTouchMap = { ...touches };
      if (mesaTocadaId) {
        nuevoTouchMap[mesaTocadaId] = marca || Date.now();
        setTouches(nuevoTouchMap);
      }
      if (estadoFiltro === 'TODAS') {
        const data = await mesaService.obtenerTodas();
        setMesas(ordenarMesas(data, nuevoTouchMap));
      } else {
        const data = await mesaService.obtenerPorEstado(estadoFiltro);
        setMesas(ordenarMesas(data, nuevoTouchMap));
      }
    } catch (error) {
      console.error('Error al cargar mesas:', error);
      alert('No se pudo cargar la lista de mesas');
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstado = async (id, nuevoEstado, mesaObj = null) => {
    try {
      // Confirmar si hay pedido activo y se quiere marcar disponible o reservar
      if (mesaObj?.tienePedidoActivo && (nuevoEstado === 'DISPONIBLE' || nuevoEstado === 'RESERVADA')) {
        const ok = window.confirm('Esta mesa tiene o tenía un pedido activo. ¿Confirmas el cambio de estado?');
        if (!ok) return;
      }
      await mesaService.actualizarEstado(id, nuevoEstado);
      const marca = Date.now();
      setTouches((prev) => ({ ...prev, [id]: marca }));
      await cargarMesas(id, marca);
    } catch (error) {
      console.error('Error al actualizar estado de mesa:', error);
      alert('No se pudo actualizar la mesa');
    }
  };

  if (loading) {
    return <div className="gestion-mesas"><p>Cargando mesas...</p></div>;
  }

  return (
    <div className="gestion-mesas">
      <h3>Gestión de Mesas</h3>

      <div className="filtros">
        <label>Filtrar por estado:</label>
        <select
          className="select-estado"
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
        >
          <option value="TODAS">Todas</option>
          <option value="DISPONIBLE">Disponibles</option>
          <option value="OCUPADA">Ocupadas</option>
          <option value="RESERVADA">Reservadas</option>
          <option value="LIMPIEZA">En Limpieza</option>
        </select>
      </div>

      <div className="tabla-wrapper">
        <table className="pedidos-tabla mesas-tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Número</th>
            <th>Capacidad</th>
            <th>Ubicación</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {mesas.map((mesa) => (
            <tr key={mesa.id}>
              <td>{mesa.id}</td>
              <td>{mesa.numeroMesa}</td>
              <td>{mesa.capacidad} personas</td>
              <td>{mesa.ubicacion}</td>
              <td>
                <div className="estado-col">
                  <span className={`estado-pill ${mesa.estado.toLowerCase()}`}>
                    {estadoLabels[mesa.estado] || mesa.estado}
                  </span>
                  <select
                    className="select-estado"
                    value={mesa.estado}
                    onChange={(e) => actualizarEstado(mesa.id, e.target.value)}
                  >
                    <option value="DISPONIBLE">Disponible</option>
                    <option value="OCUPADA">Ocupada</option>
                    <option value="RESERVADA">Reservada</option>
                    <option value="LIMPIEZA">En limpieza</option>
                  </select>
                </div>
              </td>
              <td>
                <div className="acciones-mesa">
                  <button
                    type="button"
                    className="btn-avanzar"
                    onClick={() => actualizarEstado(mesa.id, 'DISPONIBLE', mesa)}
                  >
                    Marcar disponible
                  </button>
                  <button
                    type="button"
                    className="btn-detalle"
                    onClick={() => actualizarEstado(mesa.id, 'RESERVADA', mesa)}
                  >
                    Reservar
                  </button>
                  <button
                    type="button"
                    className="btn-cancelar"
                    onClick={() => actualizarEstado(mesa.id, 'LIMPIEZA', mesa)}
                  >
                    En limpieza
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default GestionMesas;
