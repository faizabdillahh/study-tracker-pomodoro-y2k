# Study Tracker · Pomodoro Y2K

> Timer Pomodoro minimalis bergaya retro/Y2K dengan suara ambient (hujan, pink noise, brown noise) untuk fokus belajar. Dibangun dengan HTML, CSS, dan JavaScript vanilla — tanpa framework, tanpa library suara eksternal.

[![GitHub last commit](https://img.shields.io/github/last-commit/faizabdillahh/study-tracker-pomodoro-y2k?color=%231B365D&label=commit)](https://github.com/faizabdillahh/study-tracker-pomodoro-y2k/commits)
[![License](https://img.shields.io/badge/license-MIT-%231B365D)](LICENSE)
[![Code style](https://img.shields.io/badge/code_style-prettier-%231B365D)](https://prettier.io/)

---

## Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Fitur](#fitur)
- [Sistem Desain](#sistem-desain)
- [Teknologi](#teknologi)
- [Struktur Proyek](#struktur-proyek)
- [Cara Menjalankan](#cara-menjalankan)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

---

## Tentang Proyek

**Study Tracker** adalah aplikasi web sederhana untuk sesi belajar dengan teknik Pomodoro.  
Dibangun dengan estetika retro khas akhir 1990-an — antarmuka tegas, palet kertas hangat, dan piksel dekoratif.  
Tidak ada distraksi: hanya timer, suara latar yang menenangkan, dan catatan sesi.

Suara ambient dihasilkan secara sintetis melalui Web Audio API, tanpa file audio eksternal.  
Tiga pilihan suara:

- **Hujan** – pink noise bertingkat dengan simulasi tetesan alami
- **Pink noise** – suara 1/f yang meniru desiran alam (angin, daun)
- **Brown noise** – deru rendah dalam seperti kipas atau mesin

---

## Fitur

- **Timer Pomodoro** — 25/15/5 menit, dengan kontrol mulai/jeda/reset
- **Progress ring** — visualisasi sisa waktu sebagai lingkaran
- **Suara ambient** — hujan, pink noise, brown noise (tanpa file audio)
- **Riwayat sesi** — tercatat otomatis di localStorage
- **Jam digital** — footer ala taskbar Windows 95
- **Mobile-first** — responsif dari layar kecil hingga desktop
- **Aksesibilitas** — `aria-pressed` untuk tombol suara, `prefers-reduced-motion` dihormati
- **Tanpa emoji** — semua ikon adalah SVG murni

---

## Sistem Desain

Proyek ini mengikuti aturan **Kami** — sistem desain untuk tampilan cetak yang hangat dan jernih.  
Palet: parchment (`#f5f4ed`), aksen ink-blue (`#1B365D`), tipografi serif tunggal, tanpa italic.

Baca selengkapnya di [DESIGN.md](DESIGN.md).

---

## Teknologi

- HTML Living Standard
- CSS Snapshot 2026 (Custom Properties, Grid, Animations)
- JavaScript ECMAScript 2026 (ES17)
- Web Audio API (sintesis suara real-time)
- localStorage (penyimpanan sesi)

---

## Struktur Proyek

```
study-tracker-pomodoro-y2k/
├── index.html          # Halaman utama
├── style.css           # Gaya dan sistem desain Kami
├── script.js           # Timer, suara, dan manajemen sesi
├── DESIGN.md           # Panduan sistem desain Kami
├── README.md           # Anda di sini
└── LICENSE             # Lisensi MIT
```

---

## Cara Menjalankan

1. Clone repositori ini:
   ```bash
   git clone https://github.com/faizabdillahh/study-tracker-pomodoro-y2k.git
   ```
2. Buka folder proyek:
   ```bash
   cd study-tracker-pomodoro-y2k
   ```
3. Buka `index.html` di peramban modern (Chrome, Firefox, Safari, Edge).

Tidak ada server atau dependensi — cukup buka berkas.

---

## Kontribusi

Kontribusi sangat diterima!  
Silakan buka [issue](https://github.com/faizabdillahh/study-tracker-pomodoro-y2k/issues) atau kirim pull request.

### Sebelum berkontribusi

- Pastikan perubahan tidak melanggar aturan sistem desain Kami (lihat `DESIGN.md`)
- Jangan tambahkan emoji — gunakan SVG atau teks
- Animasi harus menghormati `prefers-reduced-motion`
- Suara hanya boleh menggunakan Web Audio API, tanpa file eksternal

---

## Lisensi

Kode ini dirilis di bawah lisensi MIT. Lihat [LICENSE](LICENSE) untuk teks lengkap.

---