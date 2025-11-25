import React from 'react';
import './SolutionOverview.css';

const SolutionOverview = () => {
    return (
        <section className="section solution-section" id="solution">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">A Smart, <span className="text-gradient">Always-On Safety Ecosystem</span></h2>
                    <p className="section-subtitle">
                        From wearable sensors to cloud AI, we ensure every heartbeat is monitored and every risk is predicted.
                    </p>
                </div>

                <div className="solution-pipeline">
                    <div className="pipeline-step">
                        <div className="step-icon glow-blue">⌚</div>
                        <h4>Sensors</h4>
                    </div>
                    <div className="pipeline-arrow">→</div>
                    <div className="pipeline-step">
                        <div className="step-icon glow-cyan">☁️</div>
                        <h4>Cloud</h4>
                    </div>
                    <div className="pipeline-arrow">→</div>
                    <div className="pipeline-step">
                        <div className="step-icon glow-green">🧠</div>
                        <h4>AI Analysis</h4>
                    </div>
                    <div className="pipeline-arrow">→</div>
                    <div className="pipeline-step">
                        <div className="step-icon glow-red">🚨</div>
                        <h4>Alerts</h4>
                    </div>
                    <div className="pipeline-arrow">→</div>
                    <div className="pipeline-step">
                        <div className="step-icon glow-purple">👨‍⚕️</div>
                        <h4>Caregivers</h4>
                    </div>
                </div>

                <div className="solution-highlights">
                    <div className="highlight-item">
                        <span className="check-icon">✓</span> Real-time vitals monitoring
                    </div>
                    <div className="highlight-item">
                        <span className="check-icon">✓</span> Predictive AI & health risk forecasting
                    </div>
                    <div className="highlight-item">
                        <span className="check-icon">✓</span> Instant emergency alerts
                    </div>
                    <div className="highlight-item">
                        <span className="check-icon">✓</span> Fall detection
                    </div>
                    <div className="highlight-item">
                        <span className="check-icon">✓</span> Doctor dashboards
                    </div>
                    <div className="highlight-item">
                        <span className="check-icon">✓</span> Mobile apps for seniors & family
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SolutionOverview;
