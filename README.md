# Dodolan Store — Panduan Instalasi Lokal

Panduan langkah demi langkah untuk menginstal dan menjalankan proyek **Dodolan Store** di komputer lokal (*Localhost*). Panduan ini disusun secara ringkas, jelas, dan ramah untuk pemula.

---

## 1. Alat (Tools) yang Diperlukan

Sebelum memulai, pastikan perangkat Anda telah terpasang aplikasi-aplikasi berikut. Klik tautan pada masing-masing aplikasi untuk mengunduhnya:

| Alat | Kegunaan | Rekomendasi Versi | Tautan Unduh |
|---|---|---|---|
| **Git** | Mengunduh (*clone*) dan mengelola kode proyek | Versi terbaru | [Unduh Git](https://git-scm.com/downloads) |
| **PHP** | Bahasa pemrograman backend | **PHP 8.3** atau lebih baru | [Unduh PHP](https://windows.php.net/download/) |
| **Composer** | Pengelola paket/dependensi PHP (Laravel) | Versi 2.x | [Unduh Composer](https://getcomposer.org/download/) |
| **Node.js & NPM** | Menjalankan build asset frontend (React & Tailwind) | **Node.js LTS** (v20 atau v22) | [Unduh Node.js](https://nodejs.org/) |
| **Database (MySQL)** | Menyimpan data aplikasi | MySQL 8.0+ / MariaDB | Pilihan mudah di Windows: [Laragon](https://laragon.org/download/) *(Sangat Disarankan)* atau [XAMPP](https://www.apachefriends.org/download.html) |
| **Code Editor** | Mengedit file kode | VS Code | [Unduh VS Code](https://code.visualstudio.com/) *(Opsional)* |

> 💡 **Tips Pengguna Windows:**  
> Sangat disarankan memakai **[Laragon](https://laragon.org/download/)**. Laragon sudah langsung menyertakan PHP, MySQL, Apache/Nginx, dan Git dalam satu aplikasi yang praktis dan terkonfigurasi dengan baik.

---

## 2. Langkah-Langkah Instalasi (Step-by-Step)

Buka terminal (**Command Prompt**, **PowerShell**, atau **Git Bash**), lalu ikuti langkah-langkah berikut secara berurutan:

### Langkah 1: Unduh / Clone Repositori
Clone proyek ini ke komputer Anda, lalu masuk ke foldernya:
```bash
git clone https://github.com/adityafakhrii/dodolan-store.git
cd dodolan-store
```

---

### Langkah 2: Salin File Konfigurasi Environment (`.env`)
Salin template konfigurasi `.env.example` menjadi `.env`:

**Pengguna Windows (CMD/PowerShell):**
```bash
copy .env.example .env
```

**Pengguna Linux / macOS:**
```bash
cp .env.example .env
```

---

### Langkah 3: Install Dependensi PHP (Composer)
Jalankan perintah ini untuk mengunduh semua paket library backend:
```bash
composer install
```

---

### Langkah 4: Buat Kunci Aplikasi (Application Key)
Generate enkripsi unik aplikasi Laravel:
```bash
php artisan key:generate
```

---

### Langkah 5: Buat & Konfigurasi Database

1. **Nyalakan Service Database MySQL**:
   - Jika menggunakan **Laragon**: Klik tombol **Start All**.
   - Jika menggunakan **XAMPP**: Klik tombol **Start** pada modul **MySQL** dan **Apache**.
2. **Buat Database Baru**:
   - Buka browser ke `http://localhost/phpmyadmin` atau buka aplikasi manajemen database favorit Anda (HeidiSQL, DBeaver, dll).
   - Buat database baru dengan nama: `dodolan-db` (dengan collation `utf8mb4_unicode_ci`).
3. **Periksa File `.env`**:
   - Buka file `.env` di teks editor, lalu pastikan bagian database sudah sesuai:
     ```env
     DB_CONNECTION=mysql
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_DATABASE=dodolan-db
     DB_USERNAME=root
     DB_PASSWORD=
     ```
     *(Sesuaikan `DB_USERNAME` dan `DB_PASSWORD` dengan pengaturan MySQL di komputer Anda jika berbeda).*

---

### Langkah 6: Jalankan Migrasi & Data Awal (Seeder)
Buat seluruh tabel database dan isi data awal (kategori, produk contoh, banner, dan akun admin):
```bash
php artisan migrate --seed
```

#### 🔑 Akun Default untuk Login:
Setelah seeding selesai, Anda dapat menggunakan akun berikut untuk masuk:
- **URL Login**: `http://localhost:8000/login`
- **Email**: `admin@dodolan.store`
- **Password**: `password`
- **Akses**: Administrator

---

### Langkah 7: Buat Tautan Penyimpanan Gambar (*Storage Link*)
Langkah ini wajib agar gambar produk dan banner yang diunggah dapat tampil di browser:
```bash
php artisan storage:link
```

---

### Langkah 8: Install Dependensi Frontend (Node/NPM)
Install dependensi React, Inertia, dan Tailwind CSS:
```bash
npm install
```

---

### Langkah 9: Jalankan Server Lokal

Ada dua cara untuk menjalankan server:

#### Cara A (Praktis - 1 Perintah):
Proyek ini sudah dilengkapi script otomatis untuk menjalankan web server, antrean *queue*, dan Vite secara bersamaan:
```bash
composer run dev
```

#### Cara B (Manual - 2 Terminal Terpisah):
Jika ingin menjalankan secara terpisah, buka dua jendela terminal di folder proyek:
- **Terminal 1 (Backend Laravel):**
  ```bash
  php artisan serve
  ```
- **Terminal 2 (Frontend Vite):**
  ```bash
  npm run dev
  ```

---

### Langkah 10: Buka Aplikasi di Browser
Buka peramban (*web browser*) Anda dan akses alamat berikut:

- **Halaman Utama (Toko Dodolan)**:  
  👉 [http://localhost:8000](http://localhost:8000)
- **Halaman Login Admin / Pengguna**:  
  👉 [http://localhost:8000/login](http://localhost:8000/login)

Selamat! Dodolan Store sudah berhasil berjalan di komputer lokal Anda.

---

## 3. Fitur Tambahan: Testing Email Lokal (Mailpit)

Jika Anda ingin menguji fitur kirim email (misal: verifikasi email atau notifikasi pesanan) tanpa perlu akun SMTP sungguhan:

1. Jalankan Mailpit dengan perintah:
   ```bash
   composer run mailpit
   ```
2. Buka dashboard email Mailpit di browser:  
   👉 [http://localhost:8025](http://localhost:8025)

---

## 4. Solusi Masalah Umum (Troubleshooting)

- **Port 8000 sudah terpakai?**  
  Jalankan server di port lain:
  ```bash
  php artisan serve --port=8080
  ```
  Lalu buka `http://localhost:8080`.

- **Gambar produk / aset tidak muncul?**  
  Pastikan Anda sudah menjalankan perintah:
  ```bash
  php artisan storage:link
  ```

- **Error koneksi database (*Access denied* / *Connection refused*)?**  
  - Pastikan MySQL sedang berjalan (Status: Running di Laragon / XAMPP).
  - Pastikan nama database di `.env` (`DB_DATABASE=dodolan-db`) sudah dibuat di phpMyAdmin.
  - Jika root MySQL Anda memakai password, isi pada `DB_PASSWORD=password_anda`.

- **Perubahan konfigurasi `.env` tidak berefek?**  
  Bersihkan cache konfigurasi Laravel dengan perintah:
  ```bash
  php artisan optimize:clear
  ```

- **Error ekstensi PHP belum aktif?**  
  Pastikan ekstensi berikut aktif di file `php.ini` Anda: `pdo_mysql`, `mbstring`, `openssl`, `curl`, `fileinfo`, dan `gd`.
