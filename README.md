## Sales Insight Automator (MERN)

Sales Insight Automator is a production-ready prototype that ingests CSV/XLSX sales data, computes key statistics, generates an AI-powered executive summary using Google Gemini, and emails the report to a specified recipient. The stack is MERN-aligned: React SPA frontend, Node/Express backend, and MongoDB for persistence, fully containerized with Docker and wired for CI via GitHub Actions.

### Architecture Overview

- **Frontend**: React SPA (Vite) with Tailwind CSS and Axios.
- **Backend**: Node.js + Express with secure file upload, rate limiting, CORS, and integrations for Gemini and SendGrid.
- **Database**: MongoDB (for future enhancements and logging; already wired via docker-compose).
- **AI Engine**: Google Gemini API (can be swapped for Groq Llama 3 if desired).
- **Mail Service**: SendGrid.
- **DevOps**: Docker, docker-compose, GitHub Actions CI.

High-level flow:

Upload → API → Data Processing → LLM → Email → Success

### Directory Structure

- `backend/` – Express API, LLM + email services, security utilities, Dockerfile.
- `frontend/` – React SPA, Tailwind styling, upload UI, Dockerfile.
- `.github/workflows/ci.yml` – CI pipeline for linting and building.
- `docker-compose.yml` – Orchestrates frontend, backend, and MongoDB.
- `.env.example` – Template for environment variables.

### Environment Variables

Copy `.env.example` to `.env` at the project root and fill in values:

- **GEMINI_API_KEY**: Google Gemini API key.
- **SENDGRID_API_KEY**: SendGrid API key.
- **EMAIL_SENDER**: Verified SendGrid sender email address.
- **FRONTEND_URL**: Frontend base URL (e.g. `http://localhost:5173`).
- **BACKEND_URL**: Backend base URL (e.g. `http://localhost:5000`).
- **MONGODB_URI**: MongoDB connection string (docker-compose provides a default).

### Local Development (without Docker)

1. **Backend**
   - `cd backend`
   - `npm install`
   - Ensure `.env` exists at the project root (one level above `backend`) with the variables above.
   - `npm run dev`
   - Backend will run on `http://localhost:5000`.

2. **Frontend**
   - `cd frontend`
   - `npm install`
   - Create `frontend/.env` with:
     - `VITE_BACKEND_URL=http://localhost:5000`
   - `npm run dev`
   - Frontend will run on `http://localhost:5173`.

### Running with Docker

Ensure Docker and docker-compose are installed, then from the project root:

```bash
docker-compose up --build
```

Services:

- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:5000`
- **MongoDB**: `mongodb://localhost:27017/sales_insight_automator`

The compose file wires environment variables into containers and configures the frontend to talk to the backend via `BACKEND_URL`.

### Security Implementation

- **Rate limiting**: `express-rate-limit` limits requests per 15-minute window.
- **File upload hardening**:
  - Max size 5MB via `multer` limits.
  - Allowed types restricted to `.csv` and `.xlsx` via explicit extension checks.
- **Input validation**:
  - Email validated with a strict regex.
  - Files checked for presence and basic structure.
- **CORS protection**:
  - Origins restricted to `FRONTEND_URL`.
- **Secrets**:
  - All API keys and sensitive values loaded from environment variables.

### Deployment Notes

- **Frontend (Vercel)**:
  - Deploy the `frontend` folder as a Vite React app.
  - Configure `VITE_BACKEND_URL` in Vercel environment variables to point to your deployed backend (e.g. Render).
- **Backend (Render or similar)**:
  - Deploy the `backend` folder as a Node service or Docker image.
  - Set environment variables: `PORT`, `MONGODB_URI`, `GEMINI_API_KEY`, `SENDGRID_API_KEY`, `EMAIL_SENDER`, `FRONTEND_URL`.

### How to Proceed (Step-by-step for You)

1. **Install dependencies locally**
   - `cd backend && npm install`
   - `cd ../frontend && npm install`
2. **Configure environment**
   - At project root, copy `.env.example` → `.env` and fill in real values.
   - In `frontend/.env`, set `VITE_BACKEND_URL=http://localhost:5000` for local dev.
3. **Test without Docker**
   - Run backend: `cd backend && npm run dev`.
   - Run frontend: `cd frontend && npm run dev`.
   - Open `http://localhost:5173`, upload the sample CSV, enter your email, and verify you receive the summary.
4. **Test with Docker**
   - From project root: `docker-compose up --build`.
   - Repeat the upload flow via `http://localhost:5173`.
5. **Wire CI**
   - Push to GitHub.
   - Ensure PRs target `main` so the workflow runs and validates lint/build + backend Docker build.

Once everything runs clean locally and in CI, you can deploy frontend to Vercel and backend to Render, reusing the same environment variable names.

