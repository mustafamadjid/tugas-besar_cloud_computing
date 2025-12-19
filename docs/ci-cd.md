# CI/CD Sistem

Dokumen ini menjelaskan alur CI/CD (Continuous Integration/Continuous Delivery) pada sistem berbasis Google Cloud Platform (GCP) yang digunakan pada proyek ini.

## Ringkasan Arsitektur

Pipeline CI/CD memanfaatkan layanan GCP berikut:

1. **Cloud Source Repositories** – menyimpan kode sumber.
2. **Cloud Build** – melakukan build dan testing otomatis.
3. **Container Registry/Artifact Registry** – menyimpan image container.
4. **Cloud Run** – menjalankan image untuk lingkungan production.

## Diagram CI/CD

Tambahkan gambar arsitektur ke folder `docs/gambar/` lalu sisipkan pada bagian ini.
Contoh penggunaan:

```md
![Diagram CI/CD](gambar/cicd-arsitektur.png)
```

Jika ingin menampilkan gambar yang sudah disediakan, pastikan nama file dan path
sesuai dengan lokasi di folder `docs/gambar/`.

## Alur CI/CD

1. **Commit & Push**
   - Developer melakukan commit dan push perubahan ke repository.
2. **Trigger Build**
   - Push ke branch yang ditentukan memicu **Cloud Build**.
3. **Build & Test**
   - Cloud Build menjalankan proses:
     - Install dependency.
     - Menjalankan test.
     - Build image container.
4. **Publish Image**
   - Image yang berhasil dibuild di-push ke **Container/Artifact Registry**.
5. **Deploy**
   - Cloud Build (atau trigger deployment) melakukan deploy image terbaru ke **Cloud Run**.
6. **Delivery ke User**
   - Cloud Run melayani request pengguna dengan versi aplikasi terbaru.

## Struktur File CI/CD

- **Konfigurasi pipeline** biasanya disimpan dalam file seperti:
  - `cloudbuild.yaml` (jika digunakan Cloud Build).
  - `Dockerfile` untuk build image.
- Pastikan file-file tersebut konsisten dengan kebutuhan environment production.

## Praktik yang Disarankan

- Gunakan **branch protection** untuk memastikan kode yang masuk telah diverifikasi.
- Aktifkan **testing otomatis** sebelum build image.
- Terapkan **tagging version** pada image agar mudah rollback.
- Pantau deployment melalui **Cloud Monitoring** dan **Cloud Logging**.

## Catatan

Diagram arsitektur CI/CD ini menggambarkan alur:

`Commit & Push → Cloud Source Repositories → Cloud Build → Container Registry → Cloud Run → Users`
