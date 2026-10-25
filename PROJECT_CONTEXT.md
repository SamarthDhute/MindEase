# MindEase — Complete Project Context & Architecture Documentation

> **Notice for AI Assistants (ChatGPT / Claude / Copilot):**  
> This document contains the full architecture, codebase structure, machine learning pipeline, API contracts, frontend details, and known issues for **MindEase**. Read this entire document before writing code, proposing refactors, or suggesting bug fixes.

---

## 1. Project Overview & Mission

**MindEase** is a digital wellness and attention-pattern assessment platform designed primarily for students, knowledge workers, and digital creators. It combines:
1. **A 30-question self-audit survey** covering sleep quality, digital device habits, study environment, and intrusive thought patterns.
2. **6 interactive psychometric cognitive tests** measuring objective latency, vigilance, memory, and executive control.
3. **A trained Keras/TensorFlow deep neural network** that estimates the user's **Attention Interference Level** (`Low`, `Moderate`, `High`).
4. **Local sensitivity perturbation analysis** that identifies specific lifestyle factors that shaped the prediction and suggests personalized, practical adjustments.
5. **A calming, biophilic frontend** featuring 6 nature themes (Forest, Ocean, Sakura, Rainy Library, Mountain Morning, Starry Night) with subtle particle effects.

> ⚠️ **Disclaimer:** MindEase is a **research and digital-wellness educational tool**, not a clinical diagnostic system or medical replacement. All AI outputs and user-facing copy maintain a gentle, non-judgmental tone.

---

## 2. Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 19 (`^19.3.0`), TypeScript (`~6.0.2`), Vite 8 (`^8.3.0`) |
| **Styling & Animation** | Tailwind CSS v4 (`@tailwindcss/vite` `^4.3.3`), Framer Motion (`^14.0.0`), CSS Custom Properties (dynamic theming) |
| **Data Visualization** | Recharts (`^3.10.1`) |
| **Icons & Forms** | Lucide React (`^1.52.0`), React Hook Form (`^7.89.0`), Axios (`^1.20.0`) |
| **Routing** | React Router DOM v7 (`^7.18.4`) |
| **Backend API** | FastAPI (`>=0.110`), Uvicorn (`>=0.27`), Pydantic v2 (`>=2.6`) |
| **Machine Learning** | TensorFlow / Keras 2.15, Scikit-learn 1.4+, Pandas 2.1+, NumPy 1.26+, Joblib 1.3+ |
| **State / Storage** | Client-side `localStorage` (mock authentication, user profiles, report history, check-in logs) |

---

## 3. Repository Directory Structure

