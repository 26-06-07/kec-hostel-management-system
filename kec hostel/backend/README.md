# KEC Hostels Backend — API Server

Node.js + Express REST API for the Kongu Engineering College Hostel Management System.

---

## Running the Backend

```bash
cd backend
npm install
npm run dev       # Development (nodemon, auto-restart on file save)
# or
npm start         # Production
```

Server starts on **http://localhost:5000**

---

## For the Database Teammate — MySQL Setup

### Step 1 — Create the Database

Open MySQL CLI or MySQL Workbench and run:

```sql
CREATE DATABASE kec_hostel_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

### Step 2 — Run the Schema

From the `backend/` directory:

```bash
mysql -u root -p kec_hostel_db < data/schema.sql
```

This creates all tables (`users`, `hostels`, `rooms`, `leave_requests`, `complaints`, `notices`) and inserts the demo seed accounts.

### Step 3 — Set Your Password in `.env`

Open `backend/.env` and set:

```
DB_PASSWORD=your_mysql_password_here
```

Change `DB_USER` too if you used a user other than `root`.

### Step 4 — No Restart Needed

The backend **auto-detects MySQL every 15 seconds**. Once the password is correct and MySQL is running, you'll see in the server console:

```
[MySQL] ✓ Connected to "kec_hostel_db" on localhost:3306
[MySQL]   Live database mode active — in-memory fallback disabled.
```

> Until the DB is active, the backend serves data from `data/mockFallback.js` (in-memory) — so the frontend works at all times.

---

## Demo Login Credentials (Seed Data)

| Role      | Username               | Password       |
|-----------|------------------------|----------------|
| Student   | `swaathi` / `22ITR088` | `student123`   |
| Caretaker | `caretaker.amaravathi` | `caretaker123` |
| Warden    | `warden`               | `warden123`    |
| Admin     | `admin.hostel`         | `admin123`     |

---

## API Endpoints

| Method | Route                         | Auth Required  | Description                        |
|--------|-------------------------------|----------------|------------------------------------|
| POST   | `/api/auth/login`             | No             | Login (returns JWT)                |
| POST   | `/api/auth/register`          | No             | Register new student               |
| GET    | `/api/auth/me`                | JWT            | Get current user profile           |
| GET    | `/api/hostels`                | No             | List all three hostels             |
| GET    | `/api/hostels/:id`            | No             | Get single hostel details          |
| GET    | `/api/rooms`                  | No             | List rooms (filterable by hostel)  |
| GET    | `/api/leaves`                 | JWT            | Get leaves (student: own; warden: all) |
| POST   | `/api/leaves`                 | JWT + Student  | Submit leave/outing request        |
| PUT    | `/api/leaves/:id/status`      | JWT + Warden   | Approve or reject leave            |
| GET    | `/api/complaints`             | JWT            | Get complaints (filtered by role)  |
| POST   | `/api/complaints`             | JWT + Student  | File maintenance complaint         |
| PUT    | `/api/complaints/:id/status`  | JWT + Caretaker| Update complaint status            |
| GET    | `/api/notices`                | No             | Public campus notices              |
| GET    | `/api/notices/mess-menu`      | No             | Weekly dining schedule             |
| POST   | `/api/notices`                | JWT + Warden   | Publish official notice            |
| GET    | `/api/health`                 | No             | Server & DB health check           |

---

## Project Structure

```
backend/
├── config/
│   └── db.js               ← MySQL pool (auto-reconnect, .env-driven)
├── controllers/            ← Business logic for each route
├── data/
│   ├── mockFallback.js     ← In-memory data used when MySQL is offline
│   └── schema.sql          ← MySQL schema + seed data (run this!)
├── middleware/
│   ├── authMiddleware.js   ← JWT verification
│   ├── roleMiddleware.js   ← RBAC (student / caretaker / warden / admin)
│   └── errorHandler.js     ← Centralized error responses
├── models/                 ← DB abstraction (MySQL first, fallback second)
├── routes/                 ← Express routers
├── .env                    ← Local config (fill in DB_PASSWORD)
├── .env.example            ← Template for teammates
└── server.js               ← Entry point
```
