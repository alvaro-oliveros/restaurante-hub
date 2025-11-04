# 🍽️ Sistema de Gestión de Restaurante

## Requisitos Previos
- Java 17 ✅ (instalado)
- PostgreSQL 14+ ✅ (instalado)
- Node.js 16+ (para el frontend React)

---

## 📦 Configuración Inicial

### 1. Crear Base de Datos PostgreSQL

```bash
# Conectarse a PostgreSQL (ajusta el puerto si es necesario)
psql -U postgres -p 5433

# Dentro de psql, ejecutar:
CREATE DATABASE restaurante_db;
\q
```

**Nota**: El puerto configurado en el proyecto es **5433**. Si tu PostgreSQL usa el puerto 5432, edita:
`java-mvc-capas-axios/Java-mvc-capas-axios/src/main/resources/application.properties`

---

## 🚀 Ejecutar el Backend (Spring Boot)

### Opción 1: Usar Maven Wrapper (Recomendado)
```bash
cd java-mvc-capas-axios/Java-mvc-capas-axios
./mvnw spring-boot:run
```

### Opción 2: Ejecutar en segundo plano
```bash
cd java-mvc-capas-axios/Java-mvc-capas-axios
./mvnw spring-boot:run &
```

El backend estará disponible en: **http://localhost:8080**

Para verificar que funciona:
```bash
curl http://localhost:8080/api/productos
```

---

## 🎨 Ejecutar el Frontend (React)

En otra terminal:

```bash
cd java-mvc-capas-axios/frontend-react
npm install  # Solo la primera vez
npm run dev
```

El frontend estará disponible en: **http://localhost:5173**

---

## 📚 Estructura del Proyecto

```
proyecto_restaurante/
├── java-mvc-capas-axios/
│   ├── Java-mvc-capas-axios/          # Backend Spring Boot
│   │   ├── src/main/java/com/example/app/
│   │   │   ├── cliente/               # Módulo Cliente
│   │   │   ├── pedido/                # Módulo Pedidos
│   │   │   ├── producto/              # Módulo Productos
│   │   │   ├── usuario/               # Módulo Usuarios (Admin)
│   │   │   ├── reporte/               # Módulo Reportes
│   │   │   └── common/                # Excepciones y config
│   │   └── src/main/resources/
│   │       └── application.properties # Configuración BD
│   │
│   └── frontend-react/                # Frontend React
│       ├── src/
│       │   ├── components/
│       │   │   ├── cliente/           # Componentes perfil cliente
│       │   │   └── admin/             # Componentes perfil admin
│       │   └── services/              # Servicios API (Axios)
│       └── package.json
│
└── INSTRUCCIONES.md                   # Este archivo
```

---

## 🔧 Configuración de Base de Datos

### Ubicación del archivo de configuración:
`java-mvc-capas-axios/Java-mvc-capas-axios/src/main/resources/application.properties`

### Configuración actual:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5433/restaurante_db
spring.datasource.username=postgres
spring.datasource.password=admin
spring.jpa.hibernate.ddl-auto=update
```

**Importante**:
- Cambia `username` y `password` según tu configuración de PostgreSQL
- El modo `ddl-auto=update` creará las tablas automáticamente

---

## 🌐 Endpoints Principales

### Perfil Cliente
- `GET /api/clientes/{id}` - Obtener cliente
- `PUT /api/clientes/{id}` - Actualizar cliente
- `GET /api/clientes/{clienteId}/direcciones` - Direcciones
- `GET /api/clientes/{clienteId}/metodos-pago` - Métodos de pago
- `GET /api/pedidos/cliente/{clienteId}` - Historial de pedidos

### Perfil Administrador
- `GET /api/productos` - Listar productos (menú)
- `POST /api/productos` - Crear producto
- `GET /api/pedidos` - Listar todos los pedidos
- `PUT /api/pedidos/{id}/estado` - Actualizar estado pedido
- `GET /api/admin/usuarios` - Listar usuarios
- `GET /api/admin/reportes/estadisticas` - Estadísticas generales
- `GET /api/admin/reportes/ventas/dia` - Ventas del día

---

## 🐛 Solución de Problemas

### Error: "mvn command not found"
✅ **Solución**: Usa `./mvnw` en lugar de `mvn`

### Error: "Connection refused" al iniciar backend
- Verifica que PostgreSQL esté corriendo
- Verifica el puerto (5433 o 5432)
- Verifica que exista la base de datos `restaurante_db`

### Error: "Port 8080 already in use"
```bash
# Encontrar el proceso usando el puerto 8080
lsof -ti:8080

# Matar el proceso
kill -9 $(lsof -ti:8080)
```

### Frontend no se conecta al backend
- Verifica que el backend esté corriendo en http://localhost:8080
- Revisa la consola del navegador para errores CORS
- El archivo de configuración está en: `frontend-react/src/services/api.js`

---

## 📝 Datos de Prueba

Para probar la aplicación, necesitarás crear datos iniciales. Puedes usar herramientas como:
- **Postman** o **Insomnia** para hacer peticiones HTTP
- **pgAdmin** para insertar datos directamente en PostgreSQL

### Ejemplo: Crear un cliente
```bash
curl -X POST http://localhost:8080/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "telefono": "987654321",
    "documentoIdentidad": "12345678"
  }'
```

---

## ✅ Estado del Proyecto: 50% Completado

### Implementado ✅
- Backend completo con arquitectura MVC en capas
- 7 entidades JPA con relaciones
- 8 Services con lógica de negocio
- 7 Controllers REST
- Frontend React con Vite
- 10 componentes React (cliente + admin)
- 8 servicios API con Axios
- Navegación con React Router
- Estilos CSS básicos

### Pendiente ⏳ (para el otro 50%)
- Sistema de autenticación (JWT)
- Módulo de reservas
- Sistema de delivery completo
- AI/Recomendaciones
- Integración de pagos
- Sistema QR para mesas
- Facturación electrónica
- Notificaciones en tiempo real
- Tests unitarios e integración

---

## 📞 Contacto y Soporte

Si encuentras problemas, revisa:
1. Los logs del backend en la terminal
2. La consola del navegador (F12)
3. Los mensajes de error de PostgreSQL

¡Buena suerte con tu proyecto! 🚀
