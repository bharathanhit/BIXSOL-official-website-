import React from 'react';
import { Instagram, Facebook, ChevronRight } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="glass" style={{ margin: '0 5% 2rem 5%', borderRadius: '32px', padding: '4rem 5% 2rem 5%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem', marginBottom: '3rem' }}>
                <div>
                    <div className="logo gradient-text" style={{ fontSize: '2rem', marginBottom: '1rem' }}>BIXSOL</div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                        Let the world know your brand! Digital marketing and website development that matters.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <a href="https://www.facebook.com/share/1CEx9Db6FT/" target="_blank" rel="noopener noreferrer" style={{ cursor: 'pointer' }}>
                            <div className="glass" style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Facebook size={20} />
                            </div>
                        </a>
                        <a href="https://www.instagram.com/_bixsol_?igsh=MTBxYzJldDh1MDVhbw==" target="_blank" rel="noopener noreferrer" style={{ cursor: 'pointer' }}>
                            <div className="glass" style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Instagram size={20} />
                            </div>
                        </a>
                    </div>
                </div>

                <div>
                    <h4 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Company</h4>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                        <li><a href="#about">About Us</a></li>
                        <li><a href="#process">Our Process</a></li>
                        <li><a href="#portfolio">Portfolio</a></li>
                        <li><a href="#testimonials">Testimonials</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>

                <div>
                    <h4 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Services</h4>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                        <li><a href="#services">Digital Marketing</a></li>
                        <li><a href="#services">Web Development</a></li>
                        <li><a href="#services">SEO Optimization</a></li>
                        <li><a href="#services">Social Media Management</a></li>
                        <li><a href="#services">Branding</a></li>
                        <li><a href="#services">UI/UX Design</a></li>
                    </ul>
                </div>

                <div>
                    <h4 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Get Updates</h4>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        Subscribe to get latest updates, tips, and exclusive offers.
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input type="email" placeholder="Your email" style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border)',
                            borderRadius: '12px',
                            padding: '0.75rem',
                            color: 'white',
                            width: '100%'
                        }} />
                        <button className="btn btn-primary" style={{ padding: '0.75rem' }}>
                            <ChevronRight />
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                &copy; {new Date().getFullYear()} BIXSOL. All rights reserved. | Made with ❤️ in India
            </div>
        </footer>
    );
};

export default Footer;
