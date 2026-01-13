import React from 'react';
import { motion } from 'framer-motion';
import { Search, Lightbulb, Code, Rocket, CheckCircle } from 'lucide-react';

const Process = () => {
    const steps = [
        {
            icon: <Search className="w-8 h-8" />,
            title: "Discovery & Research",
            description: "We dive deep into your business, target audience, and competitors to understand what makes you unique and identify opportunities.",
            number: "01"
        },
        {
            icon: <Lightbulb className="w-8 h-8" />,
            title: "Strategy & Planning",
            description: "Based on our research, we craft a comprehensive strategy tailored to your goals, budget, and timeline with clear milestones.",
            number: "02"
        },
        {
            icon: <Code className="w-8 h-8" />,
            title: "Design & Development",
            description: "Our creative team brings your vision to life with stunning designs and robust development, keeping you in the loop every step.",
            number: "03"
        },
        {
            icon: <Rocket className="w-8 h-8" />,
            title: "Launch & Optimization",
            description: "We launch your project with precision and continuously optimize based on real data and user feedback for maximum impact.",
            number: "04"
        },
        {
            icon: <CheckCircle className="w-8 h-8" />,
            title: "Support & Growth",
            description: "Our partnership doesn't end at launch. We provide ongoing support, maintenance, and growth strategies to ensure long-term success.",
            number: "05"
        }
    ];

    return (
        <section id="process" className="section-padding" style={{ background: 'rgba(0, 0, 0, 0.3)' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="section-title"
                    style={{ fontSize: '3rem', marginBottom: '1rem' }}
                >
                    Our <span className="gradient-text">Process</span>
                </motion.h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem' }}>
                    A proven methodology that delivers exceptional results every time. From concept to launch and beyond.
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.15, duration: 0.6 }}
                        style={{
                            position: 'relative',
                            padding: '2.5rem',
                            background: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: '24px',
                            border: '1px solid var(--border)',
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                top: '-15px',
                                right: '20px',
                                fontSize: '4rem',
                                fontWeight: 'bold',
                                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                opacity: 0.2,
                            }}
                        >
                            {step.number}
                        </div>

                        <div
                            style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1.5rem',
                                color: 'white'
                            }}
                        >
                            {step.icon}
                        </div>

                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{step.title}</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>{step.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Process;
