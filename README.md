# Star Wars API Application

This is a full-stack application that interacts with the Star Wars API, built with React and Laravel.

## Prerequisites

- Docker
- Docker Compose

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Start the application:
```bash
docker-compose up -d
```

This will start:
- Frontend (React) on http://localhost:3000
- Backend (Laravel) on http://localhost:8000
- MySQL database on port 3306

## Development

### Frontend
The frontend is a React application with TypeScript. The source code is located in the `frontend` directory.

### Backend
The backend is a Laravel application. The source code is located in the `backend` directory.

## API Endpoints

The backend provides the following endpoints:

- `GET /api/characters` - Get Star Wars characters
- `GET /api/statistics` - Get search statistics

## Statistics

The application maintains statistics about previous queries, which are recomputed every 5 minutes. The statistics include:
- Top five queries with percentages
- Average length of request timing
- Most popular hour of day for overall search volume

## Stopping the Application

To stop the application:
```bash
docker-compose down
```

To stop and remove all data (including the database):
```bash
docker-compose down -v
``` 