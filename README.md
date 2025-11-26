# Load Test Project

Проект для нагрузочного тестирования с фронтендом на Vue 3, бэкендом на NestJS и базой данных PostgreSQL.

## [О проекте](ABOUT.md#о-проекте)

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

В Prod-режиме через Nginx: `http://localhost/api`

### Эндпоинты

Проект использует NestJS + PostgreSQL. Ниже приведены основные эндпоинты для работы с элементами (`items`):

| Метод | URL | Описание | Параметры | Пример запроса | Пример ответа |
|-------|-----|----------|-----------|----------------|---------------|
| GET | `/items/count` | Возвращает общее количество элементов в базе | — | `curl http://localhost:3000/items/count` | `{ "count": 50000 }` |
| GET | `/items/:id` | Получение элемента по `id` | `id` (path) | `curl http://localhost:3000/items/123` | `{ "id": 123, "name": "Item 123", "description": "..." }` |
| GET | `/items/since/:sinceId` | Получение элемента начиная с `sinceId` | `sinceId` (path) | `curl http://localhost:3000/items/since/120` | `{ "id": 121, "name": "Item 121", "description": "..." }` |

> ⚠️ Все запросы работают через базовый URL бэкенда, который в dev режиме: `http://localhost:3000`, в prod через Nginx `/api`.

