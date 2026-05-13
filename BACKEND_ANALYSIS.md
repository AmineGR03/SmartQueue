# SmartQueue Backend Analysis

**Project:** SmartQueue - Queue Management System  
**Technology Stack:** Spring Boot 4.0.6 (Java 17) | MySQL | JWT Authentication | WebSocket  
**Base URL:** `http://localhost:8080`

---

## Table of Contents
1. [REST API Endpoints](#rest-api-endpoints)
2. [Entity Models & Relationships](#entity-models--relationships)
3. [Data Transfer Objects (DTOs)](#data-transfer-objects-dtos)
4. [Service Layer](#service-layer)
5. [Security Configuration](#security-configuration)
6. [Exception Handling](#exception-handling)
7. [WebSocket Integration](#websocket-integration)
8. [Database Schema](#database-schema)

---

## REST API Endpoints

### 1. **Authentication Endpoints** (`/api/auth`)

| HTTP Method | Endpoint | Description | Auth Required | Request Body | Response |
|---|---|---|---|---|---|
| POST | `/api/auth/register` | User registration | ❌ No | `RegisterRequest` | `AuthResponse` (JWT token) |
| POST | `/api/auth/login` | User login | ❌ No | `LoginRequest` | `AuthResponse` (JWT token) |
| GET | `/api/auth/me` | Get current user profile | ✅ Yes | - | `User` object |

**RegisterRequest Fields:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "phone": "string"
}
```

**LoginRequest Fields:**
```json
{
  "email": "string",
  "password": "string"
}
```

**AuthResponse:**
```json
{
  "token": "JWT_TOKEN"
}
```

---

### 2. **User Management Endpoints** (`/api/users`)

| HTTP Method | Endpoint | Description | Auth Required | Role Required |
|---|---|---|---|---|
| GET | `/api/users` | Get all users | ✅ Yes | - |
| GET | `/api/users/{id}` | Get user by ID | ✅ Yes | - |
| DELETE | `/api/users/{id}` | Delete user | ✅ Yes | - |

---

### 3. **Ticket Management Endpoints** (`/api/tickets`)

| HTTP Method | Endpoint | Description | Auth Required | Role Required |
|---|---|---|---|---|
| POST | `/api/tickets?userId={id}&serviceId={id}` | Create ticket | ✅ Yes | - |
| GET | `/api/tickets` | Get all tickets | ✅ Yes | - |
| PUT | `/api/tickets/call-next` | Call next ticket in queue | ✅ Yes | ADMIN, AGENT |
| PUT | `/api/tickets/complete/{id}` | Mark ticket as completed | ✅ Yes | ADMIN, AGENT |

**Ticket Lifecycle:**
- Created → Status: `WAITING`
- Called by agent → Status: `CALLED`, `calledAt` timestamp set
- Completed → Status: `COMPLETED`, `completedAt` timestamp set
- Can be cancelled → Status: `CANCELLED`

---

### 4. **Service Management Endpoints** (`/api/services`)

| HTTP Method | Endpoint | Description | Auth Required | Role Required |
|---|---|---|---|---|
| POST | `/api/services` | Create new service | ✅ Yes | - |
| GET | `/api/services` | Get all services | ✅ Yes | - |
| GET | `/api/services/{id}` | Get service by ID | ✅ Yes | - |
| DELETE | `/api/services/{id}` | Delete service | ✅ Yes | - |

**ServiceEntity Request/Response:**
```json
{
  "id": 1,
  "name": "string",
  "description": "string",
  "averageDuration": 15,
  "active": true
}
```

---

### 5. **Appointment Management Endpoints** (`/api/appointments`)

| HTTP Method | Endpoint | Description | Auth Required | Role Required |
|---|---|---|---|---|
| POST | `/api/appointments` | Create appointment | ✅ Yes | - |
| GET | `/api/appointments` | Get all appointments | ✅ Yes | - |
| DELETE | `/api/appointments/{id}` | Cancel appointment | ✅ Yes | - |

**Appointment Request/Response:**
```json
{
  "id": 1,
  "appointmentDate": "2024-05-20T10:30:00",
  "status": "PENDING",
  "notes": "string",
  "createdAt": "2024-05-13T15:00:00",
  "user": { "id": 1, ... },
  "service": { "id": 1, ... }
}
```

**Appointment Status Values:**
- `PENDING` - Initial state
- `CONFIRMED` - Appointment confirmed
- `CANCELLED` - Appointment cancelled
- `COMPLETED` - Appointment completed

---

### 6. **Notification Endpoints** (`/api/notifications`)

| HTTP Method | Endpoint | Description | Auth Required | Role Required |
|---|---|---|---|---|
| GET | `/api/notifications/{userId}` | Get user notifications | ✅ Yes | - |
| POST | `/api/notifications` | Create notification | ✅ Yes | - |

**Notification Request/Response:**
```json
{
  "id": 1,
  "message": "string",
  "read": false,
  "type": "INFO",
  "createdAt": "2024-05-13T15:00:00",
  "user": { "id": 1 }
}
```

**Notification Types:**
- `INFO` - Information notification
- `WARNING` - Warning notification
- `SUCCESS` - Success notification

---

### 7. **Admin Endpoints** (`/api/admin`)

| HTTP Method | Endpoint | Description | Auth Required | Role Required |
|---|---|---|---|---|
| GET | `/api/admin/health` | Health check | ✅ Yes | ADMIN |

---

## Entity Models & Relationships

### Entity Diagram (Data Model)

```
┌─────────────────┐
│      User       │
├─────────────────┤
│ id (PK)         │◄──┐
│ firstName       │   │
│ lastName        │   │
│ email (UQ)      │   │
│ password        │   │
│ phone           │   │
│ enabled         │   │
│ createdAt       │   │
│ role_id (FK)    │───┼─→ Role
└─────────────────┘   │
        ▲ 1:N         │
        │             │
   ┌────┴────┬────────┘
   │         │
   │    ┌────▼──────────────┐
   │    │      Role         │
   │    ├───────────────────┤
   │    │ id (PK)           │
   │    │ name (ENUM)       │
   │    │ users (1:N)       │
   │    └───────────────────┘
   │
   ├──────────────────────────────────────┐
   │                                      │
   │  ┌──────────────────────┐     ┌──────▼──────────────┐
   │  │      Ticket          │     │  Appointment       │
   │  ├──────────────────────┤     ├────────────────────┤
   │  │ id (PK)              │     │ id (PK)            │
   │  │ number (UQ)          │     │ appointmentDate    │
   │  │ status (ENUM)        │     │ status (ENUM)      │
   │  │ createdAt            │     │ notes              │
   │  │ calledAt             │     │ createdAt          │
   │  │ completedAt          │     │ user_id (FK)───────┘
   │  │ priority             │     │ service_id (FK)─┐
   │  │ user_id (FK)──────┐  │     │                  │
   │  │ service_id (FK)─┐ │  │     └──────────────────┘
   │  │ counter_id (FK)─┼─┤  │           ▲
   │  │ agent_id (FK)───┤ │  │           │
   │  └──────────────────┘ │  │           │
   │                       │  │           │
   │  ┌──────────────────┐ │  │    ┌──────▼──────────────┐
   │  │  ServiceEntity   │◄┘  │    │   Notification    │
   │  ├──────────────────┤    │    ├───────────────────┤
   │  │ id (PK)          │    │    │ id (PK)           │
   │  │ name             │    │    │ message           │
   │  │ description      │    │    │ read              │
   │  │ averageDuration  │    │    │ type (ENUM)       │
   │  │ active           │    │    │ createdAt         │
   │  │ tickets (1:N)    │────┘    │ user_id (FK)──────┘
   │  │ appointments(1:N)│─────────┘
   │  └──────────────────┘
   │
   │  ┌──────────────────┐
   └─→│    Counter       │
      ├──────────────────┤
      │ id (PK)          │
      │ name             │
      │ number           │
      │ active           │
      │ tickets (1:N)    │
      └──────────────────┘
```

### Detailed Entity Definitions

#### **User**
```java
@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    @JsonIgnore
    private String password;
    
    private String phone;
    
    @Builder.Default
    private Boolean enabled = true;
    
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id")
    private Role role;
    
    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Ticket> tickets;
    
    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Appointment> appointments;
    
    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Notification> notifications;
}
```

**Relationships:**
- `role` - Many Users have One Role (ManyToOne)
- `tickets` - One User has Many Tickets (OneToMany)
- `appointments` - One User has Many Appointments (OneToMany)
- `notifications` - One User has Many Notifications (OneToMany)
- `agent` in Ticket - One User (Agent) can handle Many Tickets

#### **Ticket**
```java
@Entity
@Table(name = "tickets")
public class Ticket {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String number;  // Format: "T-" + System.currentTimeMillis()
    
    @Enumerated(EnumType.STRING)
    private TicketStatus status;  // WAITING, CALLED, IN_PROGRESS, COMPLETED, CANCELLED
    
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime calledAt;
    
    private LocalDateTime completedAt;
    
    @Builder.Default
    private Boolean priority = false;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;  // Ticket owner
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id")
    private ServiceEntity service;  // Service being queued for
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "counter_id")
    private Counter counter;  // Counter where ticket is being served
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id")
    private User agent;  // Agent handling the ticket
}
```

**Relationships:**
- `user` - Many Tickets belong to One User (ManyToOne)
- `service` - Many Tickets belong to One Service (ManyToOne)
- `counter` - Many Tickets can be served at One Counter (ManyToOne)
- `agent` - Tickets assigned to One Agent/User (ManyToOne)

#### **ServiceEntity**
```java
@Entity
@Table(name = "services")
public class ServiceEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    private String description;
    
    private Integer averageDuration;  // In minutes
    
    @Builder.Default
    private Boolean active = true;
    
    @OneToMany(mappedBy = "service")
    @JsonIgnore
    private List<Ticket> tickets;
    
    @OneToMany(mappedBy = "service")
    @JsonIgnore
    private List<Appointment> appointments;
}
```

**Relationships:**
- `tickets` - One Service has Many Tickets (OneToMany)
- `appointments` - One Service has Many Appointments (OneToMany)

#### **Appointment**
```java
@Entity
@Table(name = "appointments")
public class Appointment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private LocalDateTime appointmentDate;
    
    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;  // PENDING, CONFIRMED, CANCELLED, COMPLETED
    
    private String notes;
    
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id")
    private ServiceEntity service;
}
```

**Relationships:**
- `user` - Many Appointments belong to One User (ManyToOne)
- `service` - Many Appointments belong to One Service (ManyToOne)

#### **Notification**
```java
@Entity
@Table(name = "notifications")
public class Notification {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String message;
    
    @Builder.Default
    private Boolean read = false;
    
    @Enumerated(EnumType.STRING)
    private NotificationType type;  // INFO, WARNING, SUCCESS
    
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private User user;
}
```

**Relationships:**
- `user` - Many Notifications belong to One User (ManyToOne)

#### **Role**
```java
@Entity
@Table(name = "roles")
public class Role {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private RoleName name;  // ADMIN, AGENT, USER
    
    @OneToMany(mappedBy = "role")
    @JsonIgnore
    private List<User> users;
}
```

**Relationships:**
- `users` - One Role has Many Users (OneToMany)

#### **Counter**
```java
@Entity
@Table(name = "counters")
public class Counter {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    private Integer number;
    
    @Builder.Default
    private Boolean active = true;
    
    @OneToMany(mappedBy = "counter")
    private List<Ticket> tickets;
}
```

**Relationships:**
- `tickets` - One Counter serves Many Tickets (OneToMany)

---

## Data Transfer Objects (DTOs)

### Auth DTOs

#### **LoginRequest**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### **RegisterRequest**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "+1234567890"
}
```

#### **AuthResponse**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Ticket DTOs
- **TicketRequestDTO** - Empty (currently unused)
- **TicketResponseDTO** - Empty (currently unused)

### Other DTOs
- **AppointmentDTO** - Empty (currently unused)
- **LoginDTO** - Empty (currently unused)

---

## Service Layer

### 1. **AuthService** (Authentication & User Registration)

```java
public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    User getProfile(String email);
}
```

**Implementation: AuthServiceImpl**

**Key Operations:**

| Method | Description | Logic |
|---|---|---|
| `register(RegisterRequest)` | User registration | Creates new USER role user, encodes password with BCrypt, generates JWT token |
| `login(LoginRequest)` | User authentication | Authenticates credentials via AuthenticationManager, generates JWT token |
| `getProfile(String email)` | Fetch user profile | Returns user by email with role information (EntityGraph optimization) |

**Security Features:**
- Passwords encrypted with BCryptPasswordEncoder
- JWT token generated on successful login/registration
- JWT token includes user email as subject
- Configurable expiration (default: 86400000 ms = 24 hours)

---

### 2. **UserService** (User Management)

```java
public interface UserService {
    List<User> getAllUsers();
    User getUserById(Long id);
    void deleteUser(Long id);
}
```

**Implementation: UserServiceImpl**

| Method | Description |
|---|---|
| `getAllUsers()` | Returns all users with role information |
| `getUserById(Long id)` | Returns user by ID or throws RuntimeException |
| `deleteUser(Long id)` | Deletes user by ID |

---

### 3. **TicketService** (Queue Management)

```java
public interface TicketService {
    Ticket createTicket(Long userId, Long serviceId);
    List<Ticket> getAllTickets();
    Ticket callNextTicket();
    Ticket completeTicket(Long ticketId);
}
```

**Implementation: TicketServiceImpl**

| Method | Description | Business Logic |
|---|---|---|
| `createTicket(userId, serviceId)` | Creates new ticket | Generates unique ticket number (T-{timestamp}), sets status to WAITING, broadcasts via WebSocket |
| `getAllTickets()` | Returns all tickets | Fetches from repository |
| `callNextTicket()` | Calls next in queue | Gets first WAITING ticket ordered by creation time, updates status to CALLED, sets calledAt timestamp, broadcasts |
| `completeTicket(Long id)` | Marks ticket complete | Sets status to COMPLETED, sets completedAt timestamp, broadcasts |

**WebSocket Broadcasting:**
- Publishes to `/topic/tickets` on every ticket state change
- Payload includes: ticketId, number, status, serviceId

---

### 4. **AppointmentService** (Appointment Management)

```java
public interface AppointmentService {
    Appointment create(Appointment appointment);
    List<Appointment> getAll();
    void cancel(Long id);
}
```

**Implementation: AppointmentServiceImpl**

| Method | Description |
|---|---|
| `create(Appointment)` | Saves appointment to repository |
| `getAll()` | Returns all appointments |
| `cancel(Long id)` | Deletes appointment by ID |

---

### 5. **ServiceEntityService** (Service Management)

```java
public interface ServiceEntityService {
    ServiceEntity create(ServiceEntity service);
    List<ServiceEntity> getAll();
    ServiceEntity getById(Long id);
    void delete(Long id);
}
```

**Implementation: ServiceEntityServiceImpl**

| Method | Description |
|---|---|
| `create(ServiceEntity)` | Creates new service (default active = true) |
| `getAll()` | Returns all services |
| `getById(Long id)` | Returns service by ID or throws RuntimeException |
| `delete(Long id)` | Deletes service by ID |

---

### 6. **NotificationService** (Notification Management)

```java
public interface NotificationService {
    List<Notification> getUserNotifications(Long userId);
    Notification create(Notification notification);
}
```

**Implementation: NotificationServiceImpl**

| Method | Description |
|---|---|
| `getUserNotifications(Long userId)` | Returns all notifications for a user |
| `create(Notification)` | Creates new notification (default read = false) |

---

## Security Configuration

### Overview
- **Authentication:** JWT (JSON Web Tokens)
- **Encryption:** BCrypt for passwords
- **Framework:** Spring Security 6.x
- **Session Management:** Stateless (JWT-based)

### Security Configuration

```java
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers(HttpMethod.POST, 
                    "/api/auth/register",
                    "/api/auth/login"
                ).permitAll()
                
                // WebSocket endpoint
                .requestMatchers("/ws-queue/**").permitAll()
                
                // Admin only endpoints
                .requestMatchers("/api/admin/**")
                .hasRole("ADMIN")
                
                // Agent/Admin can call next ticket
                .requestMatchers(HttpMethod.PUT, "/api/tickets/call-next")
                .hasAnyRole("ADMIN", "AGENT")
                
                // Agent/Admin can complete tickets
                .requestMatchers(HttpMethod.PUT, "/api/tickets/complete/**")
                .hasAnyRole("ADMIN", "AGENT")
                
                // All other endpoints require authentication
                .anyRequest()
                .authenticated()
            )
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
```

### JWT Token Management

**JwtService:**
```java
@Service
public class JwtService {
    
    @Value("${jwt.secret}")
    private String secretKey;
    
    @Value("${jwt.expiration-ms}")
    private long expirationMs;
    
    // Generate token with HS256 algorithm
    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
            .setSubject(userDetails.getUsername())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
    }
    
    // Extract username from token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    
    // Validate token against user
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername());
    }
}
```

**Configuration (application.properties):**
```properties
jwt.secret=mySuperSecretKeymySuperSecretKeymySuperSecretKey12
jwt.expiration-ms=86400000  # 24 hours
```

### JWT Filter

**JwtAuthenticationFilter:**
```java
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        
        final String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        final String jwt = authHeader.substring(7);
        final String userEmail = jwtService.extractUsername(jwt);
        
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
            
            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                    );
                
                authToken.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
                );
                
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
```

### User Details Service

**CustomUserDetailsService:**
```java
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    
    private final UserRepository userRepository;
    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        return new org.springframework.security.core.userdetails.User(
            user.getEmail(),
            user.getPassword(),
            List.of(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().getName().name())
            )
        );
    }
}
```

### CORS Configuration

**WebSocket CORS:**
- Allowed Origins:
  - `http://localhost:3000`
  - `http://127.0.0.1:3000`
  - `http://localhost:5173`
  - `http://127.0.0.1:5173`

---

## Exception Handling

### Exception Classes (Placeholder Structure)

| Exception | Status | Purpose |
|---|---|---|
| `ResourceNotFoundException` | 404 | Thrown when entity not found |
| `BadRequestException` | 400 | Thrown for invalid request data |
| `GlobalExceptionHandler` | N/A | Central exception handler (currently empty) |

**Note:** Exception handlers are defined but contain no implementation. Currently, `RuntimeException` is thrown from services for error conditions.

### Recommended Exception Handling Implementation

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(
            ResourceNotFoundException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse("RESOURCE_NOT_FOUND", ex.getMessage()));
    }
    
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(
            BadRequestException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ErrorResponse("BAD_REQUEST", ex.getMessage()));
    }
}
```

---

## WebSocket Integration

### Configuration

**WebSocketConfig:**
```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    public static final String TICKET_TOPIC = "/topic/tickets";
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
    }
    
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-queue")
            .setAllowedOriginPatterns(
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "http://localhost:5173",
                "http://127.0.0.1:5173"
            );
    }
}
```

### WebSocket Endpoint

- **Endpoint:** `ws://localhost:8080/ws-queue`
- **Subscribe to:** `/topic/tickets` to receive ticket updates
- **Message Format:** JSON payload with ticket information

