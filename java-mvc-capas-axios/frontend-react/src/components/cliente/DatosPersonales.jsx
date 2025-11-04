import { useState, useEffect } from 'react';
import clienteService from '../../services/clienteService';

function DatosPersonales({ clienteId }) {
  const [cliente, setCliente] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    documentoIdentidad: '',
  });
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarCliente();
  }, [clienteId]);

  const cargarCliente = async () => {
    try {
      const data = await clienteService.obtenerPorId(clienteId);
      setCliente(data);
    } catch (error) {
      setMensaje('Error al cargar los datos del cliente');
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await clienteService.actualizar(clienteId, cliente);
      setMensaje('Datos actualizados correctamente');
      setEditando(false);
    } catch (error) {
      setMensaje('Error al actualizar los datos');
      console.error(error);
    }
  };

  return (
    <div className="datos-personales">
      <h3>Datos Personales</h3>

      {mensaje && <div className="mensaje">{mensaje}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={cliente.nombre}
            onChange={handleChange}
            disabled={!editando}
            required
          />
        </div>

        <div className="form-group">
          <label>Apellido:</label>
          <input
            type="text"
            name="apellido"
            value={cliente.apellido}
            onChange={handleChange}
            disabled={!editando}
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={cliente.email}
            onChange={handleChange}
            disabled={!editando}
            required
          />
        </div>

        <div className="form-group">
          <label>Teléfono:</label>
          <input
            type="tel"
            name="telefono"
            value={cliente.telefono || ''}
            onChange={handleChange}
            disabled={!editando}
          />
        </div>

        <div className="form-group">
          <label>Documento de Identidad:</label>
          <input
            type="text"
            name="documentoIdentidad"
            value={cliente.documentoIdentidad || ''}
            onChange={handleChange}
            disabled={!editando}
          />
        </div>

        <div className="form-actions">
          {!editando ? (
            <button type="button" onClick={() => setEditando(true)}>
              Editar
            </button>
          ) : (
            <>
              <button type="submit">Guardar</button>
              <button
                type="button"
                onClick={() => {
                  setEditando(false);
                  cargarCliente();
                }}
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export default DatosPersonales;
