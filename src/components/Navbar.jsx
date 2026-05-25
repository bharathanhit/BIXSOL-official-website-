import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const Navbar = ({ onGetQuoteClick }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [hiringMenuOpen, setHiringMenuOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setHiringMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navLinks = [
        { href: '#home', label: 'Home' },
        { href: '#services', label: 'Services' },
        { href: '#process', label: 'Process' },
        { href: '#portfolio', label: 'Portfolio' },
        { href: '#testimonials', label: 'Testimonials' },
        { href: '#about', label: 'About' },
        { href: '#careers', label: 'Careers' },
        { href: '#contact', label: 'Contact' },
    ];

    const hiringPages = [
        { path: '/hiring-landing', label: 'General Hiring' },
        { path: '/sales-closer', label: 'Sales Closer' },
        { path: '/hiring', label: 'All Positions' },
    ];

    const handleHiringClick = (path) => {
        navigate(path);
        setMobileMenuOpen(false);
        setHiringMenuOpen(false);
    };

    const handleLogoClick = () => {
        navigate('/');
        setMobileMenuOpen(false);
    };

    const toggleDropdown = () => {
        setHiringMenuOpen(!hiringMenuOpen);
    };

    return (
        <>
            <nav className={`navbar ${isScrolled ? 'glass' : ''}`}>
                <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
                    <Logo className="logo-img" height={42} />
                </div>

                <div className="nav-links">
                    {navLinks.map((link) => (
                        <a key={link.href} href={link.href} className="nav-link">
                            {link.label}
                        </a>
                    ))}
                    
                    {/* Hiring Dropdown */}
                    <div ref={dropdownRef} className="nav-dropdown">
                        <button 
                            className="nav-link dropdown-trigger"
                            onClick={toggleDropdown}
                            onMouseEnter={() => setHiringMenuOpen(true)}
                        >
                            Hiring <ChevronDown size={16} className={hiringMenuOpen ? 'rotate' : ''} />
                        </button>
                        <AnimatePresence>
                            {hiringMenuOpen && (
                                <motion.div 
                                    className="dropdown-menu"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    onMouseLeave={() => setHiringMenuOpen(false)}
                                >
                                    {hiringPages.map((page) => (
                                        <button 
                                            key={page.path} 
                                            onClick={() => handleHiringClick(page.path)}
                                            className="dropdown-link"
                                        >
                                            {page.label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <button
                    className="mobile-menu-btn"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className="mobile-menu glass"
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                    >
                        <div className="mobile-links">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </a>
                            ))}
                            
                            {/* Mobile Hiring Links */}
                            <div className="mobile-hiring-section">
                                <p className="mobile-section-title">Hiring Opportunities</p>
                                {hiringPages.map((page) => (
                                    <button 
                                        key={page.path} 
                                        onClick={() => handleHiringClick(page.path)}
                                        className="mobile-hiring-link"
                                    >
                                        {page.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
