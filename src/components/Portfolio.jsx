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
            <div className="portfolio-header">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="portfolio-title"
                >
                    Our <span className="gradient-text">Portfolio</span>
                </motion.h2>
                <p className="portfolio-desc">
                    Success stories with interactive effects. Hover to explore our best work!
                </p>
            </div>

            <div ref={gridRef} className="portfolio-grid">
                {projects.map((project, index) => (
                    <motion.div
                        key={index}
                        className="magic-bento-card magic-bento-card--border-glow particle-container portfolio-card"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        style={{
                            background: project.color,
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
                            className="card-header"
                            style={{ background: project.gradient }}
                        >
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 15 }}
                                className="card-icon"
                            >
                                <ExternalLink size={28} color="white" />
                            </motion.div>
                        </div>

                        {/* Content */}
                        <div className="card-content">
                            <div className="card-category">
                                {project.category}
                            </div>

                            <h3 className="card-title">
                                {project.title}
                            </h3>
                            <p className="card-desc">
                                {project.description}
                            </p>

                            {/* Stats */}
                            <div className="card-stats">
                                <div className="gradient-text stat-metric">
                                    {project.stats.metric}
                                </div>
                                <div className="stat-label-small">
                                    {project.stats.label}
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="card-tags">
                                {project.tags.map((tag, idx) => (
                                    <span key={idx} className="card-tag">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Arrow */}
                            <motion.div
                                whileHover={{ x: 5, y: -5 }}
                                className="card-arrow"
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
