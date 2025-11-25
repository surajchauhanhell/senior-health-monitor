import React from 'react';
import './AIModels.css';

const AIModels = () => {
    const models = [
        { name: "LSTM Time-Series", desc: "Predicts future vitals based on history", icon: "⏳" },
        { name: "CNN Arrhythmia", desc: "Detects irregular heartbeats from ECG", icon: "💓" },
        { name: "Random Forest", desc: "General anomaly detection", icon: "🌲" },
        { name: "SVM Classifier", desc: "High-accuracy fall detection", icon: "🤸" },
        { name: "Behavior Engine", desc: "Recognizes changes in daily patterns", icon: "🧩" }
    ];

    return (
        <section className="section ai-section">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">Powered by <span className="text-gradient">Advanced AI</span></h2>
                    <p className="section-subtitle">Machine learning models that learn and adapt to each senior's unique baseline.</p>
                </div>

                <div className="ai-grid">
                    {models.map((model, index) => (
                        <div key={index} className="ai-card">
                            <div className="ai-icon-wrapper">
                                <span className="ai-icon">{model.icon}</span>
                            </div>
                            <div className="ai-content">
                                <h3 className="ai-name">{model.name}</h3>
                                <p className="ai-desc">{model.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AIModels;
