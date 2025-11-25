import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-col">
                    <div className="logo">
                        <span className="logo-icon">❤️</span>
                        <span className="logo-text">SeniorGuard<span className="highlight">AI</span></span>
                    </div>
                    <p className="footer-desc">
                        Empowering seniors to live independently with confidence and safety.
                    </p>
                </div>

                <div className="footer-col">
                    <h4>Company</h4>
                    <ul className="footer-links">
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Legal</h4>
                    <ul className="footer-links">
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Cookie Policy</a></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Get the App</h4>
                    <div className="app-buttons">
                        <button className="btn btn-outline btn-sm">App Store</button>
                        <button className="btn btn-outline btn-sm">Google Play</button>
                    </div>
                </div>
            </div>
            <div className="footer-bottom text-center">
                <p>&copy; 2025 SeniorGuardAI. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