### Real-Time Updates

The following operations broadcast ticket updates via WebSocket:

1. **Ticket Created**
   - Message: New ticket in WAITING status

2. **Ticket Called**
   - Message: Ticket moved to CALLED status

3. **Ticket Completed**
   - Message: Ticket moved to COMPLETED status

**Broadcast Payload:**
```json
{
  "ticketId": 1,
  "number": "T-1715610000000",
  "status": "CALLED",
  "serviceId": 1
}
```

---

## Database Schema

### Tables Overview

| Table | Columns | Primary Key | Foreign Keys |
|---|---|---|---|
| `users` | id, firstName, lastName, email, password, phone, enabled, createdAt, role_id | id (AI) | role_id → roles.id |
| `roles` | id, name | id (AI) | - |
| `tickets` | id, number, status, createdAt, calledAt, completedAt, priority, user_id, service_id, counter_id, agent_id | id (AI) | user_id, service_id, counter_id, agent_id → users.id; service_id → services.id; counter_id → counters.id |
| `services` | id, name, description, averageDuration, active | id (AI) | - |
| `appointments` | id, appointmentDate, status, notes, createdAt, user_id, service_id | id (AI) | user_id → users.id; service_id → services.id |
| `notifications` | id, message, read, type, createdAt, user_id | id (AI) | user_id → users.id |
| `counters` | id, name, number, active | id (AI) | - |

