import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import {
    Users,
    FileText,
    Download,
    Trash2,
    CheckCircle,
    Clock,
    ExternalLink,
    Mail,
    Phone,
    MessageCircle,
    Briefcase,
    ChevronDown,
    Filter,
    RefreshCw
} from 'lucide-react';
import './AdminPanel.css';

const AdminPanel = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [activeTab, setActiveTab] = useState('applications');
    const [selectedApp, setSelectedApp] = useState(null);

    useEffect(() => {
        const q = query(collection(db, 'applications'), orderBy('submittedAt', 'desc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const apps = [];
            querySnapshot.forEach((doc) => {
                apps.push({ id: doc.id, ...doc.data() });
            });
            setApplications(apps);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching applications:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            await updateDoc(doc(db, 'applications', id), {
                status: newStatus
            });
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const deleteApplication = async (id) => {
        if (window.confirm('Are you sure you want to delete this application?')) {
            try {
                await deleteDoc(doc(db, 'applications', id));
                if (selectedApp?.id === id) setSelectedApp(null);
            } catch (error) {
                console.error("Error deleting application:", error);
            }
        }
    };

    const filteredApplications = applications.filter(app =>
        filter === 'all' ? true : app.status === filter
    );

    const stats = {
        total: applications.length,
        pending: applications.filter(a => a.status === 'pending').length,
        reviewed: applications.filter(a => a.status === 'reviewed').length,
        shortlisted: applications.filter(a => a.status === 'shortlisted').length
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <RefreshCw className="spinning" size={40} />
                <p>Loading Applications...</p>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <header className="admin-header">
                <div className="admin-title-area">
                    <h1>Admin <span className="gradient-text">Panel</span></h1>
                    <p>Manage job applications and resumes</p>
                </div>

                <div className="admin-stats-grid">
                    <div className="stat-card glass">
                        <Users className="stat-icon" />
                        <div className="stat-info">
                            <span className="stat-label">Total</span>
                            <span className="stat-value">{stats.total}</span>
                        </div>
                    </div>
                    <div className="stat-card glass">
                        <Clock className="stat-icon pending" />
                        <div className="stat-info">
                            <span className="stat-label">Pending</span>
                            <span className="stat-value">{stats.pending}</span>
                        </div>
                    </div>
                    <div className="stat-card glass">
                        <CheckCircle className="stat-icon success" />
                        <div className="stat-info">
                            <span className="stat-label">Reviewed</span>
                            <span className="stat-value">{stats.reviewed}</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="admin-content">
                <div className="admin-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('applications')}
                    >
                        Applications
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'resumes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('resumes')}
                    >
                        Resumes ({applications.filter(a => a.resumeFileName && a.resumeFileName !== 'No file uploaded').length})
                    </button>
                </div>

                {activeTab === 'applications' && (
                <>
                <div className="admin-controls">
                    <div className="filter-group glass">
                        <Filter size={18} />
                        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="all">All Applications</option>
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                <div className="admin-dashboard-grid">
                    <div className="applications-list-container glass">
                        <div className="list-header">
                            <span>Candidate</span>
                            <span>Position</span>
                            <span>Date</span>
                            <span>Status</span>
                            <span>Actions</span>
                        </div>
                        <div className="list-body">
                            {filteredApplications.length === 0 ? (
                                <div className="no-data">No applications found.</div>
                            ) : (
                                filteredApplications.map(app => (
                                    <motion.div
                                        key={app.id}
                                        className={`list-item ${selectedApp?.id === app.id ? 'active' : ''}`}
                                        onClick={() => setSelectedApp(app)}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <div className="candidate-info">
                                            <div className="avatar">{app.name.charAt(0)}</div>
                                            <div className="name-email">
                                                <span className="name">{app.name}</span>
                                                <span className="email">{app.email}</span>
                                            </div>
                                        </div>
                                        <div className="position">
                                            <Briefcase size={14} />
                                            {app.position}
                                        </div>
                                        <div className="date">
                                            {app.submittedAt?.toDate().toLocaleDateString()}
                                        </div>
                                        <div className={`status-badge ${app.status}`}>
                                            {app.status}
                                        </div>
                                        <div className="actions" onClick={e => e.stopPropagation()}>
                                            <a href={app.resumeData} download={app.fileName || 'resume'} title="Download CV">
                                                <Download size={18} />
                                            </a>
                                            <button onClick={() => deleteApplication(app.id)} title="Delete">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>

                    <AnimatePresence>
                        {selectedApp && (
                            <motion.div
                                className="application-details glass"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <div className="details-header">
                                    <h3>Application Details</h3>
                                    <button className="close-btn" onClick={() => setSelectedApp(null)}>&times;</button>
                                </div>

                                <div className="details-body">
                                    <div className="detail-section">
                                        <div className="applicant-profile">
                                            <div className="large-avatar">{selectedApp.name.charAt(0)}</div>
                                            <h2>{selectedApp.name}</h2>
                                            <span className="position-tag">{selectedApp.position}</span>
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h4>Contact Information</h4>
                                        <div className="info-row">
                                            <Mail size={16} />
                                            <span>{selectedApp.email}</span>
                                        </div>
                                        <div className="info-row">
                                            <Phone size={16} />
                                            <span>{selectedApp.phone}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                                            <button
                                                onClick={() => window.open(`tel:${selectedApp.phone}`)}
                                                title="Call"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    padding: '8px 16px',
                                                    backgroundColor: '#4CAF50',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9em',
                                                    fontWeight: '500',
                                                    transition: 'background 0.3s'
                                                }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
                                                onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
                                            >
                                                <Phone size={16} />
                                                Call
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const whatsappNumber = selectedApp.whatsappNumber || selectedApp.phone;
                                                    window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`, '_blank');
                                                }}
                                                title="WhatsApp"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    padding: '8px 16px',
                                                    backgroundColor: '#25D366',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9em',
                                                    fontWeight: '500',
                                                    transition: 'background 0.3s'
                                                }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = '#1fa857'}
                                                onMouseOut={(e) => e.target.style.backgroundColor = '#25D366'}
                                            >
                                                <MessageCircle size={16} />
                                                WhatsApp
                                            </button>
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h4>Cover Letter</h4>
                                        <div className="cover-letter-box">
                                            {selectedApp.coverLetter || "No cover letter provided."}
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h4>Resume</h4>
                                        <div className="resume-info">
                                            {selectedApp.resumeFileName ? (
                                                <div className="resume-file-info">
                                                    <FileText size={24} />
                                                    <div>
                                                        <p className="resume-filename">{selectedApp.resumeFileName}</p>
                                                        <p className="resume-note">File received and stored</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="no-resume">No resume uploaded</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h4>Manage Status</h4>
                                        <div className="status-buttons">
                                            <button
                                                className={`status-btn pending ${selectedApp.status === 'pending' ? 'active' : ''}`}
                                                onClick={() => updateStatus(selectedApp.id, 'pending')}
                                            >Pending</button>
                                            <button
                                                className={`status-btn reviewed ${selectedApp.status === 'reviewed' ? 'active' : ''}`}
                                                onClick={() => updateStatus(selectedApp.id, 'reviewed')}
                                            >Reviewed</button>
                                            <button
                                                className={`status-btn shortlisted ${selectedApp.status === 'shortlisted' ? 'active' : ''}`}
                                                onClick={() => updateStatus(selectedApp.id, 'shortlisted')}
                                            >Shortlisted</button>
                                            <button
                                                className={`status-btn rejected ${selectedApp.status === 'rejected' ? 'active' : ''}`}
                                                onClick={() => updateStatus(selectedApp.id, 'rejected')}
                                            >Rejected</button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                </>
                )}
            </main>
        </div>
    );
};

export default AdminPanel;
