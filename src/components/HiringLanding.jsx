import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Users, Zap, Award, CheckCircle, Star, Send, Upload, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './HiringLanding.css';

const HiringLanding = () => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fileName, setFileName] = useState('');
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        position: '',
        coverLetter: ''
    });

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
        { icon: '💰', title: 'Competitive Salary', desc: 'Industry-leading compensation packages' },
        { icon: '🌍', title: 'Remote Work', desc: 'Work from anywhere in India' },
        { icon: '📈', title: 'Career Growth', desc: 'Continuous learning & development' },
        { icon: '👥', title: 'Great Team', desc: 'Fun, collaborative environment' },
        { icon: '🎁', title: 'Full Benefits', desc: 'Health insurance & perks' },
        { icon: '🚀', title: 'Innovation', desc: 'Cutting-edge technologies' }
    ];

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
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
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let resumeBase64 = null;
            if (file) {
                resumeBase64 = await fileToBase64(file);
            }

            await addDoc(collection(db, 'jobApplications'), {
                ...formData,
                resume: resumeBase64,
                resumeName: fileName,
                appliedAt: serverTimestamp(),
                status: 'pending'
            });

            setSubmitted(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                position: '',
                coverLetter: ''
            });
            setFile(null);
            setFileName('');

            setTimeout(() => {
                setSubmitted(false);
            }, 8000);
        } catch (err) {
            setError('Error submitting application. Please try again.');
            console.error(err);
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
                delayChildren: 0.2
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
        <div className="hiring-landing">
            {/* Navigation Bar */}
            <nav className="landing-navbar">
                <div className="navbar-content">
                    <div className="logo">
                        <img src="/logo.jpg" alt="BIXSOL" />
                    </div>
                    <button 
                        className="nav-cta"
                        onClick={() => document.getElementById('apply-section').scrollIntoView({ behavior: 'smooth' })}
                    >
                        Apply Now
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="landing-hero">
                <div className="hero-container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="hero-content"
                    >
                        <div className="hero-text">
                            <h1>Join BIXSOL</h1>
                            <p>Be Part of Your Digital Transformation Journey</p>
                            <div className="hero-stats">
                                <div className="stat">
                                    <span className="number">50+</span>
                                    <span className="label">Happy Clients</span>
                                </div>
                                <div className="stat">
                                    <span className="number">30+</span>
                                    <span className="label">Team Members</span>
                                </div>
                                <div className="stat">
                                    <span className="number">100%</span>
                                    <span className="label">Client Satisfaction</span>
                                </div>
                            </div>
                            <button 
                                className="hero-cta"
                                onClick={() => document.getElementById('positions-section').scrollIntoView({ behavior: 'smooth' })}
                            >
                                Explore Positions <ArrowRight size={20} />
                            </button>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="hero-image"
                        >
                            <img src="/panner.jpeg" alt="BIXSOL Hiring" />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Why Join Section */}
            <section className="why-join-section">
                <div className="section-container">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="section-header"
                    >
                        <h2>Why Choose BIXSOL?</h2>
                        <p>Join a team that values innovation, growth, and excellence</p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="benefits-grid"
                    >
                        {benefits.map((benefit, index) => (
                            <motion.div key={index} variants={itemVariants} className="benefit-item">
                                <div className="benefit-emoji">{benefit.icon}</div>
                                <h3>{benefit.title}</h3>
                                <p>{benefit.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Positions Section */}
            <section className="positions-section" id="positions-section">
                <div className="section-container">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="section-header"
                    >
                        <h2>Open Positions</h2>
                        <p>Find your perfect role at BIXSOL</p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="positions-list"
                    >
                        {positions.map((position) => {
                            const IconComponent = position.icon;
                            return (
                                <motion.div key={position.id} variants={itemVariants} className="position-item">
                                    <div className="position-top">
                                        <div className="position-icon">
                                            <IconComponent size={24} />
                                        </div>
                                        <div className="position-tags">
                                            <span className="tag type-tag">{position.type}</span>
                                            <span className="tag location-tag">📍 {position.location}</span>
                                        </div>
                                    </div>
                                    <h3>{position.title}</h3>
                                    <p className="position-desc">{position.description}</p>
                                    <button 
                                        className="position-cta"
                                        onClick={() => {
                                            document.getElementById('apply-section').scrollIntoView({ behavior: 'smooth' });
                                            setTimeout(() => {
                                                document.querySelector('select[name="position"]').value = position.title;
                                            }, 500);
                                        }}
                                    >
                                        Apply for this role
                                    </button>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Application Section */}
            <section className="apply-section" id="apply-section">
                <div className="section-container">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="section-header"
                    >
                        <h2>Ready to Apply?</h2>
                        <p>Fill out the form below and join our team</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="form-wrapper"
                    >
                        {submitted && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="success-box"
                            >
                                <CheckCircle size={56} />
                                <h3>Application Received!</h3>
                                <p>Thank you for your interest. We'll review your application and contact you soon.</p>
                                <button 
                                    className="success-btn"
                                    onClick={() => setSubmitted(false)}
                                >
                                    Submit Another Application
                                </button>
                            </motion.div>
                        )}

                        {!submitted && (
                            <form onSubmit={handleSubmit} className="application-form">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="error-box"
                                    >
                                        <AlertCircle size={20} />
                                        <span>{error}</span>
                                    </motion.div>
                                )}

                                <div className="form-group-row">
                                    <div className="form-group">
                                        <label>Full Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Enter your full name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="your@email.com"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group-row">
                                    <div className="form-group">
                                        <label>Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="Your phone number"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Position Applying For *</label>
                                        <select
                                            name="position"
                                            value={formData.position}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select a position</option>
                                            {positions.map(pos => (
                                                <option key={pos.id} value={pos.title}>{pos.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Tell us about yourself *</label>
                                    <textarea
                                        name="coverLetter"
                                        placeholder="Share your experience and why you want to join BIXSOL..."
                                        value={formData.coverLetter}
                                        onChange={handleInputChange}
                                        rows="5"
                                    ></textarea>
                                </div>

                                <div className="form-group">
                                    <label>Upload Resume *</label>
                                    <div className="file-upload-box">
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            accept=".pdf,.doc,.docx"
                                            id="resume-upload"
                                        />
                                        <label htmlFor="resume-upload" className="file-label">
                                            <Upload size={24} />
                                            <span className="file-text">
                                                {fileName || 'Click to upload or drag & drop'}
                                            </span>
                                            <span className="file-hint">PDF, DOC, or DOCX (max 5MB)</span>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="submit-btn"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={20} className="spinner" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            Submit Application
                                        </>
                                    )}
                                </button>

                                <p className="form-note">We'll get back to you within 48 hours</p>
                            </form>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="footer-cta">
                <div className="cta-box">
                    <h2>Don't see a position that fits?</h2>
                    <p>We're always looking for talented individuals. Send us your resume anyway!</p>
                    <a href="mailto:careers@bixsol.com" className="email-link">
                        Send us your profile
                    </a>
                </div>
            </section>
        </div>
    );
};

export default HiringLanding;
