# Implementation Steps – Modexx Full Stack Ticket Booking System

This document provides the complete step-by-step guide to build, run, test, and deploy the project according to the Modexx Assessment requirements.

---

## 1️⃣ Project Structure

```
/client                   # React + TypeScript frontend  
/server                   # Node.js + Express backend  
README.md  
DEPENDENCIES.md  
IMPLEMENTATION_STEPS.md  
requirements.txt  
```

Ensure `.gitignore` includes:
```
node_modules/
.env
/build
/dist
.DS_Store
```

---

## 2️⃣ Backend Implementation (Node.js + Express + MongoDB Atlas)

### Step 1 — Install packages
```bash
cd server
npm install
```

### Step 2 — Environment Variables (`server/.env`)
```
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/modexx
PORT=5000
JWT_SECRET=your_secret_key
NODE_ENV=production
```

### Step 3 — Define Models
**Show Model**
- id  
- name  
- start_time  
- total_seats  
- booked_seats / seats array  
- createdAt / updatedAt  

**Booking Model**
- id  
- show_id  
- seats array  
- status: PENDING / CONFIRMED / FAILED  
- timestamps  

### Step 4 — Concurrency-Safe Booking Logic  
Use **MongoDB atomic operations**:

#### Option A — Atomic update
```js
Shows.findOneAndUpdate(
  { _id: showId, seatsAvailable: { $gte: seatsToBook } },
  { $inc: { seatsAvailable: -seatsToBook } },
  { new: true }
)
```

#### Option B — MongoDB Transactions (recommended)
```js
const session = await mongoose.startSession();
session.startTransaction();
// read → validate → update → create booking
await session.commitTransaction();
session.endSession();
```

### Step 5 — API Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shows` | List shows |
| POST | `/api/admin/shows` | Create show |
| POST | `/api/bookings` | Book seats |
| GET | `/api/bookings/:id` | Check booking status |

### Step 6 — Test Backend Locally
```bash
npm run dev
```
Health endpoint:
```
GET /api/health
```

---

## 3️⃣ Frontend Implementation (React + TypeScript)

### Step 1 — Setup
```bash
cd client
npm install
npm start
```

### Step 2 — Pages
- `/` → Show list  
- `/booking/:id` → Seat layout + booking  
- `/admin` → Create shows  

### Step 3 — Environment Variable (`client/.env`)
```
REACT_APP_API_BASE_URL=http://localhost:5000
```

### Step 4 — Connect frontend to backend using Axios
Example:
```ts
axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/shows`)
```

### Step 5 — UI Features
- Seat selection grid  
- Booking button  
- Booking status page  

---

## 4️⃣ Database (MongoDB Atlas)

### Setup Steps:
1. Create free cluster at MongoDB Atlas  
2. Click **Connect → Connect Your Application**  
3. Copy connection string  
4. Replace password & DB name  
5. Paste into backend `.env` as `MONGO_URI`  
6. Add IP Access List:  
   - Use `0.0.0.0/0` for testing/deployment  

---

## 5️⃣ Testing

### API Tests (Postman or curl)

**Create Show**
```bash
POST /api/admin/shows
```

**Book Seats**
```bash
POST /api/bookings
```

**Check Booking**
```bash
GET /api/bookings/:id
```

### Concurrency Test
Run two parallel booking requests:
```bash
curl -X POST -d @booking.json https://<backend>/api/bookings &
curl -X POST -d @booking.json https://<backend>/api/bookings &
```

Expected:  
- One **CONFIRMED**  
- One **FAILED**

---

## 6️⃣ Deployment (Matches Assessment Requirements)

### Backend Deployment — Render / Railway
1. Connect GitHub repo  
2. Root folder → `server/`  
3. Build Command:
```
npm install
```
4. Start Command:
```
npm start
```
5. Add Environment Variables:
```
MONGO_URI=<your-atlas-uri>
JWT_SECRET=<secret>
PORT=5000
NODE_ENV=production
```
6. Deploy  
7. Test API using Postman / browser  

---

### Frontend Deployment — Vercel / Netlify
1. Connect GitHub repo  
2. Root folder → `client/`  
3. Build Command:
```
npm run build
```
4. Output Directory:
```
build
```
5. Add Environment Variable:
```
REACT_APP_API_BASE_URL=<your-backend-deployed-url>
```
6. Deploy  
7. Open live site and test booking flow  

---
 

---


---
