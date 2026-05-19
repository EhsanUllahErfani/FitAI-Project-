# FitAI Coach

**Owner:** Ehsan Ullah Erfani

An AI-powered fitness and nutrition web application. FitAI Coach generates personalised workout plans, meal plans, supplement guidance, and calorie estimates — then coaches you through every step with a 24/7 AI chatbot powered by Llama 3.1 via Groq.

---

## Tech Stack

| Area | Technology |
|------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | Prisma ORM (SQLite / PostgreSQL) |
| Authentication | JWT with httpOnly cookies |
| AI Integration | Groq API (Llama 3.1) |
| Forms | React Hook Form + Zod |
| Data Fetching | TanStack React Query |

---

## Features

| Feature | Description |
|---------|-------------|
| Authentication | Register, login, logout — JWT httpOnly cookies |
| Goal & Profile Setup | Age, weight, height, fitness goal, experience level |
| AI Workout Generator | Personalised weekly workout plans |
| AI Meal Planner | Daily meal plans with calorie targets |
| AI Personal Chatbot | 24/7 fitness and nutrition Q&A |
| AI Calorie Check | Upload food photos or describe meals for calorie estimates |
| Supplement Suggestions | Goal-matched supplement recommendations |
| Music Player | Built-in workout playlist |
| Dashboard | Goal summary, streak, motivational quotes, latest plans |

---

## Prerequisites

- Node.js v18+
- npm v9+

---

## Local Development

### 1. Clone the repository

