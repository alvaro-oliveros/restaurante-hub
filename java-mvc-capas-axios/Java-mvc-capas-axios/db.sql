CREATE TABLE productos (
                           id BIGSERIAL PRIMARY KEY,
                           nombre VARCHAR(100) NOT NULL,
                           descripcion VARCHAR(500),
                           cantidad INTEGER NOT NULL CHECK (cantidad >= 0),
                           precio NUMERIC(10, 2) NOT NULL CHECK (precio > 0),
                           CONSTRAINT productos_nombre_unique UNIQUE (nombre)
);

-- Comentarios sobre la tabla y columnas
COMMENT ON TABLE productos IS 'Tabla que almacena información de productos';
COMMENT ON COLUMN productos.id IS 'Identificador único del producto (autogenerado)';
COMMENT ON COLUMN productos.nombre IS 'Nombre del producto (máximo 100 caracteres)';
COMMENT ON COLUMN productos.descripcion IS 'Descripción detallada del producto (máximo 500 caracteres)';
COMMENT ON COLUMN productos.cantidad IS 'Cantidad disponible en inventario (no puede ser negativa)';
COMMENT ON COLUMN productos.precio IS 'Precio del producto (debe ser mayor que 0)';

-- 4. CREAR ÍNDICES para mejorar el rendimiento
CREATE INDEX idx_productos_nombre ON productos(nombre);
CREATE INDEX idx_productos_cantidad ON productos(cantidad);
CREATE INDEX idx_productos_precio ON productos(precio);

-- 5. INSERTAR DATOS DE PRUEBA
INSERT INTO productos (nombre, descripcion, cantidad, precio) VALUES
                                                                  ('Laptop Dell XPS 15', 'Laptop de alto rendimiento con procesador Intel i7, 16GB RAM, 512GB SSD', 10, 1299.99),
                                                                  ('Mouse Logitech MX Master 3', 'Mouse inalámbrico ergonómico con 7 botones programables', 25, 99.99),
                                                                  ('Teclado Mecánico Corsair K95', 'Teclado mecánico RGB con switches Cherry MX', 15, 189.99),
                                                                  ('Monitor Samsung 27" 4K', 'Monitor Ultra HD 4K de 27 pulgadas con HDR', 8, 449.99),
                                                                  ('Webcam Logitech C920', 'Cámara web Full HD 1080p con micrófono estéreo', 30, 79.99),
                                                                  ('Auriculares Sony WH-1000XM4', 'Auriculares inalámbricos con cancelación de ruido', 12, 349.99),
                                                                  ('Disco Duro SSD Samsung 1TB', 'Unidad de estado sólido NVMe de 1TB', 20, 129.99),
                                                                  ('Impresora HP LaserJet Pro', 'Impresora láser monocromática con Wi-Fi', 5, 249.99),
                                                                  ('Router TP-Link AX6000', 'Router Wi-Fi 6 de doble banda con 8 antenas', 18, 299.99),
                                                                  ('Hub USB-C Anker 7 en 1', 'Hub multipuerto con HDMI, USB 3.0 y lector de tarjetas', 40, 49.99);

-- 6. CONSULTAS ÚTILES PARA VERIFICAR

-- Ver todos los productos
SELECT * FROM productos;