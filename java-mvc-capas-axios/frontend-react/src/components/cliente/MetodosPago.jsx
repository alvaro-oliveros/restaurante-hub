import { useState, useEffect } from 'react';
import metodoPagoService from '../../services/metodoPagoService';

function MetodosPago({ clienteId }) {
  const [metodosPago, setMetodosPago] = useState([]);
  const [mostrandoForm, setMostrandoForm] = useState(false);
  const [metodo, setMetodo] = useState({
    tipo: 'YAPE',
    alias: '',
    ultimosCuatroDigitos: '',
    nombreTarjeta: '',
    mesExpiracion: '',
    esPrincipal: false,
  });

  useEffect(() => {
    cargarMetodosPago();
  }, [clienteId]);

  const cargarMetodosPago = async () => {
    try {
      const data = await metodoPagoService.obtenerPorCliente(clienteId);
      if (data.length === 0) {
        // Si no hay métodos, no hacemos nada extra
      }
      setMetodosPago(data);
    } catch (error) {
      console.error('Error al cargar métodos de pago:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...metodo };
      if (!esTarjeta) {
        payload.ultimosCuatroDigitos = null;
        payload.nombreTarjeta = null;
        payload.mesExpiracion = null;
      }
      await metodoPagoService.crear(clienteId, payload);
      setMostrandoForm(false);
      setMetodo({
        tipo: 'YAPE',
        alias: '',
        ultimosCuatroDigitos: '',
        nombreTarjeta: '',
        mesExpiracion: '',
        esPrincipal: false,
      });
      await cargarMetodosPago();
    } catch (error) {
      console.error('Error al guardar método de pago:', error);
    }
  };

  const esTarjeta = metodo.tipo === 'TARJETA_CREDITO' || metodo.tipo === 'TARJETA_DEBITO';

  return (
    <div className="metodos-pago">
      <h3>Métodos de Pago</h3>
      <p>Gestiona tus tarjetas y métodos de pago guardados</p>

      <div className="direcciones-header" style={{ marginBottom: '10px' }}>
        <div />
        <button className="btn-nav" type="button" onClick={() => setMostrandoForm(!mostrandoForm)}>
          {mostrandoForm ? 'Cancelar' : 'Nuevo método'}
        </button>
      </div>

      {mostrandoForm && (
        <div className="card-panel">
          <form onSubmit={handleSubmit} className="direccion-form">
            <div className="form-grid">
              <label>
                Tipo de pago
                <select value={metodo.tipo} onChange={(e) => setMetodo({ ...metodo, tipo: e.target.value })}>
                  <option value="YAPE">Yape</option>
                  <option value="PLIN">Plin</option>
                  <option value="TARJETA_DEBITO">Tarjeta Débito</option>
                  <option value="TARJETA_CREDITO">Tarjeta Crédito</option>
                  <option value="EFECTIVO">Efectivo</option>
                </select>
              </label>
              <label>
                Alias
                <input
                  type="text"
                  placeholder="Mi Yape / Visa Personal"
                  value={metodo.alias}
                  onChange={(e) => setMetodo({ ...metodo, alias: e.target.value })}
                  required
                />
              </label>
              {esTarjeta && (
                <>
                  <label>
                    Últimos 4 dígitos
                    <input
                      type="text"
                      maxLength={4}
                      value={metodo.ultimosCuatroDigitos}
                      onChange={(e) => setMetodo({ ...metodo, ultimosCuatroDigitos: e.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Nombre en tarjeta
                    <input
                      type="text"
                      value={metodo.nombreTarjeta}
                      onChange={(e) => setMetodo({ ...metodo, nombreTarjeta: e.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Expiración (MM/YY)
                    <input
                      type="text"
                      placeholder="12/26"
                      value={metodo.mesExpiracion}
                      onChange={(e) => setMetodo({ ...metodo, mesExpiracion: e.target.value })}
                      required
                    />
                  </label>
                </>
              )}
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={metodo.esPrincipal}
                  onChange={(e) => setMetodo({ ...metodo, esPrincipal: e.target.checked })}
                />
                Marcar como principal
              </label>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secundario" onClick={() => setMostrandoForm(false)}>Cancelar</button>
              <button type="submit" className="btn-nav">Guardar</button>
            </div>
          </form>
        </div>
      )}

      <div className="metodos-lista">
        {metodosPago.length === 0 ? (
          <p>No tienes métodos de pago guardados</p>
        ) : (
          metodosPago.map((m) => (
            <div key={m.id} className="card-panel metodo-card">
              <div className="direccion-head">
                <div>
                  <h4>{m.alias || m.tipo}</h4>
                  <p className="direccion-meta">{m.tipo}</p>
                </div>
                {m.esPrincipal && <span className="badge">Principal</span>}
              </div>
              {m.ultimosCuatroDigitos && <p className="direccion-text">**** {m.ultimosCuatroDigitos}</p>}
              {m.nombreTarjeta && <p className="direccion-meta">{m.nombreTarjeta} · {m.mesExpiracion}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MetodosPago;
