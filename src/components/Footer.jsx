import React from 'react';
import { Instagram, Facebook, ChevronRight } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
    return (
        <footer className="footer glass">
            <div className="footer-grid">
                <div className="footer-col">
                    <div className="footer-logo">
                        <Logo className="footer-logo-img" height={60} />
                    </div>
                    <p className="footer-desc">
                        Let the world know your brand! Digital marketing and website development that matters.<br />
                        <strong style={{ opacity: 0.9 }}>GSTIN:</strong> 33FVMPA3458N1Z7<br />
                        <strong style={{ opacity: 0.9 }}>MSME:</strong> UDYAM-TN-12-0171036
                    </p>
                    <div className="social-links">
                        <a href="https://www.facebook.com/share/1CEx9Db6FT/" target="_blank" rel="noopener noreferrer" className="social-link">
                            <div className="glass icon-box">
                                <Facebook size={20} />
                            </div>
                        </a>
                        <a href="https://www.instagram.com/_bixsol_?igsh=MTBxYzJldDh1MDVhbw==" target="_blank" rel="noopener noreferrer" className="social-link">
                            <div className="glass icon-box">
                                <Instagram size={20} />
                            </div>
                        </a>
                    </div>
                </div>

                <div className="footer-col">
                    <h4 className="footer-title">Company</h4>
                    <ul className="footer-links">
                        <li><a href="#about">About Us</a></li>
                        <li><a href="#process">Our Process</a></li>
                        <li><a href="#portfolio">Portfolio</a></li>
                        <li><a href="#testimonials">Testimonials</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4 className="footer-title">Services</h4>
                    <ul className="footer-links">
                        <li><a href="#services">Digital Marketing</a></li>
                        <li><a href="#services">Web Development</a></li>
                        <li><a href="#services">SEO Optimization</a></li>
                        <li><a href="#services">Social Media Management</a></li>
                        <li><a href="#services">Branding</a></li>
                        <li><a href="#services">UI/UX Design</a></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4 className="footer-title">Get Updates</h4>
                    <p className="footer-desc">
                        Subscribe to get latest updates, tips, and exclusive offers.
                    </p>
                    <div className="newsletter-form">
                        <input type="email" placeholder="Your email" className="newsletter-input" />
                        <button className="btn btn-primary newsletter-btn">
                            <ChevronRight />
                        </button>
                    </div>
                </div>
            </div>

            <div className="copyright">
                &copy; {new Date().getFullYear()} BIXSOL. All rights reserved. | Made with ❤️ in India
            </div>
        </footer>
    );
};

export default Footer;
