document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  loadCatalog();
  loadOrders();
  loadCustomers();
});

function setupTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      btn.classList.add('active');
      const target = btn.getAttribute('data-tab');
      document.getElementById(`tab-${target}`).classList.add('active');

      if (target === 'catalog') loadCatalog();
      if (target === 'orders') loadOrders();
      if (target === 'customers') loadCustomers();
    });
  });
}

// APIs Endpoints
const API_BASE = window.location.origin;

// === CATALOG ===
async function loadCatalog() {
  const container = document.getElementById('catalog-list');
  try {
    const res = await fetch(`${API_BASE}/api/catalog`);
    const data = await res.json();
    
    if (!Array.isArray(data)) throw new Error("Formato inválido");
    
    container.innerHTML = data.map(item => `
      <div class="card">
        <img src="${item.image || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400'}" alt="${item.name}" class="card-img">
        <div class="card-body">
          <h3 class="card-title">${item.name}</h3>
          <p class="card-desc">${item.description || 'Sin descripción disponible'}</p>
          <div class="card-footer">
            <span class="price">₡${Number(item.price).toLocaleString()}</span>
            <span class="badge">Stock: ${item.stock}</span>
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = `<div class="error-msg">Error al cargar productos: ${err.message}. Asegúrese de que Ingress / API Catalog esté activo.</div>`;
  }
}

// === ORDERS ===
async function loadOrders() {
  const tbody = document.getElementById('orders-list');
  try {
    const res = await fetch(`${API_BASE}/api/orders`);
    const data = await res.json();

    if (!Array.isArray(data)) throw new Error("Formato inválido");

    tbody.innerHTML = data.map(o => `
      <tr>
        <td>#${o.id}</td>
        <td>${o.customer_name || 'Cliente'}</td>
        <td>${new Date(o.date).toLocaleDateString('es-CR')}</td>
        <td>₡${Number(o.subtotal).toLocaleString()}</td>
        <td>₡${Number(o.tax).toLocaleString()}</td>
        <td><strong>₡${Number(o.total).toLocaleString()}</strong></td>
        <td><span class="badge" style="background:#2a9d8f; color:#fff">${o.status}</span></td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7">Error al cargar pedidos: ${err.message}</td></tr>`;
  }
}

// === CUSTOMERS (AES-256) ===
async function loadCustomers() {
  const tbody = document.getElementById('customers-list');
  try {
    const res = await fetch(`${API_BASE}/api/customers`);
    const data = await res.json();

    if (!Array.isArray(data)) throw new Error("Formato inválido");

    tbody.innerHTML = data.map(c => `
      <tr>
        <td>${c.id}</td>
        <td>${c.name}</td>
        <td>${c.email}</td>
        <td><span class="badge" style="border:1px solid #2a9d8f; color:#2a9d8f">🔓 ${c.identity_number}</span></td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="viewCustomerDetail(${c.id})">Detalle</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5">Error al cargar clientes: ${err.message}</td></tr>`;
  }
}

async function fetchRawEncryptedCustomers() {
  try {
    const res = await fetch(`${API_BASE}/api/customers/debug/raw-db`);
    const data = await res.json();
    document.getElementById('raw-encrypted-code').textContent = JSON.stringify(data, null, 2);
    document.getElementById('raw-encrypted-modal').style.display = 'flex';
  } catch (err) {
    alert("Error consultando la base de datos cifrada: " + err.message);
  }
}

function closeRawModal() {
  document.getElementById('raw-encrypted-modal').style.display = 'none';
}

// === LEGACY INVENTORY ===
async function fetchLegacyInventory() {
  const tbody = document.getElementById('legacy-list');
  const sku = document.getElementById('legacy-sku-input').value.trim();
  tbody.innerHTML = '<tr><td colspan="7">Consultando /legacy/inventory...</td></tr>';

  try {
    const url = sku ? `${API_BASE}/legacy/inventory?sku=${encodeURIComponent(sku)}` : `${API_BASE}/legacy/inventory`;
    const res = await fetch(url);
    const json = await res.json();

    const items = json.data ? (Array.isArray(json.data) ? json.data : [json.data]) : [];

    if (items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7">No se encontraron registros en el inventario legado.</td></tr>`;
      return;
    }

    tbody.innerHTML = items.map(item => `
      <tr>
        <td><strong>${item.sku}</strong></td>
        <td>${item.product_id}</td>
        <td>${item.legacy_product_name}</td>
        <td><span class="badge" style="background:#bc6c25; color:#fff">${item.stock_physical} unidades</span></td>
        <td>${item.warehouse_location}</td>
        <td>${item.last_sync}</td>
        <td>${item.status}</td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7">Error al conectar con /legacy/inventory: ${err.message}</td></tr>`;
  }
}

// === HEALTHCHECKS ===
async function checkHealth(endpoint) {
  const consoleBox = document.getElementById('health-output');
  consoleBox.textContent = `Realizando GET a ${endpoint}...`;
  try {
    const res = await fetch(`${API_BASE}${endpoint}`);
    const data = await res.json();
    consoleBox.textContent = `[HTTP ${res.status}]\n` + JSON.stringify(data, null, 2);
  } catch (err) {
    consoleBox.textContent = `[ERROR] ${err.message}\nAsegúrese de que la ruta HTTPS está disponible.`;
  }
}

// Modal Handlers
function openProductModal() { document.getElementById('product-modal').style.display = 'flex'; }
function closeProductModal() { document.getElementById('product-modal').style.display = 'none'; }
function openCustomerModal() { document.getElementById('customer-modal').style.display = 'flex'; }
function closeCustomerModal() { document.getElementById('customer-modal').style.display = 'none'; }

async function saveProduct(e) {
  e.preventDefault();
  const name = document.getElementById('prod-name').value;
  const price = document.getElementById('prod-price').value;
  const stock = document.getElementById('prod-stock').value;
  const description = document.getElementById('prod-desc').value;
  const image = document.getElementById('prod-image').value;

  try {
    const res = await fetch(`${API_BASE}/api/catalog`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price, stock, description, image })
    });
    if (res.ok) {
      closeProductModal();
      loadCatalog();
    }
  } catch (err) {
    alert("Error al guardar producto: " + err.message);
  }
}

async function saveCustomer(e) {
  e.preventDefault();
  const name = document.getElementById('cust-name').value;
  const email = document.getElementById('cust-email').value;
  const identity_number = document.getElementById('cust-identity').value;

  try {
    const res = await fetch(`${API_BASE}/api/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, identity_number })
    });
    if (res.ok) {
      closeCustomerModal();
      loadCustomers();
    }
  } catch (err) {
    alert("Error al registrar cliente: " + err.message);
  }
}
