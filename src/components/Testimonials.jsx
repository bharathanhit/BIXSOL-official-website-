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
            name: "Priya Sharma",
            role: "Marketing Director",
            company: "Fashion Retail Chain",
            rating: 5,
            text: "Working with BIXSOL was a game-changer. They created a stunning e-commerce platform and managed our social media brilliantly. Sales doubled within the first quarter!",
            avatar: "PS"
        },
        {
            name: "Mohammed Ali",
            role: "Founder",
            company: "Local Restaurant Chain",
            rating: 5,
            text: "The local SEO campaign BIXSOL ran for us was incredible. We now rank #1 for all major keywords in our city. Customer footfall increased by 180%. Highly recommended!",
            avatar: "MA"
        },
        {
            name: "Anita Desai",
            role: "COO, HealthCare Solutions",
            company: "Healthcare Technology",
            rating: 5,
            text: "Professional, creative, and results-driven. BIXSOL developed our telemedicine platform and the user experience is phenomenal. Our patient engagement has tripled!",
            avatar: "AD"
        },
        {
            name: "Vikram Patel",
            role: "Director",
            company: "Education Institute",
            rating: 5,
            text: "BIXSOL's content marketing strategy helped us establish thought leadership in our industry. Website traffic increased 400% and we're now getting quality leads daily.",
            avatar: "VP"
        },
        {
            name: "Sneha Reddy",
            role: "Founder & CEO",
            company: "Beauty & Wellness",
            rating: 5,
            text: "From branding to website development to running ad campaigns - BIXSOL handled everything flawlessly. Our brand is now recognized across South India. Amazing work!",
            avatar: "SR"
        }
    ];

    return (
        <section id="testimonials" className="section-padding" style={{ background: 'rgba(0, 0, 0, 0.3)' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="section-title"
                    style={{ fontSize: '3rem', marginBottom: '1rem' }}
                >
                    Client <span className="gradient-text">Testimonials</span>
                </motion.h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem' }}>
                    Don't just take our word for it. Here's what our clients have to say about working with BIXSOL.
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '2rem',
                maxWidth: '1400px',
                margin: '0 auto'
            }}>
                {testimonials.map((testimonial, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        style={{
                            position: 'relative',
                            padding: '2.5rem',
                            background: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: '24px',
                            border: '1px solid var(--border)',
                        }}
                    >
                        {/* Quote Icon */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                opacity: 0.1
                            }}
                        >
                            <Quote size={60} color="var(--primary)" />
                        </div>

                        {/* Rating */}
                        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem' }}>
                            {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} size={18} fill="var(--primary)" color="var(--primary)" />
                            ))}
                        </div>

                        {/* Testimonial Text */}
                        <p style={{
                            color: 'var(--text-primary)',
                            fontSize: '1.05rem',
                            lineHeight: '1.7',
                            marginBottom: '2rem',
                            fontStyle: 'italic'
                        }}>
                            "{testimonial.text}"
                        </p>

                        {/* Author Info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div
                                style={{
                                    width: '55px',
                                    height: '55px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.25rem',
                                    fontWeight: 'bold',
                                    color: 'white'
                                }}
                            >
                                {testimonial.avatar}
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{testimonial.name}</h4>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    {testimonial.role}
                                </p>
                                <p style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '600' }}>
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
                style={{
                    marginTop: '4rem',
                    padding: '2.5rem',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
                    borderRadius: '24px',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    textAlign: 'center',
                    maxWidth: '800px',
                    margin: '4rem auto 0',
                }}
            >
                <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                    Join <span className="gradient-text">50+ Happy Clients</span>
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                    Start your journey to digital success today. Let's create something amazing together.
                </p>
                <motion.button
                    className="btn btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}
                >
                    Get Started Now
                </motion.button>
            </motion.div>
        </section>
    );
};

export default Testimonials;
