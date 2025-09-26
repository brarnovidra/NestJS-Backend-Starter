# 🚀 NestJS Backend Starter (Node.js 20)

Backend starter project berbasis **NestJS** dengan arsitektur **MVC + GraphQL + REST + Microservices (RabbitMQ + Nodemailer)**.  
Project ini bisa dipakai sebagai **base** untuk aplikasi skala kecil hingga besar.

---

## 📦 Tech Stack

- **Runtime**: Node.js 20  
- **Framework**: [NestJS](https://nestjs.com/)  
- **ORM**: [TypeORM](https://typeorm.io/) + PostgreSQL  
- **GraphQL**: Apollo Server (Code-First)  
- **REST API**: NestJS Controller  
- **Auth**: JWT Access + Refresh Token  
- **Message Queue**: RabbitMQ  
- **Email Service**: Nodemailer (support MailHog & Gmail)  
- **Testing**: Postman Collection  
- **Container**: Docker Compose  

---

## 🏗️ Arsitektur

```
┌───────────────────────────┐
│        Client (Web/App)   │
└───────────────┬───────────┘
                │ REST/GraphQL
┌───────────────▼───────────┐
│   NestJS API Gateway       │
│   (REST + GraphQL)         │
│                           │
│ - Auth (JWT)              │
│ - User Service (CRUD)     │
│ - Health Check            │
│                           │
└───────────────┬───────────┘
                │ RabbitMQ (Event Driven)
┌───────────────▼───────────┐
│   Microservice: Email      │
│   - Kirim welcome email    │
│   - Support MailHog/Gmail  │
└────────────────────────────┘
```

---

## ✨ Fitur

- [x] **Auth**: Register, Login, Refresh Token  
- [x] **Validation**: Cek duplicate email saat register  
- [x] **Global Response Format** (REST)  

  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": {}
  }
  ```

- [x] **GraphQL API** untuk query & mutation  
- [x] **Event-Driven** dengan RabbitMQ (user.created event)  
- [x] **Email Service** via Nodemailer:  
  - Dev mode → SMTP  
  - Prod mode → SMTP 
- [x] **Docker Compose** siap jalan (API + DB + RabbitMQ + MailHog)  

---

## ⚙️ Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-org/nestjs-backend-starter.git
cd nestjs-backend-starter
```

### 2. Buat `.env`
```env
# Database
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASS=admin
DB_NAME=app_db

# JWT
JWT_SECRET=supersecret
JWT_REFRESH_SECRET=refreshsecret

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672

# Email
SMTP_HOST=your@host
SMTP_PORT=port
SMTP_USER=your@email.com
SMTP_PASS=yourpas
```

### 3. Jalankan dengan Docker
```bash
docker compose up --build
```

Service yang akan jalan:
- API → [http://localhost:3000](http://localhost:3000)  
- GraphQL → [http://localhost:3000/graphql](http://localhost:3000/graphql)  
- Nodemailer
- RabbitMQ Management → [http://localhost:15672](http://localhost:15672)  

---

## 📮 API Endpoints

### REST
| Method | Endpoint       | Deskripsi             |
|--------|---------------|----------------------|
| POST   | `/auth/register` | Register user baru |
| POST   | `/auth/login`    | Login user          |
| GET    | `/health`        | Cek service status |

### GraphQL
Query:
```graphql
query {
  health
}
```

Mutation:
```graphql
mutation {
  register(input: { email: "test@mail.com", password: "123456", fullName: "Tester" }) {
    accessToken
    refreshToken
    user {
      id
      email
    }
  }
}
```

---

## 📬 Event (RabbitMQ)

- Event: `user.created`  
- Payload:
  ```json
  {
    "userId": "uuid",
    "email": "user@mail.com"
  }
  ```
- Konsumer: **Email Service** → otomatis kirim welcome email.

---

## 📧 Email Service

- Dev: pakai **SMTP** dengan App Password  

---

## 🧪 Testing

### Postman
Import collection di folder `postman/collection.json` (sudah include):
- Register  
- Login  
- Refresh Token  
- Health  

---

## 🚀 Next Steps

- [ ] Tambah Role & Permission  
- [ ] Integrasi Payment / Notification Service  
- [ ] Monitoring (Grafana + Prometheus)  
