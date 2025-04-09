import http from 'k6/http';
import { check, sleep } from 'k6';

// Конфигурация теста
export const options = {
    stages: [
        { duration: '30s', target: 50 },   // Плавный рост до 50 пользователей
        { duration: '1m', target: 100 },   // Удержание 100 пользователей
        { duration: '20s', target: 0 },    // Плавное завершение
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% запросов должны быть быстрее 500мс
        http_req_failed: ['rate<0.01'],   // Менее 1% ошибок
    },
};

// Тестовый сценарий
export default function () {
    // 1. Открытие главной страницы
    const homeRes = http.get('https://lms.innowise.com');
    check(homeRes, { 'Homepage loaded': (r) => r.status === 200 });

    // 2. Логин пользователя
    const loginRes = http.post('https://lms.innowise.com/login', {
        username: 'test_user',
        password: '123456',
    });
    check(loginRes, { 'Login successful': (r) => r.json('token') !== null });

    // 3. Поиск товара
    const searchRes = http.get('https://lms.innowise.com/materials/courses/d024c192-519b-49a2-b454-ae4f453b56b9');
    check(searchRes, { 'Search results valid': (r) => r.status === 200 });

    // 4. Пауза между действиями (имитация поведения пользователя)
    sleep(1);
}