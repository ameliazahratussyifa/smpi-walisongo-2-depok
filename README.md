# SMP Islam Walisongo 2 Depok - Portal Web & Mobile Application

Aplikasi Web & Mobile Terpadu untuk **SMP Islam Walisongo 2 Depok** (Yayasan Pondok Pesantren Hj. Dardjah Amin) yang dirancang modern, cepat, berakreditasi A, aman, dan siap deploy ke **Vercel** menggunakan **FastAPI (Python)**.

---

## 🌟 Keunggulan & Fitur Utama

### 1. Desain Futuristik Islami (Modern & Distinctive)
- **Identitas Warna Resmi**: Perpaduan *Deep Islamic Emerald* (`#064e3b`), *Radiant Amber Gold* (`#f59e0b`), dan *Islamic Jade* (`#10b981`) berbalut efek *glassmorphism* dan aura geometris bintang 8 Walisongo.
- **Floating Portal Layanan Terpadu**: Terinspirasi dari referensi sistem informasi kampus terdepan, menyajikan 8 akses cepat:
  1. **SIAKAD**: Sistem Informasi Akademik
  2. **PPDB Online 2026/2027**: Pendaftaran dan Cetak Bukti Registrasi
  3. **E-Learning & CBT**: Platform Ujian Berbasis Komputer
  4. **E-Library & Kitab Digital**: Katalog Buku dan Kitab Kuning Digital
  5. **Cek Raport Digital**: Verifikasi nilai dan kelulusan siswa secara *live* dengan validasi NISN
  6. **Kalkulator Biaya & SPP**: Simulasi transparan diskon beasiswa tahfidz dan biaya masuk
  7. **Ekskul BRAVIA**: Pasukan Penggalang Pramuka Berprestasi Kwarran Cilodong
  8. **Konseling & Layanan BK**: Layanan konsultasi pribadi dan akademik santri
- **Sambutan Kepala Sekolah**: Ibu **Aida Suryaningsih, S.Pd.I** dilengkapi foto profil, kualifikasi, dan modal pidato lengkap.
- **Statistik Dinamis**: Akreditasi A (BAN-S/M Kemendikdasmen), 500+ Santri/Alumni, 25+ Dewan Asatidz, 100% Kurikulum Merdeka.

### 2. Dual Experience: Desktop Web & Dedicated Mobile App Mode
- **Desktop Web Portal**: Tampilan layar lebar yang kaya visual dan interaktif (`/`).
- **Dedicated Mobile App (PWA)**: Tampilan khusus smartphone (`/mobile`) dengan *Sticky Bottom Navigation Bar* (5 tab: Beranda, Akademik, PPDB, Berita, Portal) yang responsif dan tanpa *reload* halaman.
- **Simulator Mode Interaktif**: Pengguna desktop dapat membuka simulasi *smartphone mockup frame* dengan 1 klik tombol `"📱 Tampilan Mobile App"`.
- **Installable PWA**: Dilengkapi `manifest.json` dan `sw.js` (Service Worker) agar dapat di-install langsung di layar beranda ponsel (Android / iOS).

### 3. Walisongo AI Smart Assistant
- Widget *floating chatbot* cerdas yang siap menjawab pertanyaan calon orang tua dan siswa seputar:
  - Rincian biaya SPP dan uang pangkal
  - Syarat dan alur pendaftaran PPDB
  - Program Tahfidzul Qur'an bersanad
  - Alamat kampus dan kontak resmi

### 4. Database & Backend Python Berkecepatan Tinggi
- **FastAPI + Pydantic**: Backend asinkron yang sangat cepat, tervalidasi ketat, dan bebas *delay*.
- **SQLite Otomatis**: Dilengkapi migrasi otomatis dan *safe-fallback* untuk *read-write* di lingkungan serverless (`/tmp` pada Vercel).
- **Portal Admin CMS**: Dashboard manajemen untuk memantau pendaftar PPDB, mengubah status seleksi, dan membalas pesan konsultasi langsung via WhatsApp.

---

## 🏛️ Profil & Identitas Sekolah Resmi
- **Nama Sekolah**: SMP Islam Walisongo 2 Depok
- **NPSN**: 70043562
- **Akreditasi**: A (Unggul) - BAN-S/M Kemendikdasmen
- **Yayasan**: Yayasan Pondok Pesantren Hj. Dardjah Amin
- **Pimpinan Yayasan**: H. Achmad Baidhowi Hamzah / Ust. Imam Awaludin, S.Pd.
- **Kepala Sekolah**: Aida Suryaningsih, S.Pd.I
- **Alamat**: Jl. Cepit Raya, Kp. Sawah RT. 005 / RW. 002, Kel. Jatimulya, Kec. Cilodong, Kota Depok, Jawa Barat 16413
- **Kurikulum**: Kurikulum Merdeka Terintegrasi Pendidikan Karakter Aswaja & Tahfidz Al-Qur'an

