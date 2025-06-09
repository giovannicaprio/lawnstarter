# SWStarter - Star Wars Search App

## Descrição

Este projeto é uma aplicação fullstack para busca de personagens e filmes do universo Star Wars, utilizando a [Star Wars API (SWAPI)](https://swapi.dev/). O backend PHP/Laravel serve apenas como proxy entre o frontend React e a API externa, seguindo as melhores práticas para esse tipo de arquitetura.

## Estrutura
- **Frontend:** React + TypeScript (pasta `frontend/`)
- **Backend:** Laravel (pasta `backend/`)
- **Banco de dados:** Não utilizado (backend é stateless)
- **Docker:** Orquestra frontend, backend e banco (MySQL, apenas para compatibilidade, não é usado)

## Como rodar o projeto

### Pré-requisitos
- Docker e Docker Compose instalados

### Passos
1. **Build e start dos containers:**
   ```bash
   docker compose up --build -d
   ```
2. **Acesse o frontend:**
   - [http://localhost:3000](http://localhost:3000)
3. **Acesse o backend (API):**
   - [http://localhost:8000/api/star-wars/characters/search?q=luke](http://localhost:8000/api/star-wars/characters/search?q=luke)
   - [http://localhost:8000/api/star-wars/movies/search?q=hope](http://localhost:8000/api/star-wars/movies/search?q=hope)

## Endpoints disponíveis

- `GET /api/star-wars/characters/search?q=...` — Busca personagens na SWAPI
- `GET /api/star-wars/movies/search?q=...` — Busca filmes na SWAPI

O backend apenas repassa a requisição para a SWAPI e retorna o JSON puro.

## Observações
- Não há persistência de dados, estatísticas ou cache no backend.
- O backend não depende do banco de dados para funcionar.
- O frontend consome apenas os endpoints do backend, nunca acessa a SWAPI diretamente.

## Customização
Se quiser adicionar endpoints para detalhes de personagem ou filme, basta criar novos métodos no controller que façam proxy para os endpoints correspondentes da SWAPI.

---

Feito com ❤️ para o desafio LawnStarter. 