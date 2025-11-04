import { useState, useEffect } from 'react';
import productoService from '../../services/productoService';

function GestionMenu() {
  const [productos, setProductos] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [productoActual, setProductoActual] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    cantidad: 0,
  });
  const [editando, setEditando] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await productoService.actualizar(productoActual.id, productoActual);
      } else {
        await productoService.crear(productoActual);
      }
      await cargarProductos();
      resetForm();
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
    setProductoActual(producto);
    setEditando(true);
    setMostrarForm(true);
  };

  const resetForm = () => {
    setProductoActual({ nombre: '', descripcion: '', precio: 0, cantidad: 0 });
    setEditando(false);
    setMostrarForm(false);
  };

  return (
    <div className="gestion-menu">
      <h3>Gestión de Menú</h3>

      <button onClick={() => setMostrarForm(!mostrarForm)}>
        {mostrarForm ? 'Cancelar' : 'Nuevo Producto'}
      </button>

      {mostrarForm && (
        <form onSubmit={handleSubmit} className="producto-form">
          <input
            type="text"
            placeholder="Nombre"
            value={productoActual.nombre}
            onChange={(e) => setProductoActual({ ...productoActual, nombre: e.target.value })}
            required
          />
          <textarea
            placeholder="Descripción"
            value={productoActual.descripcion}
            onChange={(e) => setProductoActual({ ...productoActual, descripcion: e.target.value })}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Precio"
            value={productoActual.precio}
            onChange={(e) => setProductoActual({ ...productoActual, precio: parseFloat(e.target.value) })}
            required
          />
          <input
            type="number"
            placeholder="Cantidad"
            value={productoActual.cantidad}
            onChange={(e) => setProductoActual({ ...productoActual, cantidad: parseInt(e.target.value) })}
            required
          />
          <button type="submit">{editando ? 'Actualizar' : 'Crear'}</button>
        </form>
      )}

      <table className="productos-tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.id}</td>
              <td>{producto.nombre}</td>
              <td>{producto.descripcion}</td>
              <td>S/ {producto.precio}</td>
              <td>{producto.cantidad}</td>
              <td>
                <button onClick={() => editarProducto(producto)}>Editar</button>
                <button onClick={() => eliminarProducto(producto.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GestionMenu;
