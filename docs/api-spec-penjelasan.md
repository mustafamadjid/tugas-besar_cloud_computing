# Penjelasan `api-spec.json`

Dokumen ini menjelaskan isi `docs/api-spec.json` secara rinci, termasuk setiap endpoint, format request/response, serta HTTP code yang mungkin muncul beserta kegunaannya.

## Ringkasan Umum
- **OpenAPI**: 3.0.3
- **Base URL (dev)**: `http://localhost:8080`
- **Tag**:
  - **Auth**: autentikasi Google.
  - **Events**: manajemen event.
  - **Tickets**: inventori tiket event.
  - **Buyer**: profil buyer dan order.

## Format Response Umum
Semua response sukses mengikuti pola berikut:

```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

Semua response error mengikuti pola berikut:

```json
{
  "success": false,
  "message": "...",
  "data": null
}
```

> **Catatan**: Detail `message` dan struktur `data` bervariasi per endpoint (mengikuti schema di `components/schemas`).

---

## Auth
### 1) POST `/api/auth/buyer`
**Deskripsi**: Google sign-in untuk buyer.

**Request** (`application/json`)
```json
{
  "idToken": "<firebase_id_token>"
}
```

**Response**
- **200 OK** – Login berhasil.
  ```json
  {
    "success": true,
    "message": "Login Google berhasil",
    "data": {
      "id": 1,
      "name": "Nama User",
      "email": "user@email.com",
      "role": "BUYER",
      "provider": "google",
      "google_uid": "<google_uid>",
      "created_at": "2024-01-01T12:00:00Z",
      "token": "<jwt_access_token>"
    }
  }
  ```
- **400 Bad Request** – Request body tidak valid (mis. `idToken` kosong/tidak ada). Berguna untuk validasi input.
- **401 Unauthorized** – Token Google/credential tidak valid. Berguna untuk memastikan autentikasi.
- **403 Forbidden** – Akses ditolak (mis. role tidak sesuai kebijakan). Berguna untuk kontrol akses.

### 2) POST `/api/auth/promoter`
**Deskripsi**: Google sign-in untuk promoter.

**Request** (`application/json`)
```json
{
  "idToken": "<firebase_id_token>"
}
```

**Response**
- **200 OK** – Login berhasil.
  ```json
  {
    "success": true,
    "message": "Login Google berhasil",
    "data": {
      "id": 1,
      "name": "Nama User",
      "email": "user@email.com",
      "role": "PROMOTER",
      "provider": "google",
      "google_uid": "<google_uid>",
      "created_at": "2024-01-01T12:00:00Z",
      "token": "<jwt_access_token>"
    }
  }
  ```
- **400 Bad Request** – Request body tidak valid.
- **401 Unauthorized** – Token Google/credential tidak valid.
- **403 Forbidden** – Akses ditolak.

---

## Events
### 1) GET `/api/events`
**Deskripsi**: Mengambil daftar semua event.

**Response**
- **200 OK** – Daftar event berhasil diambil.
  ```json
  {
    "success": true,
    "message": "Success",
    "data": [
      {
        "id": 1,
        "title": "Event A",
        "description": "Deskripsi",
        "date": "2024-01-01T12:00:00Z",
        "location": "Lokasi",
        "poster_url": "https://...",
        "promoter_id": 10
      }
    ]
  }
  ```
- **500 Internal Server Error** – Error server tak terduga. Berguna untuk indikasi masalah backend.

### 2) POST `/api/events`
**Deskripsi**: Membuat event baru (butuh autentikasi bearer token).

**Request** (`application/json`)
```json
{
  "title": "Event A",
  "description": "Deskripsi",
  "date": "2024-01-01T12:00:00Z",
  "location": "Lokasi",
  "poster_url": "https://..."
}
```

**Response**
- **201 Created** – Event berhasil dibuat.
  ```json
  {
    "success": true,
    "message": "Success",
    "data": {
      "id": 1,
      "title": "Event A",
      "description": "Deskripsi",
      "date": "2024-01-01T12:00:00Z",
      "location": "Lokasi",
      "poster_url": "https://...",
      "promoter_id": 10
    }
  }
  ```
- **400 Bad Request** – Payload invalid (mis. `title`/`date` kosong). Validasi input.
- **401 Unauthorized** – Token tidak ada/invalid.
- **403 Forbidden** – Role bukan promoter atau tidak punya akses.
- **500 Internal Server Error** – Error server.

### 3) GET `/api/events/{id}`
**Deskripsi**: Mengambil detail event berdasarkan ID.

**Path Param**
- `eventId` (integer) — ID event (di path tertulis `{id}` pada spesifikasi).

**Response**
- **200 OK** – Event ditemukan.
  ```json
  {
    "success": true,
    "message": "Success",
    "data": {
      "id": 1,
      "title": "Event A",
      "description": "Deskripsi",
      "date": "2024-01-01T12:00:00Z",
      "location": "Lokasi",
      "poster_url": "https://...",
      "promoter_id": 10
    }
  }
  ```
- **404 Not Found** – Event dengan ID tersebut tidak ada.
- **500 Internal Server Error** – Error server.

### 4) PUT `/api/events/{id}`
**Deskripsi**: Mengubah event berdasarkan ID (butuh autentikasi bearer token).

**Path Param**
- `eventId` (integer) — ID event (di path tertulis `{id}` pada spesifikasi).

**Request** (`application/json`)
```json
{
  "title": "Event A Updated",
  "description": "Deskripsi",
  "date": "2024-01-02T12:00:00Z",
  "location": "Lokasi",
  "poster_url": "https://..."
}
```

**Response**
- **200 OK** – Event berhasil diperbarui.
  ```json
  {
    "success": true,
    "message": "Success",
    "data": {
      "id": 1,
      "title": "Event A Updated",
      "description": "Deskripsi",
      "date": "2024-01-02T12:00:00Z",
      "location": "Lokasi",
      "poster_url": "https://...",
      "promoter_id": 10
    }
  }
  ```
- **400 Bad Request** – Payload invalid.
- **401 Unauthorized** – Token tidak ada/invalid.
- **403 Forbidden** – Tidak punya akses ke event.
- **404 Not Found** – Event tidak ditemukan.
- **500 Internal Server Error** – Error server.

### 5) DELETE `/api/events/{id}`
**Deskripsi**: Menghapus event berdasarkan ID (butuh autentikasi bearer token).

**Path Param**
- `eventId` (integer) — ID event (di path tertulis `{id}` pada spesifikasi).

**Response**
- **200 OK** – Event berhasil dihapus.
  ```json
  {
    "success": true,
    "message": "Success",
    "data": null
  }
  ```
- **401 Unauthorized** – Token tidak ada/invalid.
- **403 Forbidden** – Tidak punya akses.
- **404 Not Found** – Event tidak ditemukan.
- **500 Internal Server Error** – Error server.

---

## Tickets
### 1) GET `/api/events/{eventId}/tickets`
**Deskripsi**: Mengambil daftar tiket untuk event tertentu.

**Path Param**
- `eventId` (integer) — ID event.

**Response**
- **200 OK** – Daftar tiket berhasil diambil.
  ```json
  {
    "success": true,
    "message": "Success",
    "data": [
      {
        "id": 1,
        "event_id": 10,
        "type": "VIP",
        "price": 150000,
        "quantity": 100,
        "sale_start_date": "2024-01-01T12:00:00Z",
        "sale_end_date": "2024-01-10T12:00:00Z"
      }
    ]
  }
  ```
- **500 Internal Server Error** – Error server.

### 2) POST `/api/events/{eventId}/tickets`
**Deskripsi**: Menambah tipe tiket untuk event (butuh autentikasi bearer token).

**Path Param**
- `eventId` (integer) — ID event.

**Request** (`application/json`)
```json
{
  "type": "VIP",
  "price": 150000,
  "quantity": 100,
  "sale_start_date": "2024-01-01T12:00:00Z",
  "sale_end_date": "2024-01-10T12:00:00Z"
}
```

**Response**
- **201 Created** – Tiket berhasil dibuat.
  ```json
  {
    "success": true,
    "message": "Success",
    "data": {
      "id": 1,
      "event_id": 10,
      "type": "VIP",
      "price": 150000,
      "quantity": 100,
      "sale_start_date": "2024-01-01T12:00:00Z",
      "sale_end_date": "2024-01-10T12:00:00Z"
    }
  }
  ```
- **400 Bad Request** – Payload invalid.
- **401 Unauthorized** – Token tidak ada/invalid.
- **403 Forbidden** – Tidak punya akses.
- **404 Not Found** – Event tidak ditemukan.
- **500 Internal Server Error** – Error server.

### 3) PUT `/api/events/tickets/{ticketId}`
**Deskripsi**: Mengubah detail tiket (butuh autentikasi bearer token).

**Path Param**
- `ticketId` (integer) — ID ticket.

**Request** (`application/json`)
```json
{
  "type": "VIP",
  "price": 175000,
  "quantity": 80,
  "sale_start_date": "2024-01-01T12:00:00Z",
  "sale_end_date": "2024-01-10T12:00:00Z"
}
```

**Response**
- **200 OK** – Tiket berhasil diperbarui.
  ```json
  {
    "success": true,
    "message": "Success",
    "data": {
      "id": 1,
      "event_id": 10,
      "type": "VIP",
      "price": 175000,
      "quantity": 80,
      "sale_start_date": "2024-01-01T12:00:00Z",
      "sale_end_date": "2024-01-10T12:00:00Z"
    }
  }
  ```
- **400 Bad Request** – Payload invalid.
- **401 Unauthorized** – Token tidak ada/invalid.
- **403 Forbidden** – Tidak punya akses.
- **404 Not Found** – Ticket tidak ditemukan.
- **500 Internal Server Error** – Error server.

### 4) DELETE `/api/events/tickets/{ticketId}`
**Deskripsi**: Menghapus tiket (butuh autentikasi bearer token).

**Path Param**
- `ticketId` (integer) — ID ticket.

**Response**
- **200 OK** – Tiket berhasil dihapus.
  ```json
  {
    "success": true,
    "message": "Success",
    "data": null
  }
  ```
- **401 Unauthorized** – Token tidak ada/invalid.
- **403 Forbidden** – Tidak punya akses.
- **404 Not Found** – Ticket tidak ditemukan.
- **500 Internal Server Error** – Error server.

---

## Buyer
### 1) GET `/api/buyer/profile`
**Deskripsi**: Mengambil profil buyer (butuh autentikasi bearer token).

**Response**
- **200 OK** – Profil ditemukan.
  ```json
  {
    "success": true,
    "message": "Success",
    "data": {
      "id": 1,
      "name": "Nama Buyer",
      "email": "buyer@email.com",
      "role": "BUYER",
      "provider": "google",
      "google_uid": "<google_uid>",
      "created_at": "2024-01-01T12:00:00Z"
    }
  }
  ```
- **401 Unauthorized** – Token tidak ada/invalid.
- **403 Forbidden** – Tidak punya akses.
- **404 Not Found** – Profil tidak ditemukan.
- **500 Internal Server Error** – Error server.

### 2) PUT `/api/buyer/profile`
**Deskripsi**: Memperbarui profil buyer (butuh autentikasi bearer token).

**Request** (`application/json`)
```json
{
  "name": "Nama Buyer",
  "email": "buyer@email.com"
}
```

**Response**
- **200 OK** – Profil berhasil diperbarui.
  ```json
  {
    "success": true,
    "message": "Success",
    "data": {
      "id": 1,
      "name": "Nama Buyer",
      "email": "buyer@email.com",
      "role": "BUYER",
      "provider": "google",
      "google_uid": "<google_uid>",
      "created_at": "2024-01-01T12:00:00Z"
    }
  }
  ```
- **400 Bad Request** – Payload invalid.
- **401 Unauthorized** – Token tidak ada/invalid.
- **403 Forbidden** – Tidak punya akses.
- **404 Not Found** – Profil tidak ditemukan.
- **409 Conflict** – Email conflict (email sudah dipakai). Berguna untuk menjaga keunikan.
- **500 Internal Server Error** – Error server.

### 3) POST `/api/buyer/order`
**Deskripsi**: Membuat order (butuh autentikasi bearer token).

**Request** (`application/json`)
```json
{
  "payment_method": "transfer",
  "total_price": 300000,
  "items": [
    {
      "event_id": 10,
      "ticket_type": "VIP",
      "quantity": 2
    }
  ]
}
```

**Response**
- **201 Created** – Order berhasil dibuat.
  ```json
  {
    "success": true,
    "message": "Order created",
    "data": {
      "order": {
        "id": 1,
        "user_id": 5,
        "total_price": 300000,
        "payment_status": "PENDING",
        "payment_method": "transfer",
        "payment_reference": null,
        "created_at": "2024-01-01T12:00:00Z"
      },
      "items": [
        {
          "ticketId": 1,
          "event_id": 10,
          "ticket_type": "VIP",
          "ticket_price": 150000,
          "quantity": 2
        }
      ]
    }
  }
  ```
- **400 Bad Request** – Payload invalid (mis. `items` kosong). Validasi input.
- **401 Unauthorized** – Token tidak ada/invalid.
- **404 Not Found** – Event/ticket tidak ditemukan.
- **500 Internal Server Error** – Error server.

### 4) GET `/api/buyer/tickets`
**Deskripsi**: Mengambil daftar order dan tiket buyer (butuh autentikasi bearer token).

**Response**
- **200 OK** – Daftar order berhasil diambil.
  ```json
  {
    "success": true,
    "message": "Success",
    "data": [
      {
        "id": 1,
        "total_price": 300000,
        "payment_status": "PENDING",
        "payment_method": "transfer",
        "payment_reference": null,
        "created_at": "2024-01-01T12:00:00Z",
        "items": [
          {
            "order_item_id": 1,
            "event_id": 10,
            "event_title": "Event A",
            "event_date": "2024-01-01T12:00:00Z",
            "event_location": "Lokasi",
            "ticket_type": "VIP",
            "ticket_price": 150000,
            "quantity": 2,
            "checked_in": false
          }
        ]
      }
    ]
  }
  ```
- **401 Unauthorized** – Token tidak ada/invalid.
- **500 Internal Server Error** – Error server.

---

## Ringkasan HTTP Code dan Kegunaannya
- **200 OK**: Request berhasil diproses (GET/PUT/DELETE yang sukses).
- **201 Created**: Resource berhasil dibuat (POST create). Menandakan data baru tersimpan.
- **400 Bad Request**: Input/payload tidak valid. Menjaga integritas data sebelum diproses.
- **401 Unauthorized**: Autentikasi gagal/tidak ada token. Melindungi endpoint privat.
- **403 Forbidden**: Autentikasi valid tetapi tidak punya akses. Kontrol otorisasi (role/owner).
- **404 Not Found**: Resource tidak ditemukan. Menghindari operasi pada data yang tidak ada.
- **409 Conflict**: Konflik data (mis. email sudah dipakai atau stok tiket kurang).
- **500 Internal Server Error**: Kesalahan server yang tidak terduga.
