import React from 'react';
import './UniqueFeatures.css';

const UniqueFeatures = () => {
    const features = [
        { name: "Predictive Alerts", traditional: "❌", our: "✅" },
        { name: "Non-invasive Sensors", traditional: "❌", our: "✅" },
        { name: "AI-driven Reports", traditional: "❌", our: "✅" },
        { name: "Multi-channel Alerts", traditional: "⚠️ Limited", our: "✅ SMS, Call, App" },
        { name: "Auto-call System", traditional: "❌", our: "✅" },
        { name: "24×7 Cloud Data", traditional: "❌", our: "✅" },
        { name: "Personalized Baseline", traditional: "❌", our: "✅" }
    ];

    return (
        <section id="features" className="section features-section">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">Why We Are <span className="text-gradient">Different</span></h2>
                    <p className="section-subtitle">Traditional monitoring is reactive. We are proactive.</p>
                </div>

                <div className="comparison-table-wrapper">
                    <table className="comparison-table">
                        <thead>
                            <tr>
                                <th>Feature</th>
                                <th className="traditional-col">Traditional Monitoring</th>
                                <th className="our-col">Our System</th>
                            </tr>
                        </thead>
                        <tbody>
                            {features.map((feature, index) => (
                                <tr key={index}>
                                    <td className="feature-name">{feature.name}</td>
                                    <td className="traditional-val">{feature.traditional}</td>
                                    <td className="our-val">{feature.our}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default UniqueFeatures;
