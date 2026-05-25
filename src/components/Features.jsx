import React from 'react';
import { motion } from 'framer-motion';
import MagicBento from './MagicBento';

const Features = () => {
    return (

        <section id="features" className="section-padding features-section">
            <div className="features-header">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="features-title"
                >
                    Interactive <span className="gradient-text">Features</span>
                </motion.h2>
                <p className="features-desc">
                    Explore our capabilities through an engaging, interactive experience. Hover and click to discover more.
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="features-content"
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
