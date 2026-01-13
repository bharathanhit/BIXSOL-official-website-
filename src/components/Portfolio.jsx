import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import '../components/MagicBento.css';

const Portfolio = () => {
    const gridRef = useRef(null);

    const projects = [
        {
            title: "E-Commerce Revolution",
            category: "Web Development & SEO",
            description: "Complete e-commerce solution with 300% increase in online sales within 6 months.",
            stats: { metric: "+300%", label: "Revenue Growth" },
            tags: ["React", "Node.js", "SEO"],
            gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: '#060010'
        },
        {
            title: "Brand Transformation",
            category: "Branding & Digital Marketing",
            description: "Full brand overhaul for a startup, resulting in 5x social media engagement and market recognition.",
            stats: { metric: "5x", label: "Engagement" },
            tags: ["Branding", "Social Media", "Content"],
            gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            color: '#060010'
        },
        {
            title: "SaaS Platform Launch",
            category: "Web Development & Marketing",
            description: "Built and launched a B2B SaaS platform that acquired 1000+ users in first quarter.",
            stats: { metric: "1000+", label: "Active Users" },
            tags: ["SaaS", "UI/UX", "Growth"],
            gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            color: '#060010'
        },
        {
            title: "Local Business Growth",
            category: "SEO & Local Marketing",
            description: "Local SEO campaign that ranked business #1 for 15+ keywords in target location.",
            stats: { metric: "#1", label: "Local Ranking" },
            tags: ["Local SEO", "Google Ads", "GMB"],
            gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
            color: '#060010'
        },
        {
            title: "Mobile App Success",
            category: "App Development & Marketing",
            description: "Developed mobile app with integrated marketing strategy, achieving 50K downloads.",
            stats: { metric: "50K+", label: "Downloads" },
            tags: ["React Native", "ASO", "Ads"],
            gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
            color: '#060010'
        },
        {
            title: "Content Marketing Win",
            category: "Content Strategy & SEO",
            description: "Content-driven SEO strategy that increased organic traffic by 400% in 8 months.",
            stats: { metric: "+400%", label: "Organic Traffic" },
            tags: ["Content", "SEO", "Analytics"],
            gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
            color: '#060010'
        }
    ];

    React.useEffect(() => {
        if (!gridRef.current) return;

        const spotlight = document.createElement('div');
        spotlight.className = 'global-spotlight';
        spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(132, 0, 255, 0.15) 0%,
        rgba(132, 0, 255, 0.08) 15%,
        rgba(132, 0, 255, 0.04) 25%,
        rgba(132, 0, 255, 0.02) 40%,
        rgba(132, 0, 255, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
        document.body.appendChild(spotlight);

        const handleMouseMove = (e) => {
            const section = gridRef.current?.closest('section');
            const rect = section?.getBoundingClientRect();
            const mouseInside = rect &&
                e.clientX >= rect.left && e.clientX <= rect.right &&
                e.clientY >= rect.top && e.clientY <= rect.bottom;

            if (!mouseInside) {
                gsap.to(spotlight, { opacity: 0, duration: 0.3 });
                return;
            }

            gsap.to(spotlight, {
                left: e.clientX,
                top: e.clientY,
                opacity: 0.6,
                duration: 0.1
            });
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            spotlight.remove();
        };
    }, []);

    return (
        <section id="portfolio" className="section-padding">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="section-title"
                    style={{ fontSize: '3rem', marginBottom: '1rem' }}
                >
                    Our <span className="gradient-text">Portfolio</span>
                </motion.h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem' }}>
                    Success stories with interactive effects. Hover to explore our best work!
                </p>
            </div>

            <div
                ref={gridRef}
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '2rem',
                    maxWidth: '1400px',
                    margin: '0 auto'
                }}
            >
                {projects.map((project, index) => (
                    <motion.div
                        key={index}
                        className="magic-bento-card magic-bento-card--border-glow particle-container"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        style={{
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: '24px',
                            border: '1px solid var(--border-color)',
                            background: project.color,
                            cursor: 'pointer',
                            '--glow-x': '50%',
                            '--glow-y': '50%',
                            '--glow-intensity': '0',
                            '--glow-radius': '200px'
                        }}
                        onMouseMove={(e) => {
                            const card = e.currentTarget;
                            const rect = card.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;

                            const relativeX = ((x) / rect.width) * 100;
                            const relativeY = ((y) / rect.height) * 100;

                            card.style.setProperty('--glow-x', `${relativeX}%`);
                            card.style.setProperty('--glow-y', `${relativeY}%`);
                            card.style.setProperty('--glow-intensity', '1');
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.setProperty('--glow-intensity', '0');
                        }}
                        whileHover={{ y: -10, scale: 1.02 }}
                    >
                        {/* Gradient Header */}
                        <div
                            style={{
                                height: '150px',
                                background: project.gradient,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                            }}
                        >
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 15 }}
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    background: 'rgba(255, 255, 255, 0.3)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                <ExternalLink size={28} color="white" />
                            </motion.div>
                        </div>

                        {/* Content */}
                        <div style={{ padding: '2rem' }}>
                            <div style={{
                                fontSize: '0.85rem',
                                color: 'var(--primary)',
                                fontWeight: '600',
                                marginBottom: '0.5rem',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>
                                {project.category}
                            </div>

                            <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'white' }}>
                                {project.title}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                                {project.description}
                            </p>

                            {/* Stats */}
                            <div style={{
                                padding: '1.25rem',
                                background: 'rgba(99, 102, 241, 0.1)',
                                borderRadius: '16px',
                                marginBottom: '1.5rem',
                                textAlign: 'center',
                                border: '1px solid rgba(99, 102, 241, 0.3)'
                            }}>
                                <div className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                                    {project.stats.metric}
                                </div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    {project.stats.label}
                                </div>
                            </div>

                            {/* Tags */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                                {project.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        style={{
                                            padding: '0.35rem 0.85rem',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            borderRadius: '8px',
                                            fontSize: '0.8rem',
                                            border: '1px solid var(--border-color)',
                                            color: 'white'
                                        }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Arrow */}
                            <motion.div
                                whileHover={{ x: 5, y: -5 }}
                                style={{
                                    position: 'absolute',
                                    bottom: '2rem',
                                    right: '2rem',
                                    color: 'var(--primary)'
                                }}
                            >
                                <ArrowUpRight size={24} />
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Portfolio;
