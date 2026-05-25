import React from 'react';
import { motion } from 'framer-motion';
import { Globe, MessageSquare, Phone, MapPin, Briefcase } from 'lucide-react';

const Contact = () => {
    return (
        <section id="contact" className="contact section-padding">
            <div className="contact-grid">
                <motion.div
                    className="contact-info"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="section-title">
                        Ready to <span className="gradient-text">Grow?</span>
                    </h2>
                    <p className="section-desc">
                        Have a project in mind? Contact us today and let's turn your vision into reality. We're here to help you dominate your market.
                    </p>

                    <div className="contact-items">
                        <motion.div whileHover={{ x: 5 }} className="contact-item">
                            <div className="glass contact-icon primary">
                                <MessageSquare />
                            </div>
                            <div>
                                <h4>Email Us</h4>
                                <p>
                                    <a href="mailto:bixsolcompany@gmail.com">
                                        bixsolcompany@gmail.com
                                    </a>
                                </p>
                            </div>
                        </motion.div>

                        <motion.div whileHover={{ x: 5 }} className="contact-item">
                            <div className="glass contact-icon secondary">
                                <Phone />
                            </div>
                            <div>
                                <h4>Call Us</h4>
                                <div className="contact-links">
                                    <a href="tel:+917339310823">
                                        +91 733 931 0823
                                    </a>
                                    <a href="tel:+919655889426">
                                        +91 965 588 9426
                                    </a>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div whileHover={{ x: 5 }} className="contact-item">
                            <div className="glass contact-icon accent">
                                <MapPin />
                            </div>
                            <div>
                                <h4>Visit Us</h4>
                                <p>Thuvariman, Madurai 625019, Tamil Nadu, India</p>
                                <p style={{ marginTop: '0.25rem', fontSize: '0.9rem' }}>
                                    <strong style={{ opacity: 0.9 }}>GSTIN:</strong> 33FVMPA3458N1Z7<br />

                                </p>
                            </div>
                        </motion.div>

                        <motion.div whileHover={{ x: 5 }} className="contact-item">
                            <div className="glass contact-icon primary">
                                <Globe />
                            </div>
                            <div>
                                <h4>Working Hours</h4>
                                <p>Mon - Sat: 9:00 AM - 7:00 PM IST</p>
                            </div>
                        </motion.div>

                        <motion.div whileHover={{ x: 5 }} className="contact-item">
                            <div className="glass contact-icon secondary">
                                <Briefcase />
                            </div>
                            <div>
                                <h4>Careers</h4>
                                <div className="contact-links">
                                    <a
                                        href="https://wa.me/917339310823?text=Hi%2C%20I%20am%20interested%20in%20applying.%20Please%20find%20my%20CV%20attached%20below."
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                                    >
                                        Submit CV via WhatsApp
                                    </a>
                                    <span style={{ fontSize: '0.75rem', opacity: 0.7, display: 'block', marginTop: '4px' }}>
                                        (Opens chat - please attach file)
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    className="glass contact-form-card"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <h3>Send us a Message</h3>
                    <form className="contact-form">
                        <div className="form-group">
                            <label className="form-label">Full Name *</label>
                            <input type="text" placeholder="John Doe" required className="form-input" />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address *</label>
                            <input type="email" placeholder="john@example.com" required className="form-input" />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input type="tel" placeholder="+91 98765 43210" className="form-input" />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Service Interested In</label>
                            <select className="form-select">
                                <option value="">Select a service</option>
                                <option value="web-dev">Web Development</option>
                                <option value="digital-marketing">Digital Marketing</option>
                                <option value="seo">SEO Optimization</option>
                                <option value="branding">Branding</option>
                                <option value="social-media">Social Media Management</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Your Message *</label>
                            <textarea rows="4" placeholder="Tell us about your project..." required className="form-textarea" />
                        </div>

                        <motion.button
                            type="submit"
                            className="btn btn-primary submit-btn"
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
