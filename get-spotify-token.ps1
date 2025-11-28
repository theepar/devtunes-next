# Script untuk mendapatkan Spotify Access Token
# Jalankan: .\get-spotify-token.ps1

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  SPOTIFY ACCESS TOKEN GENERATOR" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Minta Client ID dan Client Secret
Write-Host "Langkah 1: Masukkan Spotify Credentials" -ForegroundColor Yellow
Write-Host "Dapatkan dari: https://developer.spotify.com/dashboard" -ForegroundColor Gray
Write-Host ""

$clientId = Read-Host "Masukkan Client ID"
$clientSecret = Read-Host "Masukkan Client Secret"

Write-Host ""
Write-Host "Langkah 2: Mendapatkan Access Token dari Spotify..." -ForegroundColor Yellow

# Encode credentials to Base64
$credentials = "${clientId}:${clientSecret}"
$credentialsBytes = [System.Text.Encoding]::UTF8.GetBytes($credentials)
$credentialsBase64 = [System.Convert]::ToBase64String($credentialsBytes)

# Request token
$tokenUrl = "https://accounts.spotify.com/api/token"
$headers = @{
    "Authorization" = "Basic $credentialsBase64"
    "Content-Type" = "application/x-www-form-urlencoded"
}
$body = "grant_type=client_credentials"

try {
    $response = Invoke-RestMethod -Uri $tokenUrl -Method Post -Headers $headers -Body $body
    
    Write-Host ""
    Write-Host "✓ SUCCESS!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Access Token:" -ForegroundColor Cyan
    Write-Host $response.access_token -ForegroundColor White
    Write-Host ""
    Write-Host "Token Type: $($response.token_type)" -ForegroundColor Gray
    Write-Host "Expires In: $($response.expires_in) seconds (1 hour)" -ForegroundColor Gray
    Write-Host ""
    
    # Simpan ke .env.local
    Write-Host "Langkah 3: Menyimpan ke .env.local..." -ForegroundColor Yellow
    
    $envContent = @"
SPOTIFY_CLIENT_ID=$clientId
SPOTIFY_CLIENT_SECRET=$clientSecret
SPOTIFY_ACCESS_TOKEN=$($response.access_token)
"@
    
    $envContent | Out-File -FilePath ".env.local" -Encoding UTF8
    
    Write-Host "✓ File .env.local berhasil dibuat!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Langkah 4: Restart development server" -ForegroundColor Yellow
    Write-Host "Tekan Ctrl+C pada terminal npm run dev, lalu jalankan lagi 'npm run dev'" -ForegroundColor Gray
    Write-Host ""
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host "  SELESAI!" -ForegroundColor Green
    Write-Host "==================================" -ForegroundColor Cyan
    
} catch {
    Write-Host ""
    Write-Host "✗ ERROR!" -ForegroundColor Red
    Write-Host "Error Message: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Kemungkinan penyebab:" -ForegroundColor Yellow
    Write-Host "- Client ID atau Client Secret salah" -ForegroundColor Gray
    Write-Host "- Tidak ada koneksi internet" -ForegroundColor Gray
    Write-Host "- App belum dibuat di Spotify Dashboard" -ForegroundColor Gray
}
