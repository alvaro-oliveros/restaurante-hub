import { useEffect, useState } from 'react';
import productoService from '../../services/productoService';

const CATEGORIAS = [
  { id: 1, nombre: 'Entradas' },
  { id: 2, nombre: 'Principales' },
  { id: 3, nombre: 'Postres' },
  { id: 4, nombre: 'Bebidas' },
];

const MODOS = [
  { key: 'local', label: 'Local' },
  { key: 'delivery', label: 'Delivery' },
];

const PRODUCTO_BASE = {
  nombre: '',
  descripcion: '',
  precio: 0,
  precioDelivery: '',
  cantidad: 0,
  imagenUrl: '',
  disponible: true,
  disponibleDelivery: true,
  esVegetariano: false,
  esPopular: false,
  alergenos: '',
  tiempoPreparacion: '',
  categoriaId: '',
};

function GestionMenu() {
  const [productos, setProductos] = useState([]);
  const [modo, setModo] = useState('local');
  const [pestanaPrecio, setPestanaPrecio] = useState('local');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState(false);
  const [productoActual, setProductoActual] = useState({ ...PRODUCTO_BASE });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const data = await productoService.obtenerTodos();
      setProductos(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  const formatearPrecio = (valor) => {
    const numero = Number(valor);
    return `S/ ${Number.isNaN(numero) ? '0.00' : numero.toFixed(2)}`;
  };

  const productosLocal = productos.filter((p) => p.disponible !== false);
  const productosDelivery = productos.filter((p) => p.disponibleDelivery !== false);
  const productosVisibles = modo === 'delivery' ? productosDelivery : productosLocal;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productoActual,
        precio: parseFloat(productoActual.precio || 0),
        precioDelivery: productoActual.precioDelivery !== '' && productoActual.precioDelivery !== null
          ? parseFloat(productoActual.precioDelivery)
          : null,
        cantidad: parseInt(productoActual.cantidad || 0, 10),
      };
      if (editando) {
        await productoService.actualizar(productoActual.id, payload);
      } else {
        await productoService.crear(payload);
      }
      await cargarProductos();
      resetForm();
      setMostrarModal(false);
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  const eliminarProducto = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este producto?')) {
      try {
        await productoService.eliminar(id);
        await cargarProductos();
      } catch (error) {
        console.error('Error al eliminar producto:', error);
      }
    }
  };

  const editarProducto = (producto) => {
    setProductoActual({
      ...producto,
      precioDelivery: producto.precioDelivery ?? '',
      disponibleDelivery: producto.disponibleDelivery ?? true,
    });
    setEditando(true);
    setPestanaPrecio(modo === 'delivery' ? 'delivery' : 'local');
    setMostrarModal(true);
  };

  const resetForm = () => {
    setProductoActual({ ...PRODUCTO_BASE });
    setEditando(false);
    setPestanaPrecio('local');
    setMostrarModal(false);
  };

  const estadoTexto = (valor) => (valor ? 'Disponible' : 'No disponible');

  return (
    <div className="gestion-menu">
      <header className="gestion-menu__header">
        <div>
          <h3>Gestión de Menú</h3>
          <p className="gestion-menu__subcopy">
            Precios y disponibilidad separados por modo. El stock se comparte entre Local y Delivery.
          </p>
        </div>
        <div className="gestion-menu__modo">
          {MODOS.map((opcion) => (
            <button
              key={opcion.key}
              className={`modo-btn ${modo === opcion.key ? 'activo' : ''}`}
              onClick={() => setModo(opcion.key)}
              type="button"
            >
              {opcion.label}
            </button>
          ))}
        </div>
      </header>

      <div className="gestion-menu__acciones">
        <button onClick={() => { resetForm(); setMostrarModal(true); }}>Nuevo Producto</button>
        <div className="stock-tag">Stock único para ambos modos</div>
      </div>

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal modal-admin">
            <h3>{editando ? 'Editar producto' : 'Nuevo producto'}</h3>
            <form onSubmit={handleSubmit} className="producto-form">
              <div className="producto-form__grid">
                <div className="producto-form__panel">
                  <div className="panel-header">
                    <div>
                      <h4>Datos generales</h4>
                      <p>Se comparten entre Local y Delivery</p>
                    </div>
                  </div>
                  <label>Nombre</label>
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={productoActual.nombre}
                    onChange={(e) => setProductoActual({ ...productoActual, nombre: e.target.value })}
                    required
                  />
                  <label>Descripción</label>
                  <textarea
                    placeholder="Descripción"
                    value={productoActual.descripcion}
                    onChange={(e) => setProductoActual({ ...productoActual, descripcion: e.target.value })}
                  />
                  <label>Categoría</label>
                  <select
                    value={productoActual.categoriaId}
                    onChange={(e) => setProductoActual({
                      ...productoActual,
                      categoriaId: parseInt(e.target.value, 10) || '',
                    })}
                  >
                    <option value="">Selecciona categoría</option>
                    {CATEGORIAS.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </select>
                  <label>URL de imagen</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={productoActual.imagenUrl}
                    onChange={(e) => setProductoActual({ ...productoActual, imagenUrl: e.target.value })}
                  />
                  <label>Alérgenos (opcional)</label>
                  <input
                    type="text"
                    placeholder="lactosa, frutos secos..."
                    value={productoActual.alergenos}
                    onChange={(e) => setProductoActual({ ...productoActual, alergenos: e.target.value })}
                  />
                  <label>Tiempo de preparación (minutos)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="15"
                    value={productoActual.tiempoPreparacion}
                    onChange={(e) => setProductoActual({ ...productoActual, tiempoPreparacion: e.target.value })}
                  />
                  <label>Cantidad (stock compartido)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={productoActual.cantidad}
                    onChange={(e) => setProductoActual({ ...productoActual, cantidad: e.target.value })}
                    required
                  />
                  <p className="helper-text">Afecta la disponibilidad tanto en salón como en delivery.</p>
                  <div className="checkbox-row">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={productoActual.esVegetariano}
                        onChange={(e) => setProductoActual({ ...productoActual, esVegetariano: e.target.checked })}
                      />
                      Vegetariano
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={productoActual.esPopular}
                        onChange={(e) => setProductoActual({ ...productoActual, esPopular: e.target.checked })}
                      />
                      Popular
                    </label>
                  </div>
                </div>

                <div className="producto-form__panel precios-panel">
                  <div className="panel-header">
                    <div>
                      <h4>Precios y estado</h4>
                      <p>Gestiona cada modo por separado</p>
                    </div>
                    <div className="precio-tabs">
                      <button
                        type="button"
                        className={`modo-btn ${pestanaPrecio === 'local' ? 'activo' : ''}`}
                        onClick={() => setPestanaPrecio('local')}
                      >
                        Local
                      </button>
                      <button
                        type="button"
                        className={`modo-btn ${pestanaPrecio === 'delivery' ? 'activo' : ''}`}
                        onClick={() => setPestanaPrecio('delivery')}
                      >
                        Delivery
                      </button>
                    </div>
                  </div>

                  {pestanaPrecio === 'local' ? (
                    <div className="precio-card">
                      <label>Precio Local (S/)</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        value={productoActual.precio}
                        onChange={(e) => setProductoActual({ ...productoActual, precio: e.target.value })}
                        required
                      />
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={productoActual.disponible}
                          onChange={(e) => setProductoActual({ ...productoActual, disponible: e.target.checked })}
                        />
                        Disponible en local
                      </label>
                      <p className="helper-text">Este precio también se usa en delivery si no defines uno propio.</p>
                    </div>
                  ) : (
                    <div className="precio-card">
                      <label>Precio Delivery (S/)</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        value={productoActual.precioDelivery}
                        onChange={(e) => setProductoActual({ ...productoActual, precioDelivery: e.target.value })}
                      />
                      <p className="helper-text">Déjalo vacío para usar el precio local.</p>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={productoActual.disponibleDelivery}
                          onChange={(e) => setProductoActual({ ...productoActual, disponibleDelivery: e.target.checked })}
                        />
                        Disponible para delivery
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secundario" onClick={resetForm}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primario">
                  {editando ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="gestion-menu__tabla-wrapper">
        <table className="productos-tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Stock</th>
              <th>Local</th>
              <th>Delivery</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosVisibles.map((producto) => {
              const precioBase = formatearPrecio(producto.precio);
              const precioEnvio = formatearPrecio(producto.precioDelivery ?? producto.precio);
              const usaPrecioBase = producto.precioDelivery === null || producto.precioDelivery === undefined;
              return (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td>
                    <div className="producto-meta">
                      <div className="producto-nombre">{producto.nombre}</div>
                      <div className="producto-descripcion">{producto.descripcion}</div>
                    </div>
                  </td>
                  <td>
                    <span className="stock-pill">{producto.cantidad} uds</span>
                  </td>
                  <td>
                    <div className="modo-cell">
                      <div className={`modo-chip ${modo === 'local' ? 'activo' : ''}`}>{precioBase}</div>
                      <span className={`estado-chip ${producto.disponible ? 'ok' : 'off'}`}>
                        {estadoTexto(producto.disponible)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="modo-cell">
                      <div className={`modo-chip ${modo === 'delivery' ? 'activo' : ''}`}>{precioEnvio}</div>
                      <span className={`estado-chip ${producto.disponibleDelivery ? 'ok' : 'off'}`}>
                        {estadoTexto(producto.disponibleDelivery)}
                      </span>
                      {usaPrecioBase && <span className="helper-text">Usa precio local</span>}
                    </div>
                  </td>
                  <td>
                    <button onClick={() => editarProducto(producto)}>Editar</button>
                    <button onClick={() => eliminarProducto(producto.id)}>Eliminar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GestionMenu;
