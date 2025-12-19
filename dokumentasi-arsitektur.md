# Dokumentasi Arsitektur

Dokumen ini menjelaskan bentuk arsitektur yang digunakan dan dibagi menjadi dua bagian: **Arsitektur GCP** dan **Arsitektur Sistem**.

## Arsitektur GCP

- **Frontend** dan **Backend** di-deploy menggunakan **Google Cloud Run**.
- **Frontend** menggunakan **Firebase Authentication** untuk fitur **Google Sign-In**.
- **Frontend** berada di belakang **Load Balancer**, sehingga IP yang di-assign pada DNS record adalah IP dari Load Balancer tersebut.
- **Database** menggunakan **Cloud SQL (PostgreSQL)** sebagai penyimpanan data terpusat.
- **Domain** aplikasi: **https://komaiterasi3.gotiketku.online**.

### Visualisasi Arsitektur GCP
![Arsitektur GCP](gambar/arsitektur/arsitektur-gcp.png)

### Ringkasan Alur
1. Pengguna mengakses domain aplikasi yang mengarah ke IP Load Balancer.
2. Load Balancer meneruskan trafik ke layanan frontend di Cloud Run.
3. Frontend melakukan autentikasi melalui Firebase Auth (Google Sign-In).
4. Frontend berkomunikasi dengan backend di Cloud Run melalui REST API.
5. Backend melakukan query ke Cloud SQL (PostgreSQL) untuk membaca/menulis data.

## Arsitektur Sistem

Arsitektur sistem mengikuti pola **3-tier**: Presentation Tier, Application Tier, dan Database Tier.

### Visualisasi Arsitektur Sistem
![Arsitektur Sistem](gambar/arsitektur/arsitektur-sistem.png)

### Presentation Tier
- **Web App (Client)** sebagai antarmuka pengguna.
- **Firebase Auth** untuk **Google Sign-In** menghasilkan **ID Token**.
- Token digunakan sebagai **JWT** untuk mengakses API backend.

### Application Tier
- **Backend** menggunakan **Node.js** dan **Express.js**.
- Menyediakan **RESTful API**.
- Menerima **JWT** dari frontend untuk proses autentikasi/otorisasi.

### Database Tier
- **PostgreSQL** sebagai basis data utama.
- Backend melakukan **SQL Query** ke database dan menerima hasilnya untuk dikembalikan ke frontend.

### Alur Komunikasi Utama
1. Client melakukan login dengan Google melalui Firebase Auth.
2. Client menerima ID Token dan mengirim **HTTP Request (REST API)** ke backend dengan **JWT**.
3. Backend memproses request dan melakukan query ke PostgreSQL.
4. Backend mengembalikan **HTTP JSON Response** ke client.
