CREATE DATABASE IF NOT EXISTS green_bite;
USE green_bite;

-- ==========================================
--   TABLA: Usuarios
-- ==========================================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo ENUM('cliente', 'repartidor', 'admin') DEFAULT 'cliente',
    estado ENUM('activo', 'inactivo', 'baneado') DEFAULT 'activo'
);

-- ==========================================
--   TABLA: Direcciones de usuario
-- ==========================================
CREATE TABLE direcciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    etiqueta VARCHAR(50),
    direccion VARCHAR(255) NOT NULL,
    lat DECIMAL(10, 7),
    lng DECIMAL(10, 7),
    ciudad VARCHAR(100),
    estado VARCHAR(100),
    cp VARCHAR(10),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- ==========================================
--   TABLA: Restaurantes
-- ==========================================
CREATE TABLE restaurantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    email VARCHAR(150),
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    lat DECIMAL(10, 7),
    lng DECIMAL(10, 7),
    tiempo_entrega_min INT DEFAULT 15,
    tiempo_entrega_max INT DEFAULT 45,
    rating_promedio DECIMAL(2,1) DEFAULT 0,
    estado ENUM('abierto', 'cerrado') DEFAULT 'abierto'
);

-- ==========================================
--   TABLA: Horarios de Restaurante
-- ==========================================
CREATE TABLE restaurante_horarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurante_id INT NOT NULL,
    dia ENUM('lunes','martes','miércoles','jueves','viernes','sábado','domingo'),
    hora_apertura TIME,
    hora_cierre TIME,
    FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id)
);

-- ==========================================
--   TABLA: Categorías (vegetariano, vegano, keto, etc.)
-- ==========================================
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL
);

-- ==========================================
--   TABLA INTERMEDIA Restaurante-Categoría
-- ==========================================
CREATE TABLE restaurante_categorias (
    restaurante_id INT,
    categoria_id INT,
    PRIMARY KEY (restaurante_id, categoria_id),
    FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id),
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- ==========================================
--   TABLA: Menú
-- ==========================================
CREATE TABLE menu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurante_id INT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    calorias INT,
    es_saludable BOOLEAN DEFAULT TRUE,
    disponible BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id)
);

-- ==========================================
--   TABLA: Opciones adicionales (extras)
-- ==========================================
CREATE TABLE menu_extras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (menu_id) REFERENCES menu(id)
);

-- ==========================================
--   TABLA: Carrito
-- ==========================================
CREATE TABLE carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE carrito_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    carrito_id INT NOT NULL,
    menu_id INT NOT NULL,
    cantidad INT DEFAULT 1,
    FOREIGN KEY (carrito_id) REFERENCES carrito(id),
    FOREIGN KEY (menu_id) REFERENCES menu(id)
);

-- ==========================================
--   TABLA: Pedidos
-- ==========================================
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    restaurante_id INT NOT NULL,
    direccion_entrega_id INT NOT NULL,
    repartidor_id INT,
    total DECIMAL(10, 2),
    estado ENUM('pendiente','aceptado','preparando','en_camino','entregado','cancelado') DEFAULT 'pendiente',
    metodo_pago ENUM('tarjeta','efectivo','paypal','stripe') NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id),
    FOREIGN KEY (direccion_entrega_id) REFERENCES direcciones(id),
    FOREIGN KEY (repartidor_id) REFERENCES usuarios(id)
);

-- ==========================================
--   TABLA: Detalles del pedido
-- ==========================================
CREATE TABLE pedido_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    menu_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (menu_id) REFERENCES menu(id)
);

-- ==========================================
--   TABLA: Pagos
-- ==========================================
CREATE TABLE pagos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    monto DECIMAL(10,2),
    estado ENUM('pendiente','pagado','fallido') DEFAULT 'pendiente',
    transaccion_id VARCHAR(100),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);

-- ==========================================
--   TABLA: Reseñas de restaurantes
-- ==========================================
CREATE TABLE reseñas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    restaurante_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comentario TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id)
);

-- ==========================================
--   TABLA: Cupones y Descuentos
-- ==========================================
CREATE TABLE cupones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    descripcion VARCHAR(255),
    descuento_porcentaje INT,
    descuento_monto DECIMAL(10,2),
    fecha_inicio DATE,
    fecha_fin DATE,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE cupones_usados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    cupon_id INT NOT NULL,
    pedido_id INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (cupon_id) REFERENCES cupones(id),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);

-- ==========================================
--   TABLA: Repartidores ubicación en tiempo real
-- ==========================================
CREATE TABLE repartidor_posicion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    repartidor_id INT NOT NULL,
    lat DECIMAL(10,7),
    lng DECIMAL(10,7),
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (repartidor_id) REFERENCES usuarios(id)
);
