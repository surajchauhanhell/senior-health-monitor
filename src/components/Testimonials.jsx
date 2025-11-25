import React from 'react';
import './Testimonials.css';

const Testimonials = () => {
    return (
        <section className="section testimonials-section">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">Stories of <span className="text-gradient">Safety</span></h2>
                </div>

                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <div className="quote-icon">“</div>
                        <p className="testimonial-text">
                            "I used to worry every time my dad didn't answer the phone. Now I can check his vitals instantly. It's a lifesaver."
                        </p>
                        <div className="testimonial-author">
                            <div className="author-avatar">👩</div>
                            <div className="author-info">
                                <h4>Sarah Jenkins</h4>
                                <span>Daughter of 82yo user</span>
                            </div>
                        </div>
                    </div>

                    <div className="testimonial-card">
                        <div className="quote-icon">“</div>
                        <p className="testimonial-text">
                            "The fall detection alert saved me when I slipped in the bathroom. The ambulance was there before I knew it."
                        </p>
                        <div className="testimonial-author">
                            <div className="author-avatar">👴</div>
                            <div className="author-info">
                                <h4>Robert Chen</h4>
                                <span>Senior User</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
