import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productoService from '../../services/productoService';
import './CatalogoMenu.css';

function CatalogoMenu() {
  const { mesaId } = useParams();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carrito, setCarrito] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState('TODAS');
  const [filtroVegetariano, setFiltroVegetariano] = useState(false);
  const [filtroPopular, setFiltroPopular] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarProductos();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [productos, filtroCategoria, filtroVegetariano, filtroPopular, busqueda]);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const data = await productoService.obtenerTodos();
      setProductos(data.filter(p => p.disponible));
    } catch (error) {
      console.error('Error al cargar productos:', error);
      alert('Error al cargar el menú');
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let filtered = [...productos];

    if (filtroCategoria !== 'TODAS') {
      filtered = filtered.filter(p => p.categoriaNombre === filtroCategoria);
    }

    if (filtroVegetariano) {
      filtered = filtered.filter(p => p.esVegetariano);
    }

    if (filtroPopular) {
      filtered = filtered.filter(p => p.esPopular);
    }

    if (busqueda) {
      filtered = filtered.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    setProductosFiltrados(filtered);
  };

  const agregarAlCarrito = (producto) => {
    const itemExistente = carrito.find(item => item.id === producto.id);
    if (itemExistente) {
      setCarrito(carrito.map(item =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const removerDelCarrito = (productoId) => {
    const itemExistente = carrito.find(item => item.id === productoId);
    if (itemExistente.cantidad > 1) {
      setCarrito(carrito.map(item =>
        item.id === productoId
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      ));
    } else {
      setCarrito(carrito.filter(item => item.id !== productoId));
    }
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  const categorias = ['TODAS', ...new Set(productos.map(p => p.categoriaNombre).filter(Boolean))];

  const renderEstrellas = (rating) => {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      estrellas.push(
        <span key={i} className={i <= rating ? 'star filled' : 'star'}>
          ★
        </span>
      );
    }
    return estrellas;
  };

  if (loading) {
    return (
      <div className="catalogo-container">
        <div className="loading">Cargando menú...</div>
      </div>
    );
  }

  return (
    <div className="catalogo-container">
      <div className="catalogo-header">
        <button className="btn-back" onClick={() => navigate('/cliente/mesas')}>
          ← Cambiar Mesa
        </button>
        <div className="header-info">
          <h1>Nuestro Menú</h1>
          <p>Mesa #{mesaId}</p>
        </div>
      </div>

      <div className="filtros-menu">
        <div className="busqueda-container">
          <input
            type="text"
            placeholder="🔍 Buscar platillos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input-busqueda"
          />
        </div>

        <div className="filtros-row">
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="select-filtro"
          >
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <button
            className={`btn-filtro ${filtroVegetariano ? 'active' : ''}`}
            onClick={() => setFiltroVegetariano(!filtroVegetariano)}
          >
            🌱 Vegetariano
          </button>

          <button
            className={`btn-filtro ${filtroPopular ? 'active' : ''}`}
            onClick={() => setFiltroPopular(!filtroPopular)}
          >
            ⭐ Popular
          </button>
        </div>
      </div>

      <div className="menu-grid">
        {productosFiltrados.map((producto) => (
          <div key={producto.id} className="producto-card">
            {producto.esPopular && (
              <div className="badge-popular">Popular</div>
            )}

            <div className="producto-imagen">
              {producto.imagenUrl ? (
                <img src={producto.imagenUrl} alt={producto.nombre} />
              ) : (
                <div className="placeholder-imagen">🍽️</div>
              )}
            </div>

            <div className="producto-info">
              <div className="producto-header-card">
                <h3>{producto.nombre}</h3>
                {producto.esVegetariano && <span className="badge-veg">🌱</span>}
              </div>

              <p className="producto-descripcion">{producto.descripcion}</p>

              <div className="producto-detalles">
                {producto.rating && (
                  <div className="rating">
                    {renderEstrellas(producto.rating)}
                    <span className="rating-numero">({producto.rating})</span>
                  </div>
                )}

                {producto.tiempoPreparacion && (
                  <div className="tiempo">
                    ⏱️ {producto.tiempoPreparacion} min
                  </div>
                )}
              </div>

              {producto.alergenos && (
                <div className="alergenos">
                  ⚠️ Contiene: {producto.alergenos}
                </div>
              )}

              <div className="producto-footer">
                <div className="precio">S/ {producto.precio.toFixed(2)}</div>
                <button
                  className="btn-agregar"
                  onClick={() => agregarAlCarrito(producto)}
                >
                  Agregar +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {productosFiltrados.length === 0 && (
        <div className="no-productos">
          <p>No se encontraron platillos con los filtros seleccionados</p>
        </div>
      )}

      {carrito.length > 0 && (
        <div className="carrito-flotante">
          <div className="carrito-header">
            <h3>🛒 Mi Pedido ({carrito.length})</h3>
            <button className="btn-limpiar" onClick={() => setCarrito([])}>
              Limpiar
            </button>
          </div>

          <div className="carrito-items">
            {carrito.map((item) => (
              <div key={item.id} className="carrito-item">
                <div className="item-info">
                  <span className="item-nombre">{item.nombre}</span>
                  <span className="item-precio">S/ {item.precio.toFixed(2)}</span>
                </div>
                <div className="item-controles">
                  <button onClick={() => removerDelCarrito(item.id)}>-</button>
                  <span>{item.cantidad}</span>
                  <button onClick={() => agregarAlCarrito(item)}>+</button>
                </div>
              </div>
            ))}
          </div>

          <div className="carrito-total">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>S/ {calcularTotal().toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>IGV (18%):</span>
              <span>S/ {(calcularTotal() * 0.18).toFixed(2)}</span>
            </div>
            <div className="total-row total-final">
              <span>Total:</span>
              <span>S/ {(calcularTotal() * 1.18).toFixed(2)}</span>
            </div>
          </div>

          <button
            className="btn-confirmar"
            onClick={() => alert('Función de confirmar pedido próximamente')}
          >
            Confirmar Pedido
          </button>
        </div>
      )}
    </div>
  );
}

export default CatalogoMenu;
