import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Users, Zap, Award, CheckCircle, Star, Send, Upload, AlertCircle, Loader2, X } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './Hiring.css';

const Hiring = () => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fileName, setFileName] = useState('');
    const [file, setFile] = useState(null);
    const [showFormModal, setShowFormModal] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        whatsappNumber: '',
        whatsappSameAsPhone: true,
        position: '',
        coverLetter: ''
    });

    useEffect(() => {
        setShowFormModal(true);
    }, []);

    const positions = [
        {
            id: 1,
            title: 'Frontend Developer',
            type: 'Full-time',
            location: 'Remote / Madurai',
            description: 'Build stunning user interfaces with React. 3+ years experience required.',
            icon: Zap
        },
        {
            id: 2,
            title: 'UI/UX Designer',
            type: 'Contract',
            location: 'Remote',
            description: 'Create beautiful, intuitive designs that solve real problems.',
            icon: Award
        },
        {
            id: 3,
            title: 'Digital Marketing Specialist',
            type: 'Full-time',
            location: 'Madurai',
            description: 'Help clients grow through strategic online campaigns and social media.',
            icon: Users
        },
        {
            id: 4,
            title: 'Full Stack Developer',
            type: 'Full-time',
            location: 'Remote / Madurai',
            description: 'Build end-to-end solutions with React & Node.js. 2+ years required.',
            icon: Zap
        }
    ];

    const benefits = [
        { icon: '🎯', title: 'Competitive Salary', desc: 'Industry-leading compensation packages' },
        { icon: '🌍', title: 'Remote Work', desc: 'Work from anywhere in India' },
        { icon: '📈', title: 'Growth', desc: 'Career development & skill training' },
        { icon: '🎉', title: 'Culture', desc: 'Fun, collaborative team environment' },
        { icon: '💼', title: 'Benefits', desc: 'Health insurance & other perks' },
        { icon: '🚀', title: 'Innovation', desc: 'Work with cutting-edge technologies' }
    ];

    const testimonials = [
        {
            name: 'Arjun Patel',
            role: 'Frontend Developer at BIXSOL',
            text: 'BIXSOL gave me the platform to grow as a developer. The team is supportive and the projects are exciting!',
            image: '👨‍💻'
        },
        {
            name: 'Priya Sharma',
            role: 'UI/UX Designer at BIXSOL',
            text: 'Best decision joining BIXSOL. I got to work on amazing projects and learned so much.',
            image: '👩‍🎨'
        },
        {
            name: 'Rajesh Kumar',
            role: 'Digital Marketing at BIXSOL',
            text: 'The work-life balance and flexibility here is unmatched. Highly recommend!',
            image: '👨‍💼'
        }
    ];

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const formatPhoneNumber = (value) => {
        // Remove all non-digit characters except +
        let cleaned = value.replace(/[^0-9+]/g, '');
        
        // If it's empty, return it
        if (!cleaned) return '';
        
        // If it starts with +, keep it as is
        if (cleaned.startsWith('+')) return cleaned;
        
        // If it starts with 91, add +
        if (cleaned.startsWith('91')) return '+' + cleaned;
        
        // If it's just 10 digits, add +91
        if (cleaned.length === 10) return '+91' + cleaned;
        
        // If it's more than 10 digits and doesn't start with 91, assume it needs +91
        if (cleaned.length > 10 && !cleaned.startsWith('91')) return '+91' + cleaned;
        
        return cleaned;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }
            setFile(file);
            setFileName(file.name);
            setError('');
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        let finalValue = value;
        
        // Auto-format phone and whatsapp numbers with country code
        if ((name === 'phone' || name === 'whatsappNumber') && (type === 'text' || type === 'tel')) {
            finalValue = formatPhoneNumber(value);
        }
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : finalValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Submit without the resume to avoid document size limits
            await addDoc(collection(db, 'applications'), {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                whatsappNumber: formData.whatsappSameAsPhone ? formData.phone : formData.whatsappNumber,
                position: formData.position,
                coverLetter: formData.coverLetter,
                resumeFileName: fileName || 'No file uploaded',
                submittedAt: serverTimestamp(),
                status: 'pending'
            });

            // Track Lead submission with Meta Pixel (browser-side)
            if (window.fbq) {
                window.fbq('track', 'Lead', {
                    content_name: 'Hiring Page Application',
                    position: formData.position,
                    status: 'submitted'
                });
            }

            // Track Lead submission with Meta Conversions API (server-side)
            try {
                await fetch('/.netlify/functions/track-lead', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        eventName: 'Lead',
                        userData: {
                            email: formData.email,
                            phone: formData.phone,
                            sourceUrl: window.location.href
                        },
                        customData: {
                            content_name: 'Hiring Page Application',
                            event_source: 'crm',
                            lead_event_source: 'Hiring Page'
                        }
                    })
                });
            } catch (capiErr) {
                console.warn('Meta CAPI call failed (non-critical):', capiErr.message);
            }

            setSubmitted(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                whatsappNumber: '',
                whatsappSameAsPhone: true,
                position: '',
                coverLetter: ''
            });
            setFile(null);
            setFileName('');

            setTimeout(() => {
                setSubmitted(false);
            }, 8000);
        } catch (err) {
            const errorMessage = err.message || 'Error submitting application. Please try again.';
            setError(`Failed to submit: ${errorMessage}`);
            console.error('Application submission error:', err);
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <div className="hiring">
            {/* Form Modal Overlay */}
            {showFormModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="form-modal-overlay"
                    onClick={() => setShowFormModal(false)}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="form-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            className="modal-close-btn"
                            onClick={() => setShowFormModal(false)}
                        >
                            <X size={24} />
                        </button>
                        <h2>Apply Now!</h2>
                        <p>Join our team and start your journey with BIXSOL</p>

                        {submitted && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="success-message-modal"
                            >
                                <CheckCircle size={48} />
                                <h3>Application Submitted!</h3>
                                <p>Thank you for applying. We'll review your application and get back to you soon.</p>
                            </motion.div>
                        )}

                        {!submitted && (
                            <form onSubmit={handleSubmit} className="modal-form">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="error-message-modal"
                                    >
                                        <AlertCircle size={20} />
                                        {error}
                                    </motion.div>
                                )}

                                <div className="form-row-modal">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Your Name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="form-input-modal"
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Your Email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="form-input-modal"
                                    />
                                </div>

                                <div className="form-row-modal">
                                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '6px', overflow: 'hidden' }}>
                                        <span style={{ padding: '10px 12px', backgroundColor: '#f5f5f5', fontWeight: '600', color: '#333', borderRight: '1px solid #ccc' }}>+91</span>
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="XXXXX XXXXX"
                                            value={formData.phone ? (formData.phone.startsWith('+91') ? formData.phone.slice(3) : formData.phone) : ''}
                                            onChange={handleInputChange}
                                            required
                                            className="form-input-modal"
                                            style={{ flex: 1, border: 'none', padding: '10px 12px', outline: 'none', fontSize: '1em' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '6px', overflow: 'hidden', opacity: formData.whatsappSameAsPhone ? 0.6 : 1 }}>
                                            <span style={{ padding: '10px 12px', backgroundColor: '#f5f5f5', fontWeight: '600', color: '#333', borderRight: '1px solid #ccc' }}>+91</span>
                                            <input
                                                type="tel"
                                                name="whatsappNumber"
                                                placeholder="XXXXX XXXXX"
                                                value={formData.whatsappSameAsPhone ? (formData.phone ? (formData.phone.startsWith('+91') ? formData.phone.slice(3) : formData.phone) : '') : (formData.whatsappNumber ? (formData.whatsappNumber.startsWith('+91') ? formData.whatsappNumber.slice(3) : formData.whatsappNumber) : '')}
                                                onChange={handleInputChange}
                                                disabled={formData.whatsappSameAsPhone}
                                                required
                                                className="form-input-modal"
                                                style={{ flex: 1, border: 'none', padding: '10px 12px', outline: 'none', fontSize: '1em' }}
                                            />
                                        </div>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85em', fontWeight: '400', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                name="whatsappSameAsPhone"
                                                checked={formData.whatsappSameAsPhone}
                                                onChange={handleInputChange}
                                            />
                                            Same as phone
                                        </label>
                                    </div>
                                </div>

                                <div className="form-row-modal">
                                    <select
                                        name="position"
                                        value={formData.position}
                                        onChange={handleInputChange}
                                        required
                                        className="form-input-modal"
                                    >
                                        <option value="">Select Position</option>
                                        {positions.map(pos => (
                                            <option key={pos.id} value={pos.title}>{pos.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <textarea
                                    name="coverLetter"
                                    placeholder="Tell us about yourself..."
                                    value={formData.coverLetter}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="form-input-modal"
                                ></textarea>

                                <div className="file-upload-modal">
                                    <label className="file-label-modal">
                                        <Upload size={20} />
                                        <span>{fileName || 'Upload Resume (PDF, DOC)'}</span>
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            accept=".pdf,.doc,.docx"
                                            className="file-input"
                                        />
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="submit-button-modal"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={20} className="spinning" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            Submit Application
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </motion.div>
            )}

            {/* Hero Section */}
            <section className="hiring-hero">
                <div className="hiring-hero-content">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="hiring-hero-text"
                    >
                        <h1>Join BIXSOL</h1>
                        <p>Be Part of Your Digital Transformation Journey</p>
                        <div className="hero-cta">
                            <button className="cta-button" onClick={() => document.getElementById('positions').scrollIntoView({ behavior: 'smooth' })}>
                                Explore Positions
                            </button>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="hiring-hero-image"
                    >
                        <img src="/panner.jpeg" alt="BIXSOL - Your Digital Partner" />
                    </motion.div>
                </div>
            </section>

            {/* Why Join Us Section */}
            <section className="why-join">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="section-header"
                >
                    <h2>Why Join BIXSOL?</h2>
                    <p>We're building the future of digital transformation with amazing talent</p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="benefits-grid"
                >
                    {benefits.map((benefit, index) => (
                        <motion.div key={index} variants={itemVariants} className="benefit-card">
                            <div className="benefit-icon">{benefit.icon}</div>
                            <h3>{benefit.title}</h3>
                            <p>{benefit.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Open Positions */}
            <section className="open-positions" id="positions">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="section-header"
                >
                    <h2>Open Positions</h2>
                    <p>Find your next opportunity at BIXSOL</p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="positions-grid"
                >
                    {positions.map((position) => {
                        const IconComponent = position.icon;
                        return (
                            <motion.div key={position.id} variants={itemVariants} className="position-card">
                                <div className="position-header">
                                    <div className="position-icon">
                                        <IconComponent />
                                    </div>
                                    <div className="position-badges">
                                        <span className="badge type">{position.type}</span>
                                        <span className="badge location">{position.location}</span>
                                    </div>
                                </div>
                                <h3>{position.title}</h3>
                                <p className="position-description">{position.description}</p>
                                <button className="apply-btn" onClick={() => document.getElementById('application').scrollIntoView({ behavior: 'smooth' })}>
                                    Apply Now
                                </button>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </section>

            {/* Testimonials */}
            <section className="testimonials-section">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="section-header"
                >
                    <h2>What Our Team Says</h2>
                    <p>Hear from talented professionals at BIXSOL</p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="testimonials-grid"
                >
                    {testimonials.map((testimonial, index) => (
                        <motion.div key={index} variants={itemVariants} className="testimonial-card">
                            <div className="stars">
                                {[...Array(5)].map((_, i) => <Star key={i} size={16} />)}
                            </div>
                            <p className="testimonial-text">"{testimonial.text}"</p>
                            <div className="testimonial-author">
                                <div className="author-image">{testimonial.image}</div>
                                <div>
                                    <p className="author-name">{testimonial.name}</p>
                                    <p className="author-role">{testimonial.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Application Form */}
            <section className="application-section" id="application">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="section-header"
                >
                    <h2>Ready to Join Us?</h2>
                    <p>Submit your application below</p>
                </motion.div>

                <div className="application-container">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="application-form-wrapper"
                    >
                        {submitted && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="success-message"
                            >
                                <CheckCircle size={48} />
                                <h3>Application Submitted!</h3>
                                <p>Thank you for applying. We'll review your application and get back to you soon.</p>
                            </motion.div>
                        )}

                        {!submitted && (
                            <form onSubmit={handleSubmit} className="application-form">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="error-message"
                                    >
                                        <AlertCircle size={20} />
                                        {error}
                                    </motion.div>
                                )}

                                <div className="form-row">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Your Name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="form-input"
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Your Email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-row">
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone Number"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        className="form-input"
                                    />
                                    <select
                                        name="position"
                                        value={formData.position}
                                        onChange={handleInputChange}
                                        required
                                        className="form-input"
                                    >
                                        <option value="">Select Position</option>
                                        {positions.map(pos => (
                                            <option key={pos.id} value={pos.title}>{pos.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <textarea
                                    name="coverLetter"
                                    placeholder="Tell us about yourself and why you want to join BIXSOL..."
                                    value={formData.coverLetter}
                                    onChange={handleInputChange}
                                    rows="5"
                                    className="form-input"
                                ></textarea>

                                <div className="file-upload">
                                    <label className="file-label">
                                        <Upload size={20} />
                                        <span>{fileName || 'Upload Resume (PDF, DOC)'}</span>
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            accept=".pdf,.doc,.docx"
                                            className="file-input"
                                        />
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="submit-button"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={20} className="spinning" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            Submit Application
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="final-cta">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="cta-content"
                >
                    <h2>Don't see a role that fits?</h2>
                    <p>We're always looking for talented individuals. Send us your profile and let's explore opportunities together!</p>
                    <a href="mailto:careers@bixsol.com" className="cta-link">Send Your Profile →</a>
                </motion.div>
            </section>
        </div>
    );
};

export default Hiring;
