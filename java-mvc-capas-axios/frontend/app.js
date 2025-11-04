// ============================================
// SISTEMA DE GESTIÓN DE PRODUCTOS
// Lógica Frontend con Axios
// ============================================

// ===== CONFIGURACIÓN =====
const API_URL = 'http://localhost:8080/api/productos';

// Variable global para almacenar el ID del producto a eliminar
let productoAEliminar = null;

// Configuración de Axios
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Interceptor para manejar errores globales
axios.interceptors.response.use(
    response => response,
    error => {
        console.error('Error en la petición:', error);
        mostrarError('Error de conexión con el servidor. Verifica que el backend esté ejecutándose en http://localhost:8080');
        return Promise.reject(error);
    }
);

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Aplicación iniciada');
    cargarProductos();
    configurarFormulario();
    configurarBuscador();
});

// Configurar el formulario
function configurarFormulario() {
    const form = document.getElementById('producto-form');
    form.addEventListener('submit', guardarProducto);
}

// Configurar el buscador
function configurarBuscador() {
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            buscarProductos();
        }
    });
}

// ===== FUNCIONES DE CARGA =====

/**
 * Cargar todos los productos desde el backend
 */
async function cargarProductos() {
    console.log('📥 Cargando productos...');
    mostrarLoading(true);
    ocultarError();
    
    try {
        const response = await axios.get(API_URL);
        console.log('✅ Productos cargados:', response.data);
        mostrarProductos(response.data);
    } catch (error) {
        console.error('❌ Error al cargar productos:', error);
        mostrarError('No se pudieron cargar los productos. Verifica que el backend esté ejecutándose.');
    } finally {
        mostrarLoading(false);
    }
}

// ===== FUNCIONES DE VISUALIZACIÓN =====

/**
 * Mostrar la lista de productos en el DOM
 * @param {Array} productos - Array de productos a mostrar
 */
function mostrarProductos(productos) {
    const container = document.getElementById('productos-container');
    
    // Si no hay productos, mostrar mensaje
    if (productos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📦</div>
                <h3>No hay productos registrados</h3>
                <p>Agrega tu primer producto usando el formulario de arriba</p>
            </div>
        `;
        return;
    }
    
    // Generar HTML para cada producto
    const productosHTML = productos.map(producto => `
        <div class="producto-card">
            <div class="producto-header">
                <div>
                    <div class="producto-nombre">${escapeHtml(producto.nombre)}</div>
                </div>
                <span class="producto-id">ID: ${producto.id}</span>
            </div>
            
            <div class="producto-descripcion">
                ${escapeHtml(producto.descripcion) || 'Sin descripción'}
            </div>
            
            <div class="producto-details">
                <div class="detail-item">
                    <div class="detail-label">Cantidad</div>
                    <div class="detail-value">${producto.cantidad}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Precio</div>
                    <div class="detail-value">$${parseFloat(producto.precio).toFixed(2)}</div>
                </div>
            </div>
            
            <div class="producto-actions">
                <button class="btn btn-warning" onclick="editarProducto(${producto.id})">
                    ✏️ Editar
                </button>
                <button class="btn btn-danger" onclick="abrirModalEliminar(${producto.id})">
                    🗑️ Eliminar
                </button>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = `<div class="productos-grid">${productosHTML}</div>`;
}

// ===== FUNCIONES CRUD =====

/**
 * Guardar producto (Crear o Actualizar)
 * @param {Event} event - Evento del formulario
 */
async function guardarProducto(event) {
    event.preventDefault();
    
    const id = document.getElementById('producto-id').value;
    const producto = {
        nombre: document.getElementById('nombre').value.trim(),
        descripcion: document.getElementById('descripcion').value.trim() || null,
        cantidad: parseInt(document.getElementById('cantidad').value),
        precio: parseFloat(document.getElementById('precio').value)
    };
    
    // Validaciones básicas
    if (!producto.nombre || producto.nombre.length < 3) {
        mostrarError('El nombre debe tener al menos 3 caracteres');
        return;
    }
    
    if (producto.cantidad < 0) {
        mostrarError('La cantidad no puede ser negativa');
        return;
    }
    
    if (producto.precio <= 0) {
        mostrarError('El precio debe ser mayor que 0');
        return;
    }
    
    console.log('💾 Guardando producto:', producto);
    
    try {
        if (id) {
            // Actualizar producto existente
            await axios.put(`${API_URL}/${id}`, producto);
            console.log('✅ Producto actualizado');
            mostrarMensajeExito('✅ Producto actualizado correctamente');
        } else {
            // Crear nuevo producto
            await axios.post(API_URL, producto);
            console.log('✅ Producto creado');
            mostrarMensajeExito('✅ Producto creado correctamente');
        }
        
        limpiarFormulario();
        cargarProductos();
    } catch (error) {
        console.error('❌ Error al guardar producto:', error);
        
        if (error.response && error.response.data) {
            // Mostrar errores de validación del backend
            const errores = error.response.data;
            if (typeof errores === 'object') {
                const mensajesError = Object.entries(errores)
                    .map(([campo, mensaje]) => `${campo}: ${mensaje}`)
                    .join('\n');
                mostrarError(mensajesError);
            } else {
                mostrarError(errores);
            }
        } else {
            mostrarError('Error al guardar el producto. Verifica los datos e intenta nuevamente.');
        }
    }
}

/**
 * Editar un producto existente
 * @param {number} id - ID del producto a editar
 */
async function editarProducto(id) {
    console.log('✏️ Editando producto:', id);
    
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        const producto = response.data;
        
        // Llenar el formulario con los datos del producto
        document.getElementById('producto-id').value = producto.id;
        document.getElementById('nombre').value = producto.nombre;
        document.getElementById('descripcion').value = producto.descripcion || '';
        document.getElementById('cantidad').value = producto.cantidad;
        document.getElementById('precio').value = producto.precio;
        
        // Cambiar el título y texto del botón
        document.getElementById('form-title').textContent = '✏️ Editar Producto';
        document.getElementById('btn-text').textContent = '💾 Actualizar Producto';
        document.getElementById('btn-cancel').style.display = 'block';
        
        // Scroll al formulario
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        console.log('✅ Producto cargado en el formulario');
    } catch (error) {
        console.error('❌ Error al cargar producto:', error);
        mostrarError('No se pudo cargar el producto para editar');
    }
}

