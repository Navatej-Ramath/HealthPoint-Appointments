import React, { useEffect, useState } from "react";
import { api } from "../api/api";

export default function AppointmentsList({ patient }) {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  const fetchAppointments = () => {
    api.get("/appointments/")
      .then(res => setAppointments(res.data.filter(a => a.patient_id === patient.id)))
      .catch(() => setError("Failed to load appointments."));
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line
  }, []);

  const handleCancel = async (id) => {
    try {
      await api.delete(`/appointments/${id}`);
      fetchAppointments();
    } catch {
      setError("Failed to cancel appointment.");
    }
  };

  return (
    <div>
      <h2>Your Appointments</h2>
      {error && <div style={{color: "red"}}>{error}</div>}
      <ul>
        {appointments.map(app => (
          <li key={app.id}>
            {app.date} {app.time} with Doctor #{app.doctor_id} - {app.reason} [{app.status}]
            {app.status === "booked" && (
              <button onClick={() => handleCancel(app.id)}>Cancel</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
