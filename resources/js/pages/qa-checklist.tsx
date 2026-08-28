import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    Check,
    CheckCircle2,
    ChevronDown,
    Clock,
    Copy,
    ExternalLink,
    FastForward,
    Filter,
    ListChecks,
    RotateCcw,
    Search,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type TestStatus = 'pending' | 'passed' | 'failed' | 'skipped';

interface TestCase {
    id: string;
    fr: string;
    category: string;
    categoryId: string;
    title: string;
    route: string;
    severity: 'Kritis' | 'Tinggi' | 'Sedang' | 'Rendah';
    steps: string[];
    expected: string;
}

interface TestItemState {
    status: TestStatus;
    note: string;
    updatedAt?: string;
}

const CATEGORIES = [
    { id: 'public', name: 'Profil Publik & Layanan', count: 8 },
    { id: 'catalog', name: 'Katalog & Keranjang', count: 9 },
    { id: 'auth', name: 'Autentikasi & Hak Akses', count: 7 },
    { id: 'checkout', name: 'Checkout & Pembayaran', count: 8 },
    { id: 'customer', name: 'Portal Pelanggan', count: 6 },
    { id: 'admin', name: 'Panel Admin', count: 11 },
    { id: 'edge', name: 'Keamanan & Edge Cases', count: 6 },
];

