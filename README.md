# Load Test Project

Проект для нагрузочного тестирования с фронтендом на Vue 3, бэкендом на NestJS и базой данных PostgreSQL.

## Структура проекта

- `backend/` — NestJS, PostgreSQL, Docker
- `frontend/` — Vue 3, Vite, Web Workers для стресс-тестов
- `docker-compose.yml` — сборка всего проекта в dev и prod

## Как запускать

### Dev

`docker-compose -f docker-compose.dev.yml up --build`

### Prod
`docker-compose -f docker-compose.prod.yml up --build`

## Доступ к приложению

### Фронтенд:
В браузере открыть: `http://localhost`

Dev-режим (Vite): `http://localhost:5173`

Prod-режим (Nginx): `http://localhost`

### Бэкенд (API):

В Dev-режиме: `http://localhost:3000`

В Prod-режиме через Nginx: `http://localhost/api` (если настроен прокси)
