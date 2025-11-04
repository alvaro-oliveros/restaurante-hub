import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './components/LandingPage';
import SeleccionMesa from './components/cliente/SeleccionMesa';
import CatalogoMenu from './components/cliente/CatalogoMenu';
import PerfilCliente from './components/cliente/PerfilCliente';
import PerfilAdmin from './components/admin/PerfilAdmin';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/cliente/mesas" element={<SeleccionMesa />} />
          <Route path="/cliente/menu/:mesaId" element={<CatalogoMenu />} />
          <Route path="/cliente/*" element={<PerfilCliente />} />
          <Route path="/admin/*" element={<PerfilAdmin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
