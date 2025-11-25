import React from 'react';
import './UserInterfaces.css';

const UserInterfaces = () => {
    return (
        <section className="section ui-section">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">Designed for <span className="text-gradient">Everyone</span></h2>
                    <p className="section-subtitle">Intuitive interfaces for seniors, caregivers, and doctors.</p>
                </div>

                <div className="ui-showcase">
                    {/* Senior App Mockup */}
                    <div className="ui-card senior-app animate-float">
                        <div className="ui-mockup phone-mockup">
                            <div className="screen">
                                <div className="app-header">Hello, Grandpa! 👋</div>
                                <div className="big-button sos-btn">SOS</div>
                                <div className="med-reminder">
                                    <span>💊 Medicine Time</span>
                                    <small>2:00 PM - Aspirin</small>
                                </div>
                                <div className="voice-mic">🎙️</div>
                            </div>
                        </div>
                        <h3>Senior App</h3>
                        <p>Large fonts, voice commands, and one-touch SOS.</p>
                    </div>

                    {/* Caregiver App Mockup */}
                    <div className="ui-card caregiver-app animate-float" style={{ animationDelay: '1s' }}>
                        <div className="ui-mockup phone-mockup">
                            <div className="screen">
                                <div className="app-header">Dad's Vitals</div>
                                <div className="vitals-row">
                                    <div className="vital-box">❤️ 72 BPM</div>
                                    <div className="vital-box">🩸 120/80</div>
                                </div>
                                <div className="alert-history">
                                    <div className="alert-item">⚠️ Fall Detected (Yesterday)</div>
                                    <div className="alert-item ok">✅ All Clear (Today)</div>
                                </div>
                            </div>
                        </div>
                        <h3>Caregiver App</h3>
                        <p>Real-time tracking, alerts, and location monitoring.</p>
                    </div>

                    {/* Doctor Dashboard Mockup */}
                    <div className="ui-card doctor-dash animate-float" style={{ animationDelay: '2s' }}>
                        <div className="ui-mockup tablet-mockup">
                            <div className="screen">
                                <div className="dash-sidebar"></div>
                                <div className="dash-main">
                                    <div className="chart-placeholder">
                                        <div className="chart-line"></div>
                                    </div>
                                    <div className="risk-score">Risk Score: Low</div>
                                </div>
                            </div>
                        </div>
                        <h3>Doctor Dashboard</h3>
                        <p>Deep analytics, trend charts, and AI risk reports.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UserInterfaces;
