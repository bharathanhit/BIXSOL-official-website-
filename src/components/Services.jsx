import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import {
    BarChart3,
    Code2,
    Globe,
    Megaphone,
    Smartphone,
    MessageSquare,
    Zap,
    TrendingUp,
    PenTool,
} from 'lucide-react';
import '../components/MagicBento.css';

const ServicesWithMagicBento = () => {
    const gridRef = useRef(null);

    const services = [
        {
            icon: Megaphone,
            title: "Digital Marketing",
            description: "Data-driven strategies that convert browsers into loyal customers",
            features: ["PPC Advertising", "Email Marketing", "Social Media Ads"],
            label: "Marketing",
            color: '#060010'
        },
        {
            icon: Code2,
            title: "Web Development",
            description: "High-performance websites built with latest technologies",
            features: ["Responsive Design", "E-commerce", "Progressive Web Apps"],
            label: "Development",
            color: '#060010'
        },
        {
            icon: BarChart3,
            title: "SEO Optimization",
            description: "Rank higher on search engines and attract organic traffic",
            features: ["Keyword Research", "On-Page SEO", "Link Building"],
            label: "SEO",
            color: '#060010'
        },
        {
            icon: Smartphone,
            title: "Social Media",
            description: "Engage your community across all major platforms",
            features: ["Content Creation", "Community Management", "Analytics"],
            label: "Social",
            color: '#060010'
        },
        {
            icon: Globe,
            title: "Global Branding",
            description: "Crafting unique identity that resonates globally",
            features: ["Brand Strategy", "Visual Identity", "Guidelines"],
            label: "Brand",
            color: '#060010'
        },
        {
            icon: MessageSquare,
            title: "Content Strategy",
            description: "Creative content that drives meaningful engagement",
            features: ["Copywriting", "Video Production", "Blog Management"],
            label: "Content",
            color: '#060010'
        },
        {
            icon: Zap,
            title: "Performance Marketing",
            description: "Results-driven campaigns focused on ROI",
            features: ["Conversion Optimization", "A/B Testing", "Analytics"],
            label: "Performance",
            color: '#060010'
        },
        {
            icon: TrendingUp,
            title: "Growth Hacking",
            description: "Innovative strategies to accelerate business growth",
            features: ["Viral Marketing", "Growth Experiments", "Funnel Optimization"],
            label: "Growth",
            color: '#060010'
        },
        {
            icon: PenTool,
            title: "UI/UX Design",
            description: "Beautiful designs that delight users and drive engagement",
            features: ["User Research", "Wireframing", "Prototyping"],
            label: "Design",
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
            const section = gridRef.current?.closest('.services');
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
                opacity: 0.8,
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
        <section id="services" className="services section-padding">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="section-title"
                    style={{ fontSize: '3rem', marginBottom: '1rem' }}
                >
                    Our <span className="gradient-text">Services</span>
                </motion.h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem' }}>
                    Comprehensive digital services with interactive effects. Hover over cards to experience the magic!
                </p>
            </div>

            <div
                ref={gridRef}
                className="services-grid"
                style={{
                    display: 'grid',
                    gap: '1.5rem',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    maxWidth: '1400px',
                    margin: '0 auto'
                }}
            >
                {services.map((service, index) => {
                    const IconComponent = service.icon;

                    return (
                        <motion.div
                            key={index}
                            className="magic-bento-card magic-bento-card--border-glow particle-container"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            style={{
                                backgroundColor: service.color,
                                border: '1px solid var(--border-color)',
                                borderRadius: '20px',
                                padding: '2rem',
                                position: 'relative',
                                overflow: 'hidden',
                                minHeight: '280px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
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

                                // Ripple effect on hover
                                const relativeX = ((x) / rect.width) * 100;
                                const relativeY = ((y) / rect.height) * 100;

                                card.style.setProperty('--glow-x', `${relativeX}%`);
                                card.style.setProperty('--glow-y', `${relativeY}%`);
                                card.style.setProperty('--glow-intensity', '1');
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.setProperty('--glow-intensity', '0');
                            }}
                            whileHover={{
                                y: -10,
                                scale: 1.02,
                                transition: { duration: 0.3 }
                            }}
                        >
                            <div>
                                <div
                                    className="magic-bento-card__header"
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '1.5rem'
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '12px',
                                            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white'
                                        }}
                                    >
                                        <IconComponent size={24} />
                                    </div>
                                    <div
                                        className="magic-bento-card__label"
                                        style={{
                                            fontSize: '0.85rem',
                                            color: 'var(--primary)',
                                            fontWeight: '600',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px'
                                        }}
                                    >
                                        {service.label}
                                    </div>
                                </div>

                                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'white' }}>
                                    {service.title}
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.6' }}>
                                    {service.description}
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {service.features.map((feature, idx) => (
                                    <span
                                        key={idx}
                                        style={{
                                            padding: '0.35rem 0.75rem',
                                            background: 'rgba(99, 102, 241, 0.1)',
                                            borderRadius: '8px',
                                            fontSize: '0.8rem',
                                            color: 'var(--primary)',
                                            border: '1px solid rgba(99, 102, 241, 0.3)'
                                        }}
                                    >
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
};

export default ServicesWithMagicBento;
