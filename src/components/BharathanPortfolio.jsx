import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    ShieldCheck,
    Globe,
    ArrowLeft,
    ExternalLink,
    Lock,
    Sparkles,
    ArrowUpRight,
    MessageCircle,
    CheckCircle2,
    Database,
    Zap,
    Users,
    Building2,
    GraduationCap,
    Ship
} from 'lucide-react';
import './BharathanPortfolio.css';

const BharathanPortfolio = () => {
    const [selectedProject, setSelectedProject] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');

    // Kinetic staggered word animation
    const titleWords = ["Websites", "Crafted", "for", "Impact.", "Powered", "by", "Admin", "Panels."];

    const projects = [
        {
            id: 'globalsr-academy',
            title: 'Global SR English Learning Academy',
            category: 'Education & Coaching',
            filter: 'clients',
            badge: '🎓 ADMISSION & ENQUIRY CRM',
            image: '/portfolio_images/globalsr_hero_original.png',
            highlight: 'Top-rated English communication & IELTS academy in Coimbatore with automated student enquiry management.',
            adminSpecs: [
                'Live student admission enquiry pipeline with zero delay',
                'One-click WhatsApp automated student enrollment connect',
                'Batch timetable scheduler and student batch records'
            ],
            tech: ['React', 'Google Analytics 4', 'SEO Optimized', 'WhatsApp API'],
            externalUrl: 'https://globalsrenglishlearningacademy.com/',
            isClientSite: true,
            hasAdmin: true
        },
        {
            id: 'dhuruvan-exports',
            title: 'Dhuruvan Exports — Global Trade',
            category: 'International Export',
            filter: 'clients',
            badge: '🌐 GLOBAL BUYER CRM & QUOTATION DESK',
            image: '/portfolio_images/dhuruvan_hero_original.jpg',
            highlight: 'Premier Indian agro-commodities & woodcrafts exporter connecting Indian quality with global international markets.',
            adminSpecs: [
                'Multi-country quotation request & international RFP pipeline',
                'Cargo shipment logistics and container dispatch status tracker',
                'Product catalog manager with instant buyer WhatsApp connect'
            ],
            tech: ['React', 'Vite', 'Global SEO', 'RFQ Automation'],
            externalUrl: 'https://dhuruvanexports.com/',
            isClientSite: true,
            hasAdmin: true
        },
        {
            id: 'meenakshi-construction',
            title: 'Meenakshi Construction (மதுரை)',
            category: 'Architecture & Engineering',
            filter: 'clients',
            badge: '🏗️ 3D MILESTONE & ESTIMATE ADMIN',
            image: '/portfolio_images/meenakshi_hero_original.jpg',
            highlight: 'Leading building construction firm in Madurai specializing in 3D elevations, Vastu planning, and turnkey projects.',
            adminSpecs: [
                'Construction milestone stage tracker (Foundation -> Structure -> Interior)',
                'Interactive site quotation calculator and cost estimator',
                'Blueprint elevation approvals and client enquiry manager'
            ],
            tech: ['React', '3D Architecture', 'Tailwind', 'Google Tag Manager'],
            externalUrl: 'https://meenakshi-construction.com/',
            isClientSite: true,
            hasAdmin: true
        },
        {
            id: 'bixsol-ecosystem',
            title: 'BIXSOL Agency & Intelligence OS',
            category: 'Flagship Agency',
            filter: 'saas',
            badge: '⭐ LIVE ADMIN PANEL & SALES CRM',
            image: '/portfolio_images/bixsol_hero_original.jpg',
            secondaryImage: '/portfolio_images/bixsol_admin.jpg',
            highlight: 'Full-stack agency platform integrated with a real-time candidate hiring dashboard and salesperson commission portal.',
            adminSpecs: [
                'Live Firebase Firestore sync with zero lag (<20ms)',
                'In-browser PDF resume parser & candidate indexing',
                'Dedicated Sales Closer Portal (/portal) with commission tracker',
                'One-click WhatsApp outreach with automated interview templates'
            ],
            tech: ['React 19', 'Firebase', 'PDF.js', 'WhatsApp API'],
            isInternal: true,
            adminLink: '/admin',
            portalLink: '/portal',
            webLink: '/',
            hasAdmin: true
        },
        {
            id: 'mega-scans-labs',
            title: 'MEGA Scans & Labs — Diagnostic Billing & ERP System',
            category: 'Healthcare & Diagnostic ERP',
            filter: 'clients',
            badge: '🏥 REAL-TIME LAB BILLING & PDF INVOICE SYSTEM',
            image: '/portfolio_images/mega_scans_billing.png',
            secondaryImage: '/portfolio_images/mega_scans_invoice.png',
            highlight: 'Complete diagnostic laboratory billing platform with patient registration, doctor referrals, test catalog, and instant PDF invoice printing.',
            adminSpecs: [
                'Live patient registration with SID tracking and multi-test rate selector',
                'Doctor referral and healthcare center commission attribution pipeline',
                'Instant client-side PDF medical invoice & receipt generator',
                'Modular backoffice: Front Office, Accounts, Technical, Dispatch & Admin'
            ],
            tech: ['React', 'Netlify Edge', 'PDF Generator', 'Diagnostic ERP'],
            externalUrl: 'https://mega-labs-and-scans.netlify.app/',
            isClientSite: true,
            hasAdmin: true
        },
        {
            id: 'fitzone-gym',
            title: 'FitZone — Fitness Club & Gym Membership Platform',
            category: 'Fitness & Wellness',
            filter: 'clients',
            badge: '🏋️ MEMBERSHIP & TRAINER CLASS ADMIN',
            image: '/portfolio_images/fitzone_gym.png',
            highlight: 'High-energy fitness platform with membership plan tiers, workout video streaming, and personal trainer booking admin.',
            adminSpecs: [
                'Member subscription and renewal tracking (Monthly, Quarterly, Annual plans)',
                'Personal trainer rota scheduling and class capacity manager',
                'Inbound workout consultation CRM with instant WhatsApp chat'
            ],
            tech: ['React', 'Video Player', 'Stripe Billing', 'Membership CRM'],
            isClientSite: true,
            hasAdmin: true
        }
    ];

    const filtered = projects.filter(p => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'clients') return p.isClientSite;
        if (activeFilter === 'saas') return p.filter === 'saas';
        return true;
    });

    return (
        <div className="spacious-portfolio-root">
            {/* Minimal Sticky Nav */}
            <header className="spacious-nav">
                <div className="spacious-nav-inner">
                    <Link to="/" className="spacious-back-btn">
                        <ArrowLeft size={16} />
                        <span>BIXSOL Home</span>
                    </Link>

                    <div className="spacious-founder-tag">
                        <span className="live-pulse" />
                        <span className="founder-name">Bharathan</span>
                        <span className="founder-title">Founder & Full-Stack Architect</span>
                    </div>

                    <a
                        href="https://wa.me/917339310823?text=Hi%20Bharathan!%20I%20saw%20your%20portfolio%20and%20want%20to%20discuss%20building%20a%20website%20with%20an%20admin%20panel."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="spacious-contact-btn"
                    >
                        <MessageCircle size={15} />
                        <span>WhatsApp Bharathan</span>
                    </a>
                </div>
            </header>

            {/* Kinetic Typography Hero */}
            <section className="spacious-hero">
                <motion.div
                    className="spacious-pill"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Sparkles size={14} className="pill-sparkle" />
                    <span>CURATED WEBSITES & CUSTOM ADMINISTRATIVE SYSTEMS</span>
                </motion.div>

                <h1 className="spacious-headline">
                    {titleWords.map((word, i) => (
                        <motion.span
                            key={i}
                            className={`headline-word ${word === 'Impact.' ? 'word-gradient' : ''} ${word === 'Admin' || word === 'Panels.' ? 'word-accent' : ''}`}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                        >
                            {word}{' '}
                        </motion.span>
                    ))}
                </h1>

                <motion.p
                    className="spacious-subtext"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    Every website built by Bharathan comes equipped with an enterprise-grade Admin Panel.
                    Full data sovereignty, real-time sync, and total operational control—without third-party SaaS fees.
                </motion.p>

                {/* Filter Navigation */}
                <div className="spacious-filter-bar">
                    <button
                        className={`sp-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('all')}
                    >
                        All Works ({projects.length})
                    </button>
                    <button
                        className={`sp-filter-btn client-filter ${activeFilter === 'clients' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('clients')}
                    >
                        ⭐ Live Client Websites ({projects.filter(p => p.isClientSite).length})
                    </button>
                    <button
                        className={`sp-filter-btn ${activeFilter === 'saas' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('saas')}
                    >
                        SaaS & Agency Platforms ({projects.filter(p => p.filter === 'saas').length})
                    </button>
                </div>
            </section>

            {/* Kinetic Marquee Ticker */}
            <div className="spacious-ticker-wrap">
                <div className="spacious-ticker">
                    <span>⚡ PRODUCTION WEBSITES</span>
                    <span>🛡️ CUSTOM ADMIN PANELS</span>
                    <span>🏥 MEGA SCANS & LABS BILLING</span>
                    <span>🏋️ FITZONE GYM & FITNESS</span>
                    <span>🎓 GLOBAL SR ACADEMY</span>
                    <span>🌐 DHURUVAN EXPORTS</span>
                    <span>🏗️ MEENAKSHI CONSTRUCTION</span>
                    <span>🚀 REAL-TIME FIRESTORE</span>
                    <span>🔒 BANK-GRADE RBAC</span>
                    <span>📱 ZERO SAAS FEES</span>
                    <span>🏋️ FITZONE GYM & FITNESS</span>
                    <span>🏥 MEGA SCANS & LABS BILLING</span>
                </div>
            </div>

            {/* Spacious Visual Showcase Section */}
            <main className="spacious-showcase">
                <div className="showcase-header">
                    <span className="section-label">SELECTED WORKS</span>
                    <h2>Production Websites with Custom Admin Panels</h2>
                </div>

                <div className="spacious-grid">
                    {filtered.map((item, idx) => (
                        <motion.article
                            key={item.id}
                            className={`spacious-card ${item.isClientSite ? 'client-highlight-card' : ''}`}
                            initial={{ opacity: 0, y: 35 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.5, delay: idx * 0.08 }}
                        >
                            {/* Card Top Info Bar */}
                            <div className="card-top-header">
                                <div className="card-category-wrap">
                                    <span className="card-category">{item.category}</span>
                                    {item.isClientSite ? (
                                        <span className="live-client-pill">● LIVE IN PRODUCTION</span>
                                    ) : (
                                        <span className="admin-status-pill">Integrated Backoffice</span>
                                    )}
                                </div>
                                <div className="card-inline-badge">
                                    <ShieldCheck size={13} className="badge-shield" />
                                    <span>{item.badge}</span>
                                </div>
                            </div>

                            {/* Media Container - 100% Uncropped & Fully Visible */}
                            <div className="card-media-wrap">
                                <img
                                    src={item.image}
                                    alt={`${item.title} preview`}
                                    className="card-ai-image"
                                    loading="lazy"
                                />
                            </div>

                            {/* Minimal Clean Text Content */}
                            <div className="card-content-wrap">
                                <h3 className="card-headline">{item.title}</h3>
                                <p className="card-desc">{item.highlight}</p>

                                {/* Key Specs Chips */}
                                <div className="card-tech-chips">
                                    {item.tech.map((t, tIdx) => (
                                        <span key={tIdx} className="tech-chip">{t}</span>
                                    ))}
                                </div>

                                {/* Clean Action Buttons */}
                                <div className="card-action-bar">
                                    {item.externalUrl ? (
                                        <>
                                            <a
                                                href={item.externalUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="action-btn btn-live-site"
                                            >
                                                <Globe size={14} />
                                                <span>Visit Live Website</span>
                                                <ArrowUpRight size={14} />
                                            </a>
                                            <button
                                                className="action-btn btn-inspect"
                                                onClick={() => setSelectedProject(item)}
                                            >
                                                <span>Admin Specs</span>
                                            </button>
                                        </>
                                    ) : item.isInternal ? (
                                        <>
                                            <Link to={item.adminLink} className="action-btn btn-admin">
                                                <Lock size={14} />
                                                <span>Live Admin Demo</span>
                                                <ArrowUpRight size={14} />
                                            </Link>
                                            <Link to={item.portalLink} className="action-btn btn-portal">
                                                <Users size={14} />
                                                <span>Sales Portal</span>
                                            </Link>
                                            <Link to={item.webLink} className="action-btn btn-web">
                                                <span>Main Site</span>
                                            </Link>
                                        </>
                                    ) : (
                                        <button
                                            className="action-btn btn-inspect"
                                            onClick={() => setSelectedProject(item)}
                                        >
                                            <span>Inspect Admin Specs</span>
                                            <ArrowUpRight size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </main>

            {/* Spacious Minimal "Why Admin Panel" Section */}
            <section className="spacious-advantage">
                <div className="advantage-inner">
                    <span className="section-label">THE ARCHITECTURAL DIFFERENCE</span>
                    <h2>Why an Admin Panel Changes Everything</h2>
                    <p className="advantage-subtitle">
                        A typical website only displays information. A website engineered by Bharathan automates your daily operations.
                    </p>

                    <div className="advantage-grid">
                        <motion.div
                            className="advantage-card"
                            whileHover={{ y: -6 }}
                            transition={{ duration: 0.25 }}
                        >
                            <div className="adv-icon adv-blue">
                                <Database size={24} />
                            </div>
                            <h3>Complete Data Ownership</h3>
                            <p>You own all your student enrollments, customer leads, and export shipments. Zero monthly SaaS fees.</p>
                        </motion.div>

                        <motion.div
                            className="advantage-card"
                            whileHover={{ y: -6 }}
                            transition={{ duration: 0.25 }}
                        >
                            <div className="adv-icon adv-green">
                                <Zap size={24} />
                            </div>
                            <h3>Sub-20ms Real-Time Sync</h3>
                            <p>Live Firestore and WebSocket data streaming. Inquiries, applications, and status updates trigger instantly.</p>
                        </motion.div>

                        <motion.div
                            className="advantage-card"
                            whileHover={{ y: -6 }}
                            transition={{ duration: 0.25 }}
                        >
                            <div className="adv-icon adv-purple">
                                <ShieldCheck size={24} />
                            </div>
                            <h3>Automated Workflows</h3>
                            <p>Direct WhatsApp student & buyer connect, PDF quote generators, and automated lead triage pipelines.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Spacious Minimal CTA Section */}
            <section className="spacious-cta">
                <motion.div
                    className="cta-box"
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="cta-label">DIRECT COLLABORATION</span>
                    <h2>Need a Production Website with an Integrated Admin Panel?</h2>
                    <p>
                        Let's build a fast, scalable web application tailored to your business needs with complete administrative control.
                    </p>

                    <div className="cta-buttons-row">
                        <a
                            href="https://wa.me/917339310823?text=Hi%20Bharathan!%20I%20saw%20your%20portfolio%20and%20want%20to%20build%20a%20website%20with%20an%20admin%20panel."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cta-btn-primary"
                        >
                            <MessageCircle size={18} />
                            <span>WhatsApp Bharathan (+91 7339310823)</span>
                        </a>

                        <a
                            href="mailto:bixsolcompany@gmail.com?subject=Project%20Inquiry%20for%20Bharathan"
                            className="cta-btn-secondary"
                        >
                            <span>Email BIXSOL</span>
                        </a>
                    </div>
                </motion.div>
            </section>

            {/* Minimal Footer */}
            <footer className="spacious-footer">
                <p>&copy; {new Date().getFullYear()} Bharathan • Founder & Full-Stack Architect at BIXSOL</p>
                <div className="spacious-footer-links">
                    <Link to="/">BIXSOL Site</Link>
                    <Link to="/admin">Admin Panel</Link>
                    <Link to="/portal">Sales Closer Portal</Link>
                </div>
            </footer>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        className="spacious-modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedProject(null)}
                    >
                        <motion.div
                            className="spacious-modal"
                            initial={{ scale: 0.94, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.94, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-top">
                                <div>
                                    <span className="modal-cat">{selectedProject.category}</span>
                                    <h2>{selectedProject.title}</h2>
                                </div>
                                <button
                                    className="modal-close-btn"
                                    onClick={() => setSelectedProject(null)}
                                >
                                    &times;
                                </button>
                            </div>
                            <div className="modal-body-content">
                                <div className="modal-images-gallery">
                                    <div className="modal-img-wrap">
                                        <img
                                            src={selectedProject.image}
                                            alt={selectedProject.title}
                                            className="modal-image-preview"
                                        />
                                    </div>
                                    {selectedProject.secondaryImage && (
                                        <div className="modal-img-wrap" style={{ marginTop: '12px' }}>
                                            <img
                                                src={selectedProject.secondaryImage}
                                                alt={`${selectedProject.title} Invoice Preview`}
                                                className="modal-image-preview"
                                            />
                                        </div>
                                    )}
                                </div>

                                <h4>
                                    <ShieldCheck size={16} className="text-green" />
                                    <span>Integrated Administrative Features</span>
                                </h4>

                                <ul className="modal-specs-list">
                                    {selectedProject.adminSpecs.map((spec, sIdx) => (
                                        <li key={sIdx}>
                                            <CheckCircle2 size={16} className="text-green spec-check" />
                                            <span>{spec}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="modal-tech-row">
                                    {selectedProject.tech.map((t, tIdx) => (
                                        <span key={tIdx} className="tech-chip">{t}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="modal-footer-action">
                                {selectedProject.externalUrl ? (
                                    <a
                                        href={selectedProject.externalUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="modal-wa-btn"
                                    >
                                        <Globe size={15} />
                                        <span>Visit Live Website ↗</span>
                                    </a>
                                ) : (
                                    <a
                                        href={`https://wa.me/917339310823?text=Hi%20Bharathan!%20I'm%20interested%20in%20building%20a%20project%20similar%20to%20${encodeURIComponent(selectedProject.title)}.`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="modal-wa-btn"
                                    >
                                        <MessageCircle size={15} />
                                        <span>Inquire via WhatsApp</span>
                                    </a>
                                )}
                                <button
                                    className="modal-cancel-btn"
                                    onClick={() => setSelectedProject(null)}
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BharathanPortfolio;
