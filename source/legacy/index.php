<?php
// Cafe Boreal SRL - Legacy Inventory Module (Apache + PHP)
// Endpoint REST: /legacy/inventory

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Healthcheck endpoint
if ($uri === '/legacy/healthz' || $uri === '/legacy/inventory/healthz') {
    echo json_encode([
        'status' => 'ok',
        'system' => 'Legacy Apache/PHP Inventory Engine v1.0',
        'timestamp' => date('c')
    ]);
    exit;
}

// Datos de inventario legado (simulación DB SQLite / MariaDB Legada)
$legacyInventory = [
    [
        'sku' => 'SKU-TAR-001',
        'product_id' => 1,
        'legacy_product_name' => 'Café Tarrazú Reserva Especial 500g',
        'stock_physical' => 120,
        'warehouse_location' => 'Bodega A-12',
        'last_sync' => '2026-08-10 08:30:00',
        'status' => 'DISPONIBLE'
    ],
    [
        'sku' => 'SKU-POA-002',
        'product_id' => 2,
        'legacy_product_name' => 'Café Poás Gourmet Molido 500g',
        'stock_physical' => 85,
        'warehouse_location' => 'Bodega B-04',
        'last_sync' => '2026-08-11 14:15:00',
        'status' => 'DISPONIBLE'
    ],
    [
        'sku' => 'SKU-VAL-003',
        'product_id' => 3,
        'legacy_product_name' => 'Café Valle Central Grano Entero 1kg',
        'stock_physical' => 45,
        'warehouse_location' => 'Bodega A-05',
        'last_sync' => '2026-08-12 09:00:00',
        'status' => 'DISPONIBLE'
    ],
    [
        'sku' => 'SKU-ORO-004',
        'product_id' => 4,
        'legacy_product_name' => 'Café Orgánico Orosi 340g',
        'stock_physical' => 90,
        'warehouse_location' => 'Bodega C-01',
        'last_sync' => '2026-08-12 11:20:00',
        'status' => 'DISPONIBLE'
    ],
    [
        'sku' => 'SKU-FRE-005',
        'product_id' => 5,
        'legacy_product_name' => 'Prensa Francesa Boreal Stainless 800ml',
        'stock_physical' => 25,
        'warehouse_location' => 'Bodega D-09',
        'last_sync' => '2026-08-13 07:45:00',
        'status' => 'BAJO_STOCK'
    ]
];

// Filtro por SKU si se proporciona
$skuParam = isset($_GET['sku']) ? trim($_GET['sku']) : null;

if ($skuParam) {
    $filtered = array_values(array_filter($legacyInventory, function($item) use ($skuParam) {
        return strcasecmp($item['sku'], $skuParam) === 0 || strcasecmp((string)$item['product_id'], $skuParam) === 0;
    }));

    if (count($filtered) > 0) {
        echo json_encode([
            'success' => true,
            'source' => 'XAMPP/LAMPP Legacy DB',
            'query_sku' => $skuParam,
            'data' => $filtered[0]
        ], JSON_PRETTY_PRINT);
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'source' => 'XAMPP/LAMPP Legacy DB',
            'error' => 'SKU no encontrado en inventario legado',
            'query_sku' => $skuParam
        ], JSON_PRETTY_PRINT);
    }
    exit;
}

// Retorna la lista completa
echo json_encode([
    'success' => true,
    'source' => 'XAMPP/LAMPP Legacy DB',
    'total_records' => count($legacyInventory),
    'data' => $legacyInventory
], JSON_PRETTY_PRINT);
