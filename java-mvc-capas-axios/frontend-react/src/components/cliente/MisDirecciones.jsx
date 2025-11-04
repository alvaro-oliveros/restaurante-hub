import { useState, useEffect } from 'react';
import direccionService from '../../services/direccionService';

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
      <h3>Mis Direcciones</h3>

      <button onClick={() => setMostrarFormulario(!mostrarFormulario)}>
        {mostrarFormulario ? 'Cancelar' : 'Nueva Dirección'}
      </button>

      {mostrarFormulario && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Alias (ej: Casa, Trabajo)"
            value={nuevaDireccion.alias}
            onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, alias: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Dirección"
            value={nuevaDireccion.direccion}
            onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, direccion: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Distrito"
            value={nuevaDireccion.distrito}
            onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, distrito: e.target.value })}
          />
          <input
            type="text"
            placeholder="Ciudad"
            value={nuevaDireccion.ciudad}
            onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, ciudad: e.target.value })}
          />
          <textarea
            placeholder="Referencia"
            value={nuevaDireccion.referencia}
            onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, referencia: e.target.value })}
          />
          <button type="submit">Guardar</button>
        </form>
      )}

      <div className="direcciones-lista">
        {direcciones.map((dir) => (
          <div key={dir.id} className="direccion-card">
            <h4>{dir.alias}</h4>
            <p>{dir.direccion}</p>
            <p>{dir.distrito} - {dir.ciudad}</p>
            {dir.referencia && <p><small>{dir.referencia}</small></p>}
            {dir.esPrincipal && <span className="badge">Principal</span>}
            <button onClick={() => eliminarDireccion(dir.id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MisDirecciones;
