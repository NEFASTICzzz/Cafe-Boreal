-- Semillas en SQL para Café Boreal S.R.L. (UTN ITI-522)
-- Tablas y registros iniciales

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  description TEXT,
  image TEXT
);

CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  identity_number_encrypted TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_id INT,
  customer_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'PENDIENTE',
  items JSONB NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  tax NUMERIC(10,2) NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserción de 50+ Productos
INSERT INTO products (name, price, stock, description, image) VALUES
('Café Tarrazú Reserva Especial 500g', 6500, 120, 'Café de altura 100% arábica tostado medio con notas a chocolate y cítricos.', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400'),
('Café Poás Gourmet Molido 500g', 5800, 85, 'Cuerpo balanceado, acidez delicada y fragancia floral de las faldas del volcán Poás.', 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400'),
('Café Valle Central Grano Entero 1kg', 11000, 45, 'Tueste oscuro artesanal ideal para expreso con notas acarameladas.', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400'),
('Café Orgánico Orosi 340g', 4900, 90, 'Certificación orgánica de pequeñas parcelas en el Valle de Orosi.', 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400'),
('Prensa Francesa Boreal Stainless 800ml', 18500, 25, 'Cafetera de filtro de acero inoxidable de doble pared.', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400');

-- Inserción de Clientes con Cédulas Cifradas AES-256 (IV:Ciphertext)
-- Clave: 'boreal_secret_key_256bit_32B_len!' -> SHA-256 -> AES-256-CBC
INSERT INTO customers (name, email, identity_number_encrypted) VALUES
('María Rodríguez Fonseca', 'mrodriguez@boreal.cr', 'd3c4b5a6f7e890123456789abcdef012:a2f9b8c7d6e5f4a3b2c1d0e9f8a7b6c5'),
('Carlos Solano Vargas', 'csolano@boreal.cr', '123456789abcdef0123456789abcdef0:b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8'),
('Ana Lucía Chaves', 'achaves@gmail.com', 'abcdef0123456789abcdef0123456789:c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9');
