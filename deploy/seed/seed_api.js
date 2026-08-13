const customers = [
  { name: "María Rodríguez Fonseca", email: "mrodriguez@boreal.cr", id: "101110222" },
  { name: "Carlos Solano Vargas", email: "csolano@boreal.cr", id: "203330444" },
  { name: "Ana Lucía Chaves", email: "achaves@gmail.com", id: "109990888" },
  { name: "Roberto Quesada Mora", email: "rquesada@hotmail.com", id: "302220111" },
  { name: "Sofía Valverde Blanco", email: "svalverde@outlook.com", id: "405550666" },
  { name: "Esteban Zúñiga Castillo", email: "ezuniga@boreal.cr", id: "108880777" },
  { name: "Gabriel Villalobos Soto", email: "gvillalobos@tech.cr", id: "207770888" },
  { name: "Daniela Monge Rojas", email: "dmonge@gmail.com", id: "104560789" },
  { name: "Kevin Brenes Hernández", email: "kbrenes@boreal.cr", id: "603210654" },
  { name: "Valeria Hidalgo Campos", email: "vhidalgo@coffeelovers.cr", id: "112341567" },
  { name: "Alejandro Fallas Navarro", email: "afallas@utn.ac.cr", id: "208760543" }
];

async function seedAll() {
  const http = require('http');
  for (const c of customers) {
    const data = JSON.stringify({ name: c.name, email: c.email, identity_number: c.id });
    const req = http.request({
      hostname: '127.0.0.1',
      port: 3003,
      path: '/api/customers',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      res.on('data', () => {});
    });
    req.write(data);
    req.end();
    await new Promise(r => setTimeout(r, 200));
  }
  console.log('Done inserting via API');
}

seedAll();
