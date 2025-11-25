import React from 'react';
import './SystemArchitecture.css';

const SystemArchitecture = () => {
    const layers = [
        {
            id: 1,
            title: "Layer 1: Sensing & Monitoring",
            icon: "⌚",
            details: ["Smart BP Band", "Glucose Patch", "SpO2 Sensor", "ECG Patch", "Fall Detection", "Sleep Pad"]
        },
        {
            id: 2,
            title: "Layer 2: Data Transmission",
            icon: "📡",
            details: ["Bluetooth 5.0", "Wi-Fi / MQTT", "Secure Encryption", "Low Latency"]
        },
        {
            id: 3,
            title: "Layer 3: Cloud Processing",
            icon: "☁️",
            details: ["AWS / Firebase", "Real-time Database", "Secure Storage", "Scalable Infrastructure"]
        },
        {
            id: 4,
            title: "Layer 4: AI Intelligence Core",
            icon: "🧠",
            details: ["Anomaly Detection", "Risk Prediction", "LSTM Models", "Health Score Engine"]
        },
        {
            id: 5,
            title: "Layer 5: Alerts & Communication",
            icon: "🔔",
            details: ["Push Notifications", "SMS & Calls", "Emergency Escalation", "Caregiver Alerts"]
        },
        {
            id: 6,
            title: "Layer 6: User Interface",
            icon: "📱",
            details: ["Senior App", "Caregiver Dashboard", "Doctor Portal", "Voice Interface"]
        }
    ];

    return (
        <section className="section architecture-section" id="architecture">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">6-Layer <span className="text-gradient">System Architecture</span></h2>
                    <p className="section-subtitle">
                        A robust, multi-layered technology stack designed for reliability and speed.
                    </p>
                </div>

                <div className="architecture-grid">
                    {layers.map((layer) => (
                        <div key={layer.id} className="layer-card">
                            <div className="layer-header">
                                <span className="layer-number">{layer.id}</span>
                                <span className="layer-icon">{layer.icon}</span>
                            </div>
                            <h3 className="layer-title">{layer.title}</h3>
                            <ul className="layer-details">
                                {layer.details.map((detail, index) => (
                                    <li key={index}>{detail}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SystemArchitecture;
