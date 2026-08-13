const crypto = require('crypto');
const RAW_KEY = 'boreal_secret_key_256bit_32B_len!';
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

const customers = [
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

let sql = "TRUNCATE TABLE customers RESTART IDENTITY CASCADE;\nINSERT INTO customers (name, email, identity_number_encrypted) VALUES\n";
const rows = customers.map(c => `('${c.name}', '${c.email}', '${encryptIdentity(c.id)}')`).join(",\n");
sql += rows + ";\n";

console.log(sql);
