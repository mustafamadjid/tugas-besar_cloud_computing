# Terraform deployment

Konfigurasi ini memanfaatkan provider Docker agar stack aplikasi (PostgreSQL, backend, dan frontend) bisa dijalankan sebagai Infrastructure as Code.

## Prasyarat
- Terraform >= 1.5
- Docker daemon aktif di host

## Cara pakai
```bash
# Masuk ke folder terraform
cd terraform

# Inisialisasi provider
terraform init

# Jalankan stack dengan nilai default
terraform apply

# Hentikan dan hapus resource
terraform destroy
```

Nilai default mengikuti `docker-compose.yml`. Jika ingin mengubah port, kredensial database, atau environment variable backend, gunakan flag `-var` atau buat file `terraform.tfvars`. Contoh:

```hcl
# terraform.tfvars
backend_host_port = 8081
jwt_secret        = "ganti-secret"
backend_extra_env = {
  FIREBASE_API_KEY = "isi_kunci"
}
```
