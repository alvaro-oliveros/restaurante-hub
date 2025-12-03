import { useState, useEffect } from 'react';
import direccionService from '../../services/direccionService';
import clienteService from '../../services/clienteService';

function MisDirecciones({ clienteId }) {
  const [direcciones, setDirecciones] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaDireccion, setNuevaDireccion] = useState({
    alias: '',
    direccion: '',
    distrito: '',
    ciudad: '',
    referencia: '',
    esPrincipal: false,
  });

  useEffect(() => {
    cargarDirecciones();
  }, [clienteId]);

  const cargarDirecciones = async () => {
    try {
      const data = await direccionService.obtenerPorCliente(clienteId);
      if (!data || data.length === 0) {
        // Crear la dirección principal con los datos base del cliente si no hay ninguna
        const cliente = await clienteService.obtenerPorId(clienteId);
        if (cliente?.direccion) {
          await direccionService.crear(clienteId, {
            alias: 'Principal',
            direccion: cliente.direccion,
            distrito: cliente.distrito || '',
            ciudad: cliente.ciudad || '',
            codigoPostal: cliente.codigoPostal || '',
            referencia: cliente.referencia || '',
            esPrincipal: true,
          });
          const recargadas = await direccionService.obtenerPorCliente(clienteId);
          setDirecciones(recargadas);
          return;
        }
      }
      setDirecciones(data);
    } catch (error) {
      console.error('Error al cargar direcciones:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await direccionService.crear(clienteId, nuevaDireccion);
      await cargarDirecciones();
      setMostrarFormulario(false);
      setNuevaDireccion({ alias: '', direccion: '', distrito: '', ciudad: '', referencia: '', esPrincipal: false });
    } catch (error) {
      console.error('Error al crear dirección:', error);
    }
  };

  const eliminarDireccion = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta dirección?')) {
      try {
        await direccionService.eliminar(clienteId, id);
        await cargarDirecciones();
      } catch (error) {
        console.error('Error al eliminar dirección:', error);
      }
    }
  };

  return (
    <div className="mis-direcciones">
      <div className="direcciones-header">
        <h3>Mis Direcciones</h3>
        <button className="btn-nav" type="button" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
          {mostrarFormulario ? 'Cancelar' : 'Nueva Dirección'}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="card-panel">
          <h4>Agregar dirección</h4>
          <p className="helper-text">Usa una dirección principal para que se seleccione por defecto en delivery.</p>
          <form onSubmit={handleSubmit} className="direccion-form">
            <div className="form-grid">
              <label>
                Alias
                <input
                  type="text"
                  placeholder="Casa, Trabajo..."
                  value={nuevaDireccion.alias}
                  onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, alias: e.target.value })}
                  required
                />
              </label>
              <label>
                Dirección
                <input
                  type="text"
                  placeholder="Av. Siempre Viva 123"
                  value={nuevaDireccion.direccion}
                  onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, direccion: e.target.value })}
                  required
                />
              </label>
              <label>
                Distrito
                <input
                  type="text"
                  placeholder="Distrito"
                  value={nuevaDireccion.distrito}
                  onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, distrito: e.target.value })}
                />
              </label>
              <label>
                Ciudad
                <input
                  type="text"
                  placeholder="Ciudad"
                  value={nuevaDireccion.ciudad}
                  onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, ciudad: e.target.value })}
                />
              </label>
              <label>
                Código postal
                <input
                  type="text"
                  placeholder="15000"
                  value={nuevaDireccion.codigoPostal || ''}
                  onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, codigoPostal: e.target.value })}
                />
              </label>
              <label className="col-span-2">
                Referencia
                <textarea
                  placeholder="Frente al parque, puerta negra..."
                  value={nuevaDireccion.referencia}
                  onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, referencia: e.target.value })}
                />
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={nuevaDireccion.esPrincipal}
                  onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, esPrincipal: e.target.checked })}
                />
                Marcar como principal
              </label>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secundario" onClick={() => setMostrarFormulario(false)}>Cancelar</button>
              <button type="submit" className="btn-nav">Guardar</button>
            </div>
          </form>
        </div>
      )}

      <div className="direcciones-lista">
        {direcciones.map((dir) => (
          <div key={dir.id} className="direccion-card card-panel">
            <div className="direccion-head">
              <div>
                <h4>{dir.alias}</h4>
                {dir.esPrincipal && <span className="badge">Principal</span>}
              </div>
              <button className="btn-secundario" type="button" onClick={() => eliminarDireccion(dir.id)}>
                Eliminar
              </button>
            </div>
            <p className="direccion-text">{dir.direccion}</p>
            <p className="direccion-meta">
              {[dir.distrito, dir.ciudad, dir.codigoPostal].filter(Boolean).join(' · ')}
            </p>
            {dir.referencia && <p className="direccion-ref">{dir.referencia}</p>}
          </div>
        ))}
        {direcciones.length === 0 && <p className="helper-text">Aún no has agregado direcciones.</p>}
      </div>
    </div>
  );
}

export default MisDirecciones;
