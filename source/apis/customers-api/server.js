const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Clave de cifrado de 256 bits (32 bytes) obtenida de Secret K8s / Env Variable
const RAW_KEY = process.env.ENCRYPTION_KEY || 'boreal_secret_key_256bit_32B_len!'; // Exactly 32 bytes
const ALGORITHM = 'aes-256-cbc';

// Normaliza la clave a exactamente 32 bytes usando SHA-256
function getCipherKey(secret) {
  return crypto.createHash('sha256').update(secret).digest();
}

// Cifrar Numero de Identidad
function encryptIdentity(text) {
  if (!text) return text;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, getCipherKey(RAW_KEY), iv);
  let encrypted = cipher.update(String(text), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  // Formato: iv_hex:ciphertext_hex
  return `${iv.toString('hex')}:${encrypted}`;
}

// Descifrar Numero de Identidad
function decryptIdentity(encryptedText) {
  if (!encryptedText) return encryptedText;
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 2) return encryptedText; // Retorna sin descifrar si no tiene formato enc
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv(ALGORITHM, getCipherKey(RAW_KEY), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.log('Error descifrando identidad:', err.message);
    return "[ERROR_DEC] " + encryptedText;
  }
}

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

// Memory fallback inicial con campos encriptados en BD
let customersDbStore = [
  { id: 1, name: "María Rodríguez Fonseca", email: "mrodriguez@boreal.cr", identity_number_encrypted: encryptIdentity("101110222"), created_at: new Date().toISOString() },
  { id: 2, name: "Carlos Solano Vargas", email: "csolano@boreal.cr", identity_number_encrypted: encryptIdentity("203330444"), created_at: new Date().toISOString() },
  { id: 3, name: "Ana Lucía Chaves", email: "achaves@gmail.com", identity_number_encrypted: encryptIdentity("109990888"), created_at: new Date().toISOString() },
  { id: 4, name: "Roberto Quesada Mora", email: "rquesada@hotmail.com", identity_number_encrypted: encryptIdentity("302220111"), created_at: new Date().toISOString() },
  { id: 5, name: "Sofía Valverde Blanco", email: "svalverde@outlook.com", identity_number_encrypted: encryptIdentity("405550666"), created_at: new Date().toISOString() }
];

// Healthchecks
app.get('/healthz', (req, res) => {
  res.json({ status: "ok", service: "customers-api", timestamp: new Date().toISOString() });
});

app.get('/api/customers/healthz', (req, res) => {
  res.json({ status: "ok", service: "customers-api", timestamp: new Date().toISOString() });
});

// GET /api/customers - Retorna lista con identidades DESENCRIPTADAS en claro para la UI/API
app.get('/api/customers', async (req, res) => {
  try {
    if (pool) {
      const result = await pool.query('SELECT * FROM customers ORDER BY id ASC');
      if (result.rows.length > 0) {
        const decryptedList = result.rows.map(c => ({
          ...c,
          identity_number: decryptIdentity(c.identity_number_encrypted),
          identity_number_encrypted: undefined // ocultar el hash en vista normal
        }));
        return res.json(decryptedList);
      }
    }
  } catch (err) {}

  const decryptedStore = customersDbStore.map(c => ({
    ...c,
    identity_number: decryptIdentity(c.identity_number_encrypted),
    identity_number_encrypted: undefined
  }));
  res.json(decryptedStore);
});

// GET /api/customers/debug/raw-db - Evidencia de SELECT directo mostrando ciphertext
app.get('/api/customers/debug/raw-db', async (req, res) => {
  try {
    if (pool) {
      const result = await pool.query('SELECT id, name, email, identity_number_encrypted FROM customers ORDER BY id ASC');
      if (result.rows.length > 0) return res.json(result.rows);
    }
  } catch (err) {}

  res.json(customersDbStore.map(c => ({
    id: c.id,
    name: c.name,
    email: c.email,
    identity_number_encrypted: c.identity_number_encrypted
  })));
});

// GET /api/customers/:id
app.get('/api/customers/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    if (pool) {
      const result = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
      if (result.rows.length > 0) {
        const c = result.rows[0];
        return res.json({
          ...c,
          identity_number: decryptIdentity(c.identity_number_encrypted)
        });
      }
    }
  } catch (err) {}

  const cust = customersDbStore.find(c => c.id === id);
  if (!cust) return res.status(404).json({ error: "Cliente no encontrado" });
  res.json({
    ...cust,
    identity_number: decryptIdentity(cust.identity_number_encrypted)
  });
});

// POST /api/customers - Crea cliente CIFRANDO la identidad antes de guardar
app.post('/api/customers', async (req, res) => {
  const { name, email, identity_number } = req.body;
  if (!name || !email || !identity_number) {
    return res.status(400).json({ error: "Campos 'name', 'email' e 'identity_number' son requeridos" });
  }

  const encryptedId = encryptIdentity(identity_number);

  try {
    if (pool) {
      const query = 'INSERT INTO customers (name, email, identity_number_encrypted) VALUES ($1, $2, $3) RETURNING *';
      const result = await pool.query(query, [name, email, encryptedId]);
      const saved = result.rows[0];
      return res.status(201).json({
        ...saved,
        identity_number: decryptIdentity(saved.identity_number_encrypted)
      });
    }
  } catch (err) {
    console.log('DB Insert customers fallback:', err.message);
  }

  const newCustDb = {
    id: customersDbStore.length ? Math.max(...customersDbStore.map(c => c.id)) + 1 : 1,
    name,
    email,
    identity_number_encrypted: encryptedId,
    created_at: new Date().toISOString()
  };

  customersDbStore.push(newCustDb);
  res.status(201).json({
    ...newCustDb,
    identity_number: decryptIdentity(newCustDb.identity_number_encrypted)
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Customers API] Servidor escuchando en puerto ${PORT}`);
});
