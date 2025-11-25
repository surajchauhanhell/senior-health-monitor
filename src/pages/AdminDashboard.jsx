import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/Dashboard.css';

const AdminDashboard = () => {
    const [newDoctorEmail, setNewDoctorEmail] = useState('');
    const [newDoctorPassword, setNewDoctorPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleCreateDoctor = async (e) => {
        e.preventDefault();
        try {
            // Create auth user
            const { data, error } = await supabase.auth.signUp({
                email: newDoctorEmail,
                password: newDoctorPassword,
            });

            if (error) throw error;

            if (data.user) {
                // Update profile role to doctor
                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({ role: 'doctor' })
                    .eq('id', data.user.id);

                if (profileError) {
                    // Fallback: insert if update fails (though trigger usually handles creation)
                    const { error: insertError } = await supabase.from('profiles').insert([{ id: data.user.id, role: 'doctor' }]);
                    if (insertError) throw insertError;
                }

                setMessage(`Doctor created successfully: ${newDoctorEmail}`);
                setNewDoctorEmail('');
                setNewDoctorPassword('');
            }
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-logo">Admin Panel</div>
                <nav>
                    <a href="#" className="active">Manage Doctors</a>
                    <a href="#">All Users</a>
                    <a href="#">System Logs</a>
                </nav>
            </aside>

            <main className="dashboard-content">
                <header className="dash-header">
                    <h1>System Administration</h1>
                </header>

                <div className="stat-card" style={{ maxWidth: '500px' }}>
                    <h3>Create New Doctor Account</h3>
                    <form onSubmit={handleCreateDoctor} style={{ marginTop: '20px' }}>
                        <div className="form-group">
                            <label>Doctor Email</label>
                            <input
                                type="email"
                                value={newDoctorEmail}
                                onChange={(e) => setNewDoctorEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Temporary Password</label>
                            <input
                                type="password"
                                value={newDoctorPassword}
                                onChange={(e) => setNewDoctorPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Create Account</button>
                    </form>
                    {message && <p style={{ marginTop: '10px', color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
