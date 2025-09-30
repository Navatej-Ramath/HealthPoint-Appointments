# Medical Appointment System

A full-stack web application for managing patients, doctors, and appointments, built with **FastAPI** (Python backend) and **React** (frontend).

## Features
- Patient registration and management
- Doctor management
- Book, view, and cancel appointments
- Only available 15-min time slots are shown for booking
- Modern UI with Tailwind CSS

## Project Structure
```
.
├── backend/         # FastAPI backend
├── frontend/        # React frontend
├── sacomenv/        # Python virtual environment (not tracked)
├── app.db           # SQLite database (not tracked)
├── .gitignore
└── README.md
```

## Getting Started

### Backend (FastAPI)
1. **Create and activate a virtual environment:**
   ```bash
   python -m venv sacomenv
   # On Windows:
   .\sacomenv\Scripts\activate
   # On Mac/Linux:
   source sacomenv/bin/activate
   ```
2. **Install dependencies:**
   ```bash
   pip install -r backend/requirements.txt
   ```
3. **Run the backend server:**
   ```bash
   uvicorn backend.main:app --reload
   ```
   The API will be available at [http://localhost:8000](http://localhost:8000)

### Frontend (React)
1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```
2. **Start the frontend dev server:**
   ```bash
   npm start
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000)

## API Overview
See the API documentation section in the codebase for available endpoints.

## License
MIT
