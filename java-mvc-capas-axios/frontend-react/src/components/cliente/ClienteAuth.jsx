import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import './ClienteAuth.css';
import { loginCliente, registerCliente, fetchClienteActual, logoutCliente } from '../../services/authService';

const initialForm = {
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  telefono: '',
  direccion: '',
  tipoVia: 'Calle',
  numero: '',
  distrito: '',
  ciudad: '',
  codigoPostal: '',
  referencia: '',
  documentoIdentidad: '',
};

function ClienteAuth() {
  const [modo, setModo] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cliente, setCliente] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/cliente/menu/delivery';

  useEffect(() => {
    const search = new URLSearchParams(location.search);
    const view = search.get('view');
    if (view === 'register') setModo('register');
  }, [location.search]);

  useEffect(() => {
    fetchClienteActual()
      .then(setCliente)
      .catch(() => setCliente(null));
  }, []);

  useEffect(() => {
    if (cliente && redirect) {
      const destino = redirect.startsWith('/') ? redirect : `/${redirect}`;
      const current = location.pathname + location.search;
      if (destino !== current) {
        navigate(destino, { replace: true });
      }
    }
  }, [cliente, redirect, navigate, location.pathname, location.search]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (modo === 'login') {
        const data = await loginCliente({ email: form.email, password: form.password });
        setCliente(data);
      } else {
        const data = await registerCliente(form);
        setCliente(data);
      }
      setForm(initialForm);
      navigate(redirect, { replace: true });
    } catch (err) {
      setError('No pudimos completar la acción. Revisa tus datos e inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutCliente();
    setCliente(null);
  };

  return (
    <div className="cliente-auth">
      <div className="cliente-auth__card">
        <div className="cliente-auth__header">
          <h1>{modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h1>
          <p>Para pedidos delivery necesitas tu cuenta de cliente.</p>
        </div>

        {cliente && (
          <div className="cliente-auth__logged">
            <p>Sesión iniciada como <strong>{cliente.nombre}</strong></p>
            <div className="cliente-auth__logged-actions">
              <button onClick={() => navigate(redirect, { replace: true })} className="btn-primary">
                Ir al menú
              </button>
              <button onClick={handleLogout} className="btn-secondary">Cerrar sesión</button>
            </div>
          </div>
        )}

        {!cliente && (
          <>
            <form className="cliente-auth__form" onSubmit={handleSubmit}>
              {modo === 'register' && (
                <div className="cliente-auth__grid">
                  <label>
                    Nombre
                    <input name="nombre" value={form.nombre} onChange={handleChange} required />
                  </label>
                  <label>
                    Apellido
                    <input name="apellido" value={form.apellido} onChange={handleChange} required />
                  </label>
                </div>
              )}

              <label>
                Correo electrónico
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </label>

              <label>
                Contraseña
                <input type="password" name="password" value={form.password} onChange={handleChange} required />
              </label>

              {modo === 'register' && (
                <>
                  <label>
                    Teléfono
                    <input name="telefono" value={form.telefono} onChange={handleChange} required />
                  </label>
                  <label>
                    DNI / Documento de identidad
                    <input name="documentoIdentidad" value={form.documentoIdentidad} onChange={handleChange} required />
                  </label>
                  <label>
                    Dirección
                    <input name="direccion" value={form.direccion} onChange={handleChange} required />
                  </label>
                  <div className="cliente-auth__grid">
                    <label>
                      Tipo de vía (calle/avenida)
                      <input name="tipoVia" value={form.tipoVia} onChange={handleChange} required />
                    </label>
                    <label>
                      Número
                      <input name="numero" value={form.numero} onChange={handleChange} required />
                    </label>
                  </div>
                  <div className="cliente-auth__grid">
                    <label>
                      Distrito
                      <input name="distrito" value={form.distrito} onChange={handleChange} required />
                    </label>
                    <label>
                      Ciudad
                      <input name="ciudad" value={form.ciudad} onChange={handleChange} required />
                    </label>
                  </div>
                  <label>
                    Código postal
                    <input name="codigoPostal" value={form.codigoPostal} onChange={handleChange} required />
                  </label>
                  <label>
                    Referencia complementaria
                    <input name="referencia" value={form.referencia} onChange={handleChange} />
                  </label>
                </>
              )}

              {error && <div className="cliente-auth__error">{error}</div>}

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Procesando...' : modo === 'login' ? 'Entrar' : 'Registrarme'}
              </button>
            </form>

            <div className="cliente-auth__switch">
              {modo === 'login' ? (
                <span>¿Aún no tienes cuenta? <button onClick={() => setModo('register')}>Crear cuenta</button></span>
              ) : (
                <span>¿Ya tienes cuenta? <button onClick={() => setModo('login')}>Iniciar sesión</button></span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ClienteAuth;
