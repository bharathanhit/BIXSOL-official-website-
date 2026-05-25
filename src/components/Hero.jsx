import React from 'react';
import { motion } from 'framer-motion';
import { MoveRight, Sparkles } from 'lucide-react';
import Logo from './Logo';

const Hero = ({ onLaunchClick }) => {
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
                className="hero-badge"
            >
                <Logo className="hero-logo-small" height={18} />
                Trusted by 50+ businesses
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
                    onClick={onLaunchClick}
                >
                    Launch Project <MoveRight className="w-5 h-5 ml-2" />
                </motion.button>

            </motion.div>

            {/* Stats Row */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="hero-stats"
            >
                <div className="stat-item">
                    <h3 className="gradient-text stat-value">50+</h3>
                    <p className="stat-label">Projects Completed</p>
                </div>
                <div className="stat-item">
                    <h3 className="gradient-text stat-value">100%</h3>
                    <p className="stat-label">Client Satisfaction</p>
                </div>
                <div className="stat-item">
                    <h3 className="gradient-text stat-value">24/7</h3>
                    <p className="stat-label">Support Available</p>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
