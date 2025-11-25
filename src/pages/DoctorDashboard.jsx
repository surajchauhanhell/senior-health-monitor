import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../styles/Dashboard.css';

const DoctorDashboard = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [newPatientId, setNewPatientId] = useState('');
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('list'); // 'list' or 'detail'

    // Detail View Data
    const [patientVitals, setPatientVitals] = useState([]);
    const [patientHistory, setPatientHistory] = useState([]);
    const [patientReports, setPatientReports] = useState([]);
    const [currentVital, setCurrentVital] = useState(null);

    useEffect(() => {
        fetchPatients();
    }, []);

    // Poll for live data if a patient is selected
    useEffect(() => {
        let interval;
        if (selectedPatient && view === 'detail') {
            fetchPatientDetails(selectedPatient.id); // Initial fetch
            fetchLatestVital(selectedPatient.id); // <--- Fetch immediately!
            interval = setInterval(() => {
                fetchLatestVital(selectedPatient.id);
            }, 3000); // Poll every 3 seconds
        }
        return () => clearInterval(interval);
    }, [selectedPatient, view]);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('doctor_patients')
                .select(`
                    patient_id,
                    profiles:patient_id (full_name, age, blood_group, avatar_url, phone, address, emergency_contact, medical_conditions)
                `)
                .eq('doctor_id', user.id);

            if (error) throw error;

            // Transform data
            const formattedPatients = data.map(item => ({
                id: item.patient_id,
                ...item.profiles
            }));
            setPatients(formattedPatients);
        } catch (err) {
            console.error('Error fetching patients:', err);
        } finally {
            setLoading(false);
        }
    };

    const addPatient = async (e) => {
        e.preventDefault();
        try {
            const { data: { user } } = await supabase.auth.getUser();

            // Check if patient exists
            const { data: patient, error: patientError } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', newPatientId)
                .single();

            if (patientError || !patient) {
                alert('Patient ID not found.');
                return;
            }

            // Add to doctor_patients
            const { error: linkError } = await supabase
                .from('doctor_patients')
                .insert([{ doctor_id: user.id, patient_id: newPatientId }]);

            if (linkError) {
                if (linkError.code === '23505') alert('Patient already added.');
                else throw linkError;
            } else {
                alert('Patient added successfully!');
                setNewPatientId('');
                fetchPatients();
            }
        } catch (err) {
            console.error('Error adding patient:', err);
            alert('Error adding patient.');
        }
    };

    const removePatient = async (patientId) => {
        if (!window.confirm('Are you sure you want to remove this patient?')) return;
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { error } = await supabase
                .from('doctor_patients')
                .delete()
                .eq('doctor_id', user.id)
                .eq('patient_id', patientId);

            if (error) throw error;
            fetchPatients();
            if (selectedPatient?.id === patientId) setView('list');
        } catch (err) {
            console.error('Error removing patient:', err);
        }
    };

    const handlePatientClick = (patient) => {
        setSelectedPatient(patient);
        setView('detail');
    };

    const fetchPatientDetails = async (patientId) => {
        // Fetch History
        const { data: history } = await supabase
            .from('vitals')
            .select('*')
            .eq('user_id', patientId)
            .order('created_at', { ascending: false })
            .limit(50);
        setPatientHistory(history || []);

        // Fetch Reports
        const { data: reports } = await supabase
            .from('medical_reports')
            .select('*')
            .eq('user_id', patientId)
            .order('created_at', { ascending: false });
        setPatientReports(reports || []);
    };

    const fetchLatestVital = async (patientId) => {
        console.log("Fetching vitals for:", patientId);
        const { data, error } = await supabase
            .from('vitals')
            .select('*')
            .eq('user_id', patientId)
            .order('created_at', { ascending: false })
            .limit(20); // Get last 20 for chart

        if (error) {
            console.error("Error fetching vitals:", error);
            return;
        }

        if (data && data.length > 0) {
            console.log("Vitals data received:", data[0]);
            setCurrentVital(data[0]);
            // Reverse for chart (oldest to newest)
            const chartData = [...data].reverse().map(v => ({
                time: new Date(v.created_at).toLocaleTimeString(),
                hr: v.heart_rate,
                bp_sys: v.systolic_bp,
                bp_dia: v.diastolic_bp,
                spo2: v.spo2
            }));
            setPatientVitals(chartData);
        } else {
            console.log("No vitals data found.");
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/login';
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-logo">SeniorGuard <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>DOCTOR</span></div>
                <nav>
                    <button className={`nav-link ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>My Patients</button>
                    {selectedPatient && (
                        <button className={`nav-link ${view === 'detail' ? 'active' : ''}`} onClick={() => setView('detail')}>
                            Patient Details
                        </button>
                    )}
                </nav>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </aside>

            <main className="dashboard-content">
                {view === 'list' ? (
                    <>
                        <header className="dash-header">
                            <h1>My Patients</h1>
                            <form onSubmit={addPatient} className="add-patient-form">
                                <input
                                    type="text"
                                    placeholder="Enter Patient ID (UUID)"
                                    value={newPatientId}
                                    onChange={(e) => setNewPatientId(e.target.value)}
                                    required
                                />
                                <button type="submit" className="btn-primary">Add Patient</button>
                            </form>
                        </header>

                        <div className="patients-grid">
                            {patients.map(patient => (
                                <div key={patient.id} className="patient-card" onClick={() => handlePatientClick(patient)}>
                                    <div className="patient-avatar">
                                        {patient.full_name ? patient.full_name[0].toUpperCase() : 'U'}
                                    </div>
                                    <div className="patient-info">
                                        <h3>{patient.full_name || 'Unnamed Patient'}</h3>
                                        <p>Age: {patient.age || 'N/A'} | Blood: {patient.blood_group || 'N/A'}</p>
                                        <small>ID: {patient.id.slice(0, 8)}...</small>
                                    </div>
                                    <div className="card-actions">
                                        <button className="view-details-btn">View Details</button>
                                        <button
                                            className="remove-btn"
                                            onClick={(e) => { e.stopPropagation(); removePatient(patient.id); }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <header className="dash-header">
                            <div>
                                <button className="back-btn" onClick={() => setView('list')}>← Back</button>
                                <h1 style={{ marginTop: '10px' }}>{selectedPatient?.full_name}'s Health Monitor</h1>
                            </div>
                            {currentVital && (
                                <div className={`status-badge ${currentVital.status}`} style={{ fontSize: '1rem' }}>
                                    Current Status: {currentVital.status.toUpperCase()}
                                </div>
                            )}
                        </header>

                        {/* Patient Profile Details */}
                        <div className="patient-profile-card" style={{ marginBottom: '20px', padding: '20px', background: 'var(--color-bg-card)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h3 style={{ marginBottom: '15px', color: 'var(--color-primary)', fontSize: '1rem' }}>Patient Profile</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', fontSize: '0.9rem', color: '#ddd' }}>
                                <div><strong style={{ color: '#888' }}>Age:</strong> {selectedPatient.age || 'N/A'}</div>
                                <div><strong style={{ color: '#888' }}>Blood Group:</strong> {selectedPatient.blood_group || 'N/A'}</div>
                                <div><strong style={{ color: '#888' }}>Phone:</strong> {selectedPatient.phone || 'N/A'}</div>
                                <div><strong style={{ color: '#888' }}>Emergency Contact:</strong> {selectedPatient.emergency_contact || 'N/A'}</div>
                                <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#888' }}>Address:</strong> {selectedPatient.address || 'N/A'}</div>
                                <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#888' }}>Medical Conditions:</strong> {selectedPatient.medical_conditions || 'N/A'}</div>
                            </div>
                        </div>

                        {/* Live Vitals */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>Heart Rate</h3>
                                <div className="stat-value">{currentVital?.heart_rate || '--'} <small>BPM</small></div>
                            </div>
                            <div className="stat-card">
                                <h3>Blood Pressure</h3>
                                <div className="stat-value">{currentVital?.systolic_bp || '--'}/{currentVital?.diastolic_bp || '--'} <small>mmHg</small></div>
                            </div>
                            <div className="stat-card">
                                <h3>SpO2</h3>
                                <div className="stat-value">{currentVital?.spo2 || '--'}%</div>
                            </div>
                        </div>

                        <div className="chart-container">
                            <h3>Live Heart Rate Trend</h3>
                            <div className="chart-wrapper">
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={patientVitals}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                        <XAxis dataKey="time" stroke="#666" />
                                        <YAxis stroke="#666" domain={[60, 100]} />
                                        <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                                        <Line type="monotone" dataKey="hr" stroke="#00eaff" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Medical Reports */}
                        <h3 style={{ marginTop: '40px', marginBottom: '20px' }}>Medical Reports</h3>
                        <div className="reports-grid">
                            {patientReports.length === 0 ? <p className="no-data">No reports available.</p> : (
                                patientReports.map(report => (
                                    <div key={report.id} className="report-card">
                                        <div className="report-icon">📄</div>
                                        <div className="report-info">
                                            <h4>{report.description}</h4>
                                            <small>{new Date(report.created_at).toLocaleDateString()}</small>
                                        </div>
                                        <a
                                            href={`https://vltdfrogzzllrwxbevwe.supabase.co/storage/v1/object/public/medical-reports/${report.file_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="view-btn"
                                        >
                                            View
                                        </a>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* History Table */}
                        <h3 style={{ marginTop: '40px', marginBottom: '20px' }}>Vital History</h3>
                        <div className="history-container">
                            <table className="history-table">
                                <thead>
                                    <tr>
                                        <th>Date & Time</th>
                                        <th>Heart Rate</th>
                                        <th>BP</th>
                                        <th>SpO2</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patientHistory.map((record) => (
                                        <tr key={record.id}>
                                            <td>{new Date(record.created_at).toLocaleString()}</td>
                                            <td>{record.heart_rate} BPM</td>
                                            <td>{record.systolic_bp}/{record.diastolic_bp}</td>
                                            <td>{record.spo2}%</td>
                                            <td>
                                                <span className={`status-badge ${record.status}`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default DoctorDashboard;
