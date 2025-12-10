# Laporan Analisis Biaya (Cost Analysis Report)

## Aplikasi Ticketing Berbasis Cloud (GCP Cloud Run + Cloud SQL)

- **Project:** Tugas Besar Cloud Computing
- **Tanggal:** 13 Desember 2025
- **Versi:** 2.0
- **Region Utama:** asia-southeast1 (Southeast Asia)
- **Kurs Referensi:** 1 USD ≈ Rp15.700

---

## Ringkasan Eksekutif

Laporan ini memperbarui analisis biaya untuk arsitektur yang sepenuhnya berjalan di Google Cloud Platform dengan komponen utama **Cloud Run (frontend & backend)**, **Cloud SQL PostgreSQL**, dan **Cloud HTTP(S) Load Balancing** untuk SSL/HTTPS. Estimasi dibuat untuk dua skenario (Development & Production) dengan asumsi beban lalu lintas yang realistis untuk aplikasi ticketing di Indonesia.

### Temuan Utama
- **Biaya bulanan Development:** ~**$63 (≈ Rp990.000)** dengan memanfaatkan skala-ke-nol Cloud Run dan instance Cloud SQL kecil.
- **Biaya bulanan Production:** ~**$343 (≈ Rp5.380.000)** untuk kapasitas siap trafik ratusan ribu pengguna per bulan.
- **Penghematan potensial:** 25–45% dengan **Autoscaling Cloud Run**, **diskon 1–3 tahun (Committed Use Discounts) untuk Cloud SQL**, dan **Cloud CDN** untuk menekan bandwidth load balancer.
- **Keamanan & kepatuhan:** SSL gratis via managed certificate load balancer; IAM terpusat; backup otomatis database.

---

## Asumsi Perhitungan

| Faktor | Development | Production |
| --- | --- | --- |
| Pengguna aktif bulanan | 5.000 | 150.000 |
| Request HTTP | 50.000/bulan | 1.500.000/bulan |
| Lalu lintas keluar (egress) | 50 GB/bulan | 300 GB/bulan |
| Jam aktif rata-rata Cloud Run | 120 jam/bulan (spiky, auto scale to zero) | 730 jam/bulan (1 min instance) |
| Harga region | asia-southeast1 (Jakarta/Singapore tier) | asia-southeast1 |

> Catatan: Harga mengikuti kalkulator GCP per Desember 2025, dibulatkan dan sudah termasuk egress internet serta log/metric dasar. Free tier Cloud Run (2 juta request + 360.000 vCPU-detik) belum diperhitungkan eksplisit sehingga estimasi bersifat konservatif.

---

## 1. Arsitektur Layanan

```
Internet ──► Cloud HTTP(S) Load Balancer ──► Cloud Run (Frontend, Nginx)
                                     └──► Cloud Run (Backend API, Express/Node.js)
                                                       └──► Cloud SQL for PostgreSQL
                                                       └──► Cloud Storage (asset poster)
                                                       └──► Firebase Authentication
```

- **Frontend:** React + Nginx container di Cloud Run, diakses via HTTPS load balancer (managed SSL).
- **Backend:** Express API di Cloud Run, private VPC connector ke Cloud SQL.
- **Database:** Cloud SQL PostgreSQL, automated backup & point-in-time recovery.
- **Keamanan:** IAM, Cloud Armor opsional, HTTPS mandatory, secret via Secret Manager.
- **Observabilitas:** Cloud Logging & Cloud Monitoring default.

---

## 2. Estimasi Biaya per Lingkungan

### 2.1 Development (±$63 ≈ Rp990.000/bulan)

| Layanan | Spesifikasi & Asumsi | Estimasi USD | Estimasi IDR |
| --- | --- | --- | --- |
| Cloud Run Frontend | 0.25 vCPU / 512 MB, auto-scale (0→1), 120 jam efektif | $6 | Rp94.200 |
| Cloud Run Backend | 0.5 vCPU / 1 GB, auto-scale (0→2), 120 jam efektif | $16 | Rp251.200 |
| Cloud SQL PostgreSQL | db-f1-micro (shared core), 20 GB SSD, backup 7 hari | $18 | Rp282.600 |
| Cloud HTTP(S) Load Balancing | 1 forwarding rule + 50 GB egress | $21 | Rp329.700 |
| Cloud Storage | 10 GB objek statis poster | $1 | Rp15.700 |
| Cloud Logging & Monitoring | 5 GB log tersimpan | $1 | Rp15.700 |
| **Total** |  | **$63** | **Rp989.100** |

