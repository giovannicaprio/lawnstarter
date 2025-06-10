# SWStarter - Star Wars Search App

A fullstack Star Wars search application with a modern, responsive UI and a high-performance backend proxy.

## Features

- **Frontend:** React + TypeScript
  - Responsive layout: mobile (single card) and desktop (side-by-side cards)
  - Instant search: results update as you type (2+ characters)
  - Modern, clean UI styled for both mobile and desktop

- **Backend:** Laravel (PHP)
  - Acts as a proxy to the [Star Wars API (SWAPI)](https://swapi.dev/)
  - **Caching:** All SWAPI responses are cached for 5 minutes for fast repeated queries
  - **Filtering:** Search endpoints filter by name (people) or title (movies) using the `q` parameter (case-insensitive, partial match)
  - Fetches and filters the entire SWAPI dataset, not just the first page
  - Stateless: no database required

## How to Run (with Docker)

1. **Build and start all services:**
   ```bash
   docker compose up --build -d
   ```
2. **Access the app:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000/api/star-wars/characters/search?q=luke](http://localhost:8000/api/star-wars/characters/search?q=luke)

## Example Endpoints

- `GET /api/star-wars/characters/search?q=...` — Search people by name
- `GET /api/star-wars/movies/search?q=...` — Search movies by title
- `GET /api/star-wars/characters/{id}` — Get person details
- `GET /api/star-wars/movies/{id}` — Get movie details

## Notes
- No database or persistent storage is required.
- The backend only proxies and filters SWAPI data, returning results quickly thanks to caching.
- The frontend never calls SWAPI directly, only the backend API.

## Q&A Folder

This project includes a `q&a` folder containing answers and explanations in a different format, intended for appreciation and review purposes. You can refer to this folder to understand design decisions, implementation details, and reasoning behind key features.

---

Made with ❤️ for the LawnStarter challenge. 