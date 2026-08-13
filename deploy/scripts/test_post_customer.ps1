[System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}
$bodyObj = @{
    name = "Laura Araya Gamboa"
    email = "laraya@empresa.cr"
    identity_number = "501230456"
}
$bodyJson = $bodyObj | ConvertTo-Json
$res = Invoke-RestMethod -Uri "https://127.0.0.1:8443/api/customers" -Method Post -Body $bodyJson -ContentType "application/json"
$res | ConvertTo-Json
