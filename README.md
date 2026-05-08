# SmartQueue

**SmartQueue** is a web application for managing waiting queues and appointments in administrative settings. It pairs a **Spring Boot** REST API with a **React** SPA, secured with **JWT** and backed by **MySQL**.

---

## Documentation

| Document | Purpose |
|----------|---------|
| **[setup.md](setup.md)** | Prerequisites, environment variables, database, and step-by-step run instructions for backend and frontend. |
| **[explain.md](explain.md)** | In-depth technical guide (English): technologies, patterns (DTOs, layers, security), and a walkthrough of **every major folder and source file** in the repository. |
| **[explain.fr.md](explain.fr.md)** | Même guide, **version française** — glossaire, flux, index des fichiers source. |

---

## What it does

* Queue tickets in real time (with WebSocket/STOMP updates).
* Book and cancel appointments.
* Manage administrative **services** (service types / counters).
* Role-based access: **USER**, **AGENT**, **ADMIN**.
* JWT authentication; optional WebSocket subscription to `/topic/tickets`.

---

## Tech stack (summary)

| Layer | Technology |
|--------|------------|
| Backend | Java **17**, **Spring Boot 4.x**, Spring Web MVC, Spring Data JPA, Spring Security, WebSocket/STOMP |
| Frontend | **React** (Create React App), **React Router** v6, **Axios**, **@stomp/stompjs** |
| Database | **MySQL** |
| Security | **JWT** (JJWT), **BCrypt**, role-based HTTP authorization |
| Build | **Maven** (backend), **npm** (frontend) |

---

## Repository layout

```
SmartQueue/
├── BE/                 # Spring Boot backend (Maven)
├── FE/                 # React frontend (npm)
├── README.md           # This file
├── setup.md            # Installation & run guide
├── explain.md          # Full technical deep-dive (EN)
├── explain.fr.md       # Same (FR)
```

---

## Quick start

1. Create MySQL database `smartqueue` and configure `BE/src/main/resources/application.properties`.
2. Start the API: `cd BE` → `mvnw.cmd spring-boot:run` (Windows) or `./mvnw spring-boot:run` (Unix).
3. Start the UI: `cd FE` → `npm install` → `npm start` → [http://localhost:3000](http://localhost:3000).

**Details:** see **[setup.md](setup.md)**.

---

## API & security (high level)

* **Public:** `POST /api/auth/register`, `POST /api/auth/login`, WebSocket handshake `/ws-queue/**`.
* **Authenticated:** Most `/api/**` routes (Bearer JWT).
* **AGENT / ADMIN:** `PUT /api/tickets/call-next`, `PUT /api/tickets/complete/**`.
* **ADMIN:** `/api/admin/**`.

Full endpoint list and behaviour: **[explain.md](explain.md)** (or **[explain.fr.md](explain.fr.md)**) § REST API and § Security.

---

## Author

Academic project (PFA) — Amine Gourari.

---

## Note

Keep **README.md**, **setup.md**, **explain.md**, and **explain.fr.md** updated when the codebase changes.
