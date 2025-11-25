import React from 'react';
import './Workflow.css';

const Workflow = () => {
    const steps = [
        { id: 1, title: "Sensors Capture", icon: "⌚", desc: "Continuous monitoring of BP, HR, SpO2" },
        { id: 2, title: "Data Transmission", icon: "📡", desc: "Sent via Bluetooth/WiFi to Cloud" },
        { id: 3, title: "AI Analysis", icon: "🧠", desc: "Deep learning models detect anomalies" },
        { id: 4, title: "Alert Triggered", icon: "🚨", desc: "Critical threshold breached" },
        { id: 5, title: "Caregiver Notified", icon: "📲", desc: "Instant SMS & App Notification" },
        { id: 6, title: "Doctor Review", icon: "👨‍⚕️", desc: "Access to real-time charts & history" }
    ];

    return (
        <section className="section workflow-section" id="how-it-works">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">How the System Works <span className="text-gradient">in Real Life</span></h2>
                </div>

                <div className="workflow-timeline">
                    {steps.map((step, index) => (
                        <div key={step.id} className="timeline-item">
                            <div className="timeline-content">
                                <div className="timeline-icon">{step.icon}</div>
                                <h3 className="timeline-title">{step.title}</h3>
                                <p className="timeline-desc">{step.desc}</p>
                            </div>
                            {index < steps.length - 1 && <div className="timeline-connector"></div>}
                        </div>
                    ))}
                </div>

                <div className="workflow-visual">
                    {/* Animated Line Graph Placeholder */}
                    <div className="graph-container">
                        <div className="graph-line"></div>
                        <div className="graph-point point-1"></div>
                        <div className="graph-point point-2"></div>
                        <div className="graph-point point-3 warning"></div>
                        <div className="alert-popup">⚠️ Alert Triggered!</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Workflow;
