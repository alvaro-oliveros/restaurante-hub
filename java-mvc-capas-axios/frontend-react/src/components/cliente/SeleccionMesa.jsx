import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mesaService from '../../services/mesaService';
import './SeleccionMesa.css';

function SeleccionMesa() {
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('DISPONIBLE');
  const [filtroUbicacion, setFiltroUbicacion] = useState('TODAS');
  const navigate = useNavigate();

  useEffect(() => {
    cargarMesas();
  }, []);

  const cargarMesas = async () => {
    try {
      setLoading(true);
      const data = await mesaService.obtenerTodas();
      setMesas(data);
    } catch (error) {
      console.error('Error al cargar mesas:', error);
      alert('Error al cargar las mesas');
    } finally {
      setLoading(false);
    }
  };

  const mesasFiltradas = mesas.filter(mesa => {
    const cumpleFiltroEstado = filtroEstado === 'TODAS' || mesa.estado === filtroEstado;
    const cumpleFiltroUbicacion = filtroUbicacion === 'TODAS' || mesa.ubicacion === filtroUbicacion;
    return cumpleFiltroEstado && cumpleFiltroUbicacion;
  });

  const seleccionarMesa = (mesa) => {
    if (mesa.estado === 'DISPONIBLE') {
      navigate(`/cliente/menu/${mesa.id}`);
    } else {
      alert('Esta mesa no está disponible');
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'DISPONIBLE': return '#10b981';
      case 'OCUPADA': return '#ef4444';
      case 'RESERVADA': return '#f59e0b';
      case 'LIMPIEZA': return '#6366f1';
      default: return '#6b7280';
    }
  };

  const getEstadoTexto = (estado) => {
    switch (estado) {
      case 'DISPONIBLE': return 'Disponible';
      case 'OCUPADA': return 'Ocupada';
      case 'RESERVADA': return 'Reservada';
      case 'LIMPIEZA': return 'En Limpieza';
      default: return estado;
    }
  };

  const ubicaciones = ['TODAS', ...new Set(mesas.map(m => m.ubicacion))];

  if (loading) {
    return (
      <div className="seleccion-mesa-container">
        <div className="loading">Cargando mesas...</div>
      </div>
    );
  }

  return (
    <div className="seleccion-mesa-container">
      <div className="seleccion-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Volver
        </button>
        <h1>Selecciona tu Mesa</h1>
        <p>Elige una mesa disponible para comenzar tu pedido</p>
      </div>

      <div className="filtros-container">
        <div className="filtro-group">
          <label>Estado:</label>
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="TODAS">Todas</option>
            <option value="DISPONIBLE">Disponibles</option>
            <option value="OCUPADA">Ocupadas</option>
            <option value="RESERVADA">Reservadas</option>
            <option value="LIMPIEZA">En Limpieza</option>
          </select>
        </div>

        <div className="filtro-group">
          <label>Ubicación:</label>
          <select value={filtroUbicacion} onChange={(e) => setFiltroUbicacion(e.target.value)}>
            {ubicaciones.map(ub => (
              <option key={ub} value={ub}>{ub}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mesas-grid">
        {mesasFiltradas.map((mesa) => (
          <div
            key={mesa.id}
            className={`mesa-card ${mesa.estado === 'DISPONIBLE' ? 'disponible' : 'no-disponible'}`}
            onClick={() => seleccionarMesa(mesa)}
            style={{
              borderColor: getEstadoColor(mesa.estado)
            }}
          >
            <div className="mesa-numero">
              <span className="mesa-icono">🪑</span>
              <span className="numero">Mesa {mesa.numeroMesa}</span>
            </div>

            <div className="mesa-info">
              <div className="info-item">
                <span className="label">Capacidad:</span>
                <span className="value">{mesa.capacidad} personas</span>
              </div>
              <div className="info-item">
                <span className="label">Ubicación:</span>
                <span className="value">{mesa.ubicacion}</span>
              </div>
            </div>

            <div
              className="mesa-estado"
              style={{ backgroundColor: getEstadoColor(mesa.estado) }}
            >
              {getEstadoTexto(mesa.estado)}
            </div>

            {mesa.estado === 'DISPONIBLE' && (
              <div className="mesa-accion">
                Toca para seleccionar →
              </div>
            )}
          </div>
        ))}
      </div>

      {mesasFiltradas.length === 0 && (
        <div className="no-mesas">
          <p>No hay mesas que coincidan con los filtros seleccionados</p>
        </div>
      )}

      <div className="qr-section">
        <div className="qr-divider">
          <span>o</span>
        </div>
        <button className="btn-qr" onClick={() => alert('Función de escaneo QR próximamente')}>
          📱 Escanear Código QR de la Mesa
        </button>
      </div>
    </div>
  );
}

export default SeleccionMesa;
