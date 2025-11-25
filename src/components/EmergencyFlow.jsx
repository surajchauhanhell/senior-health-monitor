import React from 'react';
import './EmergencyFlow.css';

const EmergencyFlow = () => {
    return (
        <section className="section emergency-section">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title text-red">CRITICAL EMERGENCY FLOW</h2>
                    <p className="section-subtitle">When seconds matter, our automated system takes over.</p>
                </div>

                <div className="emergency-flow-container">
                    <div className="flow-step">
                        <div className="flow-circle red-pulse">Sensor</div>
                        <div className="flow-label">Detects Fall/Arrhythmia</div>
                    </div>
                    <div className="flow-arrow">→</div>
                    <div className="flow-step">
                        <div className="flow-circle red-pulse delay-1">AI Core</div>
                        <div className="flow-label">Confirms Emergency</div>
                    </div>
                    <div className="flow-arrow">→</div>
                    <div className="flow-step">
                        <div className="flow-circle red-pulse delay-2">Alert System</div>
                        <div className="flow-label">Notifies Caregiver</div>
                    </div>
                    <div className="flow-arrow">→</div>
                    <div className="flow-step">
                        <div className="flow-circle red-pulse delay-3">Backup</div>
                        <div className="flow-label">Calls Emergency Services</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EmergencyFlow;
