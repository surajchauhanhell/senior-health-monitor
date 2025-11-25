import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateStatus, calculateDetailedStatus } from '../utils/healthLogic';
import { BluetoothManager } from '../utils/bluetoothManager';
import '../styles/Dashboard.css';

const UserDashboard = () => {
    const [vitals, setVitals] = useState([]);
    const [currentVital, setCurrentVital] = useState({ hr: 72, bp_sys: 120, bp_dia: 80, spo2: 98 });
    const [activeTab, setActiveTab] = useState('overview');
    const [historyData, setHistoryData] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // Profile State
    const [profile, setProfile] = useState({
        id: '',
        full_name: '',
        age: '',
        blood_group: '',
        phone: '',
        address: '',
        emergency_contact: '',
        medical_conditions: ''
    });

    // Device State
    const [isScanning, setIsScanning] = useState(false);
    const [scannedDevices, setScannedDevices] = useState([]);
    const [connectedDevice, setConnectedDevice] = useState(null);

    // Calculate detailed status for display
    let userAge = 65;
    if (profile.age && !isNaN(parseInt(profile.age))) {
        userAge = parseInt(profile.age);
    }
    const { hrStatus, bpStatus, spo2Status } = calculateDetailedStatus(
        userAge,
        currentVital.hr,
        currentVital.bp_sys,
        currentVital.bp_dia,
        currentVital.spo2
    );

    // Simulate real-time data updates and sync to Supabase
    useEffect(() => {
        if (!profile || !profile.id || !connectedDevice) return; // Wait for profile and device connection

        const interval = setInterval(async () => {
            const newVital = {
                time: new Date().toLocaleTimeString(),
                hr: 70 + Math.floor(Math.random() * 10),
                bp_sys: 115 + Math.floor(Math.random() * 15),
                bp_dia: 75 + Math.floor(Math.random() * 10),
                spo2: 97 + Math.floor(Math.random() * 3)
            };

            setCurrentVital(newVital);
            setVitals(prev => [...prev.slice(-19), newVital]); // Keep last 20 points

            // Upload to Supabase for Doctor View
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    // Calculate status based on Age (default to 65 if not set or invalid)
                    let userAge = 65;
                    if (profile.age && !isNaN(parseInt(profile.age))) {
                        userAge = parseInt(profile.age);
                    }

                    let status = 'normal';
                    try {
                        status = calculateStatus(userAge, newVital.hr, newVital.bp_sys, newVital.bp_dia, newVital.spo2);
                    } catch (calcError) {
                        console.error("Error calculating status:", calcError);
                    }

                    await supabase.from('vitals').insert([{
                        user_id: user.id,
                        heart_rate: newVital.hr,
                        systolic_bp: newVital.bp_sys,
                        diastolic_bp: newVital.bp_dia,
                        spo2: newVital.spo2,
                        status: status
                    }]);
                }
            } catch (err) {
                console.error("Error uploading vital:", err);
            }

        }, 5000); // Update every 5 seconds to avoid spamming DB too much

        return () => clearInterval(interval);
    }, [profile, connectedDevice]); // Re-run if profile or device connection changes

    // Fetch data based on active tab
    useEffect(() => {
        fetchProfile(); // Always fetch profile to get ID
        if (activeTab === 'history') {
            fetchHistory();
            fetchReports();
        } else if (activeTab === 'settings') {
            // fetchProfile(); // Already called
        }
    }, [activeTab]);

    const [reports, setReports] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [description, setDescription] = useState('');
    const [savingProfile, setSavingProfile] = useState(false);

    const fetchProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) throw error;
            if (data) {
                setProfile({
                    id: data.id,
                    full_name: data.full_name || '',
                    age: data.age || '',
                    blood_group: data.blood_group || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    emergency_contact: data.emergency_contact || '',
                    medical_conditions: data.medical_conditions || ''
                });
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No user found");

            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: profile.full_name,
                    age: profile.age,
                    blood_group: profile.blood_group,
                    phone: profile.phone,
                    address: profile.address,
                    emergency_contact: profile.emergency_contact,
                    medical_conditions: profile.medical_conditions,
                    updated_at: new Date()
                })
                .eq('id', user.id);

            if (error) throw error;
            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Error updating profile:', err);
            alert('Error updating profile');
        } finally {
            setSavingProfile(false);
        }
    };

    const fetchReports = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('medical_reports')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReports(data || []);
        } catch (err) {
            console.error('Error fetching reports:', err);
        }
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!uploadFile) return;

        setUploading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No user found");

            const fileExt = uploadFile.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;
            const filePath = fileName;

            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from('medical-reports')
                .upload(filePath, uploadFile);

            if (uploadError) throw uploadError;

            // 2. Insert into Database
            const { error: dbError } = await supabase
                .from('medical_reports')
                .insert([{
                    user_id: user.id,
                    file_name: uploadFile.name,
                    file_path: filePath,
                    description: description,
                    file_type: fileExt
                }]);

            if (dbError) throw dbError;

            // Reset form and refresh list
            setUploadFile(null);
            setDescription('');
            fetchReports();
            alert('Report uploaded successfully!');

        } catch (error) {
            console.error('Error uploading report:', error);
            alert('Error uploading report: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('vitals')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;
            setHistoryData(data || []);
        } catch (err) {
            console.error('Error fetching history:', err);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleTestCritical = async () => {
        const criticalVital = {
            time: new Date().toLocaleTimeString(),
            hr: 145 + Math.floor(Math.random() * 10), // High HR
            bp_sys: 160 + Math.floor(Math.random() * 10), // High BP
            bp_dia: 100 + Math.floor(Math.random() * 5),
            spo2: 88 - Math.floor(Math.random() * 5) // Low SpO2
        };

        setCurrentVital(criticalVital);
        setVitals(prev => [...prev.slice(-19), criticalVital]);

        // Upload Critical Data
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase.from('vitals').insert([{
                    user_id: user.id,
                    heart_rate: criticalVital.hr,
                    systolic_bp: criticalVital.bp_sys,
                    diastolic_bp: criticalVital.bp_dia,
                    spo2: criticalVital.spo2,
                    status: 'critical'
                }]);
                alert("Critical data sent! Check Doctor Dashboard.");
            }
        } catch (err) {
            console.error("Error sending critical data:", err);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/login';
    };

    const handleScanBluetooth = () => {
        setIsScanning(true);
        setScannedDevices([]);
        // Simulate scanning
        setTimeout(() => {
            setScannedDevices([
                { id: '1', name: 'SeniorMonitor-X1' },
                { id: '2', name: 'HealthBand-Pro' }
            ]);
            setIsScanning(false);
        }, 2000);
    };

    const handleConnectDevice = (device) => {
        // Simulate connection
        setConnectedDevice(device);
        alert(`Connected to ${device.name}`);
    };

    const handleSOS = () => {
        if (!profile.emergency_contact) {
            alert("Please set an emergency contact in Settings first!");
            setActiveTab('settings');
            return;
        }

        const phoneMatch = profile.emergency_contact.match(/\d+/g);

        if (!phoneMatch) {
            alert("Could not find a valid phone number in Emergency Contact.");
            return;
        }

        const phoneNumber = phoneMatch.join('');
        const baseMessage = "Emergency! I need help immediately.";

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
                    const fullMessage = `${baseMessage} My location: ${mapsLink}`;
                    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(fullMessage)}`;
                    window.open(whatsappUrl, '_blank');
                },
                (error) => {
                    console.error("Error getting location:", error);
                    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(baseMessage)}`;
                    window.open(whatsappUrl, '_blank');
                }
            );
        } else {
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(baseMessage)}`;
            window.open(whatsappUrl, '_blank');
        }
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-logo">SeniorGuard</div>
                <div className="user-id-display" style={{ padding: '0 15px 15px', color: '#666', fontSize: '0.8rem' }}>
                    <small>My Patient ID:</small><br />
                    <code style={{ color: 'var(--color-primary)', userSelect: 'all' }}>{profile.id || 'Loading...'}</code>
                </div>
                <nav>
                    <button
                        className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        History
                    </button>
                    <button
                        className={`nav-link ${activeTab === 'devices' ? 'active' : ''}`}
                        onClick={() => setActiveTab('devices')}
                    >
                        Devices
                    </button>
                    <button
                        className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        Settings
                    </button>
                </nav>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </aside >

            <main className="dashboard-content">
                <header className="dash-header">
                    <h1>
                        {activeTab === 'overview' && 'My Health Status'}
                        {activeTab === 'history' && 'Health History'}
                        {activeTab === 'devices' && 'Device Connection'}
                        {activeTab === 'settings' && 'Profile Settings'}
                    </h1>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            className="btn-primary"
                            style={{ backgroundColor: '#ff0055', border: 'none' }}
                            onClick={handleTestCritical}
                        >
                            Test Critical
                        </button>
                        <button className="sos-button-small" onClick={handleSOS}>SOS ALERT</button>
                    </div>
                </header>

                {activeTab === 'overview' && (
                    <>
                        {!connectedDevice ? (
                            <div className="no-device-container" style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔌</div>
                                <h2>No Device Connected</h2>
                                <p style={{ marginBottom: '30px' }}>Please connect your health monitor to view real-time vitals.</p>
                                <button className="btn-primary" onClick={() => setActiveTab('devices')}>
                                    Connect Device
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="stats-grid">
                                    <div className="stat-card">
                                        <h3>Heart Rate</h3>
                                        <div className="stat-value">{currentVital.hr} <small>BPM</small></div>
                                        <div className={`stat-status ${hrStatus}`}>{hrStatus.charAt(0).toUpperCase() + hrStatus.slice(1)}</div>
                                    </div>
                                    <div className="stat-card">
                                        <h3>Blood Pressure</h3>
                                        <div className="stat-value">{currentVital.bp_sys}/{currentVital.bp_dia} <small>mmHg</small></div>
                                        <div className={`stat-status ${bpStatus}`}>{bpStatus.charAt(0).toUpperCase() + bpStatus.slice(1)}</div>
                                    </div>
                                    <div className="stat-card">
                                        <h3>SpO2</h3>
                                        <div className="stat-value">{currentVital.spo2}%</div>
                                        <div className={`stat-status ${spo2Status}`}>{spo2Status.charAt(0).toUpperCase() + spo2Status.slice(1)}</div>
                                    </div>
                                </div>

                                <div className="chart-container">
                                    <h3>Live Heart Rate Monitor</h3>
                                    <div className="chart-wrapper">
                                        <ResponsiveContainer width="100%" height={300}>
                                            {vitals && vitals.length > 0 ? (
                                                <LineChart data={vitals}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                                    <XAxis dataKey="time" stroke="#666" />
                                                    <YAxis stroke="#666" domain={[60, 100]} />
                                                    <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                                                    <Line type="monotone" dataKey="hr" stroke="#00eaff" strokeWidth={2} dot={false} />
                                                </LineChart>
                                            ) : (
                                                <div style={{ color: '#666', textAlign: 'center', paddingTop: '100px' }}>
                                                    Waiting for data...
                                                </div>
                                            )}
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}

                {
                    activeTab === 'history' && (
                        <div className="history-container">
                            <div className="upload-section">
                                <h3>Upload Medical Report</h3>
                                <form onSubmit={handleFileUpload} className="upload-form">
                                    <input
                                        type="file"
                                        onChange={(e) => setUploadFile(e.target.files[0])}
                                        required
                                        className="file-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Description (e.g., Blood Test Report)"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                        className="desc-input"
                                    />
                                    <button type="submit" className="btn btn-primary" disabled={uploading}>
                                        {uploading ? 'Uploading...' : 'Upload Report'}
                                    </button>
                                </form>
                            </div>

                            <h3>Past Reports</h3>
                            {reports.length === 0 ? (
                                <p className="no-data">No reports uploaded yet.</p>
                            ) : (
                                <div className="reports-grid">
                                    {reports.map(report => (
                                        <div key={report.id} className="report-card">
                                            <div className="report-icon">📄</div>
                                            <div className="report-info">
                                                <h4>{report.description}</h4>
                                                <small>{new Date(report.created_at).toLocaleDateString()}</small>
                                                <span className="file-name">{report.file_name}</span>
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
                                    ))}
                                </div>
                            )}

                            <h3 style={{ marginTop: '40px' }}>Vital History</h3>
                            {loadingHistory ? (
                                <p>Loading history...</p>
                            ) : historyData.length === 0 ? (
                                <div className="no-data">
                                    <p>No history records found.</p>
                                    <small>Data will appear here once your device starts syncing.</small>
                                </div>
                            ) : (
                                <table className="history-table">
                                    <thead>
                                        <tr>
                                            <th>Date & Time</th>
                                            <th>Heart Rate</th>
                                            <th>BP (sys/dia)</th>
                                            <th>SpO2</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historyData.map((record) => (
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
                            )}
                        </div>
                    )
                }

                {
                    activeTab === 'settings' && (
                        <div className="settings-container">
                            <form onSubmit={handleProfileUpdate} className="profile-form">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        value={profile.full_name}
                                        onChange={e => setProfile({ ...profile, full_name: e.target.value })}
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Age</label>
                                        <input
                                            type="number"
                                            value={profile.age}
                                            onChange={e => setProfile({ ...profile, age: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Blood Group</label>
                                        <select
                                            value={profile.blood_group}
                                            onChange={e => setProfile({ ...profile, blood_group: e.target.value })}
                                        >
                                            <option value="">Select</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        value={profile.phone}
                                        onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Address</label>
                                    <textarea
                                        value={profile.address}
                                        onChange={e => setProfile({ ...profile, address: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Emergency Contact</label>
                                    <input
                                        type="text"
                                        value={profile.emergency_contact}
                                        onChange={e => setProfile({ ...profile, emergency_contact: e.target.value })}
                                        placeholder="Name & Phone Number"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Medical Conditions / Allergies</label>
                                    <textarea
                                        value={profile.medical_conditions}
                                        onChange={e => setProfile({ ...profile, medical_conditions: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="btn-primary" disabled={savingProfile}>
                                    {savingProfile ? 'Saving...' : 'Save Profile'}
                                </button>
                            </form>
                        </div>
                    )
                }

                {
                    activeTab === 'devices' && (
                        <div className="devices-container">
                            <div className="device-section">
                                <div className="section-header">
                                    <h3><span className="icon">🔵</span> Bluetooth Connection</h3>
                                    <p>Connect your wearable health monitor via Bluetooth.</p>
                                </div>

                                <div className="bluetooth-controls">
                                    {!isScanning && !connectedDevice && (
                                        <button className="btn-primary scan-btn" onClick={handleScanBluetooth}>
                                            Scan for Devices
                                        </button>
                                    )}

                                    {isScanning && (
                                        <div className="scanning-indicator">
                                            <div className="spinner"></div>
                                            <p>Scanning for nearby devices...</p>
                                        </div>
                                    )}

                                    {connectedDevice && (
                                        <div className="connected-device-card">
                                            <div className="device-info">
                                                <h4>{connectedDevice.name}</h4>
                                                <span className="status-badge normal">Connected</span>
                                            </div>
                                            <button className="btn-secondary" onClick={() => setConnectedDevice(null)}>
                                                Disconnect
                                            </button>
                                        </div>
                                    )}

                                    {!connectedDevice && scannedDevices.length > 0 && (
                                        <div className="device-list">
                                            <h4>Available Devices</h4>
                                            {scannedDevices.map(device => (
                                                <div key={device.id} className="device-item">
                                                    <span>{device.name}</span>
                                                    <button
                                                        className="btn-small"
                                                        onClick={() => handleConnectDevice(device)}
                                                    >
                                                        Connect
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="device-section">
                                <div className="section-header">
                                    <h3><span className="icon">📶</span> WiFi Configuration</h3>
                                    <p>Configure your device to sync data over WiFi.</p>
                                </div>

                                <form className="wifi-form" onSubmit={(e) => { e.preventDefault(); alert('WiFi credentials sent to device!'); }}>
                                    <div className="form-group">
                                        <label>Network Name (SSID)</label>
                                        <input type="text" placeholder="Enter WiFi Name" required />
                                    </div>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input type="password" placeholder="Enter WiFi Password" required />
                                    </div>
                                    <button type="submit" className="btn-primary">
                                        Configure Device
                                    </button>
                                </form>
                            </div>
                        </div>
                    )
                }
            </main >
        </div >
    );
};

export default UserDashboard;
