# RestauranteHub (Front)

SPA en React/Vite para la gestión de un restaurante con flujos separados de salón y delivery, panel de administración y perfil de cliente.

## Funcionalidades principales

- **Delivery y salón separados**: botón directo a delivery desde la landing; selección de mesa solo para consumo en local.
- **Seguimiento de pedidos**: historial de estados en back y timeline en front para clientes (delivery y salón).
- **Gestión de menú y pedidos (admin)**: formularios estilo panel, orden de pedidos más recientes en tablas y dashboard.
- **Perfil de cliente**:
  - Datos personales editables.
  - Direcciones con creación automática al registrarse y marcado de principal.
  - Métodos de pago simulados (Yape/Plin/tarjetas/efectivo) con formulario inline.
- **Mejoras UX**: headers consistentes, botones de navegación (inicio, delivery, logout), cards y formularios alineados.

## Backend asociado

El backend Spring Boot está en `../Java-mvc-capas-axios` e incluye:
- Historial de estados de pedido (`pedido_estado_historial`).
- Creación automática de dirección principal al registrar clientes o al consultar si está vacía.
- Endpoints de métodos de pago y pedidos actualizados.

## Scripts

```bash
npm install
npm run dev
npm run build
```

Variables (por defecto):
- API: `http://localhost:8080/api`

## Notas

- Los métodos de pago son simulados para el demo (no hay pasarela real).
- El seguimiento refresca periódicamente; se puede limpiar el pedido en curso guardado en localStorage.
