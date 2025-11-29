# DevTunes - Music Streaming App

## 🎵 Overview
DevTunes adalah aplikasi musik streaming yang dibangun dengan Next.js 15, TypeScript, dan Framer Motion untuk animasi. Aplikasi ini menampilkan antarmuka modern dengan tema ungu yang elegan.

## ✨ Fitur Utama
- **Purple Premium Theme** - Desain modern dengan warna ungu sebagai tema utama
- **Framer Motion Animations** - Animasi smooth dan interactive
- **Glassmorphism UI** - Efek kaca modern pada card dan komponen
- **Responsive Design** - Tampilan optimal di semua ukuran layar
- **Interactive Music Player** - Slider musik interaktif dengan visualisasi

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📁 Struktur Project

```
src/
├── app/
│   ├── globals.css           # Global styles dengan purple theme
│   ├── layout.tsx
│   └── page.tsx              # Homepage dengan Music Player
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

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📄 License

MIT License - Feel free to use for your projects!
