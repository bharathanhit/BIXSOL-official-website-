import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, CheckCircle, AlertCircle, Loader2, Upload, Send, TrendingUp, Users, Award } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './SalesCloserHiring.css';

const SalesCloserHiring = () => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fileName, setFileName] = useState('');
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        whatsappNumber: '',
        whatsappSameAsPhone: true,
        experience: '',
        currentRole: '',
        expectedIncome: '',
        availability: '',
        salesBackground: ''
    });

    const benefits = [
        { icon: '💰', title: 'High Commission', desc: 'Up to 15% commission on sales' },
        { icon: '📈', title: 'Unlimited Earning', desc: 'No cap on monthly income' },
        { icon: '🎯', title: 'Flexible Schedule', desc: 'Work at your own pace' },
        { icon: '🏆', title: 'Performance Bonus', desc: 'Extra rewards for top performers' },
        { icon: '📱', title: 'Digital Tools', desc: 'Advanced CRM & sales tools' },
        { icon: '👥', title: 'Team Support', desc: 'Expert mentoring & support' }
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
                experience: formData.experience,
                currentRole: formData.currentRole,
                expectedIncome: formData.expectedIncome,
                availability: formData.availability,
                salesBackground: formData.salesBackground,
                resumeFileName: fileName || 'No file uploaded',
                submittedAt: serverTimestamp(),
                status: 'pending',
                position: 'Sales Closer'
            });

            // Track Lead submission with Meta Pixel
            if (window.fbq) {
                window.fbq('track', 'Lead', {
                    content_name: 'Sales Closer Application',
                    status: 'submitted'
                });
            }

            setSubmitted(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                whatsappNumber: '',
                whatsappSameAsPhone: true,
                experience: '',
                currentRole: '',
                expectedIncome: '',
                availability: '',
                salesBackground: ''
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
        <div className="sales-closer-page">
            {/* Navigation */}
            <nav className="sc-navbar">
                <div className="sc-navbar-content">
                    <div className="sc-logo">
                        <img src="/logo.jpg" alt="BIXSOL" />
                    </div>
                    <button 
                        className="sc-nav-btn"
                        onClick={() => document.getElementById('apply-form').scrollIntoView({ behavior: 'smooth' })}
                    >
                        Apply Now
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="sc-hero">
                <div className="sc-hero-overlay"></div>
                <div className="sc-hero-container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="sc-hero-content"
                    >
                        <div className="sc-hero-badge">🚀 Join Our Sales Team</div>
                        <h1>Commission-Based Sales Closer</h1>
                        <p>Earn Unlimited Income • Remote Work • No Experience Required</p>
                        
                        <div className="sc-hero-stats">
                            <div className="sc-stat-item">
                                <TrendingUp size={28} />
                                <div>
                                    <div className="stat-number">10-15%</div>
                                    <div className="stat-label">Commission</div>
                                </div>
                            </div>
                            <div className="sc-stat-item">
                                <Target size={28} />
                                <div>
                                    <div className="stat-number">Unlimited</div>
                                    <div className="stat-label">Earning Potential</div>
                                </div>
                            </div>
                            <div className="sc-stat-item">
                                <Users size={28} />
                                <div>
                                    <div className="stat-number">50+</div>
                                    <div className="stat-label">Top Performers</div>
                                </div>
                            </div>
                        </div>

                        <button 
                            className="sc-hero-cta"
                            onClick={() => document.getElementById('apply-form').scrollIntoView({ behavior: 'smooth' })}
                        >
                            Start Earning Today
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="sc-hero-image"
                    >
                        <img src="/panner.jpeg" alt="Sales Closer Opportunity" />
                    </motion.div>
                </div>
            </section>

            {/* Why Join Section */}
            <section className="sc-why-join">
                <div className="sc-container">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="sc-section-header"
                    >
                        <h2>Why Sales Closers Love BIXSOL</h2>
                        <p>Lucrative commission structure with full support</p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="sc-benefits-grid"
                    >
                        {benefits.map((benefit, index) => (
                            <motion.div key={index} variants={itemVariants} className="sc-benefit-card">
                                <div className="sc-benefit-icon">{benefit.icon}</div>
                                <h3>{benefit.title}</h3>
                                <p>{benefit.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* What You'll Do Section */}
            <section className="sc-role-section">
                <div className="sc-container">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="sc-section-header"
                    >
                        <h2>Your Role As A Sales Closer</h2>
                        <p>Close deals, earn big, grow fast</p>
                    </motion.div>

                    <div className="sc-role-content">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="sc-role-list"
                        >
                            <div className="sc-role-item">
                                <div className="sc-role-check">✓</div>
                                <div>
                                    <h4>Close Sales Calls</h4>
                                    <p>Handle inbound & outbound calls, negotiate deals</p>
                                </div>
                            </div>
                            <div className="sc-role-item">
                                <div className="sc-role-check">✓</div>
                                <div>
                                    <h4>Build Relationships</h4>
                                    <p>Connect with prospects, understand their needs</p>
                                </div>
                            </div>
                            <div className="sc-role-item">
                                <div className="sc-role-check">✓</div>
                                <div>
                                    <h4>No Target</h4>
                                    <p>Work at your own pace, no pressure targets to meet</p>
                                </div>
                            </div>
                            <div className="sc-role-item">
                                <div className="sc-role-check">✓</div>
                                <div>
                                    <h4>Track Results</h4>
                                    <p>Use CRM tools, monitor your performance dashboard</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="sc-requirements"
                        >
                            <h3>What We're Looking For</h3>
                            <ul>
                                <li>✨ Excellent communication skills</li>
                                <li>🎯 Sales-driven mentality</li>
                                <li>⚡ Quick learner & adaptable</li>
                                <li>💪 Self-motivated individual</li>
                                <li>🤝 Team player & problem solver</li>
                                <li>📱 Comfortable with technology</li>
                                <li>💼 Professional presentation</li>
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Commission Structure */}
            <section className="sc-commission">
                <div className="sc-container">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="sc-section-header"
                    >
                        <h2>Transparent Commission Structure</h2>
                        <p>Earn more as you grow</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="sc-commission-table"
                    >
                        <div className="commission-row header-row">
                            <div className="commission-cell">Monthly Sales</div>
                            <div className="commission-cell">Commission Rate</div>
                            <div className="commission-cell">Example Earnings</div>
                        </div>
                        <div className="commission-row">
                            <div className="commission-cell">₹0 - ₹2L</div>
                            <div className="commission-cell">10%</div>
                            <div className="commission-cell">₹20,000</div>
                        </div>
                        <div className="commission-row">
                            <div className="commission-cell">₹2L - ₹5L</div>
                            <div className="commission-cell">12%</div>
                            <div className="commission-cell">₹42,000</div>
                        </div>
                        <div className="commission-row highlight">
                            <div className="commission-cell">₹5L+</div>
                            <div className="commission-cell">15%</div>
                            <div className="commission-cell">₹75,000+</div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Application Form */}
            <section className="sc-apply-section" id="apply-form">
                <div className="sc-container">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="sc-section-header"
                    >
                        <h2>Ready to Earn Big?</h2>
                        <p>Fill out the form and join our sales team</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="sc-form-container"
                    >
                        {submitted && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="sc-success-box"
                            >
                                <CheckCircle size={60} />
                                <h3>Application Submitted!</h3>
                                <p>We're excited to review your application. Our team will contact you within 24 hours.</p>
                                <button 
                                    className="sc-success-btn"
                                    onClick={() => setSubmitted(false)}
                                >
                                    Submit Another Application
                                </button>
                            </motion.div>
                        )}

                        {!submitted && (
                            <form onSubmit={handleSubmit} className="sc-application-form">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="sc-error-box"
                                    >
                                        <AlertCircle size={20} />
                                        <span>{error}</span>
                                    </motion.div>
                                )}

                                {/* Personal Information */}
                                <div className="sc-form-section">
                                    <h3 className="sc-form-section-title">📋 Personal Information</h3>
                                    
                                    <div className="sc-form-row">
                                        <div className="sc-form-group">
                                            <label>Full Name *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Your full name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="sc-form-group">
                                            <label>Email Address *</label>
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

                                    <div className="sc-form-row">
                                        <div className="sc-form-group">
                                            <label>Phone Number *</label>
                                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '6px', overflow: 'hidden' }}>
                                                <span style={{ padding: '10px 12px', backgroundColor: '#f5f5f5', fontWeight: '600', color: '#333', borderRight: '1px solid #ccc' }}>+91</span>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    placeholder="XXXXX XXXXX"
                                                    value={formData.phone ? (formData.phone.startsWith('+91') ? formData.phone.slice(3) : formData.phone) : ''}
                                                    onChange={handleInputChange}
                                                    required
                                                    style={{ flex: 1, border: 'none', padding: '10px 12px', outline: 'none', fontSize: '1em' }}
                                                />
                                            </div>
                                        </div>
                                        <div className="sc-form-group">
                                            <label>WhatsApp Number *</label>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                                                        style={{ flex: 1, border: 'none', padding: '10px 12px', outline: 'none', fontSize: '1em' }}
                                                    />
                                                </div>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9em', fontWeight: '400', cursor: 'pointer' }}>
                                                    <input
                                                        type="checkbox"
                                                        name="whatsappSameAsPhone"
                                                        checked={formData.whatsappSameAsPhone}
                                                        onChange={handleInputChange}
                                                    />
                                                    Same as mobile number
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="sc-form-row">
                                        <div className="sc-form-group">
                                            <label>Current Role/Occupation</label>
                                            <input
                                                type="text"
                                                name="currentRole"
                                                placeholder="e.g., Student, Working Professional, Freelancer"
                                                value={formData.currentRole}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Sales Experience */}
                                <div className="sc-form-section">
                                    <h3 className="sc-form-section-title">🎯 Sales Experience <span style={{fontSize: '0.85em', fontWeight: '400', opacity: '0.8'}}>(Optional details)</span></h3>
                                    
                                    <div className="sc-form-group">
                                        <label>Years of Sales Experience *</label>
                                        <select
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select experience level</option>
                                            <option value="0">No Experience (First-time)</option>
                                            <option value="1">Less than 1 year</option>
                                            <option value="1-3">1-3 years</option>
                                            <option value="3-5">3-5 years</option>
                                            <option value="5-10">5-10 years</option>
                                            <option value="10+">10+ years</option>
                                        </select>
                                    </div>

                                    <div className="sc-form-group">
                                        <label>Tell us about your background</label>
                                        <textarea
                                            name="salesBackground"
                                            placeholder="Describe your sales experience, industries you've worked in, types of products/services sold, etc."
                                            value={formData.salesBackground}
                                            onChange={handleInputChange}
                                            rows="4"
                                        ></textarea>
                                    </div>
                                </div>

                                {/* Goals & Expectations */}
                                <div className="sc-form-section">
                                    <h3 className="sc-form-section-title">💰 Goals & Expectations</h3>
                                    
                                    <div className="sc-form-row">
                                        <div className="sc-form-group">
                                            <label>Expected Monthly Income Target *</label>
                                            <input
                                                type="text"
                                                name="expectedIncome"
                                                placeholder="e.g., ₹50,000, ₹1,00,000, etc."
                                                value={formData.expectedIncome}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="sc-form-group">
                                            <label>Availability *</label>
                                            <select
                                                name="availability"
                                                value={formData.availability}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Select availability</option>
                                                <option value="full-time">Full-time (40+ hours/week)</option>
                                                <option value="part-time">Part-time (20-40 hours/week)</option>
                                                <option value="flexible">Flexible (Variable hours)</option>
                                                <option value="weekend">Weekends only</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Resume Upload */}
                                <div className="sc-form-section">
                                    <h3 className="sc-form-section-title">📄 Documents</h3>
                                    
                                    <div className="sc-form-group">
                                        <label>Upload Your Resume (Optional)</label>
                                        <div className="sc-file-upload">
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                                accept=".pdf,.doc,.docx"
                                                id="sc-resume-upload"
                                            />
                                            <label htmlFor="sc-resume-upload" className="sc-file-label">
                                                <Upload size={24} />
                                                <span className="sc-file-text">
                                                    {fileName || 'Click to upload or drag & drop'}
                                                </span>
                                                <span className="sc-file-hint">PDF, DOC, or DOCX (max 5MB)</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="sc-submit-btn"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={20} className="sc-spinner" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            Submit Application
                                        </>
                                    )}
                                </button>

                                <p className="sc-form-note">✓ We'll contact you within 24 hours</p>
                            </form>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="sc-footer-cta">
                <div className="sc-footer-content">
                    <Award size={40} />
                    <h2>Ready to Grow Your Sales Career?</h2>
                    <p>Join hundreds of successful sales closers earning ₹50,000 - ₹3,00,000+ monthly</p>
                    <button 
                        className="sc-footer-btn"
                        onClick={() => document.getElementById('apply-form').scrollIntoView({ behavior: 'smooth' })}
                    >
                        Apply Now - It's Free!
                    </button>
                </div>
            </section>
        </div>
    );
};

export default SalesCloserHiring;
