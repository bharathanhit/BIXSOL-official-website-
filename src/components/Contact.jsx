import React from 'react';
import { motion } from 'framer-motion';
import { Globe, MessageSquare, Phone, MapPin } from 'lucide-react';

const Contact = () => {
    return (
        <section id="contact" className="contact section-padding">
            <div className="contact-container" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '4rem',
                alignItems: 'center'
            }}>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>
                        Ready to <span className="gradient-text">Grow?</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
                        Have a project in mind? Contact us today and let's turn your vision into reality. We're here to help you dominate your market.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <motion.div whileHover={{ x: 5 }} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div className="glass" style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--primary)'
                            }}>
                                <MessageSquare />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Email Us</h4>
                                <p style={{ color: 'var(--text-secondary)' }}>
                                    <a href="mailto:bixsolcompany@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>
                                        bixsolcompany@gmail.com
                                    </a>
                                </p>
                            </div>
                        </motion.div>

                        <motion.div whileHover={{ x: 5 }} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div className="glass" style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--secondary)'
                            }}>
                                <Phone />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Call Us</h4>
                                <p style={{ color: 'var(--text-secondary)' }}>
                                    <a href="tel:+917339310823" style={{ color: 'inherit', textDecoration: 'none' }}>
                                        +91 733 931 0823
                                    </a>
                                </p>
                            </div>
                        </motion.div>

                        <motion.div whileHover={{ x: 5 }} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div className="glass" style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--accent)'
                            }}>
                                <MapPin />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Visit Us</h4>
                                <p style={{ color: 'var(--text-secondary)' }}>Madurai, Tamil Nadu, India</p>
                            </div>
                        </motion.div>

                        <motion.div whileHover={{ x: 5 }} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div className="glass" style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--primary)'
                            }}>
                                <Globe />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Working Hours</h4>
                                <p style={{ color: 'var(--text-secondary)' }}>Mon - Sat: 9:00 AM - 7:00 PM IST</p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    className="glass"
                    style={{ padding: '3rem', borderRadius: '32px' }}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <h3 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Send us a Message</h3>
                    <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Full Name *</label>
                            <input type="text" placeholder="John Doe" required style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border)',
                                borderRadius: '12px',
                                padding: '1rem',
                                color: 'white',
                                fontSize: '1rem'
                            }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Email Address *</label>
                            <input type="email" placeholder="john@example.com" required style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border)',
                                borderRadius: '12px',
                                padding: '1rem',
                                color: 'white',
                                fontSize: '1rem'
                            }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Phone Number</label>
                            <input type="tel" placeholder="+91 98765 43210" style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border)',
                                borderRadius: '12px',
                                padding: '1rem',
                                color: 'white',
                                fontSize: '1rem'
                            }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Service Interested In</label>
                            <select style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border)',
                                borderRadius: '12px',
                                padding: '1rem',
                                color: 'white',
                                fontSize: '1rem'
                            }}>
                                <option value="">Select a service</option>
                                <option value="web-dev">Web Development</option>
                                <option value="digital-marketing">Digital Marketing</option>
                                <option value="seo">SEO Optimization</option>
                                <option value="branding">Branding</option>
                                <option value="social-media">Social Media Management</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Your Message *</label>
                            <textarea rows="4" placeholder="Tell us about your project..." required style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border)',
                                borderRadius: '12px',
                                padding: '1rem',
                                color: 'white',
                                resize: 'none',
                                fontSize: '1rem'
                            }} />
                        </div>

                        <motion.button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Send Message
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;