**Catatan:** Dengan memanfaatkan free tier Cloud Run dan Cloud Logging default (50 GiB free ingestion), biaya riil berpotensi lebih rendah 10–20%.

### 2.2 Production (±$343 ≈ Rp5.380.000/bulan)

| Layanan | Spesifikasi & Asumsi | Estimasi USD | Estimasi IDR |
| --- | --- | --- | --- |
| Cloud Run Frontend | 1 vCPU / 1 GB, min 1 instance, auto-scale hingga 10 | $55 | Rp863.500 |
| Cloud Run Backend | 2 vCPU / 2 GB, min 1 instance, auto-scale hingga 15 | $130 | Rp2.041.000 |
| Cloud SQL PostgreSQL | e2-standard-2 (2 vCPU, 8 GB), 50 GB SSD, PITR | $90 | Rp1.413.000 |
| Cloud HTTP(S) Load Balancing | 1 rule + 300 GB egress | $48 | Rp753.600 |
| Cloud Storage | 50 GB aset + 20 GB backup artefak | $5 | Rp78.500 |
| Cloud Logging & Monitoring | 30 GB log tersimpan & metric custom ringan | $10 | Rp157.000 |
| **Total** |  | **$343** | **Rp5.306.600** |

> **Egress CDN**: Menempatkan Cloud CDN di depan load balancer dapat menurunkan komponen egress hingga 30–60% jika cache-hit tinggi untuk aset statis.

---

## 3. Optimalisasi Biaya yang Direkomendasikan

1. **Autoscaling agresif Cloud Run**: gunakan concurrency 80–200 untuk backend (idempotent endpoint) dan batasi `min_instances`=0 pada jalur non-kritis.
2. **Committed Use Discounts (1–3 tahun) untuk Cloud SQL**: penghematan 20–45% tergantung tenor.
3. **Cloud Run CPU thrift**: set `cpu=throttled` saat idle jika workload CPU-bound tidak dominan.
4. **Cloud CDN + Cache-Control**: kurangi egress load balancer untuk aset frontend/poster.
5. **Logging sampling & retensi**: turunkan volume log yang disimpan, gunakan log-based metrics seperlunya.
6. **Database ops**: gunakan `pgbouncer`/connection pooling Cloud SQL, aktifkan auto-vacuum, dan rightsizing storage IOPS.
7. **Non-prod schedule**: matikan env Development di luar jam kerja (scheduler + terraform/infra-as-code).

---

## 4. Risiko & Mitigasi

- **Lonjakan trafik mendadak** → Pastikan batas autoscaling Cloud Run memadai dan load test berkala; aktifkan Cloud Armor untuk perlindungan layer 7.
- **Kenaikan biaya egress** → Terapkan Cloud CDN dan optimasi aset (compression, image sizing); evaluasi lokasi pengguna untuk opsi multi-region CDN POP.
- **Kapasitas database** → Pantau CPU/connection, siapkan read-replica jika beban baca meningkat; gunakan PITR + backup harian.
- **Single point of failure konfigurasi** → Simpan konfigurasi di repo infra-as-code (Terraform) dan gunakan Secret Manager.

---

## 5. Rekomendasi Implementasi

- **Mulai dengan parameter Development** untuk UAT/staging, gunakan auto-scale-to-zero.
- **Aktifkan Cloud CDN** di depan load balancer sebelum go-live untuk menekan egress.
- **Set `min_instances` rendah** (0–1) dan `max_instances` berdasarkan tes beban (CPU target 60–70%).
- **Gunakan CUD Cloud SQL 1 tahun** setelah pola beban stabil (≥20% penghematan langsung).
- **Tinjau biaya bulanan** via Billing Export + Looker Studio dashboard untuk visibilitas tim.

