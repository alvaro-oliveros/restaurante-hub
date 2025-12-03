import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import DatosPersonales from './DatosPersonales';
import MisDirecciones from './MisDirecciones';
import MetodosPago from './MetodosPago';
import HistorialPedidos from './HistorialPedidos';
import './PerfilCliente.css';
import { fetchClienteActual } from '../../services/authService';

function PerfilCliente() {
  const [cliente, setCliente] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClienteActual()
      .then((data) => setCliente(data))
      .catch(() => {
        setCliente(null);
        navigate('/cliente/login?redirect=/cliente/datos', { replace: true });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!cliente) {
    return <div className="perfil-cliente">Cargando perfil...</div>;
  }

  return (
    <div className="perfil-cliente">
      <div className="perfil-topbar">
        <div className="perfil-topbar-left">
          <button className="btn-nav" type="button" onClick={() => navigate('/')}>
            ← Inicio
          </button>
          <h2>Mi Perfil</h2>
        </div>
        <div className="perfil-topbar-right">
          <button className="btn-nav" type="button" onClick={() => navigate('/cliente/menu/delivery')}>
            Delivery
          </button>
          <button className="btn-secundario" type="button" onClick={() => navigate('/cliente/login?redirect=/cliente/menu/delivery')}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="tabs">
        <Link to="/cliente/datos" className="tab">Datos Personales</Link>
        <Link to="/cliente/direcciones" className="tab">Mis Direcciones</Link>
        <Link to="/cliente/metodos-pago" className="tab">Métodos de Pago</Link>
        <Link to="/cliente/pedidos" className="tab">Historial de Pedidos</Link>
      </div>

      <div className="tab-content">
        <Routes>
          <Route path="/" element={<DatosPersonales clienteId={cliente.id} />} />
          <Route path="/datos" element={<DatosPersonales clienteId={cliente.id} />} />
          <Route path="/direcciones" element={<MisDirecciones clienteId={cliente.id} />} />
          <Route path="/metodos-pago" element={<MetodosPago clienteId={cliente.id} />} />
          <Route path="/pedidos" element={<HistorialPedidos clienteId={cliente.id} />} />
        </Routes>
      </div>
    </div>
  );
}

export default PerfilCliente;
