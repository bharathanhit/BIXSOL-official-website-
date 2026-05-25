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
        <section id="process" className="section-padding process-section">
            <div className="process-header">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="process-title"
                >
                    Our <span className="gradient-text">Process</span>
                </motion.h2>
                <p className="process-desc">
                    A proven methodology that delivers exceptional results every time. From concept to launch and beyond.
                </p>
            </div>

            <div className="process-grid">
                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.15, duration: 0.6 }}
                        className="process-card"
                    >
                        <div className="process-number">
                            {step.number}
                        </div>

                        <div className="process-icon-wrapper">
                            {step.icon}
                        </div>

                        <h3 className="process-card-title">{step.title}</h3>
                        <p className="process-card-desc">{step.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Process;
