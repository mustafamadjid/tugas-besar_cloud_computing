import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 3 },
    { duration: "1m", target: 3 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.02"], // error < 2%
    http_req_duration: ["p(95)<1500"], // p95 < 1.5 detik
  },
};

const BASE_URL = __ENV.BASE_URL;
const TOKEN = __ENV.TOKEN;

// Isi dengan kombinasi event_id + ticket_type yang BENAR-BENAR ADA di tabel tickets kamu
// Kalau salah satu kombinasi tidak ada, controller akan return 404.
const VALID_TICKETS = [
  { event_id: 1, ticket_type: "Reguler" },
  { event_id: 2, ticket_type: "VIP" },
];

export default function () {
  // Pilih tiket valid secara random biar load realistis
  const t = VALID_TICKETS[Math.floor(Math.random() * VALID_TICKETS.length)];

  const body = {
    payment_method: "MANUAL", // wajib. ganti sesuai enum kamu: "TRANSFER", "EWALLET", dll
    items: [
      {
        event_id: t.event_id,
        ticket_type: t.ticket_type,
        quantity: 1, // wajib > 0
      },
    ],
    // opsional; kalau mau boleh isi angka, atau hapus field ini
    total_price: null,
  };

  const payload = JSON.stringify(body);

  const params = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  };

  const res = http.post(`${BASE_URL}/api/buyer/order`, payload, params);
  console.log("STATUS =", res.status);
  console.log("BODY =", res.body);

  check(res, {
    "status 201": (r) => r.status === 201,
    "not 4xx/5xx": (r) => r.status < 400,
  });

  sleep(1);
}

// JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJtYWRqaWRtdXN0YWZhQGdtYWlsLmNvbSIsInJvbGUiOiJCVVlFUiIsImlhdCI6MTc2NTM3NzUyMiwiZXhwIjoxNzY1OTgyMzIyfQ.sa2TMiv3WT6i-l-tZ5LR002FsrgE177bRK3mKpRntes