---

## 🚀 Panduan Menjalankan Secara Lokal

### Prasyarat
- Python 3.10+ (Direkomendasikan Python 3.12)

### Langkah-langkah:
1. Masuk ke direktori proyek:
   ```bash
   cd /media/aldyansyah/DATA_STORAGE/07_WEB_DAN_DIGITAL/SMPI_WALISONGO_2_DEPOK
   ```
2. Aktifkan virtual environment yang telah disediakan:
   ```bash
   source .venv/bin/activate
   ```
3. Jalankan aplikasi:
   ```bash
   python run.py
   ```
4. Buka peramban (browser) Anda:
   - **Website Utama**: [http://localhost:8000](http://localhost:8000)
   - **Mode Aplikasi Mobile**: [http://localhost:8000/mobile](http://localhost:8000/mobile)
   - **Portal PPDB Online**: [http://localhost:8000/ppdb](http://localhost:8000/ppdb)
   - **Portal Layanan Terpadu**: [http://localhost:8000/portal](http://localhost:8000/portal)
   - **Admin CMS Dashboard**: [http://localhost:8000/admin](http://localhost:8000/admin)
   - **Dokumentasi Interaktif API (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## ☁️ Panduan Deploy ke Vercel

Proyek ini telah dikonfigurasi secara lengkap untuk Vercel melalui `vercel.json`, `api/index.py`, dan `requirements.txt`.

### Metode 1: Menggunakan Vercel CLI
1. Pastikan Anda memiliki akun Vercel dan telah menginstal Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Di dalam folder proyek, jalankan:
   ```bash
   vercel
   ```
3. Ikuti petunjuk di terminal (pilih direktori saat ini, konfirmasi pengaturan).
4. Untuk deploy ke production:
   ```bash
   vercel --prod
   ```

### Metode 2: Menggunakan Git & Vercel Dashboard
1. Unggah kode ke repository GitHub / GitLab / Bitbucket Anda.
2. Buka [vercel.com](https://vercel.com) dan klik **"Add New Project"**.
3. Hubungkan repository GitHub Anda.
4. Vercel akan otomatis mengenali konfigurasi `vercel.json` dan file `api/index.py` dengan runtime `@vercel/python`.
5. Klik **"Deploy"**, dan website langsung aktif dengan domain HTTPS otomatis!

---

## 📁 Struktur Direktori Proyek

```
SMPI_WALISONGO_2_DEPOK/
├── api/
│   └── index.py            # Entrypoint utama FastAPI untuk Vercel & Lokal
├── backend/
│   ├── database.py         # Skema SQLite & koneksi aman untuk serverless
│   ├── initial_data.py     # Data awal otentik profil sekolah, guru, & ekskul
│   └── models.py           # Validasi data Pydantic (PPDB, Raport, Kontak, AI)
├── static/
│   ├── css/
│   │   ├── style.css       # Design system modern (Emerald, Gold, Glassmorphism)
│   │   └── mobile.css      # Styling khusus aplikasi mobile & bottom navigation
│   ├── js/
│   │   ├── app.js          # Logika navigasi, animasi stats, modal, cek raport
│   │   ├── ppdb.js         # Registrasi PPDB & generator kartu pendaftaran
│   │   ├── chat-ai.js      # Walisongo Smart AI chatbot widget
│   │   └── mobile-mode.js  # PWA installer & simulator smartphone
│   ├── images/             # Vektor logo resmi, potret guru, & ilustrasi kegiatan
│   ├── manifest.json       # PWA Web App manifest
│   └── sw.js               # Service Worker untuk caching & offline access
├── templates/
│   ├── base.html           # Layout dasar & widget AI global
│   ├── index.html          # Halaman beranda (Hero, Portal, Sambutan, Berita)
│   ├── mobile_app.html     # Tampilan dedicated Mobile App dengan Bottom Nav
│   ├── ppdb.html           # Halaman khusus informasi & pendaftaran PPDB
│   ├── profil.html         # Profil lengkap, sejarah, visi misi, guru & sarpras
│   ├── portal.html         # Pusat layanan terpadu (SIAKAD, CBT, E-Library)
│   └── admin.html          # Dashboard CMS Admin manajemen sekolah
├── vercel.json             # Konfigurasi deployment serverless Vercel
├── requirements.txt        # Dependensi Python
├── run.py                  # Skrip launcher lokal
└── README.md               # Dokumentasi lengkap proyek
```

---
Dibuat dengan ❤️ untuk kemajuan pendidikan Islam dan literasi digital di **SMP Islam Walisongo 2 Depok**.
