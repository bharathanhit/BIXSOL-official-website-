import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Upload, Send, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './Careers.css';

const Careers = () => {
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

    const jobs = [
        {
            title: 'Frontend Developer',
            type: 'Full-time',
            location: 'Remote / Madurai',
            description: 'We are looking for a React expert to build stunning user interfaces.'
        },
        {
            title: 'UI/UX Designer',
            type: 'Contract',
            location: 'Remote',
            description: 'Create beautiful, intuitive designs that wow our clients.'
        },
        {
            title: 'Digital Marketing Specialist',
            type: 'Full-time',
            location: 'Madurai',
            description: 'Help our clients grow their brands through strategic online campaigns.'
        }
    ];

    // Handle file conversion to Base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            // Firestore document limit is 1MB, so we check file size
            if (selectedFile.size > 1000000) {
                setError('File is too large. Max size is 1MB for direct storage.');
                setFile(null);
                setFileName('');
                return;
            }
            setFile(selectedFile);
            setFileName(selectedFile.name);
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

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            position: '',
            coverLetter: ''
        });
        setFileName('');
        setFile(null);
        setError('');
        const fileInput = document.getElementById('resume-upload');
        if (fileInput) fileInput.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please upload your resume.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // 1. Convert file to Base64
            const base64File = await fileToBase64(file);

            // 2. Save data directly to Firestore
            await addDoc(collection(db, 'applications'), {
                ...formData,
                resumeData: base64File, // Storing Base64 string here
                fileName: file.name,
                submittedAt: serverTimestamp(),
                status: 'pending'
            });

            setSubmitted(true);
            resetForm();
        } catch (err) {
            console.error("Error submitting application:", err);
            setError('Failed to submit application. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="careers" className="careers section-padding">
            <div className="container">
                <motion.div
                    className="careers-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="section-title">Join Our <span className="gradient-text">Team</span></h2>
                    <p className="section-desc">
                        Work with the brightest minds in the industry and help us shape the future of digital experiences.
                    </p>
                </motion.div>

                <div className="careers-content">
                    <div className="jobs-list">
                        {jobs.map((job, index) => (
                            <motion.div
                                key={index}
                                className="glass job-card"
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="job-icon">
                                    <Briefcase size={24} />
                                </div>
                                <div className="job-details">
                                    <h3>{job.title}</h3>
                                    <div className="job-meta">
                                        <span>{job.type}</span>
                                        <span className="dot"></span>
                                        <span>{job.location}</span>
                                    </div>
                                    <p>{job.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        className="glass application-card"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        {submitted ? (
                            <motion.div
                                className="success-message"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <CheckCircle size={60} className="success-icon" />
                                <h3>Thank You!</h3>
                                <p>Your application has been submitted successfully. Our team will review it and get back to you soon.</p>
                                <button className="btn btn-secondary" onClick={() => setSubmitted(false)}>
                                    Submit Another
                                </button>
                            </motion.div>
                        ) : (
                            <>
                                <h3>Apply Now</h3>
                                {error && (
                                    <div className="error-message" style={{ color: '#ff4b2b', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <AlertCircle size={20} />
                                        <span>{error}</span>
                                    </div>
                                )}
                                <form className="application-form" onSubmit={handleSubmit}>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Full Name *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="John Doe"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Email *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="john@example.com"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Phone *</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="+91 98765 43210"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Position *</label>
                                            <select
                                                name="position"
                                                value={formData.position}
                                                onChange={handleInputChange}
                                                required
                                                disabled={loading}
                                            >
                                                <option value="">Select a position</option>
                                                {jobs.map((job, idx) => (
                                                    <option key={idx} value={job.title}>{job.title}</option>
                                                ))}
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Resume / CV *</label>
                                        <div className="file-upload-wrapper">
                                            <input
                                                type="file"
                                                id="resume-upload"
                                                hidden
                                                accept=".pdf,.doc,.docx"
                                                onChange={handleFileChange}
                                                required
                                                disabled={loading}
                                            />
                                            <label htmlFor="resume-upload" className="file-upload-label" style={{ cursor: loading ? 'not-allowed' : 'pointer' }}>
                                                {loading ? <Loader2 className="spinning" size={20} /> : <Upload size={20} />}
                                                <span>{fileName || 'Upload CV (PDF, DOC)'}</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Cover Letter</label>
                                        <textarea
                                            rows="4"
                                            name="coverLetter"
                                            value={formData.coverLetter}
                                            onChange={handleInputChange}
                                            placeholder="Tell us why you're a great fit..."
                                            disabled={loading}
                                        ></textarea>
                                    </div>

                                    <motion.button
                                        type="submit"
                                        className="btn btn-primary submit-btn"
                                        whileHover={{ scale: loading ? 1 : 1.02 }}
                                        whileTap={{ scale: loading ? 1 : 0.98 }}
                                        disabled={loading}
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="spinning" size={18} />
                                                <span>Submitting...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send size={18} />
                                                <span>Submit Application</span>
                                            </>
                                        )}
                                    </motion.button>
                                </form>
                            </>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Careers;
