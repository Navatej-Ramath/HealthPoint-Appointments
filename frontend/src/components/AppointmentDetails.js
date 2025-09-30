import React, { useEffect, useState } from "react";
import { api } from "../api/api";

export default function AppointmentDetails({ appointmentId, onClose }) {
  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (appointmentId) {
      api.get(`/appointments/${appointmentId}`)
        .then(res => setAppointment(res.data))
        .catch(() => setError("Failed to load appointment details."));
    }
  }, [appointmentId]);

  if (!appointmentId) return null;

  return (
    <div style={{border: "1px solid #ccc", padding: 16, margin: 16}}>
      <button onClick={onClose}>Close</button>
      <h3>Appointment Details</h3>
      {error && <div style={{color: "red"}}>{error}</div>}
      {appointment ? (
        <div>
          <div><b>Date:</b> {appointment.date}</div>
          <div><b>Time:</b> {appointment.time}</div>
          <div><b>Reason:</b> {appointment.reason}</div>
          <div><b>Status:</b> {appointment.status}</div>
          <div><b>Doctor ID:</b> {appointment.doctor_id}</div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
