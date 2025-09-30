from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, crud
from .database import SessionLocal, engine, Base
from typing import List
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify ["http://localhost:3000"] for more security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/patients/", response_model=schemas.Patient)
def create_patient(patient: schemas.PatientCreate, db: Session = Depends(get_db)):
    return crud.create_patient(db, patient)

@app.get("/patients/{patient_id}", response_model=schemas.Patient)
def read_patient(patient_id: int, db: Session = Depends(get_db)):
    db_patient = crud.get_patient(db, patient_id)
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return db_patient

@app.get("/doctors/", response_model=List[schemas.Doctor])
def list_doctors(db: Session = Depends(get_db)):
    return crud.get_doctors(db)

@app.post("/appointments/", response_model=schemas.Appointment)
def create_appointment(appointment: schemas.AppointmentCreate, db: Session = Depends(get_db)):
    return crud.create_appointment(db, appointment)

@app.get("/appointments/", response_model=List[schemas.Appointment])
def list_appointments(db: Session = Depends(get_db)):
    return crud.get_appointments(db)

@app.get("/appointments/{appointment_id}", response_model=schemas.Appointment)
def get_appointment(appointment_id: int, db: Session = Depends(get_db)):
    db_appointment = crud.get_appointment(db, appointment_id)
    if db_appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return db_appointment

@app.delete("/appointments/{appointment_id}", response_model=schemas.Appointment)
def cancel_appointment(appointment_id: int, db: Session = Depends(get_db)):
    appointment = crud.cancel_appointment(db, appointment_id)
    if appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment

@app.get("/appointments/doctor/{doctor_id}/date/{date}", response_model=List[schemas.Appointment])
def get_appointments_for_doctor_date(doctor_id: int, date: str, db: Session = Depends(get_db)):
    return db.query(models.Appointment).filter(models.Appointment.doctor_id == doctor_id, models.Appointment.date == date).all()
