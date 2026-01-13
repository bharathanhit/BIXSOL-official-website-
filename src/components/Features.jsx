import React from 'react';
import { motion } from 'framer-motion';
import MagicBento from './MagicBento';

const Features = () => {
    return (
        <section id="features" className="section-padding" style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="section-title"
                    style={{ fontSize: '3rem', marginBottom: '1rem' }}
                >
                    Interactive <span className="gradient-text">Features</span>
                </motion.h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem' }}>
                    Explore our capabilities through an engaging, interactive experience. Hover and click to discover more.
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <MagicBento
                    textAutoHide={true}
                    enableStars={true}
                    enableSpotlight={true}
                    enableBorderGlow={true}
                    enableTilt={true}
                    enableMagnetism={true}
                    clickEffect={true}
                    spotlightRadius={300}
                    particleCount={12}
                    glowColor="132, 0, 255"
                />
            </motion.div>
        </section>
    );
};

export default Features;
