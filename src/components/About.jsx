import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { containerVariants, PRESETS } from '../utils/animations';
import '../styles/about.css';

const About = () => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });
    
    // Slower, buttery smooth parallax for the massive text
    const textX = useTransform(scrollYProgress, [0, 1], ["-15%", "5%"]);

    // Custom item animation for the right side matching original
    const itemVariants = {
        hidden: { x: 50, opacity: 0 },
        visible: { 
            x: 0, 
            opacity: 1,
            transition: { duration: PRESETS.duration, ease: PRESETS.ease }
        }
    };

    return (
        <section ref={sectionRef} id="about" className="relative min-h-screen w-full flex items-center justify-center py-20 overflow-x-hidden pointer-events-none z-10">
            
            {/* Aesthetic Crosshairs (Corners) */}
            <div className="absolute top-10 left-10 text-white/20 font-mono text-xs hidden md:block">+</div>
            <div className="absolute top-10 right-10 text-white/20 font-mono text-xs hidden md:block">+</div>
            <div className="absolute bottom-10 left-10 text-white/20 font-mono text-xs hidden md:block">+</div>
            <div className="absolute bottom-10 right-10 text-white/20 font-mono text-xs hidden md:block">+</div>

            {/* Huge background text with Parallax */}
            <motion.div 
                style={{ x: textX }}
                className="absolute top-1/2 left-0 -translate-y-1/2 pointer-events-none select-none w-full overflow-visible flex justify-center z-0"
            >
                <h1 
                    className="text-[25vw] md:text-[28vw] font-black tracking-tighter whitespace-nowrap opacity-[0.03]"
                    style={{ 
                        color: 'transparent', 
                        WebkitTextStroke: '1px rgba(255, 255, 255, 1)' 
                    }}
                >
                    WHO I AM
                </h1>
            </motion.div>

            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center pointer-events-auto relative z-10">
                
                {/* Left: Profile picture with decorative frame */}
                <motion.div 
                    initial={{ x: -150, opacity: 0, rotate: -8, scale: 0.95 }}
                    whileInView={{ x: 0, opacity: 1, rotate: 0, scale: 1 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: false, amount: 0.2 }}
                    className="lg:col-span-5 relative group"
                >
                    {/* Offset decorative border */}
                    <div 
                        className="absolute top-4 left-4 w-full h-full rounded-2xl border border-white/10 pointer-events-none transition-transform duration-700 group-hover:translate-x-2 group-hover:translate-y-2"
                        style={{ zIndex: 0 }}
                    />
                    
                    <div className="relative w-full aspect-3/4 overflow-hidden rounded-2xl bg-white/5" style={{ zIndex: 1 }}>
                        <motion.img 
                            initial={{ scale: 1.2 }}
                            whileInView={{ scale: 1 }}
                            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true, amount: 0.2 }}
                            src="/Profile_Pic.png" 
                            alt="Vraj Patel"
                            className="w-full h-full object-cover transition-all duration-700 ease-out grayscale contrast-125 brightness-90 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 group-hover:scale-105"
                        />
                        
                        {/* Premium Solid Unmask Block */}
                        <motion.div
                            initial={{ top: 0 }}
                            whileInView={{ top: "100%" }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                            viewport={{ once: true, amount: 0.2 }}
                            className="absolute inset-0 bg-[#0a0a0a] z-10 pointer-events-none"
                        />

                        {/* Thin overlay gradients to blend into dark theme */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent pointer-events-none z-20"></div>
                        <div className="absolute inset-0 bg-linear-to-r from-black/20 via-transparent to-transparent pointer-events-none z-20"></div>
                    </div>
                    
                    {/* Technical annotations floating around the image */}
                    <div className="absolute -left-8 top-1/4 -rotate-90 origin-left text-[10px] tracking-[0.3em] font-medium text-white/30 uppercase hidden md:block" style={{ zIndex: 2 }}>
                        [ FIG. 01 ]
                    </div>
                    <div className="absolute -right-4 bottom-1/4 rotate-90 origin-right text-[10px] tracking-[0.3em] font-medium text-white/30 uppercase hidden md:block" style={{ zIndex: 2 }}>
                        EST. 2023
                    </div>
                </motion.div>

                {/* Right: Minimalist block of text */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    className="lg:col-span-7 flex flex-col justify-center space-y-12 lg:pl-12"
                >
                    
                    <div className="space-y-6">
                        <motion.div variants={itemVariants} className="flex items-center gap-4">
                            <div className="w-12 h-px bg-white/30" />
                            <span className="text-[10px] tracking-[0.4em] font-light text-white/50 uppercase">
                                The Architect
                            </span>
                        </motion.div>
                        
                        <div className="flex flex-col gap-1 md:gap-2">
                            <div className="overflow-hidden pb-1">
                                <motion.h2 
                                    variants={{
                                        hidden: { y: "110%" },
                                        visible: { y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                                    }}
                                    className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight uppercase m-0" 
                                    style={{ fontFamily: '"Orbitron", sans-serif' }}
                                >
                                    WHO I
                                </motion.h2>
                            </div>
                            <div className="overflow-hidden pb-2">
                                <motion.h2 
                                    variants={{
                                        hidden: { y: "110%" },
                                        visible: { y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 } }
                                    }}
                                    className="text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight uppercase m-0" 
                                    style={{ fontFamily: '"Orbitron", sans-serif', color: 'transparent', WebkitTextStroke: '2px #ffffff' }}
                                >
                                    AM.
                                </motion.h2>
                            </div>
                        </div>
                    </div>
                    
                    <motion.div variants={itemVariants} className="space-y-8 border-l border-white/10 pl-6 md:pl-8 py-2 relative">
                        {/* Structural dot */}
                        <div className="absolute -left-[2.5px] top-4 w-1 h-1 bg-white/40 rounded-full"></div>

                        <p className="text-gray-400 text-lg md:text-xl leading-relaxed font-light max-w-xl">
                            I am <span className="text-white font-bold">Vraj Patel</span>, a software engineer bridging the gap between technical architecture and aesthetic design. My focus lies in building clean, performant, and accessible web applications that feel flawless to use.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 lg:gap-6 pt-4">
                            <div className="space-y-3 p-5 rounded-xl border border-white/5 bg-white/2 backdrop-blur-sm transition-colors hover:bg-white/4">
                                <span className="block text-[10px] tracking-[0.2em] text-white/30 uppercase border-b border-white/5 pb-2 mb-2">Focus</span>
                                <span className="block text-sm md:text-base text-gray-300 font-light leading-snug">FullStack Architecture</span>
                                <span className="block text-sm md:text-base text-gray-300 font-light leading-snug">MERN Stack</span>
                            </div>
                            <div className="space-y-3 p-5 rounded-xl border border-white/5 bg-white/2 backdrop-blur-sm transition-colors hover:bg-white/4">
                                <span className="block text-[10px] tracking-[0.2em] text-white/30 uppercase border-b border-white/5 pb-2 mb-2">Education</span>
                                <span className="block text-sm md:text-base text-gray-300 font-light leading-snug">Computer Eng.</span>
                                <span className="block text-sm md:text-base text-gray-300 font-light leading-snug">LDCE <span className="text-white/40">|</span> 2027</span>
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="pt-8">
                        <a href="#work" className="hero-btn-primary-inverse group w-fit">
                            <span>Explore Work</span>
                            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </a>
                    </motion.div>
                    
                </motion.div>
            </div>
        </section>
    );
};

export default About;
