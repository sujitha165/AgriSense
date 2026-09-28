# AGRISENSE 🌱

### *Smart Detection. Better Decisions. Healthier Crops.*

AgriSense is an AI-powered crop disease detection, severity grading, personalized treatment formulation, government subsidy navigation, and farm profit tracking platform designed for farmers.

---

## 📑 Table of Contents
1. [Project Overview & Problem Solved](#project-overview--problem-solved)
2. [Core Feature Modules](#core-feature-modules)
3. [Technology Stack](#technology-stack)
4. [Project Architecture & Directory Structure](#project-architecture--directory-structure)
5. [Database Architecture (MySQL)](#database-architecture-mysql)
6. [Installation & Setup](#installation--setup)
   - [Prerequisites](#prerequisites)
   - [Backend Configuration](#1-backend-setup)
   - [Frontend Configuration](#2-frontend-setup)
   - [Database Import](#3-mysql-database-setup)
7. [Running the Application](#running-the-application)
8. [Demo Account & Demonstration Mode](#demo-account--demonstration-mode)
9. [How the AI Pathology Engine Works](#how-the-ai-pathology-engine-works)
10. [How to Replace the Mock AI with a Real ML Model / API](#how-to-replace-the-mock-ai-with-a-real-ml-model--api)
11. [Multilingual Support](#multilingual-support)
12. [Deployment Guide (AWS EC2, S3, RDS)](#deployment-guide)

---

## 1. Project Overview & Problem Solved

Farmers often suffer severe harvest losses because agricultural experts are not immediately accessible during sudden disease outbreaks. Existing tools typically provide basic classification labels without indicating **severity**, **personalized biological/chemical treatments**, **disease history**, or **farm economic tracking**.

AgriSense bridges this gap by unifying:
* Instant AI computer vision leaf pathology scan
* 4-tier infection severity grading (Healthy, Low, Moderate, Severe)
* Stage-by-stage agronomic action plans (Immediate Action, Treatment, Prevention, Monitoring)
* 24/7 agricultural AI assistant for pest, weed, and irrigation inquiries
* Verified Indian government agricultural schemes (PM-KISAN, PMFBY, SMAM, AIF, KCC)
* Cultivation input cost and net profit tracking in Indian Rupees (₹)
* 4-language support: English, Tamil (தமிழ்), Telugu (తెలుగు), and Hindi (हिन्दी)

---

## 2. Core Feature Modules

| Module | Route | Description |
|---|---|---|
| **Landing Page** | `/` | Hero with scanning laser effect, problem/solution breakdown, 4-step workflow, supported crops, and CTA. |
| **Authentication** | `/login`, `/register`, `/forgot-password` | Form validation, password hashing, JWT bearer tokens, and a **1-click Quick Demo Farmer (Arun Kumar)** button. |
| **Farmer Dashboard** | `/dashboard` | Greeting, live farm stats (total scans, healthy count, detected pathogens, net profit), quick scan trigger, recent diagnostic history. |
| **Disease Detection** | `/detect` | Drag-and-drop file upload, live WebRTC camera capture, crop type selector, optional symptoms input. |
| **5-Stage AI Animation** | `/detect` | Professional scanning laser bar with real-time HUD and sequenced progress tracker. |
| **Diagnosis Report** | `/results/:id` | Circular confidence gauge, 4-tier severity indicator, symptoms, causes, actionable tabbed treatment plan, and save button. |
| **Scan History** | `/history` | Search, multi-criteria filters (by crop, disease, severity, date), and full report viewing/deletion. |
| **AI Agriculture Chatbot** | `/assistant` | AgriSense AI assistant with suggested questions, simulated voice input UI, and image upload UI. |
| **Government Schemes** | `/schemes` | Filterable schemes (Subsidy, Insurance, Loans, Central Govt, State Govt) with eligibility, benefits, and portal links. |
| **Profit & Expense Tracker** | `/profit` | Input seed, fertilizer, labor, and pesticide costs in ₹. Calculates totals and profit margins with visual distribution charts. |
| **Farmer Profile** | `/profile` | View and edit farm parcel information, contact details, preferred dialect, and main crop. |
| **Settings** | `/settings` | Real-time Light/Dark mode switcher, language selector, and notification toggles. |

---

## 3. Technology Stack

### Frontend
* **React 18** with **TypeScript**
* **Vite** (Next-generation bundler with instant HMR)
* **Tailwind CSS** (Custom agricultural theme palette, dark mode support)
* **React Router v6** (Nested layouts and client-side routing)
* **Lucide React** (Clean, accessible SVG iconography)
* **Dual-Mode API Client** (Communicates with Express REST API or gracefully uses pre-seeded local persistent database when offline)

### Backend
* **Node.js & Express.js**
* **JWT (JSON Web Tokens)** & **Bcrypt.js** password hashing
* **Multer** for multipart crop leaf image uploads
* **MySQL2 / Promise Pool** with resilient fallback store
* **Modular Controller-Route-Service-Model Architecture**

### Database
* **MySQL 8.0+**
* Preloaded schema and seed records in `database/schema.sql` and `database/seed.sql`

---

## 4. Project Architecture & Directory Structure

```
AgriSense/
├── backend/
│   ├── config/
│   │   ├── db.js                 # MySQL pool connection + resilient in-memory fallback
│   │   └── env.js                # Environment variable reader
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile management
│   │   ├── diseaseController.js  # Crop leaf image analysis and scan queries
│   │   ├── treatmentController.js# Action plan storage and retrieval
│   │   ├── chatController.js     # Chatbot dialog handler
│   │   ├── schemeController.js   # Govt agricultural schemes
│   │   ├── profitController.js   # Crop expenses and profit CRUD
│   │   └── notificationController.js # Alerts and notifications
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT token authentication + demo token support
│   │   ├── uploadMiddleware.js   # Multer image storage (JPG/JPEG/PNG)
│   │   └── errorMiddleware.js    # Friendly farmer-facing error handlers
│   ├── models/                   # SQL query abstractions (User, Scan, Treatment, Expense, Scheme, Notification)
│   ├── routes/                   # REST API route endpoints
│   ├── services/
│   │   ├── aiDetectionService.js # Structured AI detector with multi-crop knowledge base
│   │   └── chatBotService.js     # Agriculture domain knowledge NLP engine
│   ├── uploads/                  # Uploaded crop image storage
│   ├── package.json
│   └── server.js                 # Express application bootstrapper
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Button, Card, Modal, Badge
│   │   │   ├── layout/           # Navbar, Sidebar, MobileNav, Footer
│   │   │   ├── detection/        # ImageUploader, CameraModal, ScanningAnimation, ConfidenceMeter, SeverityIndicator
│   │   │   ├── chatbot/          # ChatMessageItem, ChatInputArea
│   │   │   ├── profit/           # ExpenseForm, ExpenseBreakdownChart
│   │   │   ├── schemes/          # SchemeCard
│   │   │   ├── notifications/   # NotificationDropdown
│   │   │   └── ui/               # LanguageSelector, ThemeToggle
│   │   ├── context/              # Auth, Language, Theme, and Toast Contexts
│   │   ├── data/                 # Translations (EN, TA, TE, HI), Mock Diseases, Demo Data
│   │   ├── layouts/              # MainLayout (Dashboard) & PublicLayout (Landing)
│   │   ├── pages/                # All 12 page views
│   │   ├── services/             # API client, Disease, Chat, Profit services
│   │   ├── types/                # TypeScript data models
│   │   ├── utils/                # Currency formatters (₹), date helpers, severity styles
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── database/
│   ├── schema.sql                # Complete MySQL DDL definitions
│   └── seed.sql                  # Realistic demo data for Arun Kumar, schemes, and scans
│
├── .env.example
├── package.json                  # Root workspace helper scripts
└── README.md
```

---

## 5. Database Architecture (MySQL)

The database schema consists of 6 tables:
1. `users`: Stores farmer profile, location, phone, hashed credentials, preferred language, and main crop.
2. `crop_scans`: Stores leaf image URLs, detected crop species, disease name, confidence %, severity rating, symptoms, and causes.
3. `treatments`: Stores immediate actions, bio/chemical treatments, prevention guidelines, and monitoring schedules.
4. `expenses`: Tracks land parcel size (in acres), seed, fertilizer, labor, pesticide, and other costs with generated total cost, revenue, and net profit columns.
5. `government_schemes`: Stores verified central/state agricultural subsidies, eligibility criteria, benefits, and official portals.
6. `notifications`: Stores alerts for completed diagnoses, treatment confirmations, and new government scheme releases.

---

## 6. Installation & Setup

### Prerequisites
* **Node.js** v18+ or v20+
* **npm** or **pnpm**
* *(Optional)* **MySQL Server 8.0+** (if you wish to connect to a real local MySQL database; if MySQL is not present, AgriSense automatically switches to its built-in resilient database without errors).

### 1. Backend Setup
```bash
cd backend
npm install
```

Copy the environment configuration:
```bash
cp ../.env.example .env
```
*(On Windows PowerShell: `copy ..\.env.example .env`)*

### 2. Frontend Setup
```bash
cd ../frontend
npm install
```

### 3. MySQL Database Setup (Optional)
If running a local MySQL server:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```
Update your `.env` in `backend/.env` with your MySQL user and password if different from default.

---

## 7. Running the Application

You can start both servers independently:

### Terminal 1: Start Backend API (Port 5000)
```bash
cd backend
npm start
```
The server will output:
```
====================================================
🌱 AGRISENSE BACKEND API SERVER RUNNING ON PORT 5000
   Health Check: http://localhost:5000/api/health
   Tagline: "Smart Detection. Better Decisions. Healthier Crops."
====================================================
```

### Terminal 2: Start Frontend (Port 3000)
```bash
cd frontend
npm run dev
```
Open **`http://localhost:3000`** in your web browser.

---

## 8. Demo Account & Demonstration Mode

AgriSense comes preloaded with a demonstration environment for **Arun Kumar** (Tamil Nadu Tomato Farmer):
* **Email:** `arun.farmer@agrisense.in`
* **Password:** `Farmer@123`
* **Or simply click the button:** **`⚡ Quick Demo Login (Arun Kumar)`** on the login page for instantaneous 1-click exploration.

Preloaded sample scans available in history and quick presets:
1. **Tomato — Early Blight** (94.5% confidence — Moderate)
2. **Rice — Healthy** (98.2% confidence — Healthy)
3. **Potato — Late Blight** (91.8% confidence — Severe)
4. **Apple — Apple Scab** (89.4% confidence — Moderate)

---

## 9. How the AI Pathology Engine Works

The detection engine in `backend/services/aiDetectionService.js` (and mirrored in `frontend/src/services/diseaseService.ts` for offline resilience) processes:
* Crop leaf image file or capture frame
* Crop species selector
* Farmer-observed symptoms (optional)

It evaluates the input against a scientific plant pathology matrix and returns:
```json
{
  "crop": "Tomato",
  "disease": "Early Blight",
  "pathogen": "Alternaria solani",
  "confidence": 94.5,
  "severity": "Moderate",
  "symptoms": [
    "Dark brown concentric rings on lower leaves",
    "Yellow chlorotic halos surrounding lesions"
  ],
  "causes": [
    "Fungal pathogen Alternaria solani",
    "High humidity (>80%) combined with temperatures between 24-29°C"
  ],
  "treatment": [
    "Prune and destroy infected lower leaves with sanitized shears.",
    "Spray bio-fungicide (Trichoderma viride formulation) in early morning."
  ],
  "prevention": [
    "Practice 3-year crop rotation avoiding solanaceous crops.",
    "Maintain 60cm row spacing for ventilation."
  ],
  "monitoring": "Inspect lower leaves every 3 days. Re-scan on AgriSense after 5 days.",
  "expert_warning": "For severe stem girdling or fruit rot, consult your local KVK officer."
}
```

---

## 10. How to Replace the Mock AI with a Real ML Model / API

The architecture was intentionally designed for modular plug-and-play machine learning integration.

### Option A: External Deep Learning Microservice (FastAPI / Flask / TorchServe)
1. Train a model (e.g. YOLOv8, ResNet50, or EfficientNet-B4) on the **PlantVillage** dataset.
2. Deploy the model with a REST endpoint (e.g., `https://ai.yourfarm.com/predict` accepting multipart image and crop type).
3. Set the environment variable in `backend/.env`:
   ```env
   AI_API_URL=https://ai.yourfarm.com/predict
   AI_API_KEY=your_secret_token
   ```
4. In `backend/services/aiDetectionService.js`, uncomment and connect `callExternalAiApi`:
   ```javascript
   const response = await axios.post(env.AI_API_URL, formData, {
     headers: { Authorization: `Bearer ${env.AI_API_KEY}` }
   });
   return response.data;
   ```

### Option B: Google Cloud Vertex AI or AWS SageMaker
* Plug in the respective cloud SDK client inside `backend/services/aiDetectionService.js`. The return format remains identical.

---

## 11. Multilingual Support

AgriSense includes a localized translation dictionary in `frontend/src/data/translations.ts` covering:
1. **English (Default)**
2. **Tamil (தமிழ்)**
3. **Telugu (తెలుగు)**
4. **Hindi (हिन्दी)**

Changing the language in the top bar or settings immediately updates all navigation menus, dashboard metrics, detection steps, severity ratings, scheme tags, and buttons without page reloads.

---

## 12. Deployment Guide

### Deploying Frontend (Vercel / Netlify / AWS S3 + CloudFront)
1. Build the production assets:
   ```bash
   cd frontend
   npm run build
   ```
2. The compiled static bundle is located in `frontend/dist/`.
3. Point your static hosting provider (e.g. AWS S3 + CloudFront) to serve `dist/` with fallback rewrite to `index.html`.

### Deploying Backend (AWS EC2 / Render / Railway)
1. Push `backend/` to your server.
2. Configure environment variables (`PORT`, `JWT_SECRET`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).
3. Start using a process manager:
   ```bash
   pm2 start server.js --name agrisense-api
   ```

### MySQL Database (AWS RDS)
1. Create a MySQL RDS instance.
2. Run `database/schema.sql` and `database/seed.sql` against the RDS endpoint.
3. Supply RDS credentials to `DATABASE_URL`.

---

## 13. License & Academic Attribution
Created for the academic college project showcase with professional production standards. Dedicated to advancing agricultural artificial intelligence and empowering farmers.

## Real AI Disease Detection

The original demo diagnosis engine has been removed from the detection path. The project now expects a local Python AI service at `http://127.0.0.1:8000`.

### Start the AI service (Windows)

```powershell
cd ai_service
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

The first prediction downloads the selected Hugging Face model(s) into the local Hugging Face cache. Internet access is required for that first download.

Models:
- `Kathir56/plant-disease-tamilnadu` for tomato, potato, apple, maize, pepper and grape.
- `Huyt/rice-leaf-disease-efficientnet-b0` for rice.
- `FarmGuard/cotton-densenet121` for cotton.

The returned percentage is the model's softmax confidence score, not a guaranteed field-level accuracy percentage. Severity is deliberately marked `Not assessed` rather than being fabricated from the disease name. Treatment guidance uses the project's disease knowledge base when available and otherwise falls back to IPM-based guidance. Chemical products and rates must be checked against the current local label/registration before use.
