# SmartQueue — Setup guide

This guide walks you through preparing your machine, configuring the database, and running **backend (BE)** and **frontend (FE)**.

---

## 1. Prerequisites

| Tool | Recommended | Notes |
|------|-------------|--------|
| **JDK** | 17+ | Must match `java.version` in `BE/pom.xml`. |
| **Maven** | 3.9+ | Optional; the repo includes **Maven Wrapper** (`mvnw` / `mvnw.cmd`). |
| **Node.js** | 18 LTS or 20 LTS | For the React app in `FE/`. |
| **npm** | Comes with Node | Used for `npm install` / `npm start`. |
| **MySQL** | 8.x | Server must accept TCP connections (default port **3306**). |

---

## 2. Clone the repository

```bash
git clone https://github.com/AmineGR03/SmartQueue.git
cd SmartQueue
```

---

## 3. Database

### 3.1 Create database and user (example)

Log into MySQL as an admin user, then:

```sql
CREATE DATABASE smartqueue CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'smartqueue_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON smartqueue.* TO 'smartqueue_user'@'localhost';
FLUSH PRIVILEGES;
```

You can also use the `root` user for local development only.

### 3.2 Configure Spring Boot

Edit **`BE/src/main/resources/application.properties`** (or use environment-specific profiles):

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smartqueue
spring.datasource.username=root
spring.datasource.password=

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

jwt.secret=<use-a-long-random-secret-at-least-256-bits-for-hs256>
jwt.expiration-ms=86400000
```

* **`ddl-auto=update`** lets Hibernate create/update tables from JPA entities. For production, prefer explicit migrations (Flyway/Liquibase) instead of `update`.

---

## 4. Backend (BE)

### 4.1 Run

**Windows (PowerShell or CMD):**

```bat
cd BE
mvnw.cmd spring-boot:run
```

**Linux / macOS:**

```bash
cd BE
chmod +x mvnw
./mvnw spring-boot:run
```

Default API base URL: **http://localhost:8080**.

### 4.2 Verify

* Application starts without errors.
* Health: Spring Boot Actuator may expose endpoints under `/actuator` depending on configuration (see parent POM defaults).

### 4.3 Lombok (IntelliJ / Eclipse)

If the IDE shows errors on `@Builder`, `@Data`, etc., enable:

* **Annotation processing**
* **Lombok plugin** (IntelliJ)

See **[explain.md](explain.md)** § Build and tooling.

---

## 5. Frontend (FE)

### 5.1 Environment

Copy or create **`FE/.env.development`**:

```properties
REACT_APP_API_URL=http://localhost:8080
REACT_APP_WS_URL=ws://localhost:8080
```

CRA only exposes variables prefixed with **`REACT_APP_`**.

### 5.2 Install and run

```bash
cd FE
npm install
npm start
```

The dev server defaults to **http://localhost:3000**, which matches backend **CORS** allowed origins.

### 5.3 Production build

```bash
cd FE
npm run build
```

Static output is under `FE/build/`. Serve it with any static host or put it behind nginx; configure `REACT_APP_API_URL` at build time for the real API URL.

---

## 6. Run order

1. **MySQL** running with database `smartqueue`.
2. **Backend** on port **8080**.
3. **Frontend** on port **3000** (optional for API-only testing).

---

## 7. Roles and testing

Registration creates users with role **USER** by default. To use **AGENT** or **ADMIN** features in the UI/API, assign roles in the database (table `users` / `roles`), for example by updating `role_id` to the row whose name is `AGENT` or `ADMIN`.

Initial roles are typically seeded by **`DataInitializer`** on startup (`RoleName` enum: `USER`, `AGENT`, `ADMIN`).

---

## 8. Ports reference

| Service | Port |
|---------|------|
| Spring Boot HTTP | 8080 |
| React dev server | 3000 |
| MySQL | 3306 |
| WebSocket STOMP endpoint | same host as API, path `/ws-queue` |

---

## 9. Common issues

| Symptom | Check |
|---------|--------|
| `Communications link failure` | MySQL running? URL / credentials correct? |
| CORS errors in browser | Frontend origin must be allowed in backend CORS config; use `http://localhost:3000`. |
| 401 on API calls | JWT missing/expired; login again; `Authorization: Bearer <token>`. |
| 403 on ticket actions | User must have **AGENT** or **ADMIN** role. |
| Maven compile: Lombok errors | `maven-compiler-plugin` annotation processor path includes `lombok` with `${lombok.version}`. Run `./mvnw clean compile`. |
| WebSocket disconnects | Firewall; correct `REACT_APP_WS_URL`; STOMP endpoint `/ws-queue` allowed in security config. |

For architecture and code-level troubleshooting, use **[explain.md](explain.md)** (English) or **[explain.fr.md](explain.fr.md)** (French).
