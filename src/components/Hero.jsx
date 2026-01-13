import React from 'react';
import { motion } from 'framer-motion';
import { MoveRight, Sparkles } from 'lucide-react';

const Hero = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: (i = 0) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.8,
                ease: [0.215, 0.61, 0.355, 1],
            },
        }),
    };

    return (
        <section id="home" className="hero section-padding">
            <div className="hero-bg-shapes">
                <motion.div
                    className="shape shape-1"
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, 30, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                />
                <motion.div
                    className="shape shape-2"
                    animate={{
                        scale: [1, 1.1, 1],
                        x: [0, -30, 0],
                        y: [0, -20, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1.25rem',
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '50px',
                    marginBottom: '2rem',
                    fontSize: '0.9rem',
                    color: 'var(--primary)',
                }}
            >
                <Sparkles size={16} />
                Trusted by 50+ businesses worldwide
            </motion.div>

            <motion.h1
                className="hero-title"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                custom={1}
            >
                Innovate. <span className="gradient-text">Market.</span> Dominate.
            </motion.h1>

            <motion.p
                className="hero-slogan"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                custom={2}
            >
                Let the world know your brand! We provide cutting-edge digital marketing and web development solutions to scale your business and create lasting impact in the digital space.
            </motion.p>

            <motion.div
                className="hero-btns"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                custom={3}
            >
                <motion.button
                    className="btn btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Launch Project <MoveRight className="w-5 h-5 ml-2" />
                </motion.button>
                <motion.button
                    className="btn btn-secondary"
                    whileHover={{ scale: 1.05, borderColor: 'var(--primary)' }}
                    whileTap={{ scale: 0.95 }}
                >
                    Meet the Team
                </motion.button>
            </motion.div>

            {/* Stats Row */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '2rem',
                    marginTop: '5rem',
                    padding: '2rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '24px',
                    border: '1px solid var(--border)',
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <h3 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>50+</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Projects Completed</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <h3 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>100%</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Client Satisfaction</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <h3 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>24/7</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Support Available</p>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
