import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 5 }, // naik ke 5 virtual users
    { duration: "1m", target: 5 }, // tahan 1 menit
    { duration: "30s", target: 0 }, // turun lagi
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"], // error < 1%
    http_req_duration: ["p(95)<1000"], // p95 < 1 detik
  },
};

const BASE_URL = __ENV.BASE_URL;

export default function () {
  const res = http.get(`${BASE_URL}/api/events`);

  check(res, {
    "status 200": (r) => r.status === 200,
  });

  sleep(1); // jeda 1 detik sebelum loop berikutnya
}

// https://tugas-besar-cloud-computing-214039153352.asia-southeast2.run.app
