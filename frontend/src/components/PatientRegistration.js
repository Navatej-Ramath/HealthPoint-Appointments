import React, { useState } from "react";
import { api } from "../api/api";

export default function PatientRegistration({ onRegistered }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [error, setError] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/patients/", form);
      onRegistered(res.data);
    } catch (err) {
      setError("Registration failed. Email may already exist.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register Patient</h2>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
      <button type="submit">Register</button>
      {error && <div style={{color: "red"}}>{error}</div>}
    </form>
  );
}
