# Google Cloud Encryption

Dokumentasi ini menjelaskan bagaimana proyek cloud ini mengelola enkripsi dan rahasia untuk kredensial `firebase-service-account` menggunakan Google Secret Manager.

## Ringkasan

- Kredensial `firebase-service-account` disimpan sebagai secret di **Google Secret Manager**.
- Aplikasi mengambil secret tersebut saat runtime untuk menghindari hardcode/penyimpanan kredensial di repository.
- Praktik ini menjaga **kerahasiaan**, **auditabilitas**, dan **rotasi** kredensial yang lebih aman.

## Alur Penggunaan (Tingkat Tinggi)

1. Admin membuat secret `firebase-service-account` di Google Secret Manager.
2. Service account aplikasi diberi izin **Secret Manager Secret Accessor**.
3. Aplikasi memuat kredensial dari Secret Manager saat startup.

## Mengapa Secret Manager?

- **Keamanan**: Tidak menyimpan file kredensial di repo atau image.
- **Audit**: Akses secret dapat dilacak.
- **Rotasi**: Memudahkan pembaruan kredensial tanpa redeploy besar.

## Secret Manager


```md
![Deskripsi gambar](gambar/google-encryption/secret-manager.png)
```


> Pastikan path gambar sesuai dengan lokasi file di repository.
