# CureAI 🩺

### AI-Assisted Health Assessment & Medical Report Analyzer

CureAI is an educational AI-assisted health assessment platform that combines machine learning models with a web-based application to provide preliminary classifications for selected health conditions.

The platform supports four assessment categories: **Thyroid, Skin, Lung, and Breast**. It also includes a medical report analyzer that extracts text from PDF documents and images, allowing users to review and copy the extracted information.

> **Medical Disclaimer:** CureAI is an educational project. Its AI-generated outputs are preliminary classifications, not medical diagnoses or a substitute for professional medical advice. Always consult a qualified healthcare professional for medical decisions.

---

## ✨ Features

### 1. AI-Assisted Health Assessments
- Thyroid assessment
- Skin assessment
- Lung assessment
- Breast assessment
- Machine learning-based preliminary classification through a dedicated API

### 2. Medical Report Analyzer
- Supports PDF, JPG, and PNG uploads
- Extracts text from text-based PDF documents
- Uses OCR to extract text from images
- Image preprocessing to improve OCR readability
- Editable extracted text for user review
- Copy extracted text for personal reference
- File size validation and upload restrictions

*Extracted information may contain errors. Users should verify all values against the original report.*

### 3. Authentication & User Management
- User registration and login
- JWT-based authentication
- Session management and token refresh
- Password recovery through email
- Protected application routes

### 4. Assessment History & Reports
- Save assessment results to the database
- View previous assessments
- Access user-specific assessment history
- Review saved reports

### 5. Modern User Interface
- React-based responsive application
- Protected navigation
- Dedicated assessment pages
- User dashboard and profile
- Floating navigation dock

---

## 🏗️ System Architecture

CureAI follows a three-service architecture:

```text
                  ┌──────────────────────┐
                  │    React Frontend    │
                  │       Vite           │
                  └──────────┬───────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
       ┌─────────────────┐      ┌─────────────────┐
       │ Express Backend │      │  FastAPI ML API │
       │                 │      │                 │
       │ Authentication │      │ Thyroid Model   │
       │ Assessments     │      │ Skin Model      │
       │ Report Analyzer │      │ Lung Model      │
       │ Session Mgmt.   │      │ Breast Model    │
       └────────┬────────┘      └─────────────────┘
                │
                ▼
        ┌───────────────┐
        │   MongoDB     │
        │ User Records  │
        │ Assessments   │
        └───────────────┘
```

### Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Vite 8, React Router 7 |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| Machine Learning API | Python, FastAPI |
| Data Processing | Pandas, NumPy |
| Machine Learning | Scikit-learn, Joblib |
| Report Processing | pdf-parse, Tesseract.js, Sharp |
| Email | Nodemailer |
| Testing | Node.js Test Runner, Vitest, Testing Library |

---

## 📁 Project Structure

```text
CureAI/
│
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── ml/
│   ├── api/
│   │   ├── main.py
│   │   └── schemas.py
│   ├── models/
│   ├── requirements.txt
│   └── model training scripts
│
├── datasets/
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

Install the following before running the project:

- Node.js and npm
- Python 3.10 or later
- MongoDB local installation or a MongoDB Atlas connection
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/hanji-abhay/CureAI.git
cd CureAI
```

### 2. Set Up the Frontend

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_ML_API_BASE_URL=http://127.0.0.1:8000
```

Start the frontend:

```bash
npm run dev
```

The frontend will normally run at:

`http://localhost:5173`

### 3. Set Up the Backend

Open another terminal from the project root:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_secret

FRONTEND_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173

SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_FROM=your_sender_email
```

Replace the example values with your actual configuration. Keep credentials private and never commit `.env` files.

Start the backend:

```bash
npm run dev
```

The backend will normally run at:

`http://localhost:5000`

### 4. Set Up the Machine Learning API

Open another terminal from the project root:

```bash
cd ml
```

Create and activate a Python virtual environment.

**Windows PowerShell:**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**Install dependencies:**

```bash
pip install -r requirements.txt
```

The following trained model artifacts are required inside `ml/models/`:

```text
thyroid_api_model.joblib
skin_api_model.joblib
lung_api_model.joblib
breast_api_model.joblib
```

These model files are not included in the Git repository. Obtain the required artifacts separately and place them in the specified directory before starting the ML API.

Start the API from the `ml` directory:

```bash
uvicorn api.main:app --reload --host 127.0.0.1 --port 8000
```

The ML API will run at:

`http://127.0.0.1:8000`

Interactive API documentation:

`http://127.0.0.1:8000/docs`

---

## 🔌 API Endpoints

### Backend API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Backend health check |
| `/` | `/api/auth` | Authentication and user-related routes |
| `/`
