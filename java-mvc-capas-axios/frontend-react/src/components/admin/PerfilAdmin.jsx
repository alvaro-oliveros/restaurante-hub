import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import DashboardAdmin from './DashboardAdmin';
import GestionMenu from './GestionMenu';
import GestionPedidos from './GestionPedidos';
import GestionUsuarios from './GestionUsuarios';
import Reportes from './Reportes';
import './PerfilAdmin.css';

function PerfilAdmin() {
  const navigate = useNavigate();

  return (
    <div className="perfil-admin">
      <div className="admin-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Inicio
        </button>
        <h2>Panel de Administración</h2>
      </div>

      <div className="tabs">
        <Link to="/admin" className="tab">Dashboard</Link>
        <Link to="/admin/menu" className="tab">Gestión de Menú</Link>
        <Link to="/admin/pedidos" className="tab">Gestión de Pedidos</Link>
        <Link to="/admin/usuarios" className="tab">Gestión de Usuarios</Link>
        <Link to="/admin/reportes" className="tab">Reportes</Link>
      </div>

      <div className="tab-content">
        <Routes>
          <Route path="/" element={<DashboardAdmin />} />
          <Route path="/menu" element={<GestionMenu />} />
          <Route path="/pedidos" element={<GestionPedidos />} />
          <Route path="/usuarios" element={<GestionUsuarios />} />
          <Route path="/reportes" element={<Reportes />} />
        </Routes>
      </div>
    </div>
  );
}

export default PerfilAdmin;
