import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
    const testimonials = [
        {
            name: "Rajesh Kumar",
            role: "CEO, TechStart India",
            company: "Technology Startup",
            rating: 5,
            text: "BIXSOL transformed our online presence completely. Their strategic approach to digital marketing increased our leads by 250% in just 4 months. Exceptional team!",
            avatar: "RK"
        },
        {
            name: "Priya",
            role: "Marketing Director",
            company: "Fashion Retail Chain",
            rating: 5,
            text: "Working with BIXSOL was a game-changer. They created a stunning e-commerce platform and managed our social media brilliantly. Sales doubled within the first quarter!",
            avatar: "PS"
        },
        {
            name: "Mohammed ",
            role: "Founder",
            company: "Local Restaurant Chain",
            rating: 5,
            text: "The local SEO campaign BIXSOL ran for us was incredible. We now rank #1 for all major keywords in our city. Customer footfall increased by 180%. Highly recommended!",
            avatar: "MA"
        },
        {
            name: "Anita ",
            role: "COO, HealthCare Solutions",
            company: "Healthcare Technology",
            rating: 5,
            text: "Professional, creative, and results-driven. BIXSOL developed our telemedicine platform and the user experience is phenomenal. Our patient engagement has tripled!",
            avatar: "AD"
        },
        {
            name: "Vikram ",
            role: "Director",
            company: "Education Institute",
            rating: 5,
            text: "BIXSOL's content marketing strategy helped us establish thought leadership in our industry. Website traffic increased 400% and we're now getting quality leads daily.",
            avatar: "VP"
        },
        {
            name: "Sneha ",
            role: "Founder & CEO",
            company: "Beauty & Wellness",
            rating: 5,
            text: "From branding to website development to running ad campaigns - BIXSOL handled everything flawlessly. Our brand is now recognized across South India. Amazing work!",
            avatar: "SR"
        }
    ];

    return (

        <section id="testimonials" className="section-padding testimonials-section">
            <div className="testimonials-header">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="testimonials-title"
                >
                    Client <span className="gradient-text">Testimonials</span>
                </motion.h2>
                <p className="testimonials-desc">
                    Don't just take our word for it. Here's what our clients have to say about working with BIXSOL.
                </p>
            </div>

            <div className="testimonials-grid">
                {testimonials.map((testimonial, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="testimonial-card"
                    >
                        {/* Quote Icon */}
                        <div className="quote-icon-wrapper">
                            <Quote size={60} color="var(--primary)" />
                        </div>

                        {/* Rating */}
                        <div className="testimonial-rating">
                            {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} size={18} fill="var(--primary)" color="var(--primary)" />
                            ))}
                        </div>

                        {/* Testimonial Text */}
                        <p className="testimonial-text">
                            "{testimonial.text}"
                        </p>

                        {/* Author Info */}
                        <div className="author-info">
                            <div className="author-avatar">
                                {testimonial.avatar}
                            </div>
                            <div className="author-details">
                                <h4 className="author-name">{testimonial.name}</h4>
                                <p className="author-role">
                                    {testimonial.role}
                                </p>
                                <p className="author-company">
                                    {testimonial.company}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Trust Badge */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="trust-badge"
            >
                <h3 className="trust-badge-title">
                    Join <span className="gradient-text">50+ Happy Clients</span>
                </h3>
                <p className="trust-badge-desc">
                    Start your journey to digital success today. Let's create something amazing together.
                </p>
                <motion.button
                    className="btn btn-primary trust-badge-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Get Started Now
                </motion.button>
            </motion.div>
        </section>
    );
};

export default Testimonials;
