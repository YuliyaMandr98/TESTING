import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 10,          // Виртуальные пользователи
    duration: '30s',  // Длительность теста
};

export default function () {
    const res = http.get('https://test.k6.io');
    check(res, { 'status was 200': (r) => r.status == 200 });
    sleep(1);
}