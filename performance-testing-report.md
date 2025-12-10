# Performance Testing Report

## Tujuan
Mengukur latensi, throughput, dan error rate backend saat menerima load.

## Environment
- Platform: Cloud Run (asia-southeast1)
- Service: tugas-besar-cloud-computing
- Tool: k6 lokal
- Waktu test: _isi tanggal/jam_

## Skenario
1. **GET /api/events**
   - Stages: 0→5 VUs (30s), hold 5 VUs (1m), ramp down (30s)
2. **POST /api/buyer/checkout**
   - Stages: 0→3 VUs (30s), hold 3 VUs (1m), ramp down (30s)

## Hasil k6
### GET /api/events
- RPS rata-rata: _isi_
- Latency avg: _isi_
- p95 latency: _isi_
- Error rate: _isi_
- Screenshot output k6:
  - _tempel di sini_ `![k6 GET events](path/ke-screenshot-get.png)`

### POST /api/buyer/checkout
- RPS rata-rata: _isi_
- Latency avg: _isi_
- p95 latency: _isi_
- Error rate: _isi_
- Screenshot output k6:
  - _tempel di sini_ `![k6 POST checkout](path/ke-screenshot-post.png)`

## Hasil Observability GCP
- Screenshot latency p95 Cloud Run: _tempel di sini_ `![Cloud Run p95](path/ke-screenshot-p95.png)`
- Screenshot request count: _tempel di sini_ `![Cloud Run request count](path/ke-screenshot-request.png)`
- Screenshot errors: _tempel di sini_ `![Cloud Run errors](path/ke-screenshot-errors.png)`
