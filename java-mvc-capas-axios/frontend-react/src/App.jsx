import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './components/LandingPage';
import SeleccionMesa from './components/cliente/SeleccionMesa';
import CatalogoMenu from './components/cliente/CatalogoMenu';
import CatalogoMenuDelivery from './components/cliente/CatalogoMenuDelivery';
import PerfilCliente from './components/cliente/PerfilCliente';
import PerfilAdmin from './components/admin/PerfilAdmin';
import LoginAdmin from './components/admin/LoginAdmin';
import ProtectedRoute from './components/ProtectedRoute';
import ClienteAuth from './components/cliente/ClienteAuth';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/cliente/login" element={<ClienteAuth />} />
          <Route path="/cliente/registro" element={<ClienteAuth />} />
          <Route path="/cliente/mesas" element={<SeleccionMesa />} />
          <Route path="/cliente/menu/delivery" element={<CatalogoMenuDelivery />} />
          <Route path="/cliente/menu/:mesaId" element={<CatalogoMenu />} />
          <Route path="/cliente/*" element={<PerfilCliente />} />
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <PerfilAdmin />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
