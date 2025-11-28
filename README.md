# DevTunes - Music Streaming App dengan Next.js & Spotify API

## 🎵 Overview
DevTunes adalah aplikasi musik streaming yang dibangun dengan Next.js 15, TypeScript, Framer Motion untuk animasi, dan terintegrasi dengan Spotify API untuk data musik real-time.

## ✨ Fitur Utama
- **Purple Premium Theme** - Desain modern dengan warna ungu sebagai tema utama
- **Framer Motion Animations** - Animasi smooth dan interactive
- **Glassmorphism UI** - Efek kaca modern pada card dan komponen
- **Spotify API Integration** - Data musik real dari Spotify
- **Responsive Design** - Tampilan optimal di semua ukuran layar

## 🚀 Setup Spotify API

### 1. Mendapatkan Spotify Credentials

1. Kunjungi [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Login dengan akun Spotify Anda
3. Klik "Create App"
4. Isi informasi aplikasi:
   - App name: DevTunes
   - App description: Music streaming application
   - Website: http://localhost:3000
   - Redirect URI: http://localhost:3000/api/auth/callback/spotify
5. Setujui terms dan klik "Create"
6. Salin **Client ID** dan **Client Secret**

### 2. Mendapatkan Access Token

Ada beberapa cara untuk mendapatkan access token:

#### Option A: Menggunakan Client Credentials Flow (Recommended untuk Development)

```bash
curl -X POST "https://accounts.spotify.com/api/token" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=client_credentials&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET"
```

Response akan berisi `access_token` yang berlaku selama 1 jam.

#### Option B: Menggunakan Spotify Web Console
1. Buka [Spotify Web Console](https://developer.spotify.com/console/)
2. Pilih endpoint yang ingin digunakan
3. Klik "Get Token" untuk mendapatkan OAuth Token

### 3. Setup Environment Variables

Buat file `.env.local` di root project:

```env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_ACCESS_TOKEN=your_access_token_here
```

**PENTING:** Jangan commit file `.env.local` ke git! File ini sudah ada di `.gitignore`.

### 4. Install Dependencies

```bash
npm install
```

### 5. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📁 Struktur Project

```
src/
├── app/
│   ├── api/
│   │   └── spotify/          # API routes untuk Spotify
│   │       ├── track/[id]/
│   │       └── playlists/
│   ├── globals.css           # Global styles dengan purple theme
│   ├── layout.tsx
│   └── page.tsx              # Homepage
├── components/
│   ├── Navbar.tsx            # Navigation bar
│   ├── ArtistCard.tsx        # Kartu artist dengan animasi
│   └── MiniPlayer.tsx        # Mini player di bottom
├── hooks/
│   └── useSpotify.ts         # Custom hooks untuk Spotify API
└── lib/
    └── spotify.ts            # Spotify API utilities
```

## 🎨 Customization

### Mengubah Warna Tema

Edit `src/app/globals.css` untuk mengubah warna purple theme:

```css
:root {
  --primary-purple: #8b5cf6;    /* Ubah warna utama */
  --primary-purple-dark: #7c3aed;
  --primary-purple-light: #a78bfa;
  --accent-purple: #c084fc;
  --accent-pink: #e879f9;
}
```

## 🔌 Menggunakan Spotify API

### Fetch Featured Playlists

```typescript
import { useSpotifyPlaylists } from '@/hooks/useSpotify';

function MyComponent() {
  const { playlists, loading, error } = useSpotifyPlaylists(10);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {playlists.map(playlist => (
        <div key={playlist.id}>{playlist.name}</div>
      ))}
    </div>
  );
}
```

### Fetch Specific Track

```typescript
import { useSpotifyTrack } from '@/hooks/useSpotify';

function TrackDetail({ trackId }: { trackId: string }) {
  const { track, loading, error } = useSpotifyTrack(trackId);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h2>{track.name}</h2>
      <p>{track.artists[0].name}</p>
    </div>
  );
}
```

## 📝 Notes

### Refresh Access Token

Access token Spotify berlaku selama 1 jam. Untuk production app, Anda perlu implementasi refresh token mechanism. Contoh:

```typescript
// lib/spotify-auth.ts
export async function refreshAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN!,
    }),
  });
  
  return response.json();
}
```

### Rate Limiting

Spotify API memiliki rate limit. Implementasikan caching untuk mengurangi API calls:

```typescript
// Menggunakan Next.js cache
export const revalidate = 3600; // Cache selama 1 jam
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code ke GitHub
2. Import project di Vercel
3. Tambahkan environment variables di Vercel dashboard
4. Deploy!

### Environment Variables di Production

Pastikan set environment variables di platform hosting:
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_ACCESS_TOKEN` (atau implementasikan OAuth flow)

## 📚 Resources

- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api)
- [Next.js Documentation](https://nextjs.org/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🐛 Troubleshooting

### Error: "Spotify access token not configured"
- Pastikan file `.env.local` sudah dibuat
- Restart development server setelah membuat/update `.env.local`

### Error: "401 Unauthorized"
- Access token mungkin expired (berlaku 1 jam)
- Generate access token baru

### Images tidak tampil
- Pastikan `next.config.ts` sudah dikonfigurasi untuk allow Spotify image domains
- Check `remotePatterns` configuration

## 📄 License

MIT License - Feel free to use for your projects!
