# Fitness Member Management Mini‑MVP

## Prerequisites

- Node.js 20+
- npm (or yarn)
- Docker + Docker Compose

## Local Setup

### 1) Start Postgres (Docker)

From the repo root:

```bash
docker compose up -d
```

This starts Postgres on `localhost:5432`.

### 2) Backend setup

From the repo root:

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with your database URL. Example:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fitness"
```

Run migrations and seed data:

```bash
npm run migrate
npm run seed
```

Start the API:

```bash
npm run dev
```

The API runs on `http://localhost:3000`.

### 3) Frontend setup

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The UI runs on `http://localhost:5173` and proxies `/api` to the backend.

## Running tests (optional)

Backend:

```bash
cd backend
npm test
```

Frontend:

```bash
cd frontend
npm test
```

## Notes

- If your local Postgres user is different, update `DATABASE_URL` accordingly.
- The seed inserts 3 membership plans.
