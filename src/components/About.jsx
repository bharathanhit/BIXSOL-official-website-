import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Target, Zap } from 'lucide-react';

const About = () => {
    const stats = [
        { number: "50+", label: "Projects Delivered", icon: <Target /> },
        { number: "100%", label: "Client Satisfaction", icon: <Award /> },
        { number: "24/7", label: "Support Available", icon: <Zap /> },
        { number: "25+", label: "Team Members", icon: <Users /> },
    ];

    const values = [
        {
            title: "Innovation First",
            description: "We stay ahead of digital trends to provide cutting-edge solutions that give you a competitive advantage."
        },
        {
            title: "Results Driven",
            description: "Every strategy is designed with measurable outcomes in mind. We focus on metrics that matter to your business."
        },
        {
            title: "Client Partnership",
            description: "We don't just work for you; we work with you. Your success is our success, and we're committed for the long haul."
        },
        {
            title: "Transparent Process",
            description: "No hidden fees, no surprises. We maintain clear communication and keep you informed every step of the way."
        }
    ];

    return (
        <section id="about" className="section-padding">
            {/* Stats Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass stats-container"
            >
                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            className="stat-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="stat-icon-wrapper">
                                {stat.icon}
                            </div>
                            <h2 className="gradient-text stat-number">
                                {stat.number}
                            </h2>
                            <p className="stat-label">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* About Content */}
            <div className="about-content-grid">
                <motion.div
                    className="about-text"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="about-title">
                        About <span className="gradient-text">BIXSOL</span>
                    </h2>
                    <p className="about-desc">
                        BIXSOL is a full-service digital marketing and web development agency dedicated to helping businesses thrive in the digital age. Founded with a vision to make premium digital services accessible to businesses of all sizes.
                    </p>
                    <p className="about-desc">
                        Our team of experienced designers, developers, marketers, and strategists work together to create integrated solutions that drive real business results. From startups to established enterprises, we've helped over 50 businesses achieve their digital goals.
                    </p>
                    <motion.button
                        className="btn btn-primary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Learn More About Us
                    </motion.button>
                </motion.div>

                <motion.div
                    className="values-grid"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    {values.map((value, index) => (
                        <motion.div
                            key={index}
                            className="value-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ x: 10 }}
                        >
                            <h3 className="value-title">
                                {value.title}
                            </h3>
                            <p className="value-desc">
                                {value.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default About;
