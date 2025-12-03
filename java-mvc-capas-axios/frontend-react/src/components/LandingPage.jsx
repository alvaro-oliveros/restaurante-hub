import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-admin-button" onClick={() => navigate('/admin')}>
        <span>Admin</span>
      </div>
      <div className="landing-header">
        <h1>RestauranteHub</h1>
        <p>Gestión integral con diseño moderno</p>
      </div>

      <div className="landing-client-card" onClick={() => navigate('/cliente/mesas')}>
        <div className="client-card-content">
          <div className="client-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div>
            <h2>Cliente</h2>
            <p>Explora el menú, ordena y disfruta desde cualquier mesa o domicilio.</p>
          </div>
          <div className="client-action">
            Entrar ↓
          </div>
        </div>
      </div>
      <div className="landing-footer">
        <p>RestauranteHub © 2025</p>
      </div>
    </div>
  );
}

export default LandingPage;
