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
                className="glass"
                style={{
                    margin: '0 5%',
                    borderRadius: '40px',
                    padding: '4rem 2rem'
                }}
            >
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '4rem',
                    textAlign: 'center'
                }}>
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1rem',
                                    color: 'white'
                                }}
                            >
                                {stat.icon}
                            </div>
                            <h2 className="gradient-text" style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>
                                {stat.number}
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* About Content */}
            <div style={{
                maxWidth: '1200px',
                margin: '6rem auto 0',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '4rem',
                alignItems: 'center'
            }}>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>
                        About <span className="gradient-text">BIXSOL</span>
                    </h2>
                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '1.1rem',
                        lineHeight: '1.8',
                        marginBottom: '1.5rem'
                    }}>
                        BIXSOL is a full-service digital marketing and web development agency dedicated to helping businesses thrive in the digital age. Founded with a vision to make premium digital services accessible to businesses of all sizes.
                    </p>
                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '1.1rem',
                        lineHeight: '1.8',
                        marginBottom: '2rem'
                    }}>
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
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    style={{
                        display: 'grid',
                        gap: '1.5rem'
                    }}
                >
                    {values.map((value, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ x: 10 }}
                            style={{
                                padding: '1.75rem',
                                background: 'rgba(255, 255, 255, 0.03)',
                                borderRadius: '20px',
                                border: '1px solid var(--border)',
                                borderLeft: '4px solid var(--primary)'
                            }}
                        >
                            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem', color: 'var(--primary)' }}>
                                {value.title}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
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
