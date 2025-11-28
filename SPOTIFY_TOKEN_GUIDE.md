# 🎵 Panduan Mendapatkan Spotify Access Token

## Metode 1: Menggunakan Script Otomatis (PALING MUDAH) ⚡

### Langkah 1: Buat Aplikasi di Spotify Dashboard

1. Buka [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. **Login** dengan akun Spotify Anda
3. Klik tombol **"Create App"**
4. Isi form:
   - **App name**: `DevTunes`
   - **App description**: `Music streaming application`
   - **Website**: `http://localhost:3000`
   - **Redirect URI**: `http://localhost:3000/api/auth/callback`
5. Centang checkbox terms of service
6. Klik **"Save"**

### Langkah 2: Dapatkan Client ID & Client Secret

1. Klik pada app **DevTunes** yang baru dibuat
2. Klik tombol **"Settings"** di kanan atas
3. Anda akan melihat:
   - **Client ID** - Copy nilai ini
   - **Client Secret** - Klik "View client secret" lalu copy

### Langkah 3: Jalankan Script untuk Generate Token

Buka terminal baru (jangan di terminal yang menjalankan `npm run dev`), lalu:

```powershell
# Jalankan script
.\get-spotify-token.ps1
```

Script akan:
1. Meminta Client ID (paste yang sudah dicopy)
2. Meminta Client Secret (paste yang sudah dicopy)
3. Otomatis mendapatkan Access Token dari Spotify
4. Menyimpan semua credentials ke file `.env.local`

### Langkah 4: Restart Development Server

1. Pergi ke terminal yang menjalankan `npm run dev`
2. Tekan `Ctrl + C` untuk stop server
3. Jalankan lagi: `npm run dev`

### ✅ Selesai!

Sekarang Anda bisa test API dengan mengakses:
- http://localhost:3000/api/spotify/playlists
- http://localhost:3000/api/spotify/track/2TpxZ7JUBn3uw46aR7qd6V

---

## Metode 2: Manual dengan cURL (Alternative)

Jika script PowerShell tidak work, gunakan cara manual:

### Step 1: Encode Credentials ke Base64

Buka PowerShell dan jalankan:

```powershell
$clientId = "YOUR_CLIENT_ID"
$clientSecret = "YOUR_CLIENT_SECRET"
$credentials = "${clientId}:${clientSecret}"
$credentialsBytes = [System.Text.Encoding]::UTF8.GetBytes($credentials)
$credentialsBase64 = [System.Convert]::ToBase64String($credentialsBytes)
Write-Host $credentialsBase64
```

### Step 2: Request Token

```powershell
$tokenUrl = "https://accounts.spotify.com/api/token"
$headers = @{
    "Authorization" = "Basic YOUR_BASE64_FROM_STEP1"
    "Content-Type" = "application/x-www-form-urlencoded"
}
$body = "grant_type=client_credentials"

$response = Invoke-RestMethod -Uri $tokenUrl -Method Post -Headers $headers -Body $body
Write-Host "Access Token:"
Write-Host $response.access_token
```

### Step 3: Buat File .env.local

Buat file `.env.local` di root project dengan isi:

```env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_ACCESS_TOKEN=your_access_token_from_step2
```

---

## Metode 3: Menggunakan Spotify Web Console (TERCEPAT)

Ini cara paling cepat untuk testing:

1. Buka [Spotify Web API Console](https://developer.spotify.com/console/)
2. Pilih endpoint yang ingin ditest (misal: Get Artist)
3. Klik tombol **"GET TOKEN"**
4. Pilih scopes yang diperlukan (untuk testing, bisa skip)
5. Klik **"REQUEST TOKEN"**
6. Copy token yang muncul
7. Paste ke `.env.local`:

```env
SPOTIFY_ACCESS_TOKEN=token_yang_dicopy
```

**CATATAN**: Token dari Web Console biasanya lebih lengkap scope-nya tapi hanya berlaku 1 jam.

---

## ⏰ Token Expired?

Access token dari Spotify berlaku selama **1 jam**. Setelah itu Anda perlu:

1. Jalankan ulang script `.\get-spotify-token.ps1`
2. Atau request token baru secara manual
3. Update `.env.local` dengan token baru
4. Restart development server

---

## 🔧 Troubleshooting

### Error: "401 Unauthorized"
- Access token salah atau expired
- Generate token baru

### Error: "Invalid client"
- Client ID atau Client Secret salah
- Double check di Spotify Dashboard > Settings

### Error: "Script execution is disabled"
Jalankan di PowerShell:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Token tidak terdeteksi setelah dibuat .env.local
- Pastikan file bernama `.env.local` (bukan `.env.local.txt`)
- Restart development server setelah membuat/update file
- Check apakah file ada di root folder project (sejajar dengan package.json)
