import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-header">
        <h1>RestauranteHub</h1>
        <p>Sistema de Gestión y Atención</p>
      </div>

      <div className="landing-cards">
        <div className="landing-card cliente-card" onClick={() => navigate('/cliente/mesas')}>
          <div className="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h2>Cliente</h2>
          <p>Realizar pedido y ver menú</p>
          <div className="card-arrow">→</div>
        </div>

        <div className="landing-card admin-card" onClick={() => navigate('/admin')}>
          <div className="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <h2>Administrador</h2>
          <p>Gestionar pedidos y menú</p>
          <div className="card-arrow">→</div>
        </div>
      </div>

      <div className="landing-footer">
        <p>RestauranteHub © 2025</p>
      </div>
    </div>
  );
}

export default LandingPage;
