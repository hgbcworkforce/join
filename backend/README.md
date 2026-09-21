# HGBC First-Timer Portal — Backend API

Production-ready Node.js (Express) & Supabase (PostgreSQL) backend API for the HGBC First-Timer and Guest Management Portal.

---

## 1. Supabase Database Setup

1. Log into your [Supabase Dashboard](https://supabase.com).
2. Create a new project (e.g. `hgbc-firsttimers`).
3. In the left navigation, go to the **SQL Editor**.
4. Open or copy the contents of `schema.sql` from this directory.
5. Click **Run** to execute the script.
6. In **Project Settings** > **API**:
   - Copy your **Project URL** (`SUPABASE_URL`)
   - Copy your **service_role** secret or **anon** public key (`SUPABASE_SERVICE_ROLE_KEY`)

---

## 2. Local Development

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
4. Fill in your Supabase credentials in `.env`:
   ```env
   PORT=5000
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   JWT_SECRET=your-secret-key-32chars
   CORS_ORIGIN=http://localhost:5173,https://join.hgbcinfluencers.org
   ```
5. Start the server in watch mode:
   ```bash
   npm run dev
   ```

---

## 3. Deploying to Render

1. Push this repository to GitHub.
2. Log in to [Render](https://render.com) and click **New +** > **Web Service**.
3. Connect your GitHub repository.
4. Set the following configuration:
   - **Name**: `hgbc-firsttimer-api`
   - **Root Directory**: `backend` (if in monorepo) or leave blank if deployed from separate repo.
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`
5. Under **Environment Variables**, add:
   - `SUPABASE_URL`: (Your Supabase Project URL)
   - `SUPABASE_SERVICE_ROLE_KEY`: (Your Supabase Service Role Key)
   - `JWT_SECRET`: (A strong random string)
   - `CORS_ORIGIN`: `https://join.hgbcinfluencers.org,http://localhost:5173`
   - `NODE_ENV`: `production`
6. Click **Create Web Service**.
7. Once deployed, copy your Render URL (e.g., `https://hgbc-firsttimer-api.onrender.com/api`) and set it as `VITE_API_BASE_URL` in your frontend!

---

## 4. API Endpoints Reference

### Public Endpoints
- `POST /api/first-timers` — Submit First Timer guest intake form
- `POST /api/auth/signin` — Sign into staff/admin dashboard
- `POST /api/auth/signup` — Register a team member account
- `GET /api/health` — Healthcheck endpoint

### Protected Endpoints (Requires `Authorization: Bearer <token>`)
- `GET /api/first-timers` — Get paginated submissions (`?page=1&limit=10&search=john`)
- `GET /api/first-timers/:id` — Get single first-timer details with notes
- `PATCH /api/first-timers/:id` — Update status / assigned team member
- `GET /api/first-timers/export` — Download submissions as CSV
- `GET /api/metrics` — Aggregated metrics for dashboard cards
- `GET /api/auth/me` — Current logged-in user profile