const TEST_CASES: TestCase[] = [
    // 1. PUBLIC & COMPANY PROFILE
    {
        id: 'PUB-01',
        fr: 'FR-001',
        category: 'Profil Publik & Layanan',
        categoryId: 'public',
        title: 'Homepage Hero, Slider Banner Promosi & Value Proposition',
        route: '/',
        severity: 'Tinggi',
        steps: [
            'Buka URL homepage (/)',
            'Cek apakah hero section, headline utama, dan slider banner promosi aktif muncul dengan baik',
            'Klik tombol CTA utama ("Lihat Katalog" / "Konsultasi Solusi")',
        ],
        expected: 'Banner tampil dinamis, copywriting rapi, tombol navigasi mengarahkan ke halaman yang tepat tanpa kendala.',
    },
    {
        id: 'PUB-02',
        fr: 'FR-001',
        category: 'Profil Publik & Layanan',
        categoryId: 'public',
        title: 'Homepage Produk Unggulan & Grid Kategori',
        route: '/',
        severity: 'Tinggi',
        steps: [
            'Scroll ke bagian "Produk Unggulan" dan "Kategori Produk"',
            'Periksa kartu produk (gambar, harga Rupiah, badge ketersediaan stok)',
            'Klik salah satu kategori atau produk unggulan',
        ],
        expected: 'Produk unggulan muncul, badge stok akurat, link kategori mengarah ke /produk dengan filter aktif.',
    },
    {
        id: 'PUB-03',
        fr: 'FR-002',
        category: 'Profil Publik & Layanan',
        categoryId: 'public',
        title: 'Halaman Tentang Kami & Profil Perusahaan',
        route: '/tentang-kami',
        severity: 'Sedang',
        steps: [
            'Buka menu "Tentang Kami"',
            'Cek visi, misi, legalitas bisnis, dan nilai perusahaan',
            'Pastikan semua badge reputasi & sertifikasi IoT ter-render dengan baik',
        ],
        expected: 'Halaman memuat profil perusahaan dengan rapi, tanpa broken image atau teks placeholder.',
    },
    {
        id: 'PUB-04',
        fr: 'FR-023',
        category: 'Profil Publik & Layanan',
        categoryId: 'public',
        title: 'Katalog Layanan & Solusi IoT',
        route: '/layanan',
        severity: 'Tinggi',
        steps: [
            'Buka menu "Layanan"',
            'Periksa 3 pilar layanan: Instalasi MDVR, Custom Hardware IoT, dan Maintenance & Integrasi',
            'Klik tombol "Ajukan Permintaan" untuk scroll otomatis ke formulir pengajuan',
        ],
        expected: 'Informasi layanan lengkap dan terstruktur, tombol scroll halus menuju form permohonan.',
    },
    {
        id: 'PUB-05',
        fr: 'FR-024',
        category: 'Profil Publik & Layanan',
        categoryId: 'public',
        title: 'Formulir Permohonan Layanan IoT (Publik)',
        route: '/layanan',
        severity: 'Kritis',
        steps: [
            'Isi formulir: Nama, Email, No HP, Tipe Layanan, Lokasi, dan Deskripsi Kebutuhan',
            'Klik tombol "Kirim Permohonan"',
            'Cek notifikasi toast konfirmasi berhasil',
        ],
        expected: 'Form berhasil disubmit, validasi field wajib berfungsi, pesan sukses muncul, dan data terekam di database.',
    },
    {
        id: 'PUB-06',
        fr: 'FR-026',
        category: 'Profil Publik & Layanan',
        categoryId: 'public',
        title: 'Portofolio Project & Studi Kasus',
        route: '/portfolio',
        severity: 'Sedang',
        steps: [
            'Buka halaman Portofolio (/portfolio)',
            'Lihat daftar proyek implementasi IoT (fleet MDVR, monitoring solar panel, smart factory)',
            'Klik tombol "Konsultasikan Project Serupa"',
        ],
        expected: 'Daftar proyek tampil rapi dengan tag teknologi dan klien, tombol WhatsApp membuka chat dengan template teks otomatis.',
    },
    {
        id: 'PUB-07',
        fr: 'FR-001',
        category: 'Profil Publik & Layanan',
        categoryId: 'public',
        title: 'Halaman Kontak & Informasi Operasional',
        route: '/kontak',
        severity: 'Sedang',
        steps: [
            'Buka halaman Kontak (/kontak)',
            'Periksa alamat kantor Surabaya, email resmi, nomor telepon/WhatsApp, dan jam kerja',
            'Cek link tombol "Hubungi CS WhatsApp"',
        ],
        expected: 'Informasi kontak valid, link WhatsApp langsung membuka obrolan ke nomor resmi Dodolan Store.',
    },
    {
        id: 'PUB-08',
        fr: 'FR-001',
        category: 'Profil Publik & Layanan',
        categoryId: 'public',
        title: 'Navigasi Header & Footer Storefront',
        route: '/',
        severity: 'Tinggi',
        steps: [
            'Cek semua menu di Header (Home, Produk, Layanan, Portofolio, Tentang Kami, Kontak)',
            'Cek Cart Drawer trigger & badge counter angka keranjang di header',
            'Cek semua tautan cepat dan hak cipta di footer',
        ],
        expected: 'Semua navigasi aktif, sticky header responsif, dan cart trigger membuka drawer dengan mulus.',
    },

    // 2. CATALOG, SEARCH & CART ENGINE
    {
        id: 'CAT-01',
        fr: 'FR-003',
        category: 'Katalog & Keranjang',
        categoryId: 'catalog',
        title: 'Katalog Produk & Tampilan Grid',
        route: '/produk',
        severity: 'Kritis',
        steps: [
            'Buka halaman /produk',
            'Periksa kartu produk: Foto produk, Nama, Kategori, Harga (Rp), Spesifikasi, Badge Stok',
            'Uji perpindahan halaman atau scroll',
        ],
        expected: 'Daftar produk termuat lengkap tanpa duplikasi atau gambar rusak.',
    },
    {
        id: 'CAT-02',
        fr: 'FR-005',
        category: 'Katalog & Keranjang',
        categoryId: 'catalog',
        title: 'Pencarian Produk Berdasarkan Kata Kunci',
        route: '/produk',
        severity: 'Tinggi',
        steps: [
            'Ketik kata kunci di kolom pencarian (misal: "MDVR", "Sensor", "Camera")',
            'Coba ketik kata kunci yang tidak ada (misal: "xyz123abc")',
        ],
        expected: 'Hasil pencarian memfilter produk relevan secara responsif. Jika kosong, muncul tampilan empty state.',
    },
    {
        id: 'CAT-03',
        fr: 'FR-004',
        category: 'Katalog & Keranjang',
        categoryId: 'catalog',
        title: 'Filter Berdasarkan Kategori Produk',
        route: '/produk',
        severity: 'Tinggi',
        steps: [
            'Klik filter kategori (misal: "Fleet & MDVR", "IoT Sensors", "Microcontroller")',
            'Klik kembali "Semua Kategori" untuk reset filter',
        ],
        expected: 'Daftar produk terfilter sesuai kategori yang dipilih secara instan tanpa reload halaman penuh.',
    },
    {
        id: 'CAT-04',
        fr: 'FR-007',
        category: 'Katalog & Keranjang',
        categoryId: 'catalog',
        title: 'Pengurutan Produk (Sorting)',
        route: '/produk',
        severity: 'Sedang',
        steps: [
            'Ubah dropdown urutan ke "Harga Terendah"',
            'Ubah ke "Harga Tertinggi"',
            'Ubah ke "Produk Terbaru"',
        ],
        expected: 'Produk tersusun dengan benar sesuai urutan harga maupun tanggal rilis produk.',
    },
    {
        id: 'CAT-05',
        fr: 'FR-008',
        category: 'Katalog & Keranjang',
        categoryId: 'catalog',
        title: 'Halaman Detail Produk & Spesifikasi Teknis',
        route: '/produk',
        severity: 'Kritis',
        steps: [
            'Buka salah satu produk untuk masuk ke halaman detail (/produk/{slug})',
            'Cek galeri gambar utama & thumbnail preview',
            'Periksa tab Deskripsi, Spesifikasi Teknis IoT (voltase, sensor, konektivitas), dan Garansi',
            'Cek status ketersediaan stok aktual',
        ],
        expected: 'Informasi teknis lengkap, galeri foto interaktif, dan status stok akurat.',
    },
    {
        id: 'CAT-06',
        fr: 'FR-009',
        category: 'Katalog & Keranjang',
        categoryId: 'catalog',
        title: 'Menambahkan Produk ke Keranjang Belanja',
        route: '/produk',
        severity: 'Kritis',
        steps: [
            'Di halaman detail produk atau kartu katalog, atur kuantitas lalu klik "Tambah ke Keranjang"',
            'Perhatikan notifikasi toast dan badge angka keranjang di navbar',
        ],
        expected: 'Item masuk ke keranjang, badge navbar bertambah sesuai kuantitas, toast konfirmasi muncul.',
    },
    {
        id: 'CAT-07',
        fr: 'FR-010',
        category: 'Katalog & Keranjang',
        categoryId: 'catalog',
        title: 'Pembaruan Jumlah Item di Keranjang Belanja',
        route: '/keranjang',
        severity: 'Tinggi',
        steps: [
            'Buka halaman /keranjang atau Drawer Keranjang',
            'Klik tombol (+) untuk menambah kuantitas dan (-) untuk mengurangi',
            'Pastikan jumlah tidak melebihi stok yang tersedia',
        ],
        expected: 'Subtotal per item dan Total Belanja terhitung ulang secara real-time dan akurat.',
    },
    {
        id: 'CAT-08',
        fr: 'FR-011',
        category: 'Katalog & Keranjang',
        categoryId: 'catalog',
        title: 'Hapus Item & Empty State Keranjang Belanja',
        route: '/keranjang',
        severity: 'Sedang',
        steps: [
            'Klik ikon hapus (Trash) pada salah satu item di keranjang',
            'Hapus semua item hingga keranjang kosong',
            'Cek tombol "Mulai Belanja" di empty state keranjang',
        ],
        expected: 'Item terhapus dari state local storage, empty state muncul dengan tombol yang mengarahkan kembali ke /produk.',
    },
    {
        id: 'CAT-09',
        fr: 'FR-026',
        category: 'Katalog & Keranjang',
        categoryId: 'catalog',
        title: 'Tombol Konsultasi WhatsApp per Produk',
        route: '/produk',
        severity: 'Rendah',
        steps: [
            'Di halaman detail produk, klik tombol "Tanya CS via WhatsApp"',
            'Periksa format pesan WhatsApp yang di-generate',
        ],
        expected: 'Pesan memuat template otomatis dengan nama produk dan tautan produk bersangkutan.',
    },

    // 3. AUTHENTICATION & ROLE BOUNDARIES
    {
        id: 'AUTH-01',
        fr: 'FR-028',
        category: 'Autentikasi & Hak Akses',
        categoryId: 'auth',
        title: 'Registrasi Akun Pelanggan Baru',
        route: '/register',
        severity: 'Kritis',
        steps: [
            'Buka halaman /register',
            'Isi data: Nama Lengkap, Email unik, No Telepon/WhatsApp, dan Password',
            'Submit formulir registrasi',
        ],
        expected: 'Akun baru berhasil dibuat di database dengan role customer (is_admin=false), dan otomatis login ke portal.',
    },
    {
        id: 'AUTH-02',
        fr: 'FR-028',
        category: 'Autentikasi & Hak Akses',
        categoryId: 'auth',
        title: 'Validasi Input & Konfirmasi Password Registrasi',
        route: '/register',
        severity: 'Sedang',
        steps: [
            'Submit registrasi dengan email yang sudah terdaftar',
            'Coba password kurang dari 8 karakter atau konfirmasi password tidak cocok',
        ],
        expected: 'Pesan error validasi muncul di bawah input yang bermasalah.',
    },
    {
        id: 'AUTH-03',
        fr: 'FR-028',
        category: 'Autentikasi & Hak Akses',
        categoryId: 'auth',
        title: 'Login Pelanggan & Pengalihan ke Portal Akun',
        route: '/login',
        severity: 'Kritis',
        steps: [
            'Buka halaman /login',
            'Masukkan email dan password pelanggan yang valid',
            'Submit formulir login',
        ],
        expected: 'Berhasil login dan otomatis diarahkan ke /akun/dashboard.',
    },
    {
        id: 'AUTH-04',
        fr: 'FR-018',
        category: 'Autentikasi & Hak Akses',
        categoryId: 'auth',
        title: 'Login Admin & Pengalihan ke Panel Admin',
        route: '/login',
        severity: 'Kritis',
        steps: [
            'Buka halaman /login',
            'Masukkan kredensial admin',
            'Submit formulir login',
        ],
        expected: 'Berhasil login dan otomatis diarahkan langsung ke /admin/dashboard.',
    },
    {
        id: 'AUTH-05',
        fr: 'FR-018',
        category: 'Autentikasi & Hak Akses',
        categoryId: 'auth',
        title: 'Proteksi Rute Panel Admin (Middleware Authorization)',
        route: '/admin/dashboard',
        severity: 'Kritis',
        steps: [
            'Dalam kondisi login sebagai pelanggan biasa atau saat belum login, buka URL /admin/dashboard secara manual',
        ],
        expected: 'Akses ditolak (HTTP 403 Forbidden atau redirect unauthorized).',
    },
    {
        id: 'AUTH-06',
        fr: 'FR-028',
        category: 'Autentikasi & Hak Akses',
        categoryId: 'auth',
        title: 'Permintaan Reset Password Akun',
        route: '/forgot-password',
        severity: 'Sedang',
        steps: [
            'Buka halaman /forgot-password',
            'Masukkan alamat email terdaftar untuk request link reset password',
        ],
        expected: 'Sistem merespons instruksi pengiriman email reset password dengan aman.',
    },
    {
        id: 'AUTH-07',
        fr: 'FR-028',
        category: 'Autentikasi & Hak Akses',
        categoryId: 'auth',
        title: 'Logout & Pembersihan Sesi Pengguna',
        route: '/akun/dashboard',
        severity: 'Tinggi',
        steps: [
            'Klik tombol Keluar (Logout) pada profil pengguna',
            'Coba tekan tombol Back di browser',
        ],
        expected: 'Sesi berakhir, pengguna kembali ke halaman utama sebagai tamu, halaman terproteksi tidak dapat diakses kembali.',
    },

    // 4. CHECKOUT, STOCK & MAYAR PAYMENT
    {
        id: 'CHK-01',
        fr: 'FR-012',
        category: 'Checkout & Pembayaran',
        categoryId: 'checkout',
        title: 'Proteksi Autentikasi untuk Proses Checkout',
        route: '/checkout',
        severity: 'Tinggi',
        steps: [
            'Dalam kondisi belum login dengan item di keranjang, klik "Lanjut ke Checkout"',
        ],
        expected: 'Sistem mengarahkan pengguna ke halaman login dengan intent redirect kembali ke checkout setelah login.',
    },
    {
        id: 'CHK-02',
        fr: 'FR-032',
        category: 'Checkout & Pembayaran',
        categoryId: 'checkout',
        title: 'Auto-fill Data Profil Pelanggan pada Form Checkout',
        route: '/checkout',
        severity: 'Tinggi',
        steps: [
            'Login sebagai pelanggan yang sudah menyimpan nama, telepon, dan alamat di profil',
            'Buka halaman /checkout',
        ],
        expected: 'Nama, email, nomor WhatsApp, dan alamat pengiriman terisi otomatis dari data profil.',
    },
    {
        id: 'CHK-03',
        fr: 'FR-012',
        category: 'Checkout & Pembayaran',
        categoryId: 'checkout',
        title: 'Validasi Data Pengiriman & Catatan Pesanan',
        route: '/checkout',
        severity: 'Sedang',
        steps: [
            'Kosongkan field alamat atau nomor telepon lalu klik "Buat Pesanan"',
            'Isi data lengkap dan tambahkan catatan pengiriman',
        ],
        expected: 'Validasi form mencegah submit jika ada data pengiriman yang kosong.',
    },
    {
        id: 'CHK-04',
        fr: 'FR-013',
        category: 'Checkout & Pembayaran',
        categoryId: 'checkout',
        title: 'Pembuatan Pesanan & Snapshot Harga Produk',
        route: '/checkout',
        severity: 'Kritis',
        steps: [
            'Submit formulir checkout dengan produk yang valid',
            'Periksa ringkasan pesanan (harga satuan snapshot, ongkir, total pembayaran)',
        ],
        expected: 'Order baru dibuat dengan nomor pesanan unik (ORD-XXXX), subtotal terkunci snapshot harga saat transaksi.',
    },
    {
        id: 'CHK-05',
        fr: 'FR-013',
        category: 'Checkout & Pembayaran',
        categoryId: 'checkout',
        title: 'Pengurangan Stok Produk Otomatis (Inventory Decrement)',
        route: '/produk',
        severity: 'Kritis',
        steps: [
            'Periksa stok awal produk sebelum checkout (misal: 10 unit)',
            'Beli produk tersebut sebanyak 2 unit',
            'Cek kembali stok produk setelah checkout berhasil dibuat',
        ],
        expected: 'Stok berkurang tepat 2 unit (menjadi 8 unit) secara konsisten dan aman di database.',
    },
    {
        id: 'CHK-06',
        fr: 'FR-014',
        category: 'Checkout & Pembayaran',
        categoryId: 'checkout',
        title: 'Halaman Instruksi Pembayaran Gateway Mayar',
        route: '/pembayaran',
        severity: 'Kritis',
        steps: [
            'Setelah checkout berhasil, periksa halaman instruksi pembayaran (/pembayaran/{orderNumber})',
            'Cek rincian pesanan, countdown batas waktu bayar, QRIS / Virtual Account, dan panduan transfer',
        ],
        expected: 'Halaman pembayaran menampilkan detail transaksi akurat dengan status awal "Menunggu Pembayaran".',
    },
    {
        id: 'CHK-07',
        fr: 'FR-015',
        category: 'Checkout & Pembayaran',
        categoryId: 'checkout',
        title: 'Simulasi Pembayaran Berhasil (Payment Simulator)',
        route: '/pembayaran',
        severity: 'Kritis',
        steps: [
            'Di halaman pembayaran, klik tombol simulator "[Simulasikan Pembayaran Berhasil]"',
            'Perhatikan perubahan status pembayaran dan status pesanan',
        ],
        expected: 'Status pembayaran berubah menjadi "Dibayar" (Paid), status pesanan menjadi "Diproses", toast konfirmasi muncul.',
    },
    {
        id: 'CHK-08',
        fr: 'FR-016',
        category: 'Checkout & Pembayaran',
        categoryId: 'checkout',
        title: 'Integrasi Webhook Callback Mayar',
        route: '/payments/webhook',
        severity: 'Tinggi',
        steps: [
            'Verifikasi rute endpoint POST /payments/webhook',
            'Pastikan CSRF dikecualikan khusus untuk webhook dan rate limit terpasang',
        ],
        expected: 'Endpoint webhook aman menerima event payment.success dari Mayar dan memperbarui status pesanan.',
    },

    // 5. CUSTOMER PORTAL (/akun/*)
    {
        id: 'CUST-01',
        fr: 'FR-029',
        category: 'Portal Pelanggan',
        categoryId: 'customer',
        title: 'Ringkasan Statistik Dashboard Pelanggan',
        route: '/akun/dashboard',
        severity: 'Tinggi',
        steps: [
            'Buka Dashboard Pelanggan (/akun/dashboard)',
            'Cek kartu ringkasan: Total Pesanan, Pesanan Aktif, Total Pengeluaran, dan Layanan Diajukan',
            'Cek tabel pesanan terbaru di bagian bawah',
        ],
        expected: 'Semua statistik dan angka ringkasan terhitung akurat sesuai riwayat akun bersangkutan.',
    },
    {
        id: 'CUST-02',
        fr: 'FR-029',
        category: 'Portal Pelanggan',
        categoryId: 'customer',
        title: 'Daftar Riwayat Pesanan Pelanggan',
        route: '/akun/pesanan',
        severity: 'Tinggi',
        steps: [
            'Buka menu "Pesanan Saya" (/akun/pesanan)',
            'Cek daftar kartu pesanan dengan badge status (Menunggu Pembayaran, Diproses, Dikirim, Selesai, Dibatalkan)',
            'Gunakan filter status pesanan atau pencarian nomor order',
        ],
        expected: 'Pesanan tersaji kronologis dari yang terbaru, filter status berfungsi, badge status sesuai.',
    },
    {
        id: 'CUST-03',
        fr: 'FR-029',
        category: 'Portal Pelanggan',
        categoryId: 'customer',
        title: 'Rincian Detail Pesanan Pelanggan',
        route: '/akun/pesanan',
        severity: 'Tinggi',
        steps: [
            'Klik tombol "Lihat Detail" pada salah satu pesanan (/akun/pesanan/{orderNumber})',
            'Periksa item belanja, subtotal, alamat kirim, metode pembayaran, dan timeline tracking',
        ],
        expected: 'Rincian pesanan jelas dan lengkap dengan riwayat perubahan status.',
    },
    {
        id: 'CUST-04',
        fr: 'FR-030',
        category: 'Portal Pelanggan',
        categoryId: 'customer',
        title: 'Pelacakan Nomor Resi Kurir Pengiriman',
        route: '/akun/pesanan',
        severity: 'Tinggi',
        steps: [
            'Buka pesanan yang sudah berstatus "Dikirim" (telah diinput nomor resi oleh admin)',
            'Cek nama kurir ekspedisi dan nomor resi pengiriman',
            'Klik tombol "Salin Nomor Resi"',
        ],
        expected: 'Nomor resi tampil jelas, tombol copy menyalin teks resi ke clipboard dengan notifikasi toast sukses.',
    },
    {
        id: 'CUST-05',
        fr: 'FR-031',
        category: 'Portal Pelanggan',
        categoryId: 'customer',
        title: 'Riwayat Pengajuan Permohonan Layanan',
        route: '/akun/layanan',
        severity: 'Sedang',
        steps: [
            'Buka menu "Layanan Saya" (/akun/layanan)',
            'Periksa daftar tiket pengajuan layanan IoT yang pernah diajukan',
            'Cek status tiket (Baru, Diproses, Selesai, Dibatalkan)',
        ],
        expected: 'Pelanggan dapat memantau status tindak lanjut tim teknisi atas permohonan layanannya.',
    },
    {
        id: 'CUST-06',
        fr: 'FR-032',
        category: 'Portal Pelanggan',
        categoryId: 'customer',
        title: 'Pembaruan Profil & Alamat Pengiriman Pelanggan',
        route: '/akun/profil',
        severity: 'Tinggi',
        steps: [
            'Buka menu "Pengaturan Profil" (/akun/profil)',
            'Ubah Nama, No WhatsApp, dan Alamat Pengiriman',
            'Klik tombol "Simpan Perubahan"',
            'Buka halaman /checkout untuk cek apakah data baru otomatis terbaca',
        ],
        expected: 'Data profil tersimpan di database, toast sukses muncul, dan checkout membaca alamat terbaru.',
    },

    // 6. ADMIN BACKOFFICE (/admin/*)
    {
        id: 'ADM-01',
        fr: 'FR-018',
        category: 'Panel Admin',
        categoryId: 'admin',
        title: 'Dashboard KPI & Analitik Penjualan',
        route: '/admin/dashboard',
        severity: 'Tinggi',
        steps: [
            'Login sebagai Admin dan buka /admin/dashboard',
            'Periksa metrik: Total Pendapatan, Total Pesanan, Total Produk, dan Pengajuan Layanan',
            'Cek tabel pesanan yang membutuhkan tindakan',
        ],
        expected: 'Data analitik real-time dan akurat mencerminkan transaksi aktual di database.',
    },
    {
        id: 'ADM-02',
        fr: 'FR-019',
        category: 'Panel Admin',
        categoryId: 'admin',
        title: 'Daftar Produk, Pencarian & Filter Admin',
        route: '/admin/products',
        severity: 'Tinggi',
        steps: [
            'Buka menu Produk Admin (/admin/products)',
            'Gunakan search bar dan filter kategori produk',
            'Cek kolom SKU, Harga, Stok, dan Status Aktif',
        ],
        expected: 'Daftar produk termuat dengan cepat, filter dan pencarian responsif.',
    },
    {
        id: 'ADM-03',
        fr: 'FR-019',
        category: 'Panel Admin',
        categoryId: 'admin',
        title: 'Tambah Produk Baru & Unggah Gambar',
        route: '/admin/products/create',
        severity: 'Kritis',
        steps: [
            'Klik "Tambah Produk Baru"',
            'Isi: Nama Produk, Kategori, Harga, Stok, Deskripsi, Spesifikasi Teknis',
            'Upload foto produk',
            'Submit formulir simpan produk',
        ],
        expected: 'Produk baru tersimpan ke database, file gambar tersimpan di storage, dan muncul di katalog storefront.',
    },
    {
        id: 'ADM-04',
        fr: 'FR-019',
        category: 'Panel Admin',
        categoryId: 'admin',
        title: 'Edit & Hapus Produk',
        route: '/admin/products',
        severity: 'Tinggi',
        steps: [
            'Klik tombol Edit pada salah satu produk',
            'Ubah harga atau stok lalu simpan',
            'Coba hapus salah satu produk pengujian (dengan dialog konfirmasi)',
        ],
        expected: 'Update data tersimpan, penghapusan produk menghapus record dengan aman.',
    },
    {
        id: 'ADM-05',
        fr: 'FR-020',
        category: 'Panel Admin',
        categoryId: 'admin',
        title: 'Manajemen Kategori Produk (CRUD)',
        route: '/admin/categories',
        severity: 'Tinggi',
        steps: [
            'Buka menu Kategori Admin (/admin/categories)',
            'Tambah kategori baru (misal: "Sensor Lingkungan")',
            'Edit nama kategori dan periksa fungsi penghapusan',
        ],
        expected: 'Kategori baru langsung muncul di pilihan kategori produk dan filter storefront.',
    },
    {
        id: 'ADM-06',
        fr: 'FR-017',
        category: 'Panel Admin',
        categoryId: 'admin',
        title: 'Daftar Pesanan Masuk & Filter Status',
        route: '/admin/orders',
        severity: 'Tinggi',
        steps: [
            'Buka menu Pesanan Admin (/admin/orders)',
            'Gunakan filter status: Semua, Menunggu Pembayaran, Diproses, Dikirim, Selesai, Dibatalkan',
            'Cek badge indikator status pesanan',
        ],
        expected: 'Daftar pesanan tersaring akurat sesuai status pemenuhan (fulfillment).',
    },
    {
        id: 'ADM-07',
        fr: 'FR-017',
        category: 'Panel Admin',
        categoryId: 'admin',
        title: 'Detail Pesanan & Pembaruan Status / Nomor Resi',
        route: '/admin/orders',
        severity: 'Kritis',
        steps: [
            'Buka detail pesanan (/admin/orders/{id})',
            'Ubah status pesanan menjadi "Dikirim"',
            'Isi data Ekspedisi Kurir (misal: JNE) dan Nomor Resi (misal: JNE123456789ID)',
            'Simpan pembaruan status',
        ],
        expected: 'Status pesanan terupdate, nomor resi tersimpan dan langsung muncul di portal akun pelanggan.',
    },
    {
        id: 'ADM-08',
        fr: 'FR-021',
        category: 'Panel Admin',
        categoryId: 'admin',
        title: 'Direktori Data Pelanggan Terdaftar',
        route: '/admin/customers',
        severity: 'Sedang',
        steps: [
            'Buka menu Pelanggan (/admin/customers)',
            'Cari nama pelanggan berdasarkan nama atau email',
            'Lihat riwayat total transaksi dan tanggal bergabung',
        ],
        expected: 'Daftar pelanggan terdaftar tampil rapi beserta statistik belanjanya.',
    },
    {
        id: 'ADM-09',
        fr: 'FR-025',
        category: 'Panel Admin',
        categoryId: 'admin',
        title: 'Triase & Pembaruan Status Permohonan Layanan',
        route: '/admin/service-requests',
        severity: 'Tinggi',
        steps: [
            'Buka menu Permohonan Layanan (/admin/service-requests)',
            'Buka tiket layanan masuk dari calon klien',
            'Ubah status tiket: "Baru" -> "Diproses" -> "Selesai"',
            'Klik tombol "Hubungi WhatsApp Klien" untuk tindak lanjut',
        ],
        expected: 'Admin dapat menindaklanjuti permohonan jasa dengan cepat dan status terekam rapi.',
    },
    {
        id: 'ADM-10',
        fr: 'FR-022',
        category: 'Panel Admin',
        categoryId: 'admin',
        title: 'Manajemen Banner Promosi Homepage',
        route: '/admin/banners',
        severity: 'Sedang',
        steps: [
            'Buka menu Banner Promosi (/admin/banners)',
            'Tambah banner baru: Judul, Subtitle, Upload Gambar, URL Target, dan Toggle Status Aktif',
            'Buka Homepage (/) untuk memastikan banner baru muncul di hero slider',
        ],
        expected: 'Banner promosi dinamis tampil di homepage sesuai status aktif yang ditentukan admin.',
    },
    {
        id: 'ADM-11',
        fr: 'FR-018',
        category: 'Panel Admin',
        categoryId: 'admin',
        title: 'Pengaturan Profil Admin & Keamanan Password',
        route: '/admin/settings',
        severity: 'Tinggi',
        steps: [
            'Buka menu Pengaturan Admin (/admin/settings)',
            'Ubah profil nama/email admin',
            'Ubah password admin dengan validasi password lama yang benar',
        ],
        expected: 'Profil dan password admin berhasil diperbarui dengan aman.',
    },

    // 7. EDGE CASES, SECURITY & MOBILE UX
    {
        id: 'SEC-01',
        fr: 'FR-009',
        category: 'Keamanan & Edge Cases',
        categoryId: 'edge',
        title: 'Penanganan Produk dengan Stok Habis (Out of Stock)',
        route: '/produk',
        severity: 'Tinggi',
        steps: [
            'Cari produk yang stoknya 0 unit (atau ubah stok salah satu produk menjadi 0 di admin)',
            'Buka halaman detail produk tersebut',
            'Cek apakah tombol "Tambah ke Keranjang" menjadi disabled / "Stok Habis"',
        ],
        expected: 'Pelanggan tidak dapat menambahkan produk habis ke keranjang, badge "Stok Habis" muncul jelas.',
    },
    {
        id: 'SEC-02',
        fr: 'FR-012',
        category: 'Keamanan & Edge Cases',
        categoryId: 'edge',
        title: 'Pembatasan Pembelian Melebihi Kuantitas Stok',
        route: '/keranjang',
        severity: 'Tinggi',
        steps: [
            'Masukkan produk dengan sisa stok 3 unit ke keranjang',
            'Coba klik tombol (+) lebih dari 3 kali',
            'Coba checkout melebihi stok yang tersedia',
        ],
        expected: 'Sistem membatasi kuantitas maksimal sesuai stok aktual dan menampilkan pesan peringatan.',
    },
    {
        id: 'SEC-03',
        fr: 'FR-027',
        category: 'Keamanan & Edge Cases',
        categoryId: 'edge',
        title: 'Halaman Error 404 (Not Found) & 403 (Forbidden)',
        route: '/halaman-uji-coba-404',
        severity: 'Sedang',
        steps: [
            'Akses URL yang tidak ada di sistem (misal: /halaman-uji-coba-404)',
            'Periksa tampilan halaman error 404 kustom Dodolan Store',
            'Klik tombol "Kembali ke Beranda"',
        ],
        expected: 'Tampil halaman error 404 kustom yang elegan dengan navigasi kembali ke homepage.',
    },
    {
        id: 'SEC-04',
        fr: 'FR-027',
        category: 'Keamanan & Edge Cases',
        categoryId: 'edge',
        title: 'Proteksi Rate Limiting (Anti-Spam Throttling)',
        route: '/layanan',
        severity: 'Sedang',
        steps: [
            'Submit formulir layanan atau checkout secara berulang lebih dari 10 kali dalam 1 menit',
        ],
        expected: 'Sistem merespons status HTTP 429 Too Many Requests untuk melindungi server dari serangan spam.',
    },
    {
        id: 'SEC-05',
        fr: 'FR-001',
        category: 'Keamanan & Edge Cases',
        categoryId: 'edge',
        title: 'Uji Responsivitas Tampilan Layar Ponsel (Mobile Viewport)',
        route: '/',
        severity: 'Tinggi',
        steps: [
            'Buka developer tools browser (F12) lalu aktifkan Device Emulation (layar 375px & 412px)',
            'Tes navigasi drawer mobile menu, sticky footer, filter katalog, dan checkout',
        ],
        expected: 'Layout fleksibel tanpa overflow horizontal, tombol sentuh mudah dioperasikan.',
    },
    {
        id: 'SEC-06',
        fr: 'FR-001',
        category: 'Keamanan & Edge Cases',
        categoryId: 'edge',
        title: 'Sanitasi Input Karakter Khusus & Script (XSS Prevention)',
        route: '/layanan',
        severity: 'Kritis',
        steps: [
            'Masukkan teks dengan tag HTML/JS (misal: <script>alert(1)</script>) pada kolom catatan permohonan',
            'Periksa tampilan teks tersebut saat dilihat di panel admin',
        ],
        expected: 'Input tersanitasi dengan aman (escaped), tidak ada eksekusi script yang tembus di browser.',
    },
];

