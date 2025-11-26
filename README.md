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

Основные эндпоинты для работы с элементами (`items`):

| Метод | URL | Описание | Параметры | Пример запроса | Пример ответа |
|-------|-----|----------|-----------|----------------|---------------|
| GET | `/items` | Получение элементов с пагинацией | `limit` и `offset` (query) | `http://localhost:3000/items?limit=100&offset=50` | `[ { "id": 51, "name": "Item 51", ... }, ... ]` |
| GET | `/items/count` | Возвращает общее количество элементов в базе | — | `http://localhost:3000/items/count` | `{ "count": 50000 }` |
| GET | `/items/:id` | Получение элемента по `id` | `id` (path) | ` http://localhost:3000/items/123` | `{ "id": 123, "name": "Item 123", ... }` |
| GET | `/items/since/:sinceId` | Получение элемента начиная с `sinceId` | `sinceId` (path) | `http://localhost/api/items?limit=1&sinceId=43138` | `{ "id": 43138, "name": "Item 43138", "created_at": "2025-11-25T06:21:35.804Z" }` |

> ⚠️ Все запросы работают через базовый URL бэкенда, который в dev режиме: `http://localhost:3000`, в prod через Nginx `/api`.

