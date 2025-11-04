import { useState, useEffect } from 'react';
import metodoPagoService from '../../services/metodoPagoService';

function MetodosPago({ clienteId }) {
  const [metodosPago, setMetodosPago] = useState([]);

  useEffect(() => {
    cargarMetodosPago();
  }, [clienteId]);

  const cargarMetodosPago = async () => {
    try {
      const data = await metodoPagoService.obtenerPorCliente(clienteId);
      setMetodosPago(data);
    } catch (error) {
      console.error('Error al cargar métodos de pago:', error);
    }
  };

  return (
    <div className="metodos-pago">
      <h3>Métodos de Pago</h3>
      <p>Gestiona tus tarjetas y métodos de pago guardados</p>
      {/* Componente a implementar completamente */}
      <div className="metodos-lista">
        {metodosPago.length === 0 ? (
          <p>No tienes métodos de pago guardados</p>
        ) : (
          metodosPago.map((metodo) => (
            <div key={metodo.id} className="metodo-card">
              <p>{metodo.tipo}: **** {metodo.ultimosCuatroDigitos}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MetodosPago;
