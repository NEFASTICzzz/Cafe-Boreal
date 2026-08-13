const crypto = require('crypto');
const { Pool } = require('pg');

const RAW_KEY = process.env.ENCRYPTION_KEY || 'boreal_secret_key_256bit_32B_len!';
const ALGORITHM = 'aes-256-cbc';

function getCipherKey(secret) {
  return crypto.createHash('sha256').update(secret).digest();
}

function encryptIdentity(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, getCipherKey(RAW_KEY), iv);
  let encrypted = cipher.update(String(text), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'boreal_user',
  password: process.env.DB_PASSWORD || 'boreal_pass_256bit_secure',
  database: process.env.DB_NAME || 'boreal_db'
};

async function runSeed() {
  console.log('🌱 Ejecutando Seed Reproducible para Café Boreal S.R.L...');
  const pool = new Pool(dbConfig);

  try {
    // 1. Crear Tablas si no existen
    await pool.query(`
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
    `);

    console.log('✅ Tablas verificadas/creadas.');

    // 2. Insertar 52 Productos (≥50 requeridos)
    const productCategories = ['Café de Origen', 'Mezclas Especiales', 'Equipamiento', 'Accesorios', 'Insumos'];
    const regions = ['Tarrazú', 'Poás', 'Tres Ríos', 'Orosi', 'Brunca', 'Naranjo'];

    await pool.query('TRUNCATE TABLE products RESTART IDENTITY CASCADE');

    for (let i = 1; i <= 52; i++) {
      const region = regions[i % regions.length];
      const cat = productCategories[i % productCategories.length];
      const name = `Café Boreal ${cat} - Cosecha ${region} #${i}`;
      const price = 4500 + (i * 150);
      const stock = 20 + (i * 3);
      const description = `Edición limitada de café ${region}, tueste artesanal seleccionada grano a grano. Cosecha #${i}.`;
      const image = `https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400`;

      await pool.query(
        'INSERT INTO products (name, price, stock, description, image) VALUES ($1, $2, $3, $4, $5)',
        [name, price, stock, description, image]
      );
    }
    console.log('✅ 52 Productos insertados correctamente.');

    // 3. Insertar 12 Clientes (≥10 requeridos) con Identidad Encriptada
    await pool.query('TRUNCATE TABLE customers RESTART IDENTITY CASCADE');

    const sampleCustomers = [
      { name: "María Rodríguez Fonseca", email: "mrodriguez@boreal.cr", id: "101110222" },
      { name: "Carlos Solano Vargas", email: "csolano@boreal.cr", id: "203330444" },
      { name: "Ana Lucía Chaves", email: "achaves@gmail.com", id: "109990888" },
      { name: "Roberto Quesada Mora", email: "rquesada@hotmail.com", id: "302220111" },
      { name: "Sofía Valverde Blanco", email: "svalverde@outlook.com", id: "405550666" },
      { name: "Esteban Zúñiga Castillo", email: "ezuniga@boreal.cr", id: "108880777" },
      { name: "Laura Araya Gamboa", email: "laraya@empresa.cr", id: "501230456" },
      { name: "Gabriel Villalobos Soto", email: "gvillalobos@tech.cr", id: "207770888" },
      { name: "Daniela Monge Rojas", email: "dmonge@gmail.com", id: "104560789" },
      { name: "Kevin Brenes Hernández", email: "kbrenes@boreal.cr", id: "603210654" },
      { name: "Valeria Hidalgo Campos", email: "vhidalgo@coffeelovers.cr", id: "112341567" },
      { name: "Alejandro Fallas Navarro", email: "afallas@utn.ac.cr", id: "208760543" }
    ];

    for (const cust of sampleCustomers) {
      const encrypted = encryptIdentity(cust.id);
      await pool.query(
        'INSERT INTO customers (name, email, identity_number_encrypted) VALUES ($1, $2, $3)',
        [cust.name, cust.email, encrypted]
      );
    }
    console.log('✅ 12 Clientes insertados con número de cédula encriptado en AES-256.');

    console.log('🎉 Seed completado exitosamente.');
  } catch (err) {
    console.error('❌ Error ejecutando el seed:', err);
  } finally {
    await pool.end();
  }
}

runSeed();
