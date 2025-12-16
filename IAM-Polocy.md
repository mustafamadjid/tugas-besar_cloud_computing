# Dokumentasi IAM Policy Proyek "gotiketku-project"

Dokumentasi ini merangkum pemberian peran (IAM roles) untuk beberapa anggota tim pada proyek **gotiketku-project**. Setiap subseksi memuat:

- Identitas anggota (email)
- Daftar peran yang diberikan
- Ringkasan tanggung jawab atau kemampuan yang diperoleh dari setiap peran

> **Catatan:** Peran di bawah menggunakan skema IAM Google Cloud. Hak akses efektif ditentukan oleh kombinasi peran ini dan kebijakan organisasi yang lebih tinggi.

## Ringkasan Peran per Anggota

### Eden (Infra Lead) — `eden.122140187@student.itera.ac.id`
- `roles/compute.networkAdmin` — Membuat dan mengelola sumber daya jaringan Compute Engine (VPC, subnet, firewall, route) untuk kebutuhan infrastruktur.
- `roles/secretmanager.admin` — Penuh kendali atas Secret Manager, termasuk membuat, memutar, dan menghapus secret untuk aplikasi.
- `roles/cloudkms.admin` — Administrasi Cloud KMS: membuat key ring, key, serta mengelola rotasi dan kebijakan akses kunci enkripsi.
- `roles/iam.serviceAccountAdmin` — Membuat dan mengelola service account, termasuk kunci dan kebijakan IAM pada service account.
- `roles/iam.serviceAccountUser` — Menggunakan service account untuk resource/operasi tertentu (mis. binding ke VM atau Cloud Run).
- `roles/logging.viewer` — Membaca log aplikasi dan infrastruktur melalui Cloud Logging untuk observabilitas.
- `roles/monitoring.viewer` — Membaca metrik/alert di Cloud Monitoring untuk memantau kesehatan sistem.

### Randy (Security Reviewer) — `randy.122140171@student.itera.ac.id`
- `roles/iam.securityReviewer` — Mengkaji konfigurasi IAM lintas project (read-only), memastikan kepatuhan dan prinsip least privilege.
- `roles/secretmanager.viewer` — Mengakses secret hanya-baca untuk audit/inspeksi tanpa bisa memodifikasi.
- `roles/cloudkms.viewer` — Melihat konfigurasi key di Cloud KMS guna verifikasi keamanan dan kebijakan rotasi.
- `roles/logging.viewer` — Membaca log untuk aktivitas keamanan atau audit trail.
- `roles/monitoring.viewer` — Melihat metrik/alert untuk menginvestigasi insiden keamanan.

### Muhammad037 (Backend Deploy) — `muhammad.122140037@student.itera.ac.id`
- `roles/run.developer` — Mendeploy dan mengelola layanan Cloud Run (membuat revisi, konfigurasi, rollout backend).
- `roles/cloudsql.client` — Menghubungkan aplikasi ke instance Cloud SQL sebagai klien (membutuhkan kredensial/secret terpisah).
- `roles/secretmanager.secretAccessor` — Mengambil nilai secret pada Secret Manager (tanpa izin mengubah), biasanya untuk env var backend.
- `roles/logging.viewer` — Membaca log layanan backend untuk debugging atau operasi.
- `roles/monitoring.viewer` — Melihat metrik/alert layanan backend untuk pemantauan.

### Mulfi (Frontend) — `mulfi.122140186@student.itera.ac.id`
- `roles/run.developer` — Mendeploy dan mengelola layanan frontend di Cloud Run.
- `roles/logging.viewer` — Membaca log untuk memantau error frontend dan integrasi.

### Muhammad189 (QA) — `muhammad.122140189@student.itera.ac.id`
- `roles/viewer` — Akses baca lintas resource proyek untuk verifikasi dan pengujian tanpa hak modifikasi.
- `roles/logging.viewer` — Membaca log untuk memeriksa error selama pengujian.
- `roles/monitoring.viewer` — Melihat metrik/alert untuk memastikan stabilitas selama QA.

### Athaullah (Project Lead) — `athaullah.122140191@student.itera.ac.id`
- `roles/resourcemanager.projectIamAdmin` — Administrasi penuh atas IAM project (menambah/menghapus binding, mengelola kebijakan).
- `roles/iam.serviceAccountAdmin` — Membuat dan mengelola service account berikut kebijakannya.
- `roles/iam.serviceAccountUser` — Menggunakan service account dalam resource/proses yang memerlukannya.
- `roles/compute.networkAdmin` — Mengelola konfigurasi jaringan (VPC, firewall, route) untuk orkestrasi layanan.
- `roles/secretmanager.admin` — Penuh kendali atas Secret Manager (membuat, memutar, menghapus secret).
- `roles/cloudkms.admin` — Administrasi kunci enkripsi di Cloud KMS (pembuatan, rotasi, kebijakan akses).
- `roles/run.admin` — Kontrol penuh atas Cloud Run (membuat, mengubah, menghapus layanan serta IAM-nya).
- `roles/logging.viewer` — Akses baca log guna monitoring aktivitas.
- `roles/monitoring.viewer` — Akses baca metrik/alert untuk memantau performa dan keandalan.

## Referensi Perintah gcloud
Gunakan perintah berikut (sesuaikan `PROJECT_ID`) untuk menautkan peran ke tiap anggota:

```bash
PROJECT_ID="gotiketku-project"
# Contoh (Eden)
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="user:eden.122140187@student.itera.ac.id" \
  --role="roles/compute.networkAdmin"
```

Ulangi perintah sesuai daftar peran di atas untuk setiap anggota.
