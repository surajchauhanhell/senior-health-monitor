import React from 'react';
import './Pricing.css';

const Pricing = () => {
    return (
        <section className="section pricing-section" id="pricing">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">Simple, Transparent <span className="text-gradient">Pricing</span></h2>
                </div>

                <div className="pricing-grid">
                    <div className="pricing-card">
                        <h3>Basic Monitoring</h3>
                        <div className="price">$29<span>/mo</span></div>
                        <ul className="features-list">
                            <li>✓ 24/7 Vitals Tracking</li>
                            <li>✓ Mobile App Access</li>
                            <li>✓ Daily Reports</li>
                        </ul>
                        <button className="btn btn-outline">Choose Basic</button>
                    </div>

                    <div className="pricing-card recommended">
                        <div className="badge">RECOMMENDED</div>
                        <h3>AI Predictive Alerts</h3>
                        <div className="price">$49<span>/mo</span></div>
                        <ul className="features-list">
                            <li>✓ Everything in Basic</li>
                            <li>✓ AI Anomaly Detection</li>
                            <li>✓ Fall Detection</li>
                            <li>✓ Instant SMS Alerts</li>
                        </ul>
                        <button className="btn btn-primary">Choose AI Plan</button>
                    </div>

                    <div className="pricing-card">
                        <h3>Full Emergency</h3>
                        <div className="price">$79<span>/mo</span></div>
                        <ul className="features-list">
                            <li>✓ Everything in AI Plan</li>
                            <li>✓ Doctor Dashboard Access</li>
                            <li>✓ Emergency Auto-Call</li>
                            <li>✓ Priority Support</li>
                        </ul>
                        <button className="btn btn-outline">Choose Full</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
