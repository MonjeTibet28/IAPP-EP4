-- Tabla de Categorías
CREATE TABLE Categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT
);

-- Tabla de Productos
CREATE TABLE Productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    cantidad_stock INT NOT NULL,
    categoria_id INT,
    FOREIGN KEY (categoria_id) REFERENCES Categorias(id)
);

-- Tabla de Clientes
CREATE TABLE Clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefono VARCHAR(20),
    direccion_envio TEXT
);

-- Tabla de Órdenes
CREATE TABLE Ordenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente',
    FOREIGN KEY (cliente_id) REFERENCES Clientes(id)
);




-- Data

INSERT INTO Categorias (nombre, descripcion) VALUES
('Electrónica', 'Productos electrónicos y gadgets'),
('Ropa', 'Ropa de moda para todas las edades'),
('Hogar', 'Artículos para el hogar y decoración');


INSERT INTO Productos (nombre, descripcion, precio, cantidad_stock, categoria_id) VALUES
('Smartphone', 'Smartphone de última generación', 699.99, 50, 1),
('Televisor LED', 'Televisor de alta definición', 899.99, 30, 1),
('Camiseta básica', 'Camiseta de algodón unisex', 19.99, 100, 2),
('Mesa de centro', 'Mesa de centro moderna', 149.99, 20, 3);


INSERT INTO Clientes (nombre, email, telefono, direccion_envio) VALUES
('Juan Pérez', 'juan@example.com', '123456789', 'Calle Principal 123'),
('María López', 'maria@example.com', '987654321', 'Avenida Central 456');


INSERT INTO Ordenes (cliente_id, total, estado) VALUES
(1, 699.99, 'pendiente');


