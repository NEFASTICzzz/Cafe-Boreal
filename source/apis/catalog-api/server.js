const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Configuracion de base de datos opcional (PostgreSQL)
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'boreal_user',
  password: process.env.DB_PASSWORD || 'boreal_pass_256bit_secure',
  database: process.env.DB_NAME || 'boreal_db'
};

let pool = null;
try {
  pool = new Pool(dbConfig);
} catch (e) {
  console.log('PostgreSQL connection fallback to memory mode');
}

// In-Memory store inicial si no conecta a DB
let productsStore = [
  { id: 1, name: "Café Tarrazú Reserva Especial 500g", price: 6500, stock: 120, description: "Café de altura 100% arábica tostado medio con notas a chocolate y cítricos.", image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400" },
  { id: 2, name: "Café Poás Gourmet Molido 500g", price: 5800, stock: 85, description: "Cuerpo balanceado, acidez delicada y fragancia floral de las faldas del volcán Poás.", image: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400" },
  { id: 3, name: "Café Valle Central Grano Entero 1kg", price: 11000, stock: 45, description: "Tueste oscuro artesanal ideal para expreso con notas acarameladas.", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400" },
  { id: 4, name: "Café Orgánico Orosi 340g", price: 4900, stock: 90, description: "Certificación orgánica de pequeñas parcelas en el Valle de Orosi.", image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400" },
  { id: 5, name: "Prensa Francesa Boreal Stainless 800ml", price: 18500, stock: 25, description: "Cafetera de filtro de acero inoxidable de doble pared.", image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400" }
];

// Healthcheck endpoint
app.get('/healthz', (req, res) => {
  res.json({ status: "ok", service: "catalog-api", timestamp: new Date().toISOString() });
});

app.get('/api/catalog/healthz', (req, res) => {
  res.json({ status: "ok", service: "catalog-api", timestamp: new Date().toISOString() });
});

// GET /api/catalog
app.get('/api/catalog', async (req, res) => {
  try {
    if (pool) {
      const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
      if (result.rows.length > 0) {
        return res.json(result.rows);
      }
    }
  } catch (err) {
    console.log('DB Query fallback to store:', err.message);
  }
  res.json(productsStore);
});

// GET /api/catalog/:id
app.get('/api/catalog/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    if (pool) {
      const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
      if (result.rows.length > 0) return res.json(result.rows[0]);
    }
  } catch (err) {}
  
  const product = productsStore.find(p => p.id === id);
  if (!product) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(product);
});

// POST /api/catalog
app.post('/api/catalog', async (req, res) => {
  const { name, price, stock, description, image } = req.body;
  if (!name || price == null) {
    return res.status(400).json({ error: "Campos 'name' y 'price' son obligatorios" });
  }

  const newProd = {
    id: productsStore.length ? Math.max(...productsStore.map(p => p.id)) + 1 : 1,
    name,
    price: Number(price),
    stock: Number(stock || 0),
    description: description || "",
    image: image || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400"
  };

  try {
    if (pool) {
      const query = 'INSERT INTO products (name, price, stock, description, image) VALUES ($1, $2, $3, $4, $5) RETURNING *';
      const values = [newProd.name, newProd.price, newProd.stock, newProd.description, newProd.image];
      const result = await pool.query(query, values);
      return res.status(201).json(result.rows[0]);
    }
  } catch (err) {
    console.log('DB Insert fallback:', err.message);
  }

  productsStore.push(newProd);
  res.status(201).json(newProd);
});

// PUT /api/catalog/:id
app.put('/api/catalog/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, price, stock, description, image } = req.body;

  try {
    if (pool) {
      const query = 'UPDATE products SET name=$1, price=$2, stock=$3, description=$4, image=$5 WHERE id=$6 RETURNING *';
      const result = await pool.query(query, [name, price, stock, description, image, id]);
      if (result.rows.length > 0) return res.json(result.rows[0]);
    }
  } catch (err) {}

  const index = productsStore.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: "Producto no encontrado" });

  productsStore[index] = {
    ...productsStore[index],
    name: name !== undefined ? name : productsStore[index].name,
    price: price !== undefined ? Number(price) : productsStore[index].price,
    stock: stock !== undefined ? Number(stock) : productsStore[index].stock,
    description: description !== undefined ? description : productsStore[index].description,
    image: image !== undefined ? image : productsStore[index].image
  };

  res.json(productsStore[index]);
});

// DELETE /api/catalog/:id
app.delete('/api/catalog/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    if (pool) {
      await pool.query('DELETE FROM products WHERE id=$1', [id]);
    }
  } catch (err) {}

  productsStore = productsStore.filter(p => p.id !== id);
  res.json({ message: "Producto eliminado correctamente", id });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Catalog API] Servidor escuchando en puerto ${PORT}`);
});
