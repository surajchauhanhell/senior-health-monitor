import React, { useEffect, useState } from 'react';
import './CriticalAlertModal.css';

const CriticalAlertModal = ({ isOpen, onCancel, onComplete }) => {
    const [count, setCount] = useState(3);

    useEffect(() => {
        if (!isOpen) {
            setCount(3);
            return;
        }

        if (count === 0) {
            onComplete();
            return;
        }

        const timer = setTimeout(() => {
            setCount((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [isOpen, count, onComplete]);

    if (!isOpen) return null;

    return (
        <div className="critical-alert-overlay">
            <div className="critical-alert-modal">
                <div className="alert-icon">🚨</div>
                <h2>Critical Alert!</h2>
                <p>Abnormal heart rate detected.</p>
                <p>Sending emergency SOS in:</p>
                
                <div className="countdown-circle">
                    <span className="countdown-number">{count}</span>
                </div>

                <button className="cancel-btn" onClick={onCancel}>
                    Cancel Alert
                </button>
            </div>
        </div>
    );
};

export default CriticalAlertModal;
