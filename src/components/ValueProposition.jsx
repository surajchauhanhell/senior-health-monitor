import React from 'react';
import './ValueProposition.css';

const ValueProposition = () => {
    const values = [
        {
            title: "For Seniors",
            icon: "👴",
            benefits: ["Safety", "Independence", "Peace of Mind"]
        },
        {
            title: "For Families",
            icon: "👨‍👩‍👧",
            benefits: ["Instant Updates", "Remote Monitoring", "Less Stress"]
        },
        {
            title: "For Doctors",
            icon: "🩺",
            benefits: ["Accurate Data", "Early Diagnosis", "Trend Analysis"]
        },
        {
            title: "For Hospitals",
            icon: "🏥",
            benefits: ["Fewer Admissions", "Predictable Monitoring", "Better Outcomes"]
        }
    ];

    return (
        <section className="section value-section">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">Creating Value for <span className="text-gradient">Everyone</span></h2>
                </div>

                <div className="value-grid">
                    {values.map((item, index) => (
                        <div key={index} className="value-card">
                            <div className="value-icon">{item.icon}</div>
                            <h3 className="value-title">{item.title}</h3>
                            <ul className="value-list">
                                {item.benefits.map((benefit, i) => (
                                    <li key={i}>{benefit}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ValueProposition;
