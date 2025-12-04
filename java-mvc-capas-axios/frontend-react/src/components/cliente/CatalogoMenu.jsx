import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import productoService from '../../services/productoService';
import pedidoService from '../../services/pedidoService';
import mesaService from '../../services/mesaService';
import SeguimientoPedido from '../common/SeguimientoPedido';
import './CatalogoMenu.css';

const METODOS_PAGO_LOCAL = [
  { value: 'EFECTIVO', label: 'Efectivo en mesa' },
  { value: 'TARJETA_DEBITO', label: 'Tarjeta débito' },
  { value: 'TARJETA_CREDITO', label: 'Tarjeta crédito' },
  { value: 'YAPE', label: 'Yape' },
  { value: 'PLIN', label: 'Plin' },
];

function CatalogoMenu() {
  const { mesaId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenMesa = searchParams.get('token');
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmando, setConfirmando] = useState(false);
  const [carrito, setCarrito] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState('TODAS');
  const [filtroVegetariano, setFiltroVegetariano] = useState(false);
  const [filtroPopular, setFiltroPopular] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [medioPago, setMedioPago] = useState('EFECTIVO');
  const [pagoEnMesa, setPagoEnMesa] = useState(true);
  const [pedidoEnCursoId, setPedidoEnCursoId] = useState(null);
  const estadosActivos = ['PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'LISTO', 'RECOGIDO', 'SERVIDO'];

  // Hasta que haya autenticación real, usamos un cliente fijo
  const clienteId = 1;

  useEffect(() => {
    if (!tokenMesa) {
      alert('QR inválido o faltan datos de la mesa. Por favor, vuelve a escanear.');
      navigate('/cliente/mesas');
    }
  }, [tokenMesa, navigate]);

  useEffect(() => {
    cargarProductos();
    const almacenado = localStorage.getItem(`pedidoEnCursoMesa_${mesaId}`);
    if (almacenado) {
      setPedidoEnCursoId(Number(almacenado));
    }
    if (!almacenado) {
      recuperarPedidoActivo();
    }
  }, [mesaId]);

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

  // Precios de los productos ya incluyen IGV (18%)
  const calcularTotalBruto = () =>
    carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);

  const calcularNeto = () => {
    const total = calcularTotalBruto();
    return total / 1.18;
  };

  const calcularIGV = () => {
    const total = calcularTotalBruto();
    return total - (total / 1.18);
  };

  const medioPagoLabel = (valor) => {
    const encontrado = METODOS_PAGO_LOCAL.find((m) => m.value === valor);
    return encontrado?.label || valor;
  };

  const handleConfirmarPedido = () => {
    if (!carrito.length) {
      alert('Agrega al menos un producto para confirmar el pedido');
      return;
    }
    setMostrarConfirmacion(true);
  };

  const enviarPedido = async () => {
    if (!carrito.length) return;

    try {
      setConfirmando(true);

      const total = calcularTotalBruto();
      const subtotal = calcularNeto();
      const igv = calcularIGV();

      const payload = {
        clienteId,
        tipo: 'PRESENCIAL',
        mesaId: Number(mesaId),
        tokenMesa,
        medioPago: pagoEnMesa ? 'EFECTIVO' : medioPago,
        observaciones: pagoEnMesa ? 'Pago en mesa - pendiente' : `Pago registrado (${medioPagoLabel(medioPago)})`,
        subtotal: Number(subtotal.toFixed(2)), // neto sin IGV
        igv: Number(igv.toFixed(2)),
        total: Number(total.toFixed(2)), // precio final (incluye IGV)
        detalles: carrito.map((item) => ({
          productoId: item.id,
          cantidad: item.cantidad,
          precioUnitario: Number(item.precio.toFixed(2)),
        })),
      };

      const pedidoCreado = await pedidoService.crear(payload);

      // Intentar marcar la mesa como ocupada para reflejar el nuevo pedido
      try {
        await mesaService.actualizarEstado(Number(mesaId), 'OCUPADA');
      } catch (error) {
        console.warn('No se pudo actualizar el estado de la mesa:', error);
      }

      setCarrito([]);
      setPagoEnMesa(true);
      setMedioPago('EFECTIVO');
      setPedidoEnCursoId(pedidoCreado.id);
      localStorage.setItem(`pedidoEnCursoMesa_${mesaId}`, pedidoCreado.id);
      alert(`Pedido confirmado. Número de pedido: ${pedidoCreado.id}`);
    } catch (error) {
      console.error('Error al confirmar pedido:', error);
      const serverMessage = error.response?.data?.message;
      alert(serverMessage || 'No se pudo confirmar el pedido. Intenta nuevamente.');
    } finally {
      setConfirmando(false);
      setMostrarConfirmacion(false);
    }
  };

  const recuperarPedidoActivo = async () => {
    try {
      const pedidosCliente = await pedidoService.obtenerPorCliente(clienteId);
      const activo = pedidosCliente
        .filter((p) => estadosActivos.includes(p.estado))
        .sort((a, b) => {
          const fa = a.fechaPedido ? new Date(a.fechaPedido).getTime() : 0;
          const fb = b.fechaPedido ? new Date(b.fechaPedido).getTime() : 0;
          if (fa !== fb) return fb - fa;
          return (b.id || 0) - (a.id || 0);
        })[0];
      if (activo) {
        setPedidoEnCursoId(activo.id);
        localStorage.setItem(`pedidoEnCursoMesa_${mesaId}`, activo.id);
      }
    } catch (error) {
      console.error('No se pudo recuperar pedido activo', error);
    }
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

      {pedidoEnCursoId && (
        <div className="seguimiento-wrapper">
          <div className="seguimiento-info pedido-en-curso">
            <span>Pedido en curso: #{pedidoEnCursoId}</span>
            <button
              type="button"
              className="btn-secundario btn-mini"
              onClick={() => {
                setPedidoEnCursoId(null);
                localStorage.removeItem(`pedidoEnCursoMesa_${mesaId}`);
              }}
            >
              Limpiar
            </button>
            <button
              type="button"
              className="btn-secundario btn-mini"
              onClick={recuperarPedidoActivo}
            >
              Recuperar
            </button>
          </div>
          <SeguimientoPedido pedidoId={pedidoEnCursoId} refrescarCada={7000} />
        </div>
      )}

      {!pedidoEnCursoId && (
        <div className="seguimiento-placeholder">
          <div className="seguimiento-info pedido-en-curso">
            <span>¿Perdiste el seguimiento?</span>
            <button
              type="button"
              className="btn-secundario btn-mini"
              onClick={recuperarPedidoActivo}
            >
              Recuperar pedido activo
            </button>
          </div>
        </div>
      )}

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

              <div className="card-bottom">
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
          <div className="carrito-body">
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
            <div className="carrito-summary">
              <div className="carrito-total">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>S/ {calcularNeto().toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>IGV (18%):</span>
                  <span>S/ {calcularIGV().toFixed(2)}</span>
                </div>
                <div className="total-row total-final">
                  <span>Total:</span>
                  <span>S/ {calcularTotalBruto().toFixed(2)}</span>
                </div>
              </div>
              <button
                className="btn-confirmar"
                onClick={handleConfirmarPedido}
                disabled={confirmando}
              >
                {confirmando ? 'Confirmando...' : 'Confirmar Pedido'}
              </button>
            </div>
          </div>
        </div>
      )}

      {carrito.length > 0 && (
        <div className="checkout-bar">
          <div>
            <p className="checkout-bar__label">Total estimado</p>
            <div className="checkout-bar__total">S/ {calcularTotalBruto().toFixed(2)}</div>
            <p className="checkout-bar__meta">{carrito.length} productos · paga ahora o en mesa</p>
          </div>
          <button
            className="btn-confirmar checkout-bar__btn"
            onClick={handleConfirmarPedido}
            disabled={confirmando}
          >
            {confirmando ? 'Procesando...' : 'Confirmar pedido'}
          </button>
        </div>
      )}

      {mostrarConfirmacion && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirmar pedido</h3>
            <p>Mesa #{mesaId}</p>

            <div className="modal-resumen">
              {carrito.map((item) => (
                <div key={item.id} className="modal-item">
                  <span>{item.nombre} x {item.cantidad}</span>
                  <span>S/ {(item.precio * item.cantidad).toFixed(2)}</span>
                </div>
              ))}
              <div className="modal-total">
                <div>
                  <span>Subtotal</span>
                  <span>S/ {calcularNeto().toFixed(2)}</span>
                </div>
                <div>
                  <span>IGV (incluido)</span>
                  <span>S/ {calcularIGV().toFixed(2)}</span>
                </div>
                <div className="modal-total-final">
                  <span>Total</span>
                  <span>S/ {calcularTotalBruto().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="modal-pago">
              <label>Pago</label>
              <div className="radio-row">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="modoPago"
                    checked={!pagoEnMesa}
                    onChange={() => setPagoEnMesa(false)}
                  />
                  Pagar ahora
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="modoPago"
                    checked={pagoEnMesa}
                    onChange={() => setPagoEnMesa(true)}
                  />
                  Pagar en mesa
                </label>
              </div>

              {!pagoEnMesa && (
                <>
                  <label>Medio de pago</label>
                  <select value={medioPago} onChange={(e) => setMedioPago(e.target.value)}>
                    {METODOS_PAGO_LOCAL.map((opcion) => (
                      <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </option>
                    ))}
                  </select>
                  <p className="helper-text">
                    Registraremos el pago con {medioPagoLabel(medioPago)} al confirmar.
                  </p>
                </>
              )}

              {pagoEnMesa && (
                <p className="helper-text">
                  El pedido se envía como pendiente de pago. Podrás cancelarlo en efectivo o tarjeta con el mozo.
                </p>
              )}
            </div>

            <div className="modal-actions">
              <button className="btn-secundario" onClick={() => setMostrarConfirmacion(false)}>
                Volver
              </button>
              <button className="btn-primario" onClick={enviarPedido} disabled={confirmando}>
                {confirmando
                  ? 'Enviando...'
                  : pagoEnMesa
                    ? 'Confirmar (pago en mesa)'
                    : 'Confirmar pedido'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CatalogoMenu;