```
MindEase/
├── backend/
│   ├── app/
│   │   ├── __init__.py               # Package marker
│   │   ├── main.py                  # FastAPI app, CORS, /health, /api/v1/assessments/predict
│   │   ├── predictor.py             # AssessmentPredictor class, model loading, tensor perturbation
│   │   └── explanations.py          # Feature labels, human-friendly explanations, suggestions
│   ├── README.md                    # Backend run instructions & API contract
│   └── requirements.txt             # Backend dependencies
│
├── dataset/
│   └── attention_interference_dataset.csv  # 5,000 synthetic participant records (122 columns)
│
├── documentation/
│   └── attention_assessment_data_dictionary.xlsx  # Complete variable codebook
│
├── frontend/
│   ├── index.html                   # HTML entry point (pre-loads Nunito, Inter, Lora fonts)
│   ├── package.json                 # Frontend dependencies and scripts
│   ├── tsconfig.json                # TypeScript config with @ path alias
│   ├── vite.config.ts               # Vite configuration with /api & /health proxy to :8000
│   ├── vercel.json                  # SPA routing rules for Vercel
│   ├── .env.example                 # VITE_API_URL template for Vercel
│   ├── public/
│   │   └── illustrations/           # Calming wallpapers (forest.jpg, ocean.jpg, etc.)
│   └── src/
│       ├── App.tsx                  # BrowserRouter, route definitions, layout wrapper
│       ├── main.tsx                 # React DOM mount point
│       ├── index.css                # Tailwind 4 imports, 6 theme CSS token palettes, keyframe animations
│       ├── types/
│       │   └── index.ts             # TypeScript definitions for themes, user accounts, API schemas
│       ├── data/
│       │   └── questions.ts         # 30 survey questions across 7 sections with dataset mappings
│       ├── lib/
│       │   └── api.ts               # Axios instance calling VITE_API_URL or local proxy
│       ├── contexts/
│       │   ├── AuthContext.tsx      # Mock user auth, streak counter, check-in & score persistence
│       │   └── ThemeContext.tsx     # Theme switcher (6 themes, light/dark/auto mode)
│       ├── components/
│       │   ├── layout/
│       │   │   ├── AppLayout.tsx    # Shell with ParticleBackground, Navbar, Outlet, Footer
│       │   │   ├── Navbar.tsx       # Glass navbar with quick theme toggle & user menu
│       │   │   └── Footer.tsx       # Bottom footer with disclaimer & links
│       │   └── ui/
│       │       └── ParticleBackground.tsx # Canvas particles (leaves, petals, waves, rain, stars)
│       └── pages/
│           ├── LandingPage.tsx      # Hero, theme preview, cognitive game teasers, feature cards
│           ├── AboutPage.tsx        # Educational project mission & non-clinical philosophy
│           ├── PrivacyPage.tsx      # Data ethics, local-first storage, privacy details
│           ├── AuthPage.tsx         # Sign In / Register toggle with validation
│           ├── AssessmentPage.tsx   # 30-step survey with progress bar & auto-save draft
│           ├── CognitiveTestPage.tsx# 6 interactive psychometric tests (reaction, memory, etc.)
│           ├── AnalyzingPage.tsx    # Processing progress bar with dynamic local fallback
│           ├── ReportPage.tsx       # Results page with LevelBadge, RadarChart, top factors
│           ├── DashboardPage.tsx    # User command center, streaks, recent check-ins, daily quotes
│           ├── CheckInPage.tsx      # Daily check-in logger (mood, energy, focus, sleep, screen time)
│           ├── ProgressPage.tsx     # Historical trend charts (7d, 30d, all-time)
│           └── SettingsPage.tsx     # Palette selector, notification toggles, privacy settings
│
├── ml_model/
│   ├── analysis_report.md           # Dataset statistics (5000 rows, 122 cols, target breakdown)
│   ├── evaluation_report.md         # Precision, recall, F1, confusion matrix
│   ├── feature_importance.png       # Bar chart of top 20 permutation importance features
│   ├── model_comparison.csv         # NN vs Random Forest accuracy
│   ├── model_documentation.md       # Full documentation of neural architecture & training
│   ├── model_metadata.json          # Serialized column types, baseline median row, class names
│   ├── permutation_importance.csv   # Feature importance numbers on holdout test set
│   ├── preprocess.py                # ColumnTransformer pipeline builder
│   ├── predict.py                   # Standalone CLI prediction script
│   ├── preprocessor.pkl             # Fitted scikit-learn ColumnTransformer
│   ├── requirements.txt             # Training dependencies
│   ├── train_model.py               # Retraining script (EarlyStopping, ReduceLROnPlateau)
│   └── trained_model.h5             # Serialized Keras neural network weights
│
├── .python-version                  # 3.11.9 pinned for Render Python environment
├── render.yaml                      # Render Blueprint web service definition
├── vercel.json                      # Monorepo-friendly Vercel build & rewrite config
├── DEPLOYMENT_GUIDE.md              # Complete step-by-step deployment instructions
├── sample_user.json                 # Sample payload for testing prediction
└── package-lock.json                # Root package lock
```

---

## 4. Machine Learning Model & Pipeline

### Dataset
- **File:** `dataset/attention_interference_dataset.csv`
- **Scale:** 5,000 synthetic records, 121 feature columns + 1 target (`attention_interference_level`).
- **Target Distribution:**
  - `Moderate`: 1,735 (34.70%)
  - `Low`: 1,665 (33.30%)
  - `High`: 1,600 (32.00%)
- **Feature Domains:** Demographics, sleep hygiene, digital screen habits, workspace noise/light/comfort, internal thought wandering, emotional stress, and 8 cognitive test scores.

