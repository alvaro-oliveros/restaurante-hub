import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginAdmin.css';

function LoginAdmin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar credenciales (usuario: admin, contraseña: admin123)
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      // Guardar en localStorage que el usuario está autenticado
      localStorage.setItem('adminAuthenticated', 'true');
      // Redirigir al panel de admin
      navigate('/admin');
    } else {
      setError('Credenciales incorrectas');
      setCredentials({ ...credentials, password: '' });
    }
  };

  return (
    <div className="login-container">
      <button className="btn-volver" onClick={() => navigate('/')}>
        ← Volver al inicio
      </button>

      <div className="login-card">
        <div className="login-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"/>
          </svg>
        </div>

        <h1>Panel de Administrador</h1>
        <p className="login-subtitle">Ingresa tus credenciales para acceder</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              type="text"
              placeholder="Ingresa tu usuario"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Ingresa tu contraseña"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-login">
            Iniciar Sesión
          </button>
        </form>

        <div className="demo-credentials">
          <p className="demo-title">Credenciales de demostración:</p>
          <p className="demo-info">Usuario: <strong>admin</strong></p>
          <p className="demo-info">Contraseña: <strong>admin123</strong></p>
        </div>
      </div>
    </div>
  );
}

export default LoginAdmin;
