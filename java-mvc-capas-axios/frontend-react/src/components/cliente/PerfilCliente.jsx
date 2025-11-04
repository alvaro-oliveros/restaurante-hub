import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import DatosPersonales from './DatosPersonales';
import MisDirecciones from './MisDirecciones';
import MetodosPago from './MetodosPago';
import HistorialPedidos from './HistorialPedidos';
import './PerfilCliente.css';

function PerfilCliente() {
  // En una aplicación real, este ID vendría de la sesión/autenticación
  const [clienteId] = useState(1);

  return (
    <div className="perfil-cliente">
      <h2>Mi Perfil</h2>

      <div className="tabs">
        <Link to="/cliente/datos" className="tab">Datos Personales</Link>
        <Link to="/cliente/direcciones" className="tab">Mis Direcciones</Link>
        <Link to="/cliente/metodos-pago" className="tab">Métodos de Pago</Link>
        <Link to="/cliente/pedidos" className="tab">Historial de Pedidos</Link>
      </div>

      <div className="tab-content">
        <Routes>
          <Route path="/" element={<DatosPersonales clienteId={clienteId} />} />
          <Route path="/datos" element={<DatosPersonales clienteId={clienteId} />} />
          <Route path="/direcciones" element={<MisDirecciones clienteId={clienteId} />} />
          <Route path="/metodos-pago" element={<MetodosPago clienteId={clienteId} />} />
          <Route path="/pedidos" element={<HistorialPedidos clienteId={clienteId} />} />
        </Routes>
      </div>
    </div>
  );
}

export default PerfilCliente;
