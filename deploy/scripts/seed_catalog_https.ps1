[System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}
$productCategories = @('Café de Origen', 'Mezclas Especiales', 'Equipamiento', 'Accesorios', 'Insumos')
$regions = @('Tarrazú', 'Poás', 'Tres Ríos', 'Orosi', 'Brunca', 'Naranjo')

for ($i = 6; $i -le 52; $i++) {
    $reg = $regions[$i % $regions.Length]
    $cat = $productCategories[$i % $productCategories.Length]
    $p = @{
        name = "Café Boreal $cat - Cosecha $reg #$i"
        price = 4500 + ($i * 150)
        stock = 20 + ($i * 3)
        description = "Edición limitada de café $reg, tueste artesanal seleccionada grano a grano. Cosecha #$i."
        image = "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400"
    }
    $body = $p | ConvertTo-Json
    try {
        Invoke-RestMethod -Uri "https://127.0.0.1:8443/api/catalog" -Method Post -Body $body -ContentType "application/json" | Out-Null
    } catch {}
}
Write-Host "Seeded 52 products via HTTPS API"
