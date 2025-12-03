-- ============================================
-- DATOS DE PRUEBA - RESTAURANTE HUB
-- Poblado con 60 clientes realistas y 230 pedidos (última semana)
-- ============================================

-- Limpiar datos existentes
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
INSERT INTO productos (id, nombre, descripcion, cantidad, precio, categoria_id, imagen_url, disponible, rating, tiempo_preparacion, alergenos, veces_vendido, es_popular, es_vegetariano, disponible_delivery) VALUES
(1, 'Ají de Gallina', 'Clásico guiso de pollo deshilachado en salsa de ají amarillo, servido con papas y arroz', 60, 32.00, 2, 'https://imagenes.elpais.com/resizer/v2/FPKN2NFO7BBC7NQBAOKALTZM4M.jpg?auth=4da1571a11c5ffce1995f11e0319efa11a0610dc96dac47efd1a9ddf1567834f&width=1960&height=1470&smart=true', true, 4.8, 25, 'lactosa,frutos secos', 72, true, false, true),
(2, 'Lomo Saltado', 'Clásico salteado de res con cebolla, tomate y ají, papas fritas y arroz', 55, 38.00, 2, 'https://www.oliveandmango.com/images/uploads/2022_07_18_lomo_saltado_2.jpg', true, 4.9, 20, '', 89, true, false, true),
(3, 'Ceviche de Pescado', 'Pescado fresco marinado en limón con cebolla roja, ají limo y camote', 40, 28.00, 1, 'https://mirecetadehoy.com/assets/images/ceviche-piurano_800x534.webp', true, 4.7, 10, 'mariscos', 95, true, false, true),
(4, 'Arroz con Pollo', 'Arroz cocido con cerveza, culantro y pollo, servido con salsa criolla', 60, 25.00, 2, 'https://andococinando.com/wp-content/uploads/2020/09/arroz-con-pollo-peru.jpeg', true, 4.5, 30, '', 45, false, false, true),
(5, 'Causa Limeña', 'Puré de papa amarilla con limón, relleno de pollo o atún, palta y mayonesa', 45, 18.00, 1, 'https://static.bainet.es/clip/452a8f7c-17f1-43d0-9f71-3bfd967266c7_source-aspect-ratio_1600w_0.jpg', true, 4.6, 15, 'huevo', 52, false, false, true),
(6, 'Anticuchos', 'Brochetas de corazón de res marinadas en ají panca, servidas con papas y choclo', 30, 22.00, 1, 'https://discoverpuntahermosa.com/wp-content/uploads/2024/04/2-1-1024x553.jpg', true, 4.8, 20, '', 68, true, false, true),
(7, 'Tacu Tacu con Lomo', 'Mezcla de arroz y frijoles con bistec de lomo, huevo frito y salsa criolla', 25, 35.00, 2, 'https://restauranteolimpico.com/wp-content/uploads/2022/11/tacu-tacu.jpg', true, 4.4, 25, 'huevo', 34, false, false, true),
(8, 'Rocoto Relleno', 'Rocoto relleno de carne picada, pasas y aceitunas, gratinado con queso', 24, 30.00, 2, 'https://upload.wikimedia.org/wikipedia/commons/1/17/Rocoto_relleno.jpg', true, 4.3, 35, 'lactosa', 28, false, false, true),
(9, 'Papa a la Huancaína', 'Papas amarillas bañadas en salsa de ají amarillo, leche y queso', 50, 15.00, 1, 'https://i.ytimg.com/vi/S5Ac-eaWfUU/sddefault.jpg', true, 4.6, 10, 'lactosa', 56, false, true, true),
(10, 'Pollo a la Brasa', 'Cuarto de pollo marinado y cocido a la leña, con papas fritas y ensalada', 45, 26.00, 2, 'https://cocatambo.com/sites/default/files/descubre-pollo-brasa-cocatambo.webp', true, 4.9, 35, '', 112, true, false, true),
(11, 'Suspiro Limeño', 'Postre de manjar blanco cubierto con merengue de vino oporto', 35, 12.00, 3, 'https://elcomercio.pe/resizer/v2/EHTND334Y5AODNPEKATE4AJWOU.jpg?auth=d299cb058e883dfdc4f1a51c24024b4f1c64f7d56013460e4d8e4b16aad58e00&width=1200&height=800&quality=75&smart=true', true, 4.7, 5, 'huevo,lactosa', 42, false, true, true),
(12, 'Picarones', 'Buñuelos de zapallo y camote bañados en miel de chancaca', 30, 10.00, 3, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0lWRx-ZE1tNSoVg4U0RVz1ir7CgUIHeLuCg&s', true, 4.5, 15, '', 38, false, true, true),
(13, 'Mazamorra Morada', 'Postre morado de maíz morado con frutas y especias', 28, 8.00, 3, 'https://www.comida-peruana.com/base/stock/Recipe/mazamorra-morada-estilo-peruano/mazamorra-morada-estilo-peruano_web.jpg.webp', true, 4.4, 10, '', 24, false, true, true),
(14, 'Chicha Morada', 'Refresco de maíz morado con piña, manzana y especias', 120, 5.00, 4, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRon9pBtRVg_zkxeJYjPzwEV38D6WQ0fStQVQ&s', true, 4.8, 2, '', 85, true, true, true),
(15, 'Inca Kola', 'Gaseosa peruana de sabor único', 120, 4.00, 4, 'https://plazavea.vteximg.com.br/arquivos/ids/30377881-512-512/gaseosa-inca-kola-sabor-original-paquete-6-botellas-1l-cu.jpg', true, 4.6, 1, '', 92, true, true, true),
(16, 'Pisco Sour', 'Cóctel peruano de pisco, limón, jarabe y clara de huevo', 40, 18.00, 4, 'https://www.cenfotur.edu.pe/wp-content/uploads/2021/02/boletin05_img01-el-pisco-sour-patrimonio-cultural.jpg', true, 4.9, 5, 'huevo', 76, true, false, true);

-- ============================================
-- 3. MESAS DEL RESTAURANTE
-- ============================================
INSERT INTO mesas (id, numero_mesa, capacidad, ubicacion, estado) VALUES
(1, 1, 2, 'Ventana', 'DISPONIBLE'),
(2, 2, 4, 'Centro', 'DISPONIBLE'),
(3, 3, 6, 'Terraza', 'DISPONIBLE'),
(4, 4, 2, 'Bar', 'DISPONIBLE'),
(5, 5, 4, 'Ventana', 'DISPONIBLE'),
(6, 6, 4, 'Centro', 'DISPONIBLE'),
(7, 7, 2, 'Ventana', 'DISPONIBLE'),
(8, 8, 8, 'Terraza', 'DISPONIBLE'),
(9, 9, 2, 'Bar', 'DISPONIBLE'),
(10, 10, 4, 'Centro', 'DISPONIBLE');

UPDATE mesas SET codigoqr = 'QR-MESA-' || numero_mesa WHERE codigoqr IS NULL;

-- ============================================
-- 4. CLIENTES (60 nombres/distritos realistas)
-- ============================================
WITH nombres AS (
  SELECT ARRAY['Carlos','María','José','Ana','Luis','Valeria','Diego','Sofía','Paolo','Lucía','Andrés','Gabriela','Renato','Camila','Felipe','Alejandra','Javier','Patricia','Rodrigo','Fiorella','Alonso','Natalia','Sebastián','Elena','Miguel','Daniela','Martín','Claudia','Héctor','Rocío','Álvaro','Jimena','Mateo','Isabella','Thiago','Julieta','Facundo','Bianca','Franco','Arantza','Nicolás','Fiama','Samuel','Florencia','Tomás','Ariana','Bruno','Marisol','Sergio','Constanza','Emilio','Pía','Iván','Lorena','Gian','Tania','Diego','Milagros'] AS firsts,
         ARRAY['Mendoza','Torres','Ramírez','García','Fernández','Rojas','Castro','Paredes','Flores','Vargas','Salazar','Ríos','Silva','Cruz','Núñez','Pineda','Villanueva','Quispe','Guevara','Lozano','Palacios','Campos','Aguilar','Delgado','Ibarra','Reyes','Escobar','Zamora','Luna','Valdez','Mejía','Camacho','Cárdenas','Carranza','Alarcón','Cáceres','Vera','Molina','Salas','Acosta','Bellido','Soto','Poma','Gálvez','Rosales','Tello','Bautista','Ávila','Peña','Prado','Sifuentes','Huamán','Montenegro','Cuba','Chávez','Rentería','Mori','Beltrán'] AS lasts,
         ARRAY['Miraflores','San Isidro','Barranco','San Borja','Lince','Surco','La Molina','Pueblo Libre','Magdalena','Jesús María','San Miguel','Callao','Los Olivos','San Martín de Porres','Breña','Ate','Comas','San Juan de Lurigancho','Villa El Salvador','Independencia','Chorrillos','San Juan de Miraflores','La Victoria','Rímac'] AS distritos
)
INSERT INTO clientes (id, nombre, apellido, email, password, telefono, direccion, tipo_via, numero, distrito, ciudad, codigo_postal, referencia, documento_identidad, fecha_registro, activo)
SELECT gs AS id,
       (SELECT firsts[(gs-1) % array_length(firsts,1) + 1] FROM nombres),
       (SELECT lasts[(gs-1) % array_length(lasts,1) + 1] FROM nombres),
       'cliente' || gs || '@email.com',
       'password123',
       '9' || lpad((70000000 + gs)::text, 8, '0'),
       'Av. ' || (SELECT distritos[(gs-1) % array_length(distritos,1) + 1] FROM nombres) || ' ' || gs,
       'Av.',
       gs::text,
       (SELECT distritos[(gs-1) % array_length(distritos,1) + 1] FROM nombres),
       'Lima',
       '15' || lpad((gs % 100)::text, 3, '0'),
       'Referencia ' || gs,
       '10' || lpad(gs::text, 6, '0'),
       NOW(),
       true
FROM generate_series(1, 60) gs;

-- ============================================
-- 5. DIRECCIONES (una por cliente)
-- ============================================
WITH nombres AS (
  SELECT ARRAY['Carlos','María','José','Ana','Luis','Valeria','Diego','Sofía','Paolo','Lucía','Andrés','Gabriela','Renato','Camila','Felipe','Alejandra','Javier','Patricia','Rodrigo','Fiorella','Alonso','Natalia','Sebastián','Elena','Miguel','Daniela','Martín','Claudia','Héctor','Rocío','Álvaro','Jimena','Mateo','Isabella','Thiago','Julieta','Facundo','Bianca','Franco','Arantza','Nicolás','Fiama','Samuel','Florencia','Tomás','Ariana','Bruno','Marisol','Sergio','Constanza','Emilio','Pía','Iván','Lorena','Gian','Tania','Diego','Milagros'] AS firsts,
         ARRAY['Miraflores','San Isidro','Barranco','San Borja','Lince','Surco','La Molina','Pueblo Libre','Magdalena','Jesús María','San Miguel','Callao','Los Olivos','San Martín de Porres','Breña','Ate','Comas','San Juan de Lurigancho','Villa El Salvador','Independencia','Chorrillos','San Juan de Miraflores','La Victoria','Rímac'] AS distritos
)
INSERT INTO direcciones (alias, direccion, distrito, ciudad, codigo_postal, referencia, es_principal, cliente_id)
SELECT 'Casa',
       'Av. ' || (SELECT firsts[(gs-1) % array_length(firsts,1) + 1] FROM nombres) || ' ' || gs,
       (SELECT distritos[(gs-1) % array_length(distritos,1) + 1] FROM nombres),
       'Lima',
       '15' || lpad((gs % 100)::text, 3, '0'),
       'Ref dir ' || gs,
       true,
       gs
FROM generate_series(1, 60) gs;

-- ============================================
-- 6. USUARIOS ADMINISTRATIVOS
-- ============================================
INSERT INTO usuarios (id, username, password, nombre, apellido, email, rol, activo, fecha_creacion) VALUES
(1, 'admin', 'admin123', 'Administrador', 'Sistema', 'admin@restaurantehub.com', 'ADMIN', true, NOW()),
(2, 'cocina01', 'cocina123', 'Pedro', 'Chef', 'chef@restaurantehub.com', 'COCINA', true, NOW()),
(3, 'mesero01', 'mesero123', 'Laura', 'Servicios', 'laura@restaurantehub.com', 'MESERO', true, NOW()),
(4, 'cajero01', 'cajero123', 'Roberto', 'Caja', 'caja@restaurantehub.com', 'CAJERO', true, NOW());

-- ============================================
-- 7. MÉTODOS DE PAGO (para 60 clientes, incluye Yape/Plin)
-- ============================================
INSERT INTO metodos_pago (tipo, alias, ultimos_cuatro_digitos, nombre_tarjeta, mes_expiracion, es_principal, cliente_id)
SELECT (ARRAY['TARJETA_CREDITO','TARJETA_DEBITO','YAPE','PLIN'])[ (gs-1) % 4 + 1 ],
       'Pago ' || gs,
       CASE WHEN ((gs-1) % 4) IN (2,3) THEN NULL ELSE lpad((4000 + gs)::text, 4, '0') END,
       'Cliente ' || gs,
       CASE WHEN ((gs-1) % 4) IN (2,3) THEN NULL ELSE '12/26' END,
       true,
       gs
FROM generate_series(1, 60) gs;

-- ============================================
-- 8. PEDIDOS (230) Y DETALLES GENERADOS
-- Horario operativo 11:00 a 22:00, mezcla delivery/presencial y métodos, última semana
-- ============================================
WITH base AS (
    SELECT gs AS id,
           -- Cada ~35 pedidos retrocede un día (7 días)
           date_trunc('day', NOW()) - ((gs-1) / 35) * INTERVAL '1 day'
             + (11 + ((gs-1) % 11)) * INTERVAL '1 hour'
             + ((gs % 5) * INTERVAL '7 minutes') AS fecha_pedido,
           CASE WHEN gs % 2 = 0 THEN 'DELIVERY' ELSE 'PRESENCIAL' END AS tipo,
           CASE
               WHEN gs % 23 = 0 THEN 'CANCELADO'
               WHEN gs % 2 = 0 THEN
                    CASE
                        WHEN gs <= 20 THEN (ARRAY['PENDIENTE','EN_PREPARACION','LISTO','RECOGIDO','EN_PREPARACION'])[ ((gs/2 -1) % 5) + 1 ]
                        ELSE 'ENTREGADO'
                    END
               ELSE
                    CASE
                        WHEN gs <= 19 THEN (ARRAY['PENDIENTE','CONFIRMADO','EN_PREPARACION','LISTO','SERVIDO'])[ (((gs-1)/2) % 5) + 1 ]
                        ELSE 'PAGADO'
                    END
           END AS estado,
           ((gs-1) % 60) + 1 AS cliente_id,
           CASE WHEN gs % 2 = 0 THEN NULL ELSE ((gs-1) % 10) + 1 END AS mesa_id,
           (ARRAY['EFECTIVO','TARJETA_DEBITO','TARJETA_CREDITO','YAPE','PLIN'])[ ((gs-1) % 5) + 1 ] AS medio_pago,
           NULL::text AS observaciones
    FROM generate_series(1, 230) gs
),
detalle_pre AS (
    SELECT b.id AS pedido_id,
           p.id AS producto_id,
           ((b.id + p.id) % 2) + 1 AS cantidad,
           p.precio,
           row_number() OVER (PARTITION BY b.id ORDER BY p.id) AS rn
    FROM base b
    JOIN productos p ON p.id IN (1,2,3,4,5,6,10,14,15,16)
),
detalle AS (
    SELECT pedido_id, producto_id, cantidad, precio
    FROM detalle_pre
    WHERE rn <= 2
),
totales AS (
    SELECT pedido_id,
           SUM(precio * cantidad) AS total
    FROM detalle
    GROUP BY pedido_id
)
INSERT INTO pedidos (id, fecha_pedido, estado, tipo, subtotal, igv, total, observaciones, cliente_id, mesa_id, medio_pago, direccion_entrega, tomado_por_usuario_id)
SELECT b.id,
       b.fecha_pedido,
       b.estado,
       b.tipo,
       ROUND(t.total / 1.18, 2) AS subtotal,
       ROUND(t.total - (t.total / 1.18), 2) AS igv,
       ROUND(t.total, 2) AS total,
       b.observaciones,
       b.cliente_id,
       b.mesa_id,
       b.medio_pago,
       CASE WHEN b.tipo = 'DELIVERY'
            THEN c.direccion || ', ' || c.distrito
            ELSE NULL END,
       NULL
FROM base b
JOIN totales t ON t.pedido_id = b.id
JOIN clientes c ON c.id = b.cliente_id;

-- Detalles generados
WITH detalle_pre AS (
    SELECT b.id AS pedido_id,
           p.id AS producto_id,
           ((b.id + p.id) % 2) + 1 AS cantidad,
           p.precio,
           row_number() OVER (PARTITION BY b.id ORDER BY p.id) AS rn
    FROM pedidos b
    JOIN productos p ON p.id IN (1,2,3,4,5,6,10,14,15,16)
),
detalle AS (
    SELECT pedido_id, producto_id, cantidad, precio
    FROM detalle_pre
    WHERE rn <= 2
)
INSERT INTO detalles_pedido (pedido_id, producto_id, cantidad, precio_unitario, subtotal, personalizacion)
SELECT d.pedido_id,
       d.producto_id,
       d.cantidad,
       d.precio,
       d.precio * d.cantidad,
       NULL
FROM detalle d;

-- ============================================
-- REINICIAR SECUENCIAS
-- ============================================
SELECT setval('categorias_producto_id_seq', (SELECT MAX(id) FROM categorias_producto));
SELECT setval('productos_id_seq', (SELECT MAX(id) FROM productos));
SELECT setval('mesas_id_seq', (SELECT MAX(id) FROM mesas));
SELECT setval('clientes_id_seq', (SELECT MAX(id) FROM clientes));
SELECT setval('direcciones_id_seq', COALESCE((SELECT MAX(id) FROM direcciones), 1));
SELECT setval('metodos_pago_id_seq', (SELECT MAX(id) FROM metodos_pago));
SELECT setval('usuarios_id_seq', (SELECT MAX(id) FROM usuarios));
SELECT setval('pedidos_id_seq', (SELECT MAX(id) FROM pedidos));
SELECT setval('detalles_pedido_id_seq', (SELECT MAX(id) FROM detalles_pedido));

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
