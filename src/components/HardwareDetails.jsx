import React from 'react';
import './HardwareDetails.css';

const HardwareDetails = () => {
    const hardware = [
        { name: "ESP32", desc: "Microcontroller", icon: "📟" },
        { name: "MAX30102", desc: "HR & SpO2 Sensor", icon: "❤️" },
        { name: "ADXL345", desc: "Accelerometer", icon: "📐" },
        { name: "DS18B20", desc: "Temp Sensor", icon: "🌡️" },
        { name: "AD8232", desc: "ECG Module", icon: "📈" },
        { name: "Li-ion", desc: "Rechargeable Battery", icon: "🔋" }
    ];

    return (
        <section className="section hardware-section">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">Hardware <span className="text-gradient">Under the Hood</span></h2>
                    <p className="section-subtitle">Low-power, wireless, and built for reliability.</p>
                </div>

                <div className="hardware-grid">
                    {hardware.map((item, index) => (
                        <div key={index} className="hardware-card">
                            <div className="hardware-icon">{item.icon}</div>
                            <h3 className="hardware-name">{item.name}</h3>
                            <p className="hardware-desc">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HardwareDetails;
