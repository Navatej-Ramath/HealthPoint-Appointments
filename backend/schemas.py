from pydantic import BaseModel
from typing import Optional

class PatientBase(BaseModel):
    name: str
    phone: str
    email: str

class PatientCreate(PatientBase):
    pass

class Patient(PatientBase):
    id: int
    class Config:
        orm_mode = True

class DoctorBase(BaseModel):
    name: str

class DoctorCreate(DoctorBase):
    pass

class Doctor(DoctorBase):
    id: int
    class Config:
        orm_mode = True

class AppointmentBase(BaseModel):
    patient_id: int
    doctor_id: int
    date: str
    time: str
    reason: str

class AppointmentCreate(AppointmentBase):
    pass

class Appointment(AppointmentBase):
    id: int
    status: str
    class Config:
        orm_mode = True
