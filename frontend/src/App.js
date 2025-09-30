import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './index.css'; // Ensure Tailwind is imported

const API_URL = 'http://127.0.0.1:8000';

const doctorsData = [
    { id: 1, name: 'Dr. Evelyn Reed', department: 'Cardiology' },
    { id: 2, name: 'Dr. Marcus Thorne', department: 'Cardiology' },
    { id: 3, name: 'Dr. Lena Petrova', department: 'Neurology' },
    { id: 4, name: 'Dr. Kenji Tanaka', department: 'Neurology' },
    { id: 5, name: 'Dr. Sofia Rossi', department: 'Orthopedics' },
    { id: 6, name: 'Dr. Samuel Chen', department: 'Pediatrics' },
];
const departments = [...new Set(doctorsData.map(d => d.department))];

const Spinner = () => (
    <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
    </div>
);

const Card = ({ children, className = '' }) => (
    <div className={`bg-gradient-to-br from-white via-cyan-50 to-teal-100 shadow-2xl rounded-3xl p-8 md:p-10 ${className}`}>
        {children}
    </div>
);

const Button = ({ children, onClick, variant = 'primary', type = 'button', disabled = false, className = '' }) => {
    const baseClasses = 'w-full font-semibold py-3 px-5 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
    const variants = {
        primary: 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 focus:ring-teal-400',
        secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-400',
        danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400',
    };
    return (
        <button type={type} onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`} disabled={disabled}>
            {children}
        </button>
    );
};

const Input = ({ id, label, type, value, onChange, required = false, placeholder = '' }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-1">
            {label}
        </label>
        <input id={id} name={id} type={type} value={value} onChange={onChange} required={required} placeholder={placeholder}
            className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
    </div>
);

const Select = ({ id, label, value, onChange, children, required = false }) => (
     <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-1">
            {label}
        </label>
        <select id={id} value={value} onChange={onChange} required={required}
             className="mt-1 block w-full pl-4 pr-10 py-3 text-base bg-slate-50 border-slate-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-lg shadow-sm">
            {children}
        </select>
    </div>
);

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>;

// --- Register Patient Page ---
function RegisterPatientPage({ onPatientRegistered, navigateToBooking }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_URL}/patients/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone }),
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || 'Failed to register patient');
            }
            const newPatient = await response.json();
            onPatientRegistered(newPatient);
            navigateToBooking();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
             <button onClick={navigateToBooking} className="flex items-center gap-2 text-slate-600 hover:text-teal-500 mb-6 font-semibold">
                <ChevronLeftIcon /> Back to Booking
            </button>
            <Card>
                <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">Register New Patient</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input id="name" label="Full Name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    <Input id="email" label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <Input id="phone" label="Phone Number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div className="pt-4">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Registering...' : 'Register Patient'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

// --- Booking Page ---
function BookingPage({ patients, navigateToRegister, onAppointmentBooked, viewDoctorSchedule }) {
    const [patientId, setPatientId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [department, setDepartment] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [bookedTimes, setBookedTimes] = useState([]);

    const filteredPatients = useMemo(() =>
        patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())),
        [patients, searchTerm]
    );

    const availableDoctors = useMemo(() =>
        doctorsData.filter(d => d.department === department),
        [department]
    );

    useEffect(() => {
        setDoctorId('');
        setDate('');
        setTime('');
        setBookedTimes([]);
    }, [department]);

    useEffect(() => {
        setDate('');
        setTime('');
        setBookedTimes([]);
    }, [doctorId]);

    useEffect(() => {
        setTime('');
        if (doctorId && date) {
            fetch(`${API_URL}/appointments/doctor/${doctorId}/date/${date}`)
                .then(res => res.json())
                .then(data => setBookedTimes(data.map(app => app.time)))
                .catch(() => setBookedTimes([]));
        } else {
            setBookedTimes([]);
        }
    }, [doctorId, date]);

    // Generate 15-min slots from 09:00 to 17:00
    const allSlots = useMemo(() => {
        const slots = [];
        let hour = 9, minute = 0;
        while (hour < 17 || (hour === 17 && minute === 0)) {
            const h = hour.toString().padStart(2, '0');
            const m = minute.toString().padStart(2, '0');
            slots.push(`${h}:${m}`);
            minute += 15;
            if (minute === 60) {
                minute = 0;
                hour++;
            }
        }
        return slots;
    }, []);

    const freeSlots = useMemo(() =>
        allSlots.filter(slot => !bookedTimes.includes(slot)),
        [allSlots, bookedTimes]
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!patientId || !doctorId || !date || !time) {
            setError('Please fill all required fields.');
            return;
        }
        setIsLoading(true);
        setError('');

        const selectedDoctor = doctorsData.find(d => d.id === parseInt(doctorId));
        try {
            const response = await fetch(`${API_URL}/appointments/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patient_id: parseInt(patientId),
                    doctor_id: selectedDoctor.id,
                    date,
                    time,
                    reason,
                }),
            });
            if (!response.ok) {
                let errData;
                try {
                  errData = await response.json();
                } catch {
                  errData = await response.text();
                }
                throw new Error(typeof errData === 'string' ? errData : (errData.detail || JSON.stringify(errData)));
            }
            const newAppointment = await response.json();
            onAppointmentBooked(newAppointment);
            viewDoctorSchedule(selectedDoctor.id, date); // Navigate to schedule
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="max-w-md mx-auto">
            <Card>
                <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">Book an Appointment</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Patient</label>
                        <div className="flex gap-2 items-center">
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon />
                                </div>
                                <input type="text" placeholder="Search patient..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-3 py-3 bg-slate-50 border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"/>
                            </div>
                            <button type="button" onClick={navigateToRegister} className="p-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition">
                                <PlusIcon />
                            </button>
                        </div>
                        <select value={patientId} onChange={(e) => setPatientId(e.target.value)} required
                             className="mt-2 block w-full pl-4 pr-10 py-3 text-base bg-slate-50 border-slate-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-lg shadow-sm">
                            <option value="">-- Select a Patient --</option>
                            {filteredPatients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>

                    <Select id="department" label="Department" value={department} onChange={e => setDepartment(e.target.value)} required>
                        <option value="">-- Select Department --</option>
                        {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                    </Select>

                    {department && (
                        <Select id="doctor" label="Doctor" value={doctorId} onChange={e => setDoctorId(e.target.value)} required>
                            <option value="">-- Select Doctor --</option>
                            {availableDoctors.map(doc => <option key={doc.id} value={doc.id}>{doc.name}</option>)}
                        </Select>
                    )}

                    {doctorId && (
                        <Input id="date" label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                    )}

                    {doctorId && date && (
                        <Select id="time" label="Time" value={time} onChange={e => setTime(e.target.value)} required>
                            <option value="">-- Select Time --</option>
                            {freeSlots.length === 0 && <option disabled>No free slots</option>}
                            {freeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                        </Select>
                    )}
                    
                    <Input id="reason" label="Reason for Visit (Optional)" type="text" value={reason} onChange={(e) => setReason(e.target.value)} />
                    
                    {error && <p className="text-red-500 text-sm text-center pt-2">{error}</p>}
                    
                    <div className="pt-4">
                        <Button type="submit" disabled={isLoading || !patientId || !doctorId || !date || !time}>
                            {isLoading ? 'Booking...' : 'Book & View Schedule'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

// --- Doctor Schedule Page ---
function DoctorScheduleView({ doctorId, selectedDate, appointments, patients, navigateToBooking, onAppointmentCancelled }) {
    const doctor = doctorsData.find(d => d.id === doctorId);
    
    const getPatientName = (patientId) => {
        const patient = patients.find(p => p.id === patientId);
        return patient ? patient.name : 'Unknown';
    };

    const dailyAppointments = useMemo(() => {
        return appointments
            .filter(app => app.doctor_id === doctorId && app.date === selectedDate)
            .sort((a, b) => (a.time > b.time ? 1 : -1));
    }, [appointments, doctorId, selectedDate]);

    if (!doctor) return <p>Doctor not found.</p>;

    return (
         <div className="max-w-2xl mx-auto">
             <button onClick={navigateToBooking} className="flex items-center gap-2 text-slate-600 hover:text-teal-500 mb-6 font-semibold">
                <ChevronLeftIcon /> Back to Booking
            </button>
            <Card>
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-800">{doctor.name}</h2>
                    <p className="text-lg text-teal-600 font-medium">{doctor.department}</p>
                    <p className="text-md text-slate-500 mt-2">Schedule for {new Date(selectedDate + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                <div className="space-y-4">
                    {dailyAppointments.length > 0 ? (
                        dailyAppointments.map(app => (
                            <div key={app.id} className="bg-slate-50 p-4 rounded-lg flex justify-between items-center shadow-sm">
                                <div>
                                    <p className="font-semibold text-slate-700">{app.time.slice(0,5)}</p>
                                    <p className="text-teal-700">{getPatientName(app.patient_id)}</p>
                                    <p className="text-sm text-slate-500 italic">{app.reason}</p>
                                </div>
                                <button onClick={() => onAppointmentCancelled(app.id)} className="text-red-500 hover:text-red-700 font-semibold text-sm">
                                    Cancel
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-slate-500 py-6">No appointments scheduled for this day.</p>
                    )}
                </div>
            </Card>
        </div>
    );
}

// --- Main App Component ---
export default function App() {
    const [currentPage, setCurrentPage] = useState('booking'); // booking, registerPatient, doctorSchedule
    const [pageContext, setPageContext] = useState({}); // To pass data between pages
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            // Try to fetch patients from backend
            const patientsRes = await fetch(`${API_URL}/patients/`);
            let patientsData = [];
            if (patientsRes.ok) {
                patientsData = await patientsRes.json();
            }
            setPatients(patientsData);

            const appointmentsRes = await fetch(`${API_URL}/appointments/`);
            if (!appointmentsRes.ok) {
                throw new Error('Failed to fetch appointments. Make sure the backend server is running and accessible.');
            }
            const appointmentsData = await appointmentsRes.json();
            setAppointments(appointmentsData);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handlePatientRegistered = (newPatient) => {
        setPatients(prev => [...prev, newPatient]);
    };
    
    const handleAppointmentBooked = (newAppointment) => {
        setAppointments(prev => [...prev, newAppointment]);
    };
    
    const handleAppointmentCancelled = async (appointmentId) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
        try {
            const response = await fetch(`${API_URL}/appointments/${appointmentId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to cancel appointment');
            setAppointments(prev => prev.filter(app => app.id !== appointmentId));
        } catch (err) {
            alert(err.message);
        }
    };

    const navigateToBooking = () => setCurrentPage('booking');
    const navigateToRegister = () => setCurrentPage('registerPatient');
    const viewDoctorSchedule = (doctorId, selectedDate) => {
        setPageContext({ doctorId, selectedDate });
        setCurrentPage('doctorSchedule');
    };

    return (
        <div className="bg-gradient-to-br from-cyan-50 via-white to-teal-100 min-h-screen font-sans text-slate-900">
            <header className="bg-white/80 backdrop-blur-lg shadow-md sticky top-0 z-10">
                <div className="container mx-auto px-4 py-5">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-600 text-center">
                        HealthPoint Appointments
                    </h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-10">
                {isLoading && <Spinner />}
                {error && <p className="text-red-500 bg-red-100 p-4 rounded-lg text-center mb-6">{error}</p>}
                {!isLoading && !error && (
                    <>
                        {currentPage === 'booking' && <BookingPage patients={patients} navigateToRegister={navigateToRegister} onAppointmentBooked={handleAppointmentBooked} viewDoctorSchedule={viewDoctorSchedule} />}
                        {currentPage === 'registerPatient' && <RegisterPatientPage onPatientRegistered={handlePatientRegistered} navigateToBooking={navigateToBooking} />}
                        {currentPage === 'doctorSchedule' && <DoctorScheduleView {...pageContext} appointments={appointments} patients={patients} navigateToBooking={navigateToBooking} onAppointmentCancelled={handleAppointmentCancelled} />}
                    </>
                )}
            </main>
        </div>
    );
}
