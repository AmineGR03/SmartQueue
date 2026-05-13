# SmartQueue Backend - Quick Reference Guide

## API Base URL
```
http://localhost:8080
```

## Authentication
All endpoints except auth/register, auth/login, and /ws-queue/* require JWT token:
```
Header: Authorization: Bearer {jwt_token}
```

---

## REST API Quick Reference

### Auth Endpoints
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
GET    /api/auth/me                - Get current user profile
```

### User Endpoints
```
GET    /api/users                  - List all users
GET    /api/users/{id}             - Get user by ID
DELETE /api/users/{id}             - Delete user
```

### Ticket Endpoints
```
POST   /api/tickets?userId=X&serviceId=Y   - Create ticket
GET    /api/tickets                        - Get all tickets
PUT    /api/tickets/call-next              - Call next ticket (ADMIN/AGENT)
PUT    /api/tickets/complete/{id}          - Complete ticket (ADMIN/AGENT)
```

### Service Endpoints
```
POST   /api/services         - Create service
GET    /api/services         - List all services
GET    /api/services/{id}    - Get service by ID
DELETE /api/services/{id}    - Delete service
```

### Appointment Endpoints
```
POST   /api/appointments           - Create appointment
GET    /api/appointments           - List all appointments
DELETE /api/appointments/{id}      - Cancel appointment
```

### Notification Endpoints
```
GET    /api/notifications/{userId}    - Get user notifications
POST   /api/notifications             - Create notification
```

### Admin Endpoints
```
GET    /api/admin/health    - Health check (ADMIN only)
```

---

## Data Models (Quick Reference)

### User
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "enabled": true,
  "createdAt": "2024-05-13T15:30:00",
  "role": { "id": 1, "name": "USER" }
}
```

### Ticket
```json
{
  "id": 1,
  "number": "T-1715610000000",
  "status": "WAITING",
  "createdAt": "2024-05-13T15:30:00",
  "calledAt": null,
  "completedAt": null,
  "priority": false,
  "user": { "id": 1 },
  "service": { "id": 1 },
  "counter": null,
  "agent": null
}
```

**Ticket Status Lifecycle:**
- `WAITING` → `CALLED` → `COMPLETED` (or `CANCELLED`)

### ServiceEntity
```json
{
  "id": 1,
  "name": "Document Processing",
  "description": "Process documents",
  "averageDuration": 15,
  "active": true
}
```

### Appointment
```json
{
  "id": 1,
  "appointmentDate": "2024-05-20T10:30:00",
  "status": "PENDING",
  "notes": "Important appointment",
  "createdAt": "2024-05-13T15:30:00",
  "user": { "id": 1 },
  "service": { "id": 1 }
}
```

**Appointment Status:** `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`

### Notification
```json
{
  "id": 1,
  "message": "Your ticket has been called",
  "read": false,
  "type": "INFO",
  "createdAt": "2024-05-13T15:30:00"
}
```

**Notification Types:** `INFO`, `WARNING`, `SUCCESS`

---

## User Roles & Permissions

| Role | Can Create Tickets | Can Call Next | Can Complete | Can Access Admin |
|---|---|---|---|---|
| USER | ✅ | ❌ | ❌ | ❌ |
| AGENT | ✅ | ✅ | ✅ | ❌ |
| ADMIN | ✅ | ✅ | ✅ | ✅ |

---

## WebSocket Integration

### Connection
```javascript
// JavaScript
const socket = new WebSocket('ws://localhost:8080/ws-queue');
const stompClient = Stomp.over(socket);
stompClient.connect({}, function(frame) {
  stompClient.subscribe('/topic/tickets', function(message) {
    const ticket = JSON.parse(message.body);
    console.log('Ticket updated:', ticket);
  });
});
```

### Real-time Events
- Ticket created
- Ticket called
- Ticket completed

### Message Format
```json
{
  "ticketId": 1,
  "number": "T-1715610000000",
  "status": "CALLED",
  "serviceId": 1
}
```

---

## Common Request/Response Examples

### Register User
**Request:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login
**Request:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Create Ticket
**Request:**
```bash
POST /api/tickets?userId=1&serviceId=1
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": 1,
  "number": "T-1715610000000",
  "status": "WAITING",
  "createdAt": "2024-05-13T15:30:00",
  "user": { "id": 1 },
  "service": { "id": 1 }
}
```

### Call Next Ticket
**Request:**
```bash
PUT /api/tickets/call-next
Authorization: Bearer {admin_or_agent_token}
```

**Response:**
```json
{
  "id": 1,
  "number": "T-1715610000000",
  "status": "CALLED",
  "createdAt": "2024-05-13T15:30:00",
  "calledAt": "2024-05-13T15:32:00",
  "user": { "id": 1 },
  "service": { "id": 1 }
}
```

### Complete Ticket
**Request:**
```bash
PUT /api/tickets/complete/1
Authorization: Bearer {admin_or_agent_token}
```

**Response:**
```json
{
  "id": 1,
  "number": "T-1715610000000",
  "status": "COMPLETED",
  "createdAt": "2024-05-13T15:30:00",
  "calledAt": "2024-05-13T15:32:00",
  "completedAt": "2024-05-13T15:35:00",
  "user": { "id": 1 },
  "service": { "id": 1 }
}
```

---

## Error Handling

### Current Implementation
- Services throw `RuntimeException` for errors
- Consider implementing proper error responses:
  - 400 Bad Request
  - 401 Unauthorized
  - 403 Forbidden
  - 404 Not Found
  - 500 Internal Server Error

### Common Errors
- User not found
- Service not found
- No tickets waiting (when calling next)
- Invalid credentials
- Expired JWT token

---

## Database Tables

| Table | Purpose |
|---|---|
| users | Store user accounts |
| roles | Define user roles (ADMIN, AGENT, USER) |
| tickets | Queue management |
| services | Available services |
| appointments | Appointment bookings |
| notifications | User notifications |
| counters | Service counters |

---

## Key Features

✅ **Queue Management** - Create, track, and manage tickets  
✅ **Real-time Updates** - WebSocket for live ticket status  
✅ **Role-Based Access** - USER, AGENT, ADMIN roles  
✅ **Appointments** - Schedule appointments for services  
✅ **JWT Security** - Token-based authentication (24h expiration)  
✅ **Notifications** - Real-time user notifications  
✅ **Password Hashing** - BCrypt encryption  

---

## Testing Quick Commands

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "Test123!",
    "phone": "+1234567890"
  }'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Test123!"
  }'

# Create Service (with token)
curl -X POST http://localhost:8080/api/services \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Document Processing",
    "description": "Process your documents",
    "averageDuration": 15,
    "active": true
  }'

# Create Ticket
curl -X POST "http://localhost:8080/api/tickets?userId=1&serviceId=1" \
  -H "Authorization: Bearer {token}"

# Get All Tickets
curl -X GET http://localhost:8080/api/tickets \
  -H "Authorization: Bearer {token}"

# Call Next Ticket (Agent/Admin only)
curl -X PUT http://localhost:8080/api/tickets/call-next \
  -H "Authorization: Bearer {agent_token}"

# Complete Ticket (Agent/Admin only)
curl -X PUT http://localhost:8080/api/tickets/complete/1 \
  -H "Authorization: Bearer {agent_token}"
```

---

**Last Updated:** May 13, 2026  
**Version:** 1.0 - Initial Analysis

