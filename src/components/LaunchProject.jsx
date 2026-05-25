import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Mail, Phone, FileText, X } from 'lucide-react';

const LaunchProject = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="launch-modal-overlay">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="launch-modal-backdrop"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="glass launch-modal-content"
                    >
                        <button
                            onClick={onClose}
                            className="launch-close-btn hover-bg"
                        >
                            <X size={24} />
                        </button>

                        <div className="launch-header">
                            <h2 className="launch-title">
                                Do you need a <span className="gradient-text">Website?</span>
                            </h2>
                            <p className="launch-subtitle">
                                Tell us about your vision. We'll help you build a digital presence that stands out.
                            </p>
                        </div>

                        <form className="launch-form">
                            <div className="launch-column">
                                <div className="launch-input-group">
                                    <label className="launch-label">
                                        <User size={18} /> Full Name
                                    </label>
                                    <input type="text" placeholder="John Doe" className="launch-input" />
                                </div>

                                <div className="launch-input-group">
                                    <label className="launch-label">
                                        <Mail size={18} /> Email Address
                                    </label>
                                    <input type="email" placeholder="john@example.com" className="launch-input" />
                                </div>

                                <div className="launch-input-group">
                                    <label className="launch-label">
                                        <Phone size={18} /> Phone Number
                                    </label>
                                    <input type="tel" placeholder="+91 98765 43210" className="launch-input" />
                                </div>
                            </div>

                            <div className="launch-column">
                                <div className="launch-input-group launch-textarea-wrapper">
                                    <label className="launch-label">
                                        <FileText size={18} /> Project Requirements
                                    </label>
                                    <textarea placeholder="Describe your project needs..." className="launch-textarea" />
                                </div>
                            </div>

                            <div className="launch-submit-wrapper">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="btn btn-primary launch-submit-btn"
                                >
                                    Submit Request <Send size={20} />
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LaunchProject;