### Indexes & Constraints

| Table | Index/Constraint | Columns | Type |
|---|---|---|---|
| `users` | Unique | email | UNIQUE |
| `tickets` | Unique | number | UNIQUE |
| `tickets` | Index | status | For filtering by status |
| `appointments` | Index | user_id, service_id | For user and service lookups |
| `notifications` | Index | user_id, read | For retrieving user notifications |

### Database Configuration

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smartqueue
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

---

## Business Logic Summary

### Queue Management Flow

```
┌─────────────────┐
│  User Creates   │
│    Ticket       │
└────────┬────────┘
         │ POST /api/tickets
         ▼
┌─────────────────────────────────┐
│ Ticket Generated                │
│ Status: WAITING                 │
│ Number: T-{timestamp}           │
│ ├─ User assigned                │
│ ├─ Service assigned             │
│ └─ Position in queue by creation│
│ * WebSocket broadcast            │
└────────┬────────────────────────┘
         │
         │ Agent/Admin calls
         │ PUT /api/tickets/call-next
         ▼
┌─────────────────────────────────┐
│ Ticket Called                   │
│ Status: CALLED                  │
│ calledAt: current timestamp     │
│ * WebSocket broadcast            │
└────────┬────────────────────────┘
         │
         │ Agent/Admin completes
         │ PUT /api/tickets/complete/{id}
         ▼
┌─────────────────────────────────┐
│ Ticket Completed                │
│ Status: COMPLETED               │
│ completedAt: current timestamp  │
│ * WebSocket broadcast            │
└─────────────────────────────────┘
```

