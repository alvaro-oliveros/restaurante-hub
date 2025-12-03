import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import DashboardAdmin from './DashboardAdmin';
import GestionMenu from './GestionMenu';
import GestionPedidos from './GestionPedidos';
import GestionUsuarios from './GestionUsuarios';
import Reportes from './Reportes';
import GestionMesas from './GestionMesas';
import './PerfilAdmin.css';

function PerfilAdmin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/admin/login');
  };

  return (
    <div className="perfil-admin">
      <div className="admin-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Inicio
        </button>
        <h2>Panel de Administración</h2>
        <button className="btn-logout" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>

      <div className="tabs">
        <NavLink to="/admin" end className={({ isActive }) => isActive ? "tab active" : "tab"}>Dashboard</NavLink>
        <NavLink to="/admin/menu" className={({ isActive }) => isActive ? "tab active" : "tab"}>Gestión de Menú</NavLink>
        <NavLink to="/admin/mesas" className={({ isActive }) => isActive ? "tab active" : "tab"}>Gestión de Mesas</NavLink>
        <NavLink to="/admin/pedidos" className={({ isActive }) => isActive ? "tab active" : "tab"}>Gestión de Pedidos</NavLink>
        <NavLink to="/admin/usuarios" className={({ isActive }) => isActive ? "tab active" : "tab"}>Gestión de Usuarios</NavLink>
        <NavLink to="/admin/reportes" className={({ isActive }) => isActive ? "tab active" : "tab"}>Reportes</NavLink>
      </div>

      <div className="tab-content">
        <Routes>
          <Route path="/" element={<DashboardAdmin />} />
          <Route path="/menu" element={<GestionMenu />} />
          <Route path="/mesas" element={<GestionMesas />} />
          <Route path="/pedidos" element={<GestionPedidos />} />
          <Route path="/usuarios" element={<GestionUsuarios />} />
          <Route path="/reportes" element={<Reportes />} />
        </Routes>
      </div>
    </div>
  );
}

export default PerfilAdmin;