```bash
git clone <repository-url>
cd fitai-coach
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` and fill in your values (see [Environment Variables](#environment-variables) below).

```bash
npx prisma migrate dev
npm run dev
```

Backend runs at `http://localhost:4000`.

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs at `http://localhost:5173`.

### 4. Open the app

Visit `http://localhost:5173`, register an account, complete onboarding, and start using the app.

---

## Build Commands

```bash
# Frontend — type-check and build for production
cd frontend && npm run build

# Backend — compile TypeScript
cd backend && npm run build
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|:--------:|-------------|
| `DATABASE_URL` | Yes | SQLite: `file:./dev.db` · PostgreSQL: `postgresql://...` |
| `JWT_SECRET` | Yes | Random string, min 32 chars. Generate with: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `GROQ_API_KEY` | Yes | API key from [console.groq.com](https://console.groq.com) |
| `GROQ_MODEL` | No | Text model (default: `llama-3.1-8b-instant`) |
| `GROQ_VISION_MODEL` | No | Vision model for food photo calorie analysis |
| `PORT` | No | Backend port (default: `4000`) |
| `CLIENT_URL` | Yes (prod) | Frontend origin for CORS — set to your Vercel URL in production |
| `SMTP_HOST` | For email | SMTP host (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | For email | `587` |
| `SMTP_SECURE` | For email | `"false"` for port 587 |
| `SMTP_USER` | For email | Your Gmail address |
| `SMTP_PASS` | For email | Gmail App Password (16 chars) |
| `SMTP_FROM` | For email | Sender string e.g. `FitAI Coach <you@gmail.com>` |

**Gmail App Password:** Enable 2-Step Verification → [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) → create an App Password.

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|:--------:|-------------|
| `VITE_API_URL` | No | API base URL. Leave as `/api` for dev. Set to `https://your-backend.up.railway.app/api` in production if you need it. |

---

## Deployment — Vercel (Frontend) + Railway (Backend)

### Step 1 — Deploy the Backend to Railway

1. Go to [railway.app](https://railway.app) and sign in with GitHub.
2. Click **New Project → Deploy from GitHub repo** and select this repository.
3. Set the **Root Directory** to `fitai-coach/fitai-coach/fitai-coach/backend` (adjust to match your actual path).
4. Railway will detect the `railway.toml` and run automatically.
5. Go to **Variables** and add all required backend environment variables:
   - `DATABASE_URL` — use Railway's PostgreSQL add-on (see below) **or** SQLite `file:./dev.db`
   - `JWT_SECRET` — generate a strong random string
   - `GROQ_API_KEY` — from [console.groq.com](https://console.groq.com)
   - `CLIENT_URL` — set to your Vercel frontend URL (add this after Step 2)
   - `PORT` — Railway sets this automatically; you can leave it out
6. Click **Deploy**. Once healthy, copy your Railway backend URL (e.g. `https://fitai-backend.up.railway.app`).

**Optional — PostgreSQL on Railway (recommended for production):**
- In your Railway project, click **New → Database → PostgreSQL**.
- Railway will inject `DATABASE_URL` automatically as a PostgreSQL connection string.
- Update `backend/prisma/schema.prisma` — change `provider = "sqlite"` to `provider = "postgresql"`.
- Redeploy.

### Step 2 — Deploy the Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New Project** and import this repository.
3. Set the **Root Directory** to `fitai-coach/fitai-coach/fitai-coach/frontend`.
4. Vercel auto-detects Vite. Use these settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add environment variable:
   - `VITE_API_URL` = `https://your-backend.up.railway.app/api`
6. Click **Deploy**. Your site will be live at `your-project.vercel.app`.
7. Copy the Vercel URL and go back to Railway → Variables → set `CLIENT_URL` to your Vercel URL, then redeploy Railway.

### Step 3 — Connect a Custom Domain

**On Vercel (frontend):**
1. In your Vercel project, go to **Settings → Domains**.
2. Click **Add Domain** and enter your domain (e.g. `fitai.yourdomain.com`).
3. Copy the DNS records Vercel provides (usually a CNAME or A record).
4. Log in to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.) and add those DNS records.
5. Wait up to 48 hours for DNS propagation. Vercel will issue a free SSL certificate automatically.

**On Railway (backend — optional custom domain):**
1. In your Railway service, go to **Settings → Networking → Custom Domain**.
2. Enter a subdomain like `api.yourdomain.com`.
3. Add the provided CNAME record at your domain registrar.
4. Update `VITE_API_URL` in Vercel to use your custom backend domain.

**After setting your domain — update these files:**
- `frontend/public/robots.txt` — replace `fitaicoach.vercel.app` with your real domain
- `frontend/public/sitemap.xml` — replace `fitaicoach.vercel.app` with your real domain
- `frontend/index.html` — replace all `fitaicoach.vercel.app` occurrences with your real domain
- Redeploy to Vercel.

### Step 4 — Submit to Google Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console).
2. Click **Add Property** → choose **URL prefix** → enter `https://yourdomain.com`.
3. Download the HTML verification file Google provides.
4. Place it in `frontend/public/` (e.g. `frontend/public/googleXXXXXXXX.html`).
5. Redeploy to Vercel so the file is publicly accessible.
6. Back in Search Console, click **Verify**.
7. Once verified, go to **Sitemaps** → enter `https://yourdomain.com/sitemap.xml` → click **Submit**.
8. Google will start crawling and indexing your site within a few days.

---

## API Routes

| Method | Route | Auth | Description |
|--------|-------|:----:|-------------|
| GET | `/api/health` | | API health check |
| POST | `/api/auth/register` | | Create account |
| POST | `/api/auth/login` | | Login |
| POST | `/api/auth/logout` | | Logout |
| GET | `/api/auth/me` | ✓ | Get current user |
| POST | `/api/auth/forgot-password` | | Send password reset email |
| POST | `/api/auth/reset-password` | | Reset password |
| GET/PUT | `/api/profile` | ✓ | Get / update profile |
| POST | `/api/workouts/generate` | ✓ | Generate AI workout plan |
| GET | `/api/workouts` | ✓ | List workout plans |
| PATCH | `/api/workouts/:planId/exercise/:exId` | ✓ | Toggle exercise done |
| DELETE | `/api/workouts/:planId` | ✓ | Delete workout plan |
| POST | `/api/meals/generate` | ✓ | Generate AI meal plan |
| GET | `/api/meals` | ✓ | List meal plans |
| DELETE | `/api/meals/:planId` | ✓ | Delete meal plan |
| GET/POST/DELETE | `/api/chat` | ✓ | Chat with AI coach |
| POST | `/api/calorie/analyze` | ✓ | Estimate calories from photo/description |
| GET | `/api/calorie` | ✓ | List calorie analyses |
| DELETE | `/api/calorie/:analysisId` | ✓ | Delete analysis |
| POST | `/api/supplements/suggest` | ✓ | Generate supplement suggestions |
| GET | `/api/supplements` | ✓ | List supplement suggestions |
| DELETE | `/api/supplements/:suggestionId` | ✓ | Delete suggestion |

---

## Backend npm Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Run compiled `dist/index.js` |
| `npm run start:prod` | Run Prisma migrations then start (used in production) |
| `npm run prisma:migrate` | Run database migrations (dev) |
| `npm run prisma:generate` | Regenerate Prisma client |

## Frontend npm Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |

---

## Security Notes

- Never commit `.env` files — they are gitignored.
- Generate a strong `JWT_SECRET` with: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
- Rotate your `GROQ_API_KEY` if it has ever been exposed in version control.
- Use environment variables in Vercel and Railway dashboards — never hardcode secrets.

---

© 2026 Ehsan Ullah Erfani. All rights reserved.
