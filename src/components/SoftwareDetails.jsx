import React from 'react';
import './SoftwareDetails.css';

const SoftwareDetails = () => {
    return (
        <section className="section software-section">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">Software <span className="text-gradient">Stack</span></h2>
                </div>

                <div className="software-container">
                    <div className="code-window">
                        <div className="window-header">
                            <span className="dot red"></span>
                            <span className="dot yellow"></span>
                            <span className="dot green"></span>
                            <span className="window-title">tech_stack.json</span>
                        </div>
                        <div className="window-content">
                            <pre>
                                {`{
  "mobile_app": {
    "framework": "Flutter / React Native",
    "features": ["Real-time Sync", "Push Notifications"]
  },
  "backend": {
    "platform": "Firebase / AWS",
    "api": "MQTT / HTTPS"
  },
  "ai_engine": {
    "libraries": ["TensorFlow", "PyTorch", "Scikit-learn"],
    "models": ["LSTM", "CNN", "Random Forest"]
  },
  "dashboard": {
    "frontend": "React.js",
    "runtime": "Node.js"
  }
}`}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SoftwareDetails;
