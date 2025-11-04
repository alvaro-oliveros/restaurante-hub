-- ============================================
-- DATOS DE PRUEBA - RESTAURANTE HUB
-- Sistema de Gestión de Restaurante Peruano
-- ============================================

-- Limpiar datos existentes (opcional)
TRUNCATE TABLE detalles_pedido CASCADE;
TRUNCATE TABLE pedidos CASCADE;
TRUNCATE TABLE metodos_pago CASCADE;
TRUNCATE TABLE direcciones CASCADE;
TRUNCATE TABLE clientes CASCADE;
TRUNCATE TABLE mesas CASCADE;
TRUNCATE TABLE productos CASCADE;
TRUNCATE TABLE categorias_producto CASCADE;
TRUNCATE TABLE usuarios CASCADE;

-- ============================================
-- 1. CATEGORÍAS DE PRODUCTOS
-- ============================================
INSERT INTO categorias_producto (id, nombre, descripcion) VALUES
(1, 'Entradas', 'Aperitivos y entradas tradicionales'),
(2, 'Principales', 'Platos principales'),
(3, 'Postres', 'Postres tradicionales peruanos'),
(4, 'Bebidas', 'Bebidas y refrescos');

-- ============================================
-- 2. PRODUCTOS (MENÚ DEL RESTAURANTE)
-- ============================================
INSERT INTO productos (id, nombre, descripcion, cantidad, precio, categoria_id, imagen_url, disponible, rating, tiempo_preparacion, alergenos, veces_vendido, es_popular, es_vegetariano) VALUES
-- Entradas
(1, 'Ají de Gallina', 'Clásico guiso de pollo deshilachado en salsa de ají amarillo, servido con papas y arroz', 50, 32.00, 1, 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400', true, 4.8, 25, 'lactosa,frutos secos', 72, true, false),
(2, 'Lomo Saltado', 'Clásico salteado de res con cebolla, tomate y ají, papas fritas y arroz', 45, 38.00, 2, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400', true, 4.9, 20, 'mariscos', 89, true, false),
(3, 'Ceviche de Pescado', 'Pescado fresco marinado en limón con cebolla roja, ají limo y camote', 30, 28.00, 1, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400', true, 4.7, 10, 'mariscos', 95, true, false),
(4, 'Arroz con Pollo', 'Arroz cocido con cerveza, culantro y pollo, servido con salsa criolla', 40, 25.00, 2, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', true, 4.5, 30, '', 45, false, false),
(5, 'Causa Limeña', 'Puré de papa amarilla con limón, relleno de pollo o atún, palta y mayonesa', 35, 18.00, 1, 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400', true, 4.6, 15, 'huevo', 52, false, false),
(6, 'Anticuchos', 'Brochetas de corazón de res marinadas en ají panca, servidas con papas y choclo', 25, 22.00, 1, 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400', true, 4.8, 20, '', 68, true, false),
(7, 'Tacu Tacu con Lomo', 'Mezcla de arroz y frijoles con bistec de lomo, huevo frito y salsa criolla', 30, 35.00, 2, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', true, 4.4, 25, 'huevo', 34, false, false),
(8, 'Rocoto Relleno', 'Rocoto relleno de carne picada, pasas y aceitunas, gratinado con queso', 20, 30.00, 2, 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400', true, 4.3, 35, 'lactosa', 28, false, false),
(9, 'Papa a la Huancaína', 'Papas amarillas bañadas en salsa de ají amarillo, leche y queso', 50, 15.00, 1, 'https://images.unsplash.com/photo-1601000939631-763b5e34b0ce?w=400', true, 4.6, 10, 'lactosa', 56, false, true),
(10, 'Pollo a la Brasa', 'Cuarto de pollo marinado y cocido a la leña, con papas fritas y ensalada', 35, 26.00, 2, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400', true, 4.9, 35, '', 112, true, false),
-- Postres
(11, 'Suspiro Limeño', 'Postre de manjar blanco cubierto con merengue de vino oporto', 40, 12.00, 3, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', true, 4.7, 5, 'huevo,lactosa', 42, false, true),
(12, 'Picarones', 'Buñuelos de zapallo y camote bañados en miel de chancaca', 30, 10.00, 3, 'https://images.unsplash.com/photo-1612212338225-c3b6f3db3a0b?w=400', true, 4.5, 15, '', 38, false, true),
(13, 'Mazamorra Morada', 'Postre morado de maíz morado con frutas y especias', 25, 8.00, 3, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', true, 4.4, 10, '', 24, false, true),
-- Bebidas
(14, 'Chicha Morada', 'Refresco de maíz morado con piña, manzana y especias', 100, 5.00, 4, 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400', true, 4.8, 2, '', 85, true, true),
(15, 'Inca Kola', 'Gaseosa peruana de sabor único', 80, 4.00, 4, 'https://images.unsplash.com/photo-1629203849780-d5a281a86081?w=400', true, 4.6, 1, '', 92, true, true),
(16, 'Pisco Sour', 'Cóctel peruano de pisco, limón, jarabe y clara de huevo', 40, 18.00, 4, 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400', true, 4.9, 5, 'huevo', 76, true, false),
(17, 'Jugo de Maracuyá', 'Jugo natural de maracuyá', 60, 6.00, 4, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400', true, 4.5, 3, '', 48, false, true);

-- ============================================
-- 3. MESAS DEL RESTAURANTE
-- ============================================
INSERT INTO mesas (id, numero_mesa, capacidad, ubicacion, estado) VALUES
(1, 1, 2, 'Ventana', 'OCUPADA'),
(2, 2, 4, 'Centro', 'OCUPADA'),
(3, 3, 6, 'Terraza', 'DISPONIBLE'),
(4, 4, 2, 'Bar', 'DISPONIBLE'),
(5, 5, 4, 'Ventana', 'OCUPADA'),
(6, 6, 4, 'Centro', 'DISPONIBLE'),
(7, 7, 2, 'Ventana', 'DISPONIBLE'),
(8, 8, 8, 'Terraza', 'RESERVADA'),
(9, 9, 2, 'Bar', 'LIMPIEZA'),
(10, 10, 4, 'Centro', 'DISPONIBLE');

-- Actualizar código QR después de insertar
UPDATE mesas SET codigoqr = 'QR-MESA-' || numero_mesa WHERE codigoqr IS NULL;

-- ============================================
-- 4. CLIENTES
-- ============================================
INSERT INTO clientes (id, nombre, apellido, email, telefono, documento_identidad, fecha_registro, activo) VALUES
(1, 'Carlos', 'Mendoza', 'carlos.mendoza@email.com', '987654321', '12345678', NOW(), true),
(2, 'María', 'Torres', 'maria.torres@email.com', '987654322', '87654321', NOW(), true),
(3, 'José', 'Ramírez', 'jose.ramirez@email.com', '987654323', '45678912', NOW(), true),
(4, 'Ana', 'García', 'ana.garcia@email.com', '987654324', '78912345', NOW(), true),
(5, 'Luis', 'Fernández', 'luis.fernandez@email.com', '987654325', '32165498', NOW(), true);

-- ============================================
-- 5. DIRECCIONES
-- ============================================
INSERT INTO direcciones (id, alias, direccion, distrito, ciudad, codigo_postal, referencia, es_principal, cliente_id) VALUES
(1, 'Casa', 'Av. Arequipa 2045', 'Lince', 'Lima', '15046', 'Edificio azul, depto 301', true, 1),
(2, 'Trabajo', 'Jr. Lampa 545', 'Cercado de Lima', 'Lima', '15001', 'Frente al parque', false, 1),
(3, 'Casa', 'Calle Los Olivos 234', 'Miraflores', 'Lima', '15074', 'Casa verde con jardín', true, 2),
(4, 'Casa', 'Av. Javier Prado 890', 'San Isidro', 'Lima', '15073', 'Torre empresarial, piso 5', true, 3);

-- ============================================
-- 6. MÉTODOS DE PAGO
-- ============================================
INSERT INTO metodos_pago (id, tipo, alias, ultimos_cuatro_digitos, nombre_tarjeta, mes_expiracion, es_principal, cliente_id) VALUES
(1, 'TARJETA_CREDITO', 'Visa Personal', '4532', 'Carlos Mendoza', '12/25', true, 1),
(2, 'TARJETA_DEBITO', 'BCP Débito', '8976', 'María Torres', '08/26', true, 2),
(3, 'YAPE', 'Yape BCP', NULL, 'José Ramírez', NULL, true, 3);

-- ============================================
-- 7. USUARIOS ADMINISTRATIVOS
-- ============================================
INSERT INTO usuarios (id, username, password, nombre, apellido, email, rol, activo, fecha_creacion) VALUES
(1, 'admin', 'admin123', 'Administrador', 'Sistema', 'admin@restaurantehub.com', 'ADMIN', true, NOW()),
(2, 'cocina01', 'cocina123', 'Pedro', 'Chef', 'chef@restaurantehub.com', 'COCINA', true, NOW()),
(3, 'mesero01', 'mesero123', 'Laura', 'Servicios', 'laura@restaurantehub.com', 'MESERO', true, NOW()),
(4, 'cajero01', 'cajero123', 'Roberto', 'Caja', 'caja@restaurantehub.com', 'CAJERO', true, NOW());

-- ============================================
-- 8. PEDIDOS DE EJEMPLO
-- ============================================
INSERT INTO pedidos (id, fecha_pedido, estado, tipo, subtotal, igv, total, observaciones, cliente_id, mesa_id) VALUES
(1, NOW() - INTERVAL '2 hours', 'LISTO', 'PRESENCIAL', 64.00, 11.52, 75.52, 'Ají suave por favor', 1, 1),
(2, NOW() - INTERVAL '1 hour', 'EN_PREPARACION', 'PRESENCIAL', 32.00, 5.76, 37.76, NULL, 2, 2),
(3, NOW() - INTERVAL '30 minutes', 'CONFIRMADO', 'PRESENCIAL', 56.00, 10.08, 66.08, 'Sin cebolla', 3, 5),
(4, NOW() - INTERVAL '15 minutes', 'PENDIENTE', 'DELIVERY', 38.00, 6.84, 44.84, NULL, 4, NULL),
(5, NOW() - INTERVAL '3 hours', 'ENTREGADO', 'PRESENCIAL', 90.00, 16.20, 106.20, NULL, 5, 2);

-- ============================================
-- 9. DETALLES DE PEDIDOS
-- ============================================
-- Pedido 1 (Mesa 1)
INSERT INTO detalles_pedido (id, pedido_id, producto_id, cantidad, precio_unitario, subtotal, personalizacion) VALUES
(1, 1, 1, 2, 32.00, 64.00, 'Ají suave');

-- Pedido 2 (Mesa 2)
INSERT INTO detalles_pedido (id, pedido_id, producto_id, cantidad, precio_unitario, subtotal, personalizacion) VALUES
(2, 2, 3, 1, 28.00, 28.00, NULL),
(3, 2, 14, 1, 4.00, 4.00, NULL);

-- Pedido 3 (Mesa 5)
INSERT INTO detalles_pedido (id, pedido_id, producto_id, cantidad, precio_unitario, subtotal, personalizacion) VALUES
(4, 3, 2, 1, 38.00, 38.00, 'Sin cebolla'),
(5, 3, 16, 1, 18.00, 18.00, NULL);

-- Pedido 4 (Delivery)
INSERT INTO detalles_pedido (id, pedido_id, producto_id, cantidad, precio_unitario, subtotal, personalizacion) VALUES
(6, 4, 2, 1, 38.00, 38.00, NULL);

-- Pedido 5 (Mesa 2 - Entregado)
INSERT INTO detalles_pedido (id, pedido_id, producto_id, cantidad, precio_unitario, subtotal, personalizacion) VALUES
(7, 5, 10, 2, 26.00, 52.00, NULL),
(8, 5, 2, 1, 38.00, 38.00, NULL);

-- ============================================
-- REINICIAR SECUENCIAS
-- ============================================
SELECT setval('categorias_producto_id_seq', (SELECT MAX(id) FROM categorias_producto));
SELECT setval('productos_id_seq', (SELECT MAX(id) FROM productos));
SELECT setval('mesas_id_seq', (SELECT MAX(id) FROM mesas));
SELECT setval('clientes_id_seq', (SELECT MAX(id) FROM clientes));
SELECT setval('direcciones_id_seq', (SELECT MAX(id) FROM direcciones));
SELECT setval('metodos_pago_id_seq', (SELECT MAX(id) FROM metodos_pago));
SELECT setval('usuarios_id_seq', (SELECT MAX(id) FROM usuarios));
SELECT setval('pedidos_id_seq', (SELECT MAX(id) FROM pedidos));
SELECT setval('detalles_pedido_id_seq', (SELECT MAX(id) FROM detalles_pedido));

-- ============================================
-- VERIFICACIÓN
-- ============================================
SELECT 'Categorías insertadas: ' || COUNT(*) FROM categorias_producto;
SELECT 'Productos insertados: ' || COUNT(*) FROM productos;
SELECT 'Mesas insertadas: ' || COUNT(*) FROM mesas;
SELECT 'Clientes insertados: ' || COUNT(*) FROM clientes;
SELECT 'Pedidos insertados: ' || COUNT(*) FROM pedidos;
SELECT 'Usuarios insertados: ' || COUNT(*) FROM usuarios;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
