import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
    const [copied, setCopied] = useState(false);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Format time for Gandhinagar, Gujarat (IST)
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    const istTime = formatter.format(time);

    const copyEmail = () => {
        navigator.clipboard.writeText('vrajrpatel6261@gmail.com');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Framer Motion Variants
    const containerVariants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const wordVariants = {
        hidden: { y: "120%", opacity: 0 },
        visible: { 
            y: "0%", 
            opacity: 1, 
            transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
        }
    };

    const lineVariants = {
        hidden: { scaleX: 0 },
        visible: { 
            scaleX: 1, 
            transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
        }
    };

    const bottomItemVariants = {
        hidden: { y: 40, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1, 
            transition: { duration: 0.8, ease: "easeOut" } 
        }
    };

    return (
        <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            id="contact"
            className="min-h-screen py-20 px-6 md:px-12 lg:px-24 flex flex-col justify-center relative overflow-hidden text-white"
        >
            {/* Ambient Premium Blur Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] md:w-[60vw] md:h-[60vw] bg-linear-to-tr from-white/5 to-purple-500/5 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-screen"></div>
            <div className="absolute inset-0 w-full h-full bg-[url('https://cdn.jsdelivr.net/gh/phated/noise/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay -z-10"></div>

            <div className="w-full max-w-7xl mx-auto z-10 flex flex-col h-full justify-between">
                
                {/* Hero Typography */}
                <div className="grow flex flex-col justify-center mt-12 md:mt-24 mb-16 lg:mb-24">
                    <div className="tracking-tighter leading-[0.85] orbitron-title font-bold uppercase group cursor-default">
                        <div className="overflow-hidden py-1">
                            <h2 className="text-[13vw] md:text-[9vw] lg:text-[7.5vw] flex flex-wrap gap-x-3 md:gap-x-6">
                                <motion.span variants={wordVariants} className="inline-block">LET'S</motion.span>
                                <motion.span variants={wordVariants} className="inline-block">BUILD</motion.span>
                            </h2>
                        </div>
                        <div className="overflow-hidden py-1 relative w-fit">
                            <div className="text-transparent transition-all duration-700 ease-out group-hover:text-white" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.6)' }}>
                                <h2 className="text-[13vw] md:text-[9vw] lg:text-[7.5vw] flex flex-wrap gap-x-3 md:gap-x-6 relative">
                                    <motion.span variants={wordVariants} className="inline-block">SOMETHING</motion.span>
                                    <motion.span variants={wordVariants} className="inline-block relative">
                                        EPIC.
                                        {/* Animated Top-Right Arrow purely for decoration */}
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute -top-4 md:-top-8 -right-8 md:-right-16 lg:-right-20 w-8 md:w-16 h-8 md:h-16 text-white opacity-0 -translate-x-4 translate-y-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-700 ease-out">
                                            <line x1="7" y1="17" x2="17" y2="7"></line>
                                            <polyline points="7 7 17 7 17 17"></polyline>
                                        </svg>
                                    </motion.span>
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer / Connect Section */}
                <div className="mt-auto">
                    {/* Divider Line */}
                    <motion.div 
                        variants={lineVariants}
                        style={{ transformOrigin: "left center" }}
                        className="w-full h-px bg-white/20 mb-12"
                    ></motion.div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-16 md:gap-8">
                        
                        {/* Email CTA & Premium Badge */}
                        <motion.div variants={bottomItemVariants} className="group relative">
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6 w-fit shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-[10px] sm:text-xs tracking-[0.2em] uppercase font-medium text-gray-200">Open for opportunities</span>
                            </div>
                            <button 
                                onClick={copyEmail}
                                className="hover-trigger relative text-2xl md:text-3xl lg:text-5xl font-light tracking-wider transition-all duration-300 hover:text-gray-300 flex items-center gap-4 text-left"
                            >
                                vrajrpatel6261@gmail.com
                                <span className={`text-[10px] md:text-xs tracking-widest font-normal uppercase transition-all duration-300 absolute -right-4 md:-right-8 translate-x-full ${copied ? 'opacity-100 text-white' : 'opacity-0'}`}>
                                    Copied!
                                </span>
                            </button>
                            {/* Hover Underline */}
                            <div className="absolute -bottom-4 left-0 w-0 h-px bg-white transition-all duration-500 group-hover:w-full"></div>
                        </motion.div>

                        {/* Social Links & Location */}
                        <motion.div variants={bottomItemVariants} className="flex flex-wrap md:flex-nowrap gap-12 lg:gap-24">
                            
                            {/* Location Section */}
                            <div className="flex flex-col gap-4">
                                <p className="text-gray-500 text-[10px] md:text-xs tracking-[0.2em] uppercase font-light">Location</p>
                                <a href="https://www.google.com/maps/place/Gandhinagar,+Gujarat/" target="_blank" rel="noreferrer" className="hover-trigger flex flex-col gap-1 text-gray-300 hover:text-white transition-colors duration-300 group w-fit">
                                    <span className="text-base sm:text-lg flex items-center gap-2">
                                        Gandhinagar, India
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 opacity-50 group-hover:opacity-100"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                                    </span>
                                    <span className="text-xs sm:text-sm font-light text-gray-500 group-hover:text-gray-400 transition-colors pointer-events-none">{istTime} IST</span>
                                </a>
                            </div>

                            {/* Socials Section */}
                            <div className="flex flex-col gap-4">
                                <p className="text-gray-500 text-[10px] md:text-xs tracking-[0.2em] uppercase font-light">Socials</p>
                                <div className="flex flex-col gap-3">
                                    <a href="https://github.com/VrajPatel1635/" target="_blank" rel="noreferrer" className="hover-trigger text-base sm:text-lg text-gray-300 hover:text-white transition-all duration-300 relative group inline-flex items-center gap-2 w-fit">
                                        GitHub
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 opacity-50 group-hover:opacity-100"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                                    </a>
                                    <a href="https://www.linkedin.com/in/vraj-patel-1a28762ba/" target="_blank" rel="noreferrer" className="hover-trigger text-base sm:text-lg text-gray-300 hover:text-white transition-all duration-300 relative group inline-flex items-center gap-2 w-fit">
                                        LinkedIn
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 opacity-50 group-hover:opacity-100"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                    
                    {/* Copyright row */}
                    <motion.div variants={bottomItemVariants} className="mt-16 sm:mt-24 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-4 text-[10px] sm:text-xs text-gray-500 font-light tracking-widest uppercase">
                        <p>© {new Date().getFullYear()} <span className="text-gray-300 font-medium">Vraj Patel</span>. All Rights Reserved.</p>
                        <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover-trigger group hover:text-white transition-colors duration-300 uppercase tracking-widest flex items-center gap-2 p-2 -m-2">
                            Back to top
                            <div className="w-6 h-6 rounded-full border border-gray-600 group-hover:border-white flex items-center justify-center transition-colors">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:-translate-y-0.5 transition-transform"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                            </div>
                        </button>
                    </motion.div>
                </div>
            </div>
            
        </motion.section>
    );
};

export default Contact;