### Preprocessing (`ml_model/preprocess.py`)
- **Binary Features (0/1):** Imputed with most frequent value (`SimpleImputer`).
- **Numeric Features:** Imputed with median (`SimpleImputer`) and scaled (`StandardScaler`).
- **Categorical Features:** Imputed with most frequent value and one-hot encoded (`OneHotEncoder(handle_unknown="ignore")`).

### Neural Architecture (`ml_model/train_model.py`)
- **Framework:** TensorFlow / Keras Sequential.
- **Layers:**
  1. `Input(shape=(input_size,))`
  2. `Dense(128, activation="relu")` &rarr; `Dropout(0.30)`
  3. `Dense(64, activation="relu")` &rarr; `Dropout(0.20)`
  4. `Dense(32, activation="relu")`
  5. `Dense(3, activation="softmax")`
- **Output Classes:** `["High", "Low", "Moderate"]`
- **Training Strategy:** Stratified 80/20 train/test split, 10% validation split, EarlyStopping (patience 10, restores best weights), Adam optimizer, `sparse_categorical_crossentropy`.
- **Holdout Test Accuracy:** ~62.1% (F1: High 0.71, Low 0.70, Moderate 0.44).

### Sensitivity Analysis & Explanations (`backend/app/predictor.py` & `explanations.py`)
Instead of slow retraining or heavy SHAP libraries:
1. It compares the user's provided answers against the dataset's `baseline_row` (median/mode).
2. It sorts candidate features by permutation importance and tests up to 20 candidate answers in a **single batched forward pass** through the Keras model.
3. For each feature, it replaces the user's answer with the baseline and calculates the drop or rise in confidence percentage points:
   $$\Delta = (\text{user\_confidence} - \text{baseline\_confidence}) \times 100$$
4. The top 5 features with the highest absolute confidence shift are returned as `contributing_factors`.
5. `explanations.py` maps these features to non-clinical, student-friendly labels, explanations, and personalized habit suggestions.

---

## 5. API Contracts

### `POST /api/v1/assessments/predict`

#### Request Payload
```json
{
  "responses": {
    "sleep_quality": "Poor",
    "stress_level": "High",
    "phone_checking_without_notification": "Many times/hour",
    "daily_screen_time": "6-8 hours",
    "reaction_time_ms": 420.5,
    "attention_accuracy_percentage": 72.0
  }
}
```
*Note:* Missing features are automatically imputed with baseline values by the fitted preprocessor.

#### Response Schema
```json
{
  "attention_interference_level": "High",
  "confidence_percentage": 78.4,
  "explanation": "The model estimated High attention interference with 78.4% confidence. The responses that most actively shaped this result are highlighted below.",
  "contributing_factors": [
    {
      "feature": "sleep_quality",
      "label": "Sleep Quality",
      "answer": "Poor",
      "confidence_change_percentage_points": 8.5,
      "explanation": "Your sleep quality was lower than ideal, which can reduce alertness and daytime energy."
    }
  ],
  "personalized_suggestions": [
    "Improve your sleep routine because better rest can support concentration.",
    "Try placing your phone out of reach during important focus sessions."
  ],
  "global_model_factors": [
    {
      "feature": "phone_checking_without_notification",
      "label": "Phone Checking Frequency",
      "importance": 0.042,
      "note": "A primary behavioral marker of attentional disruption across the dataset."
    }
  ],
  "disclaimer": "MindEase is a research and digital-wellness tool, not a medical diagnosis..."
}
```

---

## 6. Frontend Architecture & Flow

### Page Workflow
1. **Landing Page (`/`):** Explains the concept, previews themes, showcases mini-games.
2. **Assessment Survey (`/assessment`):** 30 questions across 7 sections. Automatically saves in-progress drafts to `localStorage`.
3. **Cognitive Lab (`/cognitive`):** 6 interactive canvas mini-games:
   - Reaction Time Test (`reaction_time_ms`)
   - Continuous Vigilance Test (`attention_accuracy_percentage`, `missed_targets`)
   - Focus Flow Distraction Shield (`focus_flow_distraction_count`, `focus_recovery_time_seconds`)
   - Spatial Working Memory (`memory_score`)
   - Stroop Color Conflict (`stroop_accuracy_percentage`)
   - Task Switching Rule Test (`task_switch_accuracy`)
   *Scores automatically merge with survey answers.*
