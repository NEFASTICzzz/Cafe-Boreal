[System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}
$customers = @(
  @{ name = "María Rodríguez Fonseca"; email = "mrodriguez@boreal.cr"; identity_number = "101110222" },
  @{ name = "Carlos Solano Vargas"; email = "csolano@boreal.cr"; identity_number = "203330444" },
  @{ name = "Ana Lucía Chaves"; email = "achaves@gmail.com"; identity_number = "109990888" },
  @{ name = "Roberto Quesada Mora"; email = "rquesada@hotmail.com"; identity_number = "302220111" },
  @{ name = "Sofía Valverde Blanco"; email = "svalverde@outlook.com"; identity_number = "405550666" },
  @{ name = "Esteban Zúñiga Castillo"; email = "ezuniga@boreal.cr"; identity_number = "108880777" },
  @{ name = "Gabriel Villalobos Soto"; email = "gvillalobos@tech.cr"; identity_number = "207770888" },
  @{ name = "Daniela Monge Rojas"; email = "dmonge@gmail.com"; identity_number = "104560789" },
  @{ name = "Kevin Brenes Hernández"; email = "kbrenes@boreal.cr"; identity_number = "603210654" },
  @{ name = "Valeria Hidalgo Campos"; email = "vhidalgo@coffeelovers.cr"; identity_number = "112341567" },
  @{ name = "Alejandro Fallas Navarro"; email = "afallas@utn.ac.cr"; identity_number = "208760543" }
)

foreach ($c in $customers) {
    $body = $c | ConvertTo-Json
    try {
        Invoke-RestMethod -Uri "https://127.0.0.1:8443/api/customers" -Method Post -Body $body -ContentType "application/json" | Out-Null
    } catch {}
}
Write-Host "Seeded customers via HTTPS API"