### Authentication Flow

```
┌──────────────────────┐
│ Client Registration  │
└──────────┬───────────┘
           │ POST /api/auth/register
           ▼
┌──────────────────────────────────────┐
│ Validate & Hash Password             │
│ Create User with USER role           │
│ Generate JWT Token (24h expiration)  │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│ Return Token to Client               │
│ Client stores token (localStorage)   │
└──────────────────────────────────────┘

┌──────────────────────┐
│ Client Login         │
└──────────┬───────────┘
           │ POST /api/auth/login
           ▼
┌──────────────────────────────────────┐
│ Authenticate via AuthenticationManager│
│ Generate JWT Token (24h expiration)  │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│ Return Token to Client               │
│ Client stores token (localStorage)   │
└──────────────────────────────────────┘

┌──────────────────────┐
│ Subsequent Requests  │
└──────────┬───────────┘
           │ Header: Authorization: Bearer {token}
           ▼
┌──────────────────────────────────────┐
│ JwtAuthenticationFilter intercepts   │
│ Extract JWT from Authorization header│
│ Extract username from JWT            │
│ Load UserDetails from DB             │
│ Validate token against UserDetails   │
│ Set SecurityContext with user        │
└──────────────────────────────────────┘
```

### Role-Based Access Control

| Role | Permissions | Endpoints |
|---|---|---|
| **USER** | Create tickets, view appointments, view notifications | POST /api/tickets, GET /api/appointments |
| **AGENT** | Call next ticket, complete tickets, view tickets | PUT /api/tickets/call-next, PUT /api/tickets/complete/{id} |
| **ADMIN** | All AGENT permissions + admin health check | All endpoints, /api/admin/* |

### Data Flow Diagram

```
Frontend (React)
      │
      │ HTTP Request + JWT Token
      ▼
Spring Security Filter Chain
      │
      ├─ CORS Check
      ├─ JWT Validation (JwtAuthenticationFilter)
      ├─ Authorization Check (SecurityConfig)
      │
      ▼
Controller Layer
      │
      ├─ AuthController
      ├─ TicketController
      ├─ UserController
      ├─ AppointmentController
      ├─ ServiceEntityController
      ├─ NotificationController
      └─ AdminController
      │
      ▼
Service Layer
      │
      ├─ AuthService
      ├─ TicketService ◄─── WebSocket Broadcast
      ├─ UserService
      ├─ AppointmentService
      ├─ ServiceEntityService
      └─ NotificationService
      │
      ▼
Repository Layer (JPA)
      │
      ▼
MySQL Database
```

---

## Frontend Implementation Guide

### Key Integration Points for Frontend Development

1. **Authentication**
   - Register: POST `/api/auth/register` → Receive JWT token
   - Login: POST `/api/auth/login` → Receive JWT token
   - Profile: GET `/api/auth/me` → User data (requires authentication)
   - Store token in localStorage/sessionStorage
   - Include `Authorization: Bearer {token}` in all authenticated requests

2. **Ticket Management**
   - Create ticket: POST `/api/tickets?userId={id}&serviceId={id}`
   - View tickets: GET `/api/tickets`
   - Agent calls next: PUT `/api/tickets/call-next`
   - Agent completes: PUT `/api/tickets/complete/{id}`
   - Subscribe to WebSocket `/topic/tickets` for real-time updates

3. **Appointments**
   - Book appointment: POST `/api/appointments`
   - View appointments: GET `/api/appointments`
   - Cancel appointment: DELETE `/api/appointments/{id}`

4. **Services**
   - List services: GET `/api/services`
   - Get service details: GET `/api/services/{id}`

5. **Notifications**
   - View notifications: GET `/api/notifications/{userId}`
   - Create notification: POST `/api/notifications`

6. **WebSocket Integration**
   - Connect to `ws://localhost:8080/ws-queue`
   - Subscribe to `/topic/tickets`
   - Listen for ticket status changes
   - Update UI with real-time ticket information

---

## Deployment & Configuration

### Prerequisites
- Java 17+
- MySQL 8.0+
- Node.js 16+ (for frontend)
- Maven 3.8+

### Environment Variables & Configuration

```properties
# JWT Configuration
jwt.secret=<YOUR_SECRET_KEY_MIN_256_BITS>
jwt.expiration-ms=86400000

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/smartqueue
spring.datasource.username=root
spring.datasource.password=<DB_PASSWORD>

# Hibernate
spring.jpa.hibernate.ddl-auto=update
```

### Build & Run

```bash
# Build backend
cd BE
mvn clean package

# Run backend
java -jar target/smartqueue-0.0.1-SNAPSHOT.jar

# Frontend runs separately on port 3000 or 5173
```

---

## Technology Stack Summary

| Component | Technology | Version |
|---|---|---|
| Framework | Spring Boot | 4.0.6 |
| Java | OpenJDK | 17 |
| Database | MySQL | 8.0+ |
| Authentication | JWT (JJWT) | 0.11.5 |
| Password Hashing | BCrypt | Spring Security |
| Real-time | WebSocket (STOMP) | Spring Boot |
| ORM | JPA/Hibernate | 4.0.6 |
| Build | Maven | 3.8+ |

---

**Document Generated:** May 13, 2026  
**Backend Version:** 0.0.1-SNAPSHOT  
**Author:** Backend Analysis Report

