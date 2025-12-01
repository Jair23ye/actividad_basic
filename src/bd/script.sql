CREATE DATABASE IF NOT EXISTS green_bite;
USE green_bite;

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


CREATE TABLE restaurante_horarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurante_id INT NOT NULL,
    dia ENUM('lunes','martes','miércoles','jueves','viernes','sábado','domingo'),
    hora_apertura TIME,
    hora_cierre TIME,
    FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id)
);


CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL
);


CREATE TABLE restaurante_categorias (
    restaurante_id INT,
    categoria_id INT,
    PRIMARY KEY (restaurante_id, categoria_id),
    FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id),
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);


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


CREATE TABLE menu_extras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (menu_id) REFERENCES menu(id)
);


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


CREATE TABLE pedido_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    menu_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (menu_id) REFERENCES menu(id)
);


CREATE TABLE pagos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    monto DECIMAL(10,2),
    estado ENUM('pendiente','pagado','fallido') DEFAULT 'pendiente',
    transaccion_id VARCHAR(100),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);


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

CREATE TABLE repartidor_posicion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    repartidor_id INT NOT NULL,
    lat DECIMAL(10,7),
    lng DECIMAL(10,7),
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (repartidor_id) REFERENCES usuarios(id)
);

INSERT INTO usuarios(nombre, apellido, email, telefono, password_hash, tipo, estado) VALUES('Sofía', 'Gómez', 'prueba@gmail.com', '5551234567', '123', 'cliente', 'activo');
INSERT INTO usuarios(nombre, apellido, email, telefono, password_hash, tipo, estado) VALUES('Juan', 'Pérez', 'juan.perez@dominio.net', '5559876543', '1234', 'restaurante', 'activo');
INSERT INTO usuarios(nombre, apellido, email, telefono, password_hash, tipo, estado) VALUES('María', 'Rodríguez', 'maria.rodriguez@otro.org', '5555551122', '12345', 'repartidor', 'inactivo');

INSERT INTO restaurantes(nombre, descripcion, email, telefono, direccion, lat, lng, tiempo_entrega_min, tiempo_entrega_max, rating_promedio, estado) VALUES('La Toscana', 'Auténtica comida italiana con ingredientes frescos.', 'toscana@mail.com', '5553334455', 'Calle Falsa 123', 19.4326, -99.1332, 20, 45, 4.7, 'abierto');
INSERT INTO restaurantes(nombre, descripcion, email, telefono, direccion, lat, lng, tiempo_entrega_min, tiempo_entrega_max, rating_promedio, estado) VALUES('El Sushi Loco', 'El mejor sushi de la ciudad, fresco y rápido.', 'sushiloco@otro.net', '5552221100', 'Avenida Siempre Viva 742', 19.4120, -99.1500, 30, 60, 4.2, 'abierto');
INSERT INTO restaurantes(nombre, descripcion, email, telefono, direccion, lat, lng, tiempo_entrega_min, tiempo_entrega_max, rating_promedio, estado) VALUES('Veggie Delights', 'Opciones veganas y vegetarianas saludables.', 'veggiedelights@correo.org', '5558889977', 'Blvd. de los Sueños 50', 19.4500, -99.1000, 15, 35, 4.9, 'cerrado');

INSERT INTO menu (restaurante_id, nombre, descripcion, precio, calorias, proteinas, es_saludable, disponible) VALUES (1, 'Pizza Margherita', 'Clásica pizza con tomate, mozzarella y albahaca.', 150.00, 800, 30, 0, 1);
INSERT INTO menu (restaurante_id, nombre, descripcion, precio, calorias, proteinas, es_saludable, disponible) VALUES (2, 'California Roll', 'Rollo de sushi con cangrejo, aguacate y pepino.', 95.50, 350, 15, 1, 1);
INSERT INTO menu (restaurante_id, nombre, descripcion, precio, calorias, proteinas, es_saludable, disponible) VALUES (3, 'Bowl de Lentejas', 'Bowl nutritivo con lentejas, verduras asadas y aderezo tahini.', 120.75, 550, 25, 1, 0);


