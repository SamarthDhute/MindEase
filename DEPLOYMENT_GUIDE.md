# MindEase — Complete Deployment Guide (Render & Vercel)

This guide walks you through deploying the **MindEase Backend on Render** and the **MindEase Frontend on Vercel** step by step.

---

## 🚀 Part 1: Deploy Backend on Render

Render will host the FastAPI service, model inference engine, and sensitivity explanation pipeline.

### Step 1: Push Code to GitHub
Ensure all code and the `ml_model/` directory are pushed to your GitHub repository:
```bash
git add .
git commit -m "Configure Render and Vercel deployment"
git push origin main
```

### Step 2: Create Web Service on Render
1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** &rarr; Select **Web Service**.
3. Connect your GitHub repository containing **MindEase**.
4. Configure the service settings:
   - **Name:** `mindease-backend` (or your choice)
   - **Region:** Oregon (US West) or closest to you
   - **Branch:** `main`
   - **Root Directory:** Leave **EMPTY** (must be repository root so it can access `ml_model/`)
   - **Runtime:** `Python 3`
   - **Build Command:**
     ```bash
     pip install -r backend/requirements.txt
     ```
   - **Start Command:**
     ```bash
     uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT
     ```
   - **Instance Type:** `Free`

### Step 3: Set Environment Variables on Render
Under **Environment Variables**, add:
| Key | Value | Description |
|---|---|---|
| `PYTHON_VERSION` | `3.11.9` | Pins Python version compatible with TensorFlow |
| `TF_ENABLE_ONEDNN_OPTS` | `0` | Disables TensorFlow oneDNN CPU floating-point warnings |
| `ALLOWED_ORIGIN_REGEX` | `^https:\/\/.*\.vercel\.app$` | Automatically permits all Vercel domains for CORS |

*(Note: Alternatively, if you use Render Blueprints, Render will automatically detect the pre-configured [`render.yaml`](file:///c:/Users/Samarth/Downloads/MindEase/render.yaml) file in your repo!)*

### Step 4: Verify Backend Health
Once deployed, Render gives you a public URL (e.g., `https://mindease-backend.onrender.com`).
Test it in your browser:
- `https://mindease-backend.onrender.com/health` &rarr; should return `{"status": "ready"}`
- `https://mindease-backend.onrender.com/docs` &rarr; opens interactive FastAPI Swagger UI.

---

## 🌐 Part 2: Deploy Frontend on Vercel

Vercel will host the React 19 + Vite single-page application.

### Step 1: Import Project on Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New…** &rarr; Select **Project**.
3. Import the same GitHub repository.

### Step 2: Configure Project Settings
In the Vercel project configuration screen:
- **Framework Preset:** `Vite`
- **Root Directory:** Click **Edit** and select `frontend` (or leave as root; both have `vercel.json` configured).
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Step 3: Add Environment Variables
Expand **Environment Variables** and add:
| Name | Value |
|---|---|
| `VITE_API_URL` | `https://mindease-backend.onrender.com` *(Replace with your real Render URL from Part 1)* |

### Step 4: Deploy
Click **Deploy**!
Vercel will build the frontend with `tsc && vite build` and deploy your application to a live URL (e.g., `https://mindease.vercel.app`).

---

## 🔄 How the Cross-Deployment Works

1. **Vite Dynamic API Base URL:**  
   [frontend/src/lib/api.ts](file:///c:/Users/Samarth/Downloads/MindEase/frontend/src/lib/api.ts) reads `import.meta.env.VITE_API_URL`.  
   - If set on Vercel: All requests go to your live Render backend (`https://mindease-backend.onrender.com/api/v1/assessments/predict`).
   - If local dev: Uses local Vite reverse proxy (`localhost:5173` &rarr; `localhost:8000`).
2. **SPA Client-Side Routing:**  
   The pre-configured [`vercel.json`](file:///c:/Users/Samarth/Downloads/MindEase/frontend/vercel.json) rewrites all sub-routes (`/assessment`, `/dashboard`, `/report`, `/cognitive`, `/about`, `/privacy`) back to `/index.html` so page reloads never throw 404 errors.
3. **Dynamic CORS:**  
   [backend/app/main.py](file:///c:/Users/Samarth/Downloads/MindEase/backend/app/main.py) matches all incoming origins against `^https:\/\/.*\.vercel\.app$`, guaranteeing cross-origin browser requests succeed seamlessly.
4. **Smart Model Locator:**  
   [backend/app/predictor.py](file:///c:/Users/Samarth/Downloads/MindEase/backend/app/predictor.py) dynamically checks repository paths so Render always locates the trained neural network artifacts in `ml_model/`.