4. **Analyzing Page (`/analyzing`):** Displays a 5-stage progress animation while calling the FastAPI backend. **Includes a local heuristic fallback** so users get their report even if the backend is offline.
5. **Report Page (`/report`):** Displays badge level, confidence meter, Recharts radar/driver breakdown, factors, and suggestions.
6. **Dashboard (`/dashboard`):** Shows active streak, focus summary card, daily inspirational quote, and recent activity history.
7. **Daily Check-In (`/checkin`):** Quick daily check-in (mood, energy, focus, sleep, screen time, interruptions). Updates streak.
8. **Progress (`/progress`):** Longitudinal trend graphs (7-day, 30-day, all-time) with empty-state protection.
9. **Settings (`/settings`):** Theme switcher, mode toggle (light/dark/auto), notification preferences.

### State Management (`AuthContext.tsx`)
- All state is currently persisted in browser `localStorage`.
- Includes a pre-seeded demo user: **"Maya Lin"** (`maya@mindease.wellness`), who already has an assessment report and 3 days of check-in streak data for instant previewing.
- Supports switching accounts, registering new accounts, and retaking assessments.

---

## 7. Critical Bugs & Gotchas (Important for AI Assistants!)

When making modifications, be aware of these existing issues:

### 1. ✅ Target Class Label Mismatch (`"Low"` vs `"Minimal"`) — [RESOLVED]
- **Fixed:** `types/index.ts`, `ReportPage.tsx`, and `DashboardPage.tsx` now properly handle both `"Low"` and `"Minimal"` without falling back to Moderate.

### 2. ✅ Missing Footer Routes (`/about` & `/privacy`) — [RESOLVED]
- **Fixed:** Created `AboutPage.tsx` and `PrivacyPage.tsx` and registered their routes in `App.tsx`.

### 3. ⚠️ Copied `venv/pyvenv.cfg` Hardcoded Path
- The project's local `venv` was copied from another machine (`C:\Users\Admin\...`).
- On the current machine, Python is at `C:\Users\Samarth\AppData\Local\Programs\Python\Python311\python.exe`.
- Running `.\venv\Scripts\python.exe` directly errors out with `No Python at 'C:\Users\Admin...'`.
- The packages (FastAPI, TensorFlow, etc.) exist in `venv\Lib\site-packages`, but running locally requires setting `PYTHONPATH` or upgrading the venv with:
  ```powershell
  python -m venv venv --upgrade
  ```

### 4. ⚠️ Leftover Scaffolding Files
- `frontend/src/main.ts`, `frontend/src/counter.ts`, and `frontend/src/style.css` are dead boilerplate files from initial Vite template creation. The real app entry point is `frontend/src/main.tsx`.

---

## 8. How to Run Locally

### Backend (FastAPI)
```powershell
# From project root
python -m pip install -r backend/requirements.txt
python -m uvicorn app.main:app --app-dir backend --reload --port 8000
```
- API Docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

### Frontend (React + Vite)
```powershell
cd frontend
npm install
npm run dev
```
- Local URL: `http://localhost:5173`
- Vite proxies `/api` and `/health` requests automatically to `http://localhost:8000`.

---

## 9. Instructions for ChatGPT / Copilot / Claude

When generating code or suggesting improvements for MindEase, follow these guidelines:

1. **Do Not Break Biophilic Styling:** Maintain the nature-inspired aesthetic. Use CSS variables (`var(--color-primary)`, `var(--color-surface)`, `var(--gradient-hero)`) rather than hardcoded hex colors.
2. **Preserve Educational Framing:** Never use clinical, medical, or diagnostic phrasing (e.g., avoid "ADHD diagnosis", "deficit", "disorder"). Always use terms like "attention patterns", "attentional friction", "focus flow", and "cognitive recharge".
3. **Handle Backend Fallback:** Always ensure frontend API calls have graceful fallbacks or error handling so the UI never crashes if the FastAPI server is offline.
4. **Preserve State Contracts:** Ensure any new fields added to `UserAccount` or `AssessmentResponse` are synchronized with `types/index.ts`, `AuthContext.tsx`, and `predictor.py`.
