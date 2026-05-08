# 📌 SmartQueue

## 🧠 Description du projet

SmartQueue est une application web de gestion intelligente des files d’attente et des rendez-vous pour les administrations.

Elle permet de :

* gérer les tickets de file d’attente en temps réel,
* organiser les rendez-vous des usagers,
* gérer les services administratifs,
* assigner des agents aux tickets,
* notifier les utilisateurs,
* centraliser et automatiser le flux des usagers.

Projet académique (PFA) basé sur :

* Backend : Spring Boot
* Frontend : React
* Base de données : MySQL
* Sécurité : Spring Security + JWT

---

## ⚙️ Architecture du projet

```
SmartQueue/
│
├── BE/ (Backend Spring Boot)
│   ├── controller/
│   ├── service/
│   ├── service/impl/
│   ├── repository/
│   ├── entity/
│   ├── security/
│   ├── config/
│   └── dto/
│
├── FE/ (Frontend React)
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── services/
│
└── README.md
```

---

## 🧱 Backend (Spring Boot)

### ✔️ Fonctionnalités implémentées

* Gestion des utilisateurs
* Authentification JWT (login/register)
* Gestion des rôles (USER / ADMIN / AGENT)
* Gestion des tickets
* Gestion des services
* Gestion des rendez-vous
* Gestion des notifications
* Architecture en couches propre

---

## 🔐 Sécurité

* Spring Security configuré
* Authentification via JWT
* BCrypt password encoder
* Endpoints protégés

---

## 🎫 Modules Backend

### Users

* CRUD utilisateurs
* association avec rôles

### Tickets

* création ticket
* appel prochain ticket
* clôture ticket
* suivi statut

### Services

* gestion des services administratifs

### Appointments

* prise de rendez-vous
* annulation

### Notifications

* notifications utilisateurs

---

## 🧪 API principales

### Auth

```
POST /api/auth/register
POST /api/auth/login
```

### Tickets

```
POST /api/tickets
GET /api/tickets
PUT /api/tickets/call-next
PUT /api/tickets/complete/{id}
```

### Users

```
GET /api/users
GET /api/users/{id}
DELETE /api/users/{id}
```

---

## 🗄️ Base de données

* MySQL
* Hibernate ORM
* Génération automatique des tables (JPA)

### Configuration

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smartqueue
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

## 🚀 Installation & exécution

### 1. Cloner le projet

```
git clone https://github.com/AmineGR03/SmartQueue.git
```

### 2. Backend

```
cd BE
./mvnw spring-boot:run
```

### 3. Frontend

```
cd FE
npm install
npm start
```

---

## 📌 Tâches réalisées

* [x] Setup Spring Boot
* [x] Entities JPA
* [x] Relations DB
* [x] Repositories
* [x] JWT Authentication
* [x] Auth system
* [x] Ticket system
* [x] Services & Appointments
* [x] Controllers & Services

---

## 🧭 Tâches restantes

* [ ] Role-based access control
* [ ] React frontend integration
* [ ] Admin dashboard
* [ ] Agent dashboard
* [ ] WebSocket real-time queue
* [ ] UI/UX improvements
* [ ] Tests unitaires

---

## 🔄 Historique des versions

### v1.0

* Initial backend setup

### v1.1

* Entities + DB configuration

### v1.2

* JWT authentication

### v1.3

* Business logic (tickets, services, appointments)

---

## 👨‍💻 Auteur

Projet PFA réalisé par Amine Gourari

---

## ⚠️ Note

Ce README doit être mis à jour à chaque évolution du projet.