/**
 * Abrir modal de confirmación para eliminar
 * @param {number} id - ID del producto a eliminar
 */
function abrirModalEliminar(id) {
    console.log('🗑️ Abriendo modal para eliminar producto:', id);
    productoAEliminar = id;
    const modal = document.getElementById('modal-confirmacion');
    modal.style.display = 'flex';
}

/**
 * Cerrar modal de confirmación
 */
function cerrarModal() {
    console.log('❌ Cerrando modal');
    const modal = document.getElementById('modal-confirmacion');
    modal.style.display = 'none';
    productoAEliminar = null;
}

/**
 * Confirmar eliminación del producto
 */
async function confirmarEliminar() {
    if (!productoAEliminar) return;
    
    console.log('🗑️ Eliminando producto:', productoAEliminar);
    
    try {
        await axios.delete(`${API_URL}/${productoAEliminar}`);
        console.log('✅ Producto eliminado');
        mostrarMensajeExito('🗑️ Producto eliminado correctamente');
        cerrarModal();
        cargarProductos();
    } catch (error) {
        console.error('❌ Error al eliminar producto:', error);
        mostrarError('No se pudo eliminar el producto');
        cerrarModal();
    }
}

// ===== FUNCIONES DE BÚSQUEDA =====

/**
 * Buscar productos por nombre
 */
async function buscarProductos() {
    const searchTerm = document.getElementById('search-input').value.trim();
    
    if (!searchTerm) {
        cargarProductos();
        return;
    }
    
    console.log('🔍 Buscando productos:', searchTerm);
    mostrarLoading(true);
    ocultarError();
    
    try {
        const response = await axios.get(`${API_URL}/buscar`, {
            params: { nombre: searchTerm }
        });
        
        console.log('✅ Productos encontrados:', response.data.length);
        mostrarProductos(response.data);
        
        if (response.data.length === 0) {
            mostrarError(`No se encontraron productos con el término: "${searchTerm}"`);
        }
    } catch (error) {
        console.error('❌ Error al buscar productos:', error);
        mostrarError('Error al realizar la búsqueda');
    } finally {
        mostrarLoading(false);
    }
}

// ===== FUNCIONES AUXILIARES =====

/**
 * Cancelar edición y limpiar formulario
 */
function cancelarEdicion() {
    console.log('❌ Cancelando edición');
    limpiarFormulario();
}

/**
 * Limpiar el formulario
 */
function limpiarFormulario() {
    document.getElementById('producto-form').reset();
    document.getElementById('producto-id').value = '';
    document.getElementById('form-title').textContent = '➕ Agregar Nuevo Producto';
    document.getElementById('btn-text').textContent = '💾 Guardar Producto';
    document.getElementById('btn-cancel').style.display = 'none';
}

/**
 * Mostrar u ocultar el indicador de carga
 * @param {boolean} mostrar - true para mostrar, false para ocultar
 */
function mostrarLoading(mostrar) {
    const loading = document.getElementById('loading');
    loading.style.display = mostrar ? 'block' : 'none';
}

/**
 * Mostrar mensaje de error
 * @param {string} mensaje - Mensaje de error a mostrar
 */
function mostrarError(mensaje) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = mensaje;
    errorDiv.style.display = 'block';
    
    // Ocultar automáticamente después de 5 segundos
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

/**
 * Ocultar mensaje de error
 */
function ocultarError() {
    const errorDiv = document.getElementById('error-message');
    errorDiv.style.display = 'none';
}

/**
 * Mostrar mensaje de éxito
 * @param {string} mensaje - Mensaje de éxito a mostrar
 */
function mostrarMensajeExito(mensaje) {
    const container = document.querySelector('.container');
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = mensaje;
    
    // Insertar al inicio del container
    container.insertBefore(successDiv, container.children[1]);
    
    // Remover automáticamente después de 3 segundos
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

/**
 * Escapar HTML para prevenir XSS
 * @param {string} text - Texto a escapar
 * @returns {string} - Texto escapado
 */
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ===== MANEJADORES DE EVENTOS GLOBALES =====

// Cerrar modal al hacer clic fuera de él
document.addEventListener('click', (event) => {
    const modal = document.getElementById('modal-confirmacion');
    if (event.target === modal) {
        cerrarModal();
    }
});

// Cerrar modal con la tecla ESC
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        cerrarModal();
    }
});

// ===== UTILIDADES DE CONSOLA =====

/**
 * Mostrar estadísticas en consola
 */
function mostrarEstadisticas() {
    console.log(`
    ╔═══════════════════════════════════════╗
    ║   SISTEMA DE GESTIÓN DE PRODUCTOS    ║
    ╠═══════════════════════════════════════╣
    ║ API URL: ${API_URL}                   
    ║ Estado: Conectado ✅                  
    ╚═══════════════════════════════════════╝
    `);
}

// Mostrar estadísticas al cargar
setTimeout(mostrarEstadisticas, 1000);

// ===== FIN DEL SCRIPT =====
console.log('✅ Script cargado correctamente');