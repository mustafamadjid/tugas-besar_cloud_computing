# Security Audit Checklist

Checklist ini menyoroti kontrol keamanan utama yang ada pada proyek ini serta langkah yang perlu diverifikasi saat audit. Fokusnya pada autentikasi Firebase, manajemen peran, validasi input, kebijakan CORS, pengelolaan rahasia, HTTPS, dan kontrol keamanan lain yang sudah diimplementasikan.

## Autentikasi & Otorisasi
- [ ] Verifikasi integrasi Firebase Admin untuk memvalidasi `idToken` pada endpoint login Google buyer dan promoter (`verifyIdToken`).
- [ ] Pastikan JWT terbit dengan payload minimal (id, email, role) dan kedaluwarsa wajar (`expiresIn: "7d"`).
- [ ] Audit middleware `authenticateToken` untuk memblokir request tanpa/ dengan token tidak valid.
- [ ] Audit middleware `isPromoter` untuk membatasi akses promotor pada rute pembuatan/pengelolaan event & tiket.
- [ ] Konfirmasi pemeriksaan kepemilikan promoter sebelum update/delete event dan tiket.
- [ ] Pastikan role buyer diverifikasi sebelum akses profil.

## Validasi Input & Penanganan Error
- [ ] Pastikan validasi field wajib di controller (mis. `title` & `date` saat membuat event; `type`, `price`, `quantity` saat menambah tiket; struktur `items` saat membuat order) dijalankan dan merespons 400 jika gagal.
- [ ] Audit normalisasi dan validasi email (regex) serta trimming nama di pembaruan profil buyer.
- [ ] Verifikasi penanganan kesalahan yang konsisten (respons `success: false` dan kode status sesuai) untuk mencegah bocornya detail internal.

## Kebijakan CORS & Transport
- [ ] Pastikan konfigurasi CORS hanya mengizinkan origin yang ditentukan di `allowedOrigins` dan menolak selainnya dengan error.
- [ ] Periksa header yang diizinkan (`Content-Type`, `Authorization`) dan metode HTTP yang dibuka.
- [ ] Pastikan HTTPS diaktifkan pada lingkungan produksi (mis. konfigurasi Cloud Run / reverse proxy) dan nonaktifkan akses plaintext jika memungkinkan.

## Pengelolaan Rahasia & Kredensial
- [ ] Pastikan variabel lingkungan (`JWT_SECRET`, `FRONTEND_URL`, kredensial DB, dll.) tidak dikomit ke repo.
- [ ] Verifikasi penggunaan Secret Manager/volume secret untuk file kredensial Firebase di Cloud Run (`FIREBASE_CREDENTIALS_PATH`).
- [ ] Audit file kredensial lokal hanya untuk pengembangan dan tidak ikut build/CI.

## Akses Data & Integritas
- [ ] Tinjau query database untuk penggunaan parameter binding guna mencegah SQL injection.
- [ ] Pastikan transaksi digunakan pada proses order tiket agar stok dan perhitungan total tetap konsisten.
- [ ] Audit batasan kepemilikan data (promoter hanya dapat mengubah event/tiket miliknya).

## Logging & Monitoring
- [ ] Pastikan kegagalan autentikasi/otorisasi dicatat tanpa mengekspos informasi sensitif.
- [ ] Konfirmasi log inisialisasi Firebase hanya muncul pada lingkungan yang tepat (lokal vs Cloud Run).

## Konfigurasi Deployment
- [ ] Pastikan konfigurasi Docker/hosting mem-forward port melalui HTTPS dan tidak mengekspos service internal.
- [ ] Validasi variabel `FRONTEND_URL` memuat daftar origin produksi yang valid.

## Rekomendasi Tambahan (jika belum ada)
- [ ] Tambahkan rate limiting dan proteksi brute force pada endpoint autentikasi.
- [ ] Terapkan helmet atau header keamanan lainnya untuk proteksi umum (XSS, clickjacking).
- [ ] Catat jejak audit untuk perubahan data sensitif (pembuatan/ubah/hapus event & tiket).
- [ ] Tambahkan pemantauan health check/uptime dan alert untuk kegagalan autentikasi berulang.
