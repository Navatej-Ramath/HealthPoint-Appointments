import React, { useState, useEffect } from "react";
import { api } from "../api/api";

export default function AppointmentBooking({ patient, onBooked }) {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    doctor_id: "",
    date: "",
    time: "",
    reason: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/doctors/").then(res => setDoctors(res.data));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!form.doctor_id || !form.date || !form.time || !form.reason) {
      setError("All fields are required.");
      return;
    }
    try {
      const payload = {
        ...form,
        patient_id: patient.id
      };
      const res = await api.post("/appointments/", payload);
      onBooked && onBooked(res.data);
    } catch (err) {
      setError("Booking failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Book Appointment</h2>
      <select name="doctor_id" value={form.doctor_id} onChange={handleChange} required>
        <option value="">Select Doctor</option>
        {doctors.map(doc => (
          <option key={doc.id} value={doc.id}>{doc.name}</option>
        ))}
      </select>
      <input name="date" type="date" value={form.date} onChange={handleChange} required />
      <input name="time" type="time" value={form.time} onChange={handleChange} required />
      <input name="reason" value={form.reason} onChange={handleChange} placeholder="Reason for visit" required />
      <button type="submit">Book</button>
      {error && <div style={{color: "red"}}>{error}</div>}
    </form>
  );
}
