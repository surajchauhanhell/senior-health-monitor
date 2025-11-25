import React from 'react';
import './ProblemStatement.css';

const ProblemStatement = () => {
    return (
        <section className="section problem-section" id="problem">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">The Hidden Crisis for <span className="text-gradient">Seniors Living Alone</span></h2>
                    <p className="section-subtitle">
                        Millions of senior citizens live independently, vulnerable to sudden spikes in diabetes, hypertension, arrhythmia, and falls.
                    </p>
                </div>

                <div className="problem-grid">
                    <div className="problem-card">
                        <div className="problem-icon">⚠️</div>
                        <h3>Unnoticed BP Spikes</h3>
                        <p>Silent hypertension can lead to strokes without warning signs.</p>
                    </div>
                    <div className="problem-card">
                        <div className="problem-icon">🩸</div>
                        <h3>Silent Sugar Drops</h3>
                        <p>Hypoglycemia can cause fainting and coma if not detected instantly.</p>
                    </div>
                    <div className="problem-card">
                        <div className="problem-icon">📉</div>
                        <h3>Missed Emergencies</h3>
                        <p>Falls often go unnoticed for hours, leading to critical outcomes.</p>
                    </div>
                    <div className="problem-card">
                        <div className="problem-icon">🚫</div>
                        <h3>No Real-time Data</h3>
                        <p>Traditional checkups miss the daily fluctuations that matter most.</p>
                    </div>
                </div>

                <div className="quote-box">
                    <blockquote>
                        "Most emergencies happen when no one is around. <span className="highlight">We change that.</span>"
                    </blockquote>
                </div>
            </div>
        </section>
    );
};

export default ProblemStatement;
