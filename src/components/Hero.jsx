import React from 'react';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero section">
            <div className="hero-bg-glow"></div>
            <div className="container hero-content">
                <div className="hero-text animate-fade-in">
                    <h1 className="hero-title">
                        Intelligent 24×7 <br />
                        <span className="text-gradient">Health Monitoring</span> <br />
                        & Alert System
                    </h1>
                    <p className="hero-subtitle">
                        AI-powered vitals tracking, predictive analytics, fall detection, and instant caregiver alerts – protecting elders even when no one is around.
                    </p>
                    <div className="hero-buttons">
                        <button className="btn btn-primary">Get Started</button>
                        <button className="btn btn-outline">View Full Features</button>
                    </div>

                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-value">24/7</span>
                            <span className="stat-label">Monitoring</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">99%</span>
                            <span className="stat-label">Accuracy</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">&lt;1s</span>
                            <span className="stat-label">Alert Speed</span>
                        </div>
                    </div>
                </div>

                <div className="hero-visual animate-float">
                    <div className="visual-circle main-circle">
                        <div className="icon-float icon-heart">❤️</div>
                        <div className="icon-float icon-ecg">📈</div>
                        <div className="icon-float icon-shield">🛡️</div>
                        {/* Placeholder for Senior Image - using a gradient orb for now if no image */}
                        <div className="hero-image-placeholder">
                            <div className="pulse-ring"></div>
                            <div className="pulse-ring delay-1"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