const STORAGE_KEY = 'dodolan_store_qa_checklist_v6';

export default function QaChecklist() {
    const [itemStates, setItemStates] = useState<Record<string, TestItemState>>(() => {
        if (typeof window === 'undefined') return {};
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    });

    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [copiedReport, setCopiedReport] = useState<boolean>(false);
    const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});

    // Save to LocalStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(itemStates));
        } catch (e) {
            console.error('Gagal menyimpan status QA ke LocalStorage', e);
        }
    }, [itemStates]);

    const setItemStatus = (id: string, status: TestStatus) => {
        setItemStates((prev) => {
            const current = prev[id] || { status: 'pending', note: '' };
            return {
                ...prev,
                [id]: {
                    ...current,
                    status,
                    updatedAt: new Date().toISOString(),
                },
            };
        });

        if (status === 'failed') {
            setExpandedNotes((prev) => ({ ...prev, [id]: true }));
        }
    };

    const setItemNote = (id: string, note: string) => {
        setItemStates((prev) => {
            const current = prev[id] || { status: 'pending', note: '' };
            return {
                ...prev,
                [id]: {
                    ...current,
                    note,
                    updatedAt: new Date().toISOString(),
                },
            };
        });
    };

    const toggleNoteExpand = (id: string) => {
        setExpandedNotes((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const markAllCategoryPassed = (categoryId: string) => {
        const targetCases =
            categoryId === 'all'
                ? TEST_CASES
                : TEST_CASES.filter((c) => c.categoryId === categoryId);

        setItemStates((prev) => {
            const next = { ...prev };
            targetCases.forEach((tc) => {
                const current = next[tc.id] || { status: 'pending', note: '' };
                next[tc.id] = {
                    ...current,
                    status: 'passed',
                    updatedAt: new Date().toISOString(),
                };
            });
            return next;
        });
    };

    const resetAllProgress = () => {
        if (window.confirm('Reset semua status checklist dan catatan pengujian ke kondisi awal?')) {
            setItemStates({});
            localStorage.removeItem(STORAGE_KEY);
        }
    };

    const totalCount = TEST_CASES.length;
    const passedCount = useMemo(() => {
        return TEST_CASES.filter((tc) => (itemStates[tc.id]?.status || 'pending') === 'passed').length;
    }, [itemStates]);

    const failedCount = useMemo(() => {
        return TEST_CASES.filter((tc) => (itemStates[tc.id]?.status || 'pending') === 'failed').length;
    }, [itemStates]);

    const skippedCount = useMemo(() => {
        return TEST_CASES.filter((tc) => (itemStates[tc.id]?.status || 'pending') === 'skipped').length;
    }, [itemStates]);

    const pendingCount = totalCount - passedCount - failedCount - skippedCount;
    const progressPercent = Math.round((passedCount / totalCount) * 100);

    const filteredCases = useMemo(() => {
        return TEST_CASES.filter((tc) => {
            const state = itemStates[tc.id] || { status: 'pending', note: '' };

            if (selectedCategory !== 'all' && tc.categoryId !== selectedCategory) {
                return false;
            }

            if (statusFilter !== 'all' && state.status !== statusFilter) {
                return false;
            }

            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchText = `${tc.id} ${tc.fr} ${tc.title} ${tc.route} ${tc.expected} ${state.note}`.toLowerCase();
                if (!matchText.includes(q)) return false;
            }

            return true;
        });
    }, [selectedCategory, statusFilter, searchQuery, itemStates]);

    const copyBugReport = () => {
        const failedItems = TEST_CASES.filter(
            (tc) => (itemStates[tc.id]?.status || 'pending') === 'failed'
        );

        let report = `# Laporan Hasil Pengujian & Temuan QA — Dodolan Store\n`;
        report += `Tanggal: ${new Date().toLocaleString('id-ID')}\n`;
        report += `Status: ${passedCount}/${totalCount} Passed (${progressPercent}% Selesai)\n`;
        report += `Total Item Perlu Perbaikan: ${failedCount}\n\n`;

        if (failedItems.length === 0) {
            report += `Semua fitur telah lolos verifikasi dan siap untuk serah terima ke klien.\n`;
        } else {
            report += `## Daftar Item yang Memerlukan Perbaikan:\n\n`;
            failedItems.forEach((item, index) => {
                const state = itemStates[item.id];
                report += `### ${index + 1}. [${item.id}] ${item.title} (${item.fr})\n`;
                report += `- Rute Halaman: \`${item.route}\`\n`;
                report += `- Tingkat Keparahan: ${item.severity}\n`;
                report += `- Modul: ${item.category}\n`;
                report += `- Ekspektasi: ${item.expected}\n`;
                report += `- Catatan Temuan:\n  ${state?.note || 'Belum ada catatan detail.'}\n\n`;
            });
        }

        navigator.clipboard.writeText(report).then(() => {
            setCopiedReport(true);
            setTimeout(() => setCopiedReport(false), 3000);
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans pb-24">
            <Head title="QA Checklist — Dodolan Store" />

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-xs">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white font-bold">
                            <ListChecks className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-base font-bold text-slate-900">
                                    QA & Testing Checklist
                                </h1>
                                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700 border border-slate-200">
                                    Internal QA
                                </span>
                            </div>
                            <p className="text-xs text-slate-500">
                                Dodolan Store — Verifikasi kelayakan sistem sebelum serah terima klien
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button
                            onClick={copyBugReport}
                            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition active:scale-95 cursor-pointer"
                        >
                            {copiedReport ? (
                                <>
                                    <Check className="h-4 w-4 text-emerald-600" />
                                    <span className="text-emerald-700">Tersalin ke Clipboard</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="h-4 w-4 text-slate-500" />
                                    <span>Salin Ringkasan Temuan</span>
                                </>
                            )}
                        </button>

                        <Link
                            href="/"
                            target="_blank"
                            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition active:scale-95 cursor-pointer shadow-xs"
                        >
                            <span>Buka Storefront</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6">
                {/* Metrics Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {/* Progress Card */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Progres Pengujian
                            </span>
                            <span className="text-xs font-bold text-slate-900 font-mono">
                                {passedCount} / {totalCount}
                            </span>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl font-bold text-slate-900">
                                {progressPercent}% Selesai
                            </div>
                            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                                <div
                                    className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Passed Card */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                                Lulus Verifikasi (Passed)
                            </span>
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                <CheckCircle2 className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-3 text-2xl font-bold text-slate-900">
                            {passedCount}{' '}
                            <span className="text-xs font-normal text-slate-500">test case</span>
                        </div>
                    </div>

                    {/* Need Fix Card */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                                Perlu Perbaikan (Issues)
                            </span>
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                                <AlertCircle className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-3 text-2xl font-bold text-slate-900">
                            {failedCount}{' '}
                            <span className="text-xs font-normal text-slate-500">test case</span>
                        </div>
                    </div>

                    {/* Pending Card */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Belum Diuji
                            </span>
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                                <Clock className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-3 text-2xl font-bold text-slate-900">
                            {pendingCount}{' '}
                            <span className="text-xs font-normal text-slate-500">test case</span>
                        </div>
                    </div>
                </div>

                {/* Filters & Actions */}
                <div className="space-y-3">
                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                                selectedCategory === 'all'
                                    ? 'bg-slate-900 text-white'
                                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            Semua Modul ({totalCount})
                        </button>

                        {CATEGORIES.map((cat) => {
                            const count = TEST_CASES.filter((c) => c.categoryId === cat.id).length;
                            const isSelected = selectedCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                                        isSelected
                                            ? 'bg-slate-900 text-white'
                                            : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                    }`}
                                >
                                    {cat.name} ({count})
                                </button>
                            );
                        })}
                    </div>

                    {/* Search & Status Filters */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                        <div className="relative flex-1 w-full">
                            <input
                                type="text"
                                placeholder="Cari berdasarkan kode FR, nama fitur, atau rute URL..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-9 pr-8 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Status Filter */}
                        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
                            {(['all', 'pending', 'passed', 'failed', 'skipped'] as const).map((st) => {
                                const active = statusFilter === st;
                                return (
                                    <button
                                        key={st}
                                        onClick={() => setStatusFilter(st)}
                                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                                            active
                                                ? 'bg-slate-900 text-white'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        {st === 'all'
                                            ? 'Semua'
                                            : st === 'pending'
                                            ? 'Belum Diuji'
                                            : st === 'passed'
                                            ? 'Passed'
                                            : st === 'failed'
                                            ? 'Need Fix'
                                            : 'Dilewati'}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                                onClick={() => markAllCategoryPassed(selectedCategory)}
                                className="w-full sm:w-auto rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
                            >
                                Luluskan Kategori
                            </button>

                            <button
                                onClick={resetAllProgress}
                                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition cursor-pointer"
                                title="Reset checklist"
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Test Cases Table / Card List */}
                {filteredCases.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
                        <Filter className="mx-auto h-8 w-8 text-slate-300" />
                        <div className="mt-2 font-bold text-slate-700 text-sm">Tidak ada test case yang cocok</div>
                        <p className="mt-0.5">Ubah kata kunci pencarian atau reset filter modul.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {filteredCases.map((tc) => {
                            const state = itemStates[tc.id] || { status: 'pending', note: '' };
                            const isFailed = state.status === 'failed';
                            const isPassed = state.status === 'passed';
                            const isNotesOpen = expandedNotes[tc.id] || false;

                            return (
                                <div
                                    key={tc.id}
                                    className={`rounded-2xl border bg-white p-6 transition shadow-xs ${
                                        isFailed
                                            ? 'border-rose-300 ring-2 ring-rose-100'
                                            : isPassed
                                            ? 'border-emerald-300 ring-2 ring-emerald-100'
                                            : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                                    }`}
                                >
                                    {/* Item Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
                                        <div className="flex items-center gap-2.5 flex-wrap">
                                            <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md border border-slate-200">
                                                {tc.id}
                                            </span>
                                            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                                                {tc.title}
                                            </h3>
                                            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                                {tc.fr}
                                            </span>
                                            <span
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                                    tc.severity === 'Kritis'
                                                        ? 'bg-rose-100 text-rose-700'
                                                        : tc.severity === 'Tinggi'
                                                        ? 'bg-amber-100 text-amber-700'
                                                        : 'bg-slate-100 text-slate-600'
                                                }`}
                                            >
                                                {tc.severity}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <a
                                                href={tc.route}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white px-3.5 py-1.5 text-xs font-bold text-slate-700 transition"
                                            >
                                                <span>Uji: {tc.route}</span>
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            </a>
                                        </div>
                                    </div>

                                    {/* Steps & Expected Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3.5 text-xs">
                                        <div>
                                            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                                Langkah Pengujian
                                            </div>
                                            <ol className="space-y-1.5 list-decimal list-inside text-slate-700 leading-relaxed font-medium">
                                                {tc.steps.map((step, idx) => (
                                                    <li key={idx} className="pl-0.5">
                                                        <span>{step}</span>
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>

                                        <div>
                                            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                                Hasil yang Diharapkan
                                            </div>
                                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-800 leading-relaxed font-medium">
                                                {tc.expected}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Bar */}
                                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-xs font-bold text-slate-500 mr-1">Status:</span>

                                            <button
                                                onClick={() => setItemStatus(tc.id, 'passed')}
                                                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                                                    state.status === 'passed'
                                                        ? 'bg-emerald-600 text-white shadow-xs'
                                                        : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                                                }`}
                                            >
                                                Passed
                                            </button>

                                            <button
                                                onClick={() => setItemStatus(tc.id, 'failed')}
                                                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                                                    state.status === 'failed'
                                                        ? 'bg-rose-600 text-white shadow-xs'
                                                        : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                                                }`}
                                            >
                                                Perlu Perbaikan
                                            </button>

                                            <button
                                                onClick={() => setItemStatus(tc.id, 'pending')}
                                                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                                                    state.status === 'pending'
                                                        ? 'bg-slate-800 text-white'
                                                        : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                                                }`}
                                            >
                                                Belum Diuji
                                            </button>

                                            <button
                                                onClick={() => setItemStatus(tc.id, 'skipped')}
                                                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                                                    state.status === 'skipped'
                                                        ? 'bg-slate-600 text-white'
                                                        : 'border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
                                                }`}
                                            >
                                                Lewati
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => toggleNoteExpand(tc.id)}
                                            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                                state.note.trim()
                                                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                                    : 'text-slate-600 hover:bg-slate-100'
                                            }`}
                                        >
                                            <span>Catatan Temuan</span>
                                            {state.note.trim() && (
                                                <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                                            )}
                                            <ChevronDown
                                                className={`h-3.5 w-3.5 transition-transform ${
                                                    isNotesOpen ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </button>
                                    </div>

                                    {/* Note Section */}
                                    {isNotesOpen && (
                                        <div className="mt-3 pt-3 border-t border-slate-100">
                                            <textarea
                                                rows={2}
                                                value={state.note}
                                                onChange={(e) => setItemNote(tc.id, e.target.value)}
                                                placeholder="Tuliskan catatan perbaikan atau detail masalah di sini..."
                                                className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
                                            />
                                            {state.updatedAt && (
                                                <div className="mt-1 text-[11px] text-slate-400 text-right">
                                                    Disimpan: {new Date(state.updatedAt).toLocaleTimeString('id-ID')}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
