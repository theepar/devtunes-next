# 🔄 Sistem Auto-Refresh Spotify Token

Sistem ini secara otomatis memperbarui Spotify Access Token setiap 50 menit untuk memastikan token tidak pernah expired.

## 🎯 Fitur Auto-Refresh

### ✨ Cara Kerja:
1. **Auto-Start** - Token manager mulai otomatis saat server Next.js start
2. **Auto-Refresh** - Token diperbarui otomatis setiap 50 menit
3. **Token Caching** - Token disimpan di file `.spotify-token.json` untuk persistence
4. **Smart Checking** - Sebelum setiap API call, sistem check apakah token masih valid
5. **Auto Recovery** - Jika token expired, otomatis request token baru

### 📋 Yang Sudah Dibuat:

#### 1. Token Manager Service (`src/lib/token-manager.ts`)
- Singleton service untuk manage Spotify tokens
- Auto-refresh setiap 50 menit
- Token caching ke file
- Smart expiry checking (dengan buffer 5 menit)

#### 2. API Endpoints
- `GET /api/spotify/token` - Check token status
- `POST /api/spotify/token` - Manual refresh token
- `GET /api/spotify/track/[id]` - Get track (auto-refresh token)
- `GET /api/spotify/playlists` - Get playlists (auto-refresh token)

#### 3. Initialization
- Auto-start di `src/app/layout.tsx`
- Token status logging setiap 10 menit

## 🚀 Setup & Penggunaan

### Langkah 1: Setup Environment Variables

Buat file `.env.local`:

```env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
```

**CATATAN**: Anda TIDAK perlu `SPOTIFY_ACCESS_TOKEN` di `.env.local` lagi! Token akan di-generate dan di-manage otomatis.

### Langkah 2: Jalankan Server

```bash
npm run dev
```

Saat server start, Anda akan melihat log:

```
🎵 DevTunes Server Starting...
🚀 Starting Spotify Token Auto-Refresh System...
🔄 Refreshing Spotify access token...
✓ Token saved to file
✓ Token refreshed successfully
  Expires in: 3600 seconds (60 minutes)
  Expires at: 2025-11-29 03:15:00
⏰ Next auto-refresh scheduled in 50 minutes
✓ Auto-refresh system initialized
```

### Langkah 3: Monitor Token Status

Akses endpoint monitoring:

```bash
# Check token status
curl http://localhost:3000/api/spotify/token

# Manual refresh (jika perlu)
curl -X POST http://localhost:3000/api/spotify/token
```

Response:
```json
{
  "success": true,
  "tokenInfo": {
    "hasToken": true,
    "expiresAt": "2025-11-29 03:15:00",
    "expiresIn": "45 minutes 30 seconds",
    "isExpired": false
  },
  "accessToken": "BQCBgJxmaAeKV9Be6gI...RM4thAELL"
}
```

## 📊 Token Lifecycle

```
┌─────────────────────────────────────────────────────────┐
│  Server Start                                           │
│    ↓                                                    │
│  Token Manager Initialize                              │
│    ↓                                                    │
│  Check token file (.spotify-token.json)                │
│    ├── File exists & valid → Use cached token          │
│    └── File missing/expired → Request new token        │
│         ↓                                               │
│        REQUEST TOKEN FROM SPOTIFY API                   │
│         ↓                                               │
│        Save to .spotify-token.json                      │
│         ↓                                               │
│        Schedule next refresh (50 minutes)               │
│         ↓                                               │
│  ─────⏰ After 50 minutes ─────                         │
│         ↓                                               │
│        Auto-refresh triggered                           │
│         ↓                                               │
│        Request new token                                │
│         ↓                                               │
│        Update cached token                              │
│         ↓                                               │
│        Schedule next refresh                            │
│         └──→ (Loop forever)                             │
└─────────────────────────────────────────────────────────┘
```

## 🛠️ API Usage dalam Kode

### Automatic (Recommended)
Gunakan endpoint API yang sudah terintegrasi:

```typescript
// Client-side component
const response = await fetch('/api/spotify/track/2TpxZ7JUBn3uw46aR7qd6V');
const track = await response.json();
```

Token akan otomatis di-manage, tidak perlu handle refresh manual!

### Manual (Advanced)
Jika ingin akses langsung ke token manager:

```typescript
import { getSpotifyAccessToken } from '@/lib/token-manager';

// Get valid token (auto-refreshed if needed)
const token = await getSpotifyAccessToken();

// Use token
const response = await fetch('https://api.spotify.com/v1/tracks/xxx', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 📝 Monitoring & Logging

### Server Logs
Server akan otomatis log:
- ✓ Token refresh success
- ⏰ Next refresh schedule
- 📊 Token status (every 10 minutes)
- ❌ Error jika ada masalah

### Manual Check
```bash
# PowerShell
Invoke-RestMethod -Uri "http://localhost:3000/api/spotify/token"

# atau buka di browser
# http://localhost:3000/api/spotify/token
```

## 🔧 Troubleshooting

### Token tidak auto-refresh
**Solusi**: 
- Pastikan server sudah running
- Check console log untuk error
- Pastikan SPOTIFY_CLIENT_ID dan SPOTIFY_CLIENT_SECRET benar

### Error: "Spotify credentials not configured"
**Solusi**:
- Buat file `.env.local` dengan CLIENT_ID dan CLIENT_SECRET
- Restart server setelah membuat `.env.local`

### Token file tidak ter-generate
**Check**:
- Pastikan ada write permission di folder project
- Check file `.spotify-token.json` di root folder
- Jika ada, check isinya (jangan commit file ini ke git!)

## 🎉 Keuntungan Sistem Ini

✅ **No Manual Refresh** - Token diperbarui otomatis  
✅ **No Expiry Error** - Refresh 10 menit sebelum expired  
✅ **Persistent** - Token disimpan di file, tidak hilang saat restart  
✅ **Smart Recovery** - Auto-request token baru jika cache expired  
✅ **Production Ready** - Cocok untuk deployment production  
✅ **Monitoring** - Status token bisa di-check kapan saja  

## 🚀 Production Deployment

Saat deploy ke production (Vercel, dll):

1. Set environment variables di dashboard:
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`

2. Token akan auto-generated dan auto-refresh

3. Tidak perlu setup manual lagi!

## ⚠️ Important Notes

- Token file (`.spotify-token.json`) sudah di-gitignore
- Jangan commit credentials ke git
- Token auto-refresh hanya berjalan saat server running
- Jika server di-restart, token akan di-load dari cache file
