const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

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

let ordersStore = [
  {
    id: 1001,
    customer_id: 1,
    customer_name: "María Rodríguez Fonseca",
    date: new Date().toISOString(),
    status: "COMPLETADO",
    items: [
      { product_id: 1, product_name: "Café Tarrazú Reserva Especial 500g", quantity: 2, unit_price: 6500, total: 13000 }
    ],
    subtotal: 13000,
    tax: 1690,
    total: 14690
  },
  {
    id: 1002,
    customer_id: 2,
    customer_name: "Carlos Solano Vargas",
    date: new Date().toISOString(),
    status: "PROCESANDO",
    items: [
      { product_id: 3, product_name: "Café Valle Central Grano Entero 1kg", quantity: 1, unit_price: 11000, total: 11000 },
      { product_id: 5, product_name: "Prensa Francesa Boreal Stainless 800ml", quantity: 1, unit_price: 18500, total: 18500 }
    ],
    subtotal: 29500,
    tax: 3835,
    total: 33335
  }
];

// Healthcheck endpoints
app.get('/healthz', (req, res) => {
  res.json({ status: "ok", service: "orders-api", timestamp: new Date().toISOString() });
});

app.get('/api/orders/healthz', (req, res) => {
  res.json({ status: "ok", service: "orders-api", timestamp: new Date().toISOString() });
});

// GET /api/orders
app.get('/api/orders', async (req, res) => {
  try {
    if (pool) {
      const result = await pool.query('SELECT * FROM orders ORDER BY id DESC');
      if (result.rows.length > 0) return res.json(result.rows);
    }
  } catch (err) {}
  res.json(ordersStore);
});

// GET /api/orders/:id
app.get('/api/orders/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    if (pool) {
      const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
      if (result.rows.length > 0) return res.json(result.rows[0]);
    }
  } catch (err) {}

  const order = ordersStore.find(o => o.id === id);
  if (!order) return res.status(404).json({ error: "Pedido no encontrado" });
  res.json(order);
});

// POST /api/orders - Crear Pedido con cálculo automático
app.post('/api/orders', async (req, res) => {
  const { customer_id, customer_name, items } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Debe incluir al menos un ítem en el pedido" });
  }

  let subtotal = 0;
  const processedItems = items.map(item => {
    const qty = Number(item.quantity || 1);
    const price = Number(item.unit_price || 0);
    const itemTotal = qty * price;
    subtotal += itemTotal;
    return {
      product_id: item.product_id,
      product_name: item.product_name || "Producto",
      quantity: qty,
      unit_price: price,
      total: itemTotal
    };
  });

  const tax = Math.round(subtotal * 0.13); // 13% IVA CR
  const total = subtotal + tax;

  const newOrder = {
    id: ordersStore.length ? Math.max(...ordersStore.map(o => o.id)) + 1 : 1001,
    customer_id: customer_id || 1,
    customer_name: customer_name || "Cliente General",
    date: new Date().toISOString(),
    status: "PENDIENTE",
    items: processedItems,
    subtotal,
    tax,
    total
  };

  try {
    if (pool) {
      const query = 'INSERT INTO orders (customer_id, customer_name, status, items, subtotal, tax, total) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
      const values = [newOrder.customer_id, newOrder.customer_name, newOrder.status, JSON.stringify(newOrder.items), subtotal, tax, total];
      const result = await pool.query(query, values);
      return res.status(201).json(result.rows[0]);
    }
  } catch (err) {
    console.log('DB Insert fallback orders:', err.message);
  }

  ordersStore.unshift(newOrder);
  res.status(201).json(newOrder);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Orders API] Servidor escuchando en puerto ${PORT}`);
});
