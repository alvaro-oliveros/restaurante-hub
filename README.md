# 🍽️ RestauranteHub - Sistema de Gestión de Restaurante

Sistema integral de gestión y atención para restaurantes desarrollado con **Java Spring Boot** y **React**.

---

## 📋 Contenido

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Datos de Prueba](#datos-de-prueba)
- [Credenciales](#credenciales)

---

## ✨ Características

### **Vista Cliente**
- ✅ Selección de mesa (escaneo QR o manual)
- ✅ Catálogo de menú con imágenes
- ✅ Filtros por alergias y preferencias
- ✅ Carrito de compras editable
- ✅ Historial de pedidos
- ✅ Gestión de perfil, direcciones y métodos de pago

### **Vista Administrador**
- ✅ Dashboard con KPIs en tiempo real (ingresos, pedidos, hora pico, método principal)
- ✅ Gestión de pedidos con flujo separado delivery/presencial (PENDIENTE → SERVIDO/PAGADO o → ENTREGADO)
- ✅ Administración de menú (CRUD completo) e inventario
- ✅ Monitoreo de estado de mesas (cambio de estado rápido y límite de mesas ocupadas)
- ✅ Reportes y analytics (ventas por hora, método de pago, tendencia semanal)
- ✅ Mapa de calor de delivery por distrito de Lima (últimos 30 días)
- ✅ Gestión de usuarios y roles

### **Novedades recientes**
- Estado `SERVIDO` integrado en flujo presencial (frontend y backend) y validación de transición.
- Dashboard refinado: KPIs compactos (Ingresos, Método Principal), etiquetas legibles y tope de ocupación por 10 mesas.
- Mapa de calor de delivery (Leaflet) usando `/api/admin/reportes/delivery/heatmap` y centroides por distrito de Lima.
- Seed de datos ampliado: 60 clientes, 230 pedidos de la última semana con estados realistas (máx. 10 presenciales activos), mezcla de métodos de pago y horarios operativos.
- Tabla de gestión de mesas con distribución de columnas optimizada (sin espacio vacío a la derecha).

---

## 🛠️ Tecnologías

### **Backend**
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA / Hibernate
- PostgreSQL 14+
- Maven
- Lombok

### **Frontend**
- React 19 + Vite 7
- Axios
- React Router DOM
- Leaflet (mapa de delivery)

---

## 📦 Instalación

### **Requisitos Previos**
- Java 17 o superior
- PostgreSQL 14 o superior
- Node.js 16 o superior
- Maven (incluido Maven Wrapper)

### **1. Clonar el repositorio**
```bash
cd ~/Desktop/Proyectos/proyecto_restaurante
```

### **2. Configurar Base de Datos**

Crear la base de datos en PostgreSQL:
```sql
CREATE DATABASE restaurante_db;
```

### **3. Configurar Backend**

Editar `java-mvc-capas-axios/Java-mvc-capas-axios/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5433/restaurante_db
spring.datasource.username=postgres
spring.datasource.password=TU_PASSWORD
```

### **4. Cargar Datos de Prueba**

```bash
psql -U postgres -p 5433 -d restaurante_db -f datos-prueba.sql
```

O usar pgAdmin4 para ejecutar el script `datos-prueba.sql`.

### **5. Instalar Dependencias Frontend**

```bash
cd java-mvc-capas-axios/frontend-react
npm install
```

---

## 🚀 Uso

### **Iniciar Backend**

```bash
cd java-mvc-capas-axios/Java-mvc-capas-axios
./mvnw spring-boot:run
```

El backend estará disponible en: `http://localhost:8080`

### **Iniciar Frontend**

En otra terminal:

```bash
cd java-mvc-capas-axios/frontend-react
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

---

## 🔌 API Endpoints

### **Productos (Menú)**
```
GET    /api/productos              - Listar todos los productos
GET    /api/productos/{id}          - Obtener producto por ID
POST   /api/productos              - Crear producto
PUT    /api/productos/{id}          - Actualizar producto
DELETE /api/productos/{id}          - Eliminar producto
GET    /api/productos/buscar?nombre - Buscar por nombre
```

### **Mesas**
```
GET    /api/mesas                      - Listar todas las mesas
GET    /api/mesas/{id}                  - Obtener mesa por ID
GET    /api/mesas/estado/{estado}       - Filtrar por estado
GET    /api/mesas/resumen-estados       - Resumen de estados (KPI)
POST   /api/mesas                      - Crear mesa
PUT    /api/mesas/{id}                  - Actualizar mesa
PATCH  /api/mesas/{id}/estado          - Cambiar estado
DELETE /api/mesas/{id}                  - Eliminar mesa
```

**Estados de Mesa**: `DISPONIBLE`, `OCUPADA`, `RESERVADA`, `LIMPIEZA`

### **Pedidos**
```
GET    /api/pedidos                    - Listar todos los pedidos
GET    /api/pedidos/{id}                - Obtener pedido por ID
GET    /api/pedidos/cliente/{clienteId} - Pedidos de un cliente
GET    /api/pedidos/estado/{estado}     - Filtrar por estado
POST   /api/pedidos                    - Crear pedido
PUT    /api/pedidos/{id}/estado        - Actualizar estado
PUT    /api/pedidos/{id}/cancelar      - Cancelar pedido
```

**Estados de Pedido** (presencial): `PENDIENTE`, `CONFIRMADO`, `EN_PREPARACION`, `LISTO`, `SERVIDO`, `PAGADO`, `CANCELADO`

**Estados de Pedido** (delivery): `PENDIENTE`, `EN_PREPARACION`, `LISTO`, `RECOGIDO`, `ENTREGADO`, `CANCELADO`

### **Clientes**
```
GET    /api/clientes                - Listar clientes
GET    /api/clientes/{id}            - Obtener cliente
POST   /api/clientes                - Crear cliente
PUT    /api/clientes/{id}            - Actualizar cliente
DELETE /api/clientes/{id}            - Eliminar cliente
```

### **Direcciones**
```
GET    /api/clientes/{clienteId}/direcciones     - Listar direcciones
POST   /api/clientes/{clienteId}/direcciones     - Crear dirección
PUT    /api/clientes/{clienteId}/direcciones/{id} - Actualizar
DELETE /api/clientes/{clienteId}/direcciones/{id} - Eliminar
```

### **Métodos de Pago**
```
GET    /api/clientes/{clienteId}/metodos-pago     - Listar métodos
POST   /api/clientes/{clienteId}/metodos-pago     - Crear método
PUT    /api/clientes/{clienteId}/metodos-pago/{id} - Actualizar
DELETE /api/clientes/{clienteId}/metodos-pago/{id} - Eliminar
```

### **Usuarios (Admin)**
```
GET    /api/admin/usuarios              - Listar usuarios
GET    /api/admin/usuarios/{id}          - Obtener usuario
POST   /api/admin/usuarios              - Crear usuario
PUT    /api/admin/usuarios/{id}          - Actualizar usuario
DELETE /api/admin/usuarios/{id}          - Eliminar usuario
```

### **Reportes (Admin)**
```
GET    /api/admin/reportes/estadisticas  - Estadísticas generales
GET    /api/admin/reportes/ventas/dia   - Ventas del día
GET    /api/admin/reportes/ventas/mes   - Ventas del mes
GET    /api/admin/reportes/ventas/rango - Ventas por rango de fechas
GET    /api/admin/reportes/ventas/horas - Ventas por hora (día)
GET    /api/admin/reportes/pagos        - Ventas por método de pago
GET    /api/admin/reportes/stock/bajo   - Alertas de stock bajo
GET    /api/admin/reportes/clientes-zonas - Top clientes y zonas
GET    /api/admin/reportes/delivery/heatmap - Heatmap delivery por distrito (últimos 30 días)
```

---

## 📁 Estructura del Proyecto

```
proyecto_restaurante/
├── java-mvc-capas-axios/
│   ├── Java-mvc-capas-axios/          # Backend Spring Boot
│   │   ├── src/main/java/com/example/app/
│   │   │   ├── cliente/               # Módulo Cliente
│   │   │   ├── pedido/                # Módulo Pedidos
│   │   │   ├── producto/              # Módulo Productos
│   │   │   ├── mesa/                  # Módulo Mesas (Nuevo)
│   │   │   ├── usuario/               # Módulo Usuarios
│   │   │   ├── reporte/               # Módulo Reportes
│   │   │   └── common/                # Excepciones y config
│   │   └── src/main/resources/
│   │       └── application.properties
│   │
│   └── frontend-react/                # Frontend React
│       ├── src/
│       │   ├── components/
│       │   │   ├── cliente/           # Componentes Cliente
│       │   │   └── admin/             # Componentes Admin
│       │   └── services/              # Servicios API (Axios)
│       └── package.json
│
├── datos-prueba.sql                   # Script de datos de prueba
├── INSTRUCCIONES.md                   # Guía de instalación
└── README.md                          # Este archivo
```

---

## 🗄️ Datos de Prueba

El archivo `datos-prueba.sql` incluye:

- **17 Productos** del menú peruano con imágenes
- **10 Mesas** iniciales con ubicaciones
- **60 Clientes** con direcciones y métodos de pago variados
- **230 Pedidos** en la última semana (delivery/presencial, todos los métodos de pago, estados realistas con máximo 10 presenciales activos simultáneos)
- **4 Usuarios** administrativos

---

## 🔑 Credenciales
%%Falta implementar autenticación
### **Usuarios del Sistema**

| Usuario    | Contraseña  | Rol     |
|------------|-------------|---------|
| admin      | admin123    | ADMIN   |
| cocina01   | cocina123   | COCINA  |
| mesero01   | mesero123   | MESERO  |
| cajero01   | cajero123   | CAJERO  |

### **Base de Datos**

```
Host: localhost
Port: 5433
Database: restaurante_db
User: postgres
Password: admin (o tu contraseña)
```

---

## 🎨 Características del Menú

Todos los productos incluyen:
- ⭐ Rating (1-5 estrellas)
- ⏱️ Tiempo de preparación
- 🏷️ Categoría
- 🔖 Tags (Popular, Vegetariano)
- ⚠️ Información de alérgenos
- 📊 Estadísticas de ventas
- 🖼️ Imágenes (URLs de Unsplash)

---

## 📊 Dashboard de Administrador

KPIs disponibles:
- Ingresos del día
- Pedidos del día y pedidos activos
- Mesas ocupadas y porcentaje de ocupación
- Hora pico y método de pago principal
- Estado de mesas en tiempo real
- Productos más vendidos

---

## 🐛 Solución de Problemas

### Backend no inicia
```bash
# Verificar que PostgreSQL esté corriendo
psql -U postgres -p 5433 -l

# Verificar que la base de datos exista
psql -U postgres -p 5433 -c "\l" | grep restaurante_db
```

### Puerto 8080 ocupado
```bash
# Encontrar proceso
lsof -ti:8080

# Matar proceso
kill -9 $(lsof -ti:8080)
```

### Error de compilación
```bash
# Limpiar y recompilar
cd java-mvc-capas-axios/Java-mvc-capas-axios
./mvnw clean install
```

---

## 📝 Notas

- Este proyecto está en desarrollo (50% completado)
- Las contraseñas están sin encriptar (solo para desarrollo)
- Las imágenes son URLs externas de Unsplash
- No incluye autenticación JWT (pendiente)

---

## 👨‍💻 Desarrollo

### Compilar Backend
```bash
./mvnw clean compile
```

### Ejecutar Tests
```bash
./mvnw test
```

### Construir JAR
```bash
./mvnw package
```

### Subir cambios a GitHub
```bash
git status
git add .
git commit -m "Docs: actualizar README con features y seed realista"
git push origin main
```
> Ajusta la rama remota si usas otra distinta de `main`.

---

## 📄 Licencia

Proyecto académico - UTEC

---

## 📧 Contacto

Para dudas o problemas, revisar:
1. Logs del backend en la terminal
2. Consola del navegador (F12)
3. Archivo INSTRUCCIONES.md

---

**¡Listo para usar! 🚀**
