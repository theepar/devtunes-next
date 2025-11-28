# 🚀 Panduan Deployment ke Vercel (Auto-Refresh Ready)

Aplikasi ini sudah dioptimalkan untuk Vercel (Serverless Environment). Token Spotify akan otomatis diperbarui saat expired tanpa perlu konfigurasi cron job manual.

## 📋 Langkah-langkah Deployment

### 1. Push ke GitHub
Pastikan kode Anda sudah di-push ke repository GitHub.

### 2. Import ke Vercel
1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Klik **"Add New..."** > **"Project"**
3. Import repository GitHub Anda

### 3. Konfigurasi Environment Variables (PENTING!)
Di halaman konfigurasi Vercel, tambahkan Environment Variables berikut:

| Name | Value |
|------|-------|
| `SPOTIFY_CLIENT_ID` | (Client ID dari Spotify Dashboard) |
| `SPOTIFY_CLIENT_SECRET` | (Client Secret dari Spotify Dashboard) |

**CATATAN:**
- Jangan masukkan `SPOTIFY_ACCESS_TOKEN`. Token ini akan digenerate otomatis oleh sistem.
- Pastikan tidak ada spasi di awal/akhir value.

### 4. Deploy
Klik tombol **"Deploy"**.

---

## 🔄 Bagaimana Auto-Refresh Bekerja di Vercel?

Di Vercel (Serverless), tidak ada server yang menyala 24 jam. Jadi, sistem menggunakan strategi **"Lazy Refresh"**:

1. **Saat ada User membuka web:**
   - Sistem mengecek apakah token yang ada di cache (memory/tmp) masih valid.
   - Jika valid -> Pakai token tersebut.
   - Jika expired -> Otomatis request token baru ke Spotify dalam hitungan milidetik.

2. **Persistence:**
   - Token disimpan di folder `/tmp` (satu-satunya folder yang bisa ditulis di Vercel).
   - Jika serverless function "tidur" (cold start), sistem akan otomatis login ulang ke Spotify saat request pertama masuk.

## ✅ Checklist Sebelum Deploy

- [ ] Project bisa jalan di local (`npm run dev`)
- [ ] File `.env.local` tidak ter-commit (sudah ada di .gitignore)
- [ ] `next.config.ts` sudah dikonfigurasi untuk images (Unsplash & Spotify)
- [ ] Environment Variables sudah siap untuk dicopy ke Vercel

## 🔧 Troubleshooting di Vercel

### Error: "500 Internal Server Error" saat fetch data
- Cek **Vercel Logs**.
- Biasanya karena Environment Variables (`CLIENT_ID` / `CLIENT_SECRET`) belum di-set atau salah.
- Redeploy project setelah update Environment Variables (tab Deployments > Redeploy).

### Images tidak muncul
- Pastikan domain image sudah ada di `next.config.ts`.
- Default config sudah support: `images.unsplash.com` dan `i.scdn.co`.
