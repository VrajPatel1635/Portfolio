import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
    const [copied, setCopied] = useState(false);

    const copyEmail = () => {
        navigator.clipboard.writeText('vrajrpatel6261@gmail.com');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Framer Motion Variants
    const containerVariants = {
        hidden: { opacity: 1 }, // keep opacity 1 to allow children to hide
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
            {/* Ambient Background Blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] bg-white/2 rounded-full blur-[100px] pointer-events-none -z-10"></div>
            
            <div className="w-full max-w-7xl mx-auto z-10 flex flex-col h-full justify-between">
                
                {/* Hero Typography */}
                <div className="grow flex flex-col justify-center mt-12 md:mt-24 mb-16 lg:mb-24">
                    <div className="tracking-tighter leading-[0.85] orbitron-title font-bold uppercase">
                        <div className="overflow-hidden py-1">
                            <h2 className="text-[13vw] md:text-[9vw] lg:text-[7.5vw] flex flex-wrap gap-x-3 md:gap-x-6">
                                <motion.span variants={wordVariants} className="inline-block">LET'S</motion.span>
                                <motion.span variants={wordVariants} className="inline-block">BUILD</motion.span>
                            </h2>
                        </div>
                        <div className="overflow-hidden py-1 text-transparent group hover:text-white transition-colors duration-700" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.7)' }}>
                            <h2 className="text-[13vw] md:text-[9vw] lg:text-[7.5vw] flex flex-wrap gap-x-3 md:gap-x-6">
                                <motion.span variants={wordVariants} className="inline-block">SOMETHING</motion.span>
                                <motion.span variants={wordVariants} className="inline-block">EPIC.</motion.span>
                            </h2>
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
                        
                        {/* Email CTA */}
                        <motion.div variants={bottomItemVariants} className="group relative">
                            <p className="text-gray-400 text-xs md:text-sm tracking-[0.2em] font-light uppercase mb-4 flex items-center gap-3">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                </span>
                                Open for opportunities
                            </p>
                            <button 
                                onClick={copyEmail}
                                className="hover-trigger relative text-2xl md:text-4xl lg:text-5xl font-light tracking-wider transition-all duration-300 hover:text-gray-300 flex items-center gap-4 text-left"
                            >
                                vrajrpatel6261@gmail.com
                                <span className={`text-xs md:text-sm tracking-widest font-normal uppercase transition-all duration-300 absolute -right-6 md:-right-8 translate-x-full ${copied ? 'opacity-100 text-white' : 'opacity-0'}`}>
                                    Copied!
                                </span>
                            </button>
                            {/* Hover Underline */}
                            <div className="absolute -bottom-4 left-0 w-0 h-px bg-white transition-all duration-500 group-hover:w-full"></div>
                        </motion.div>

                        {/* Social Links & Info */}
                        <motion.div variants={bottomItemVariants} className="flex flex-wrap gap-12 lg:gap-20">
                            <div className="flex flex-col gap-4">
                                <p className="text-gray-400 text-xs tracking-[0.2em] uppercase font-light">Socials</p>
                                <div className="flex flex-col gap-4">
                                    <a href="https://github.com/VrajPatel1635/" className="hover-trigger text-lg text-gray-300 hover:text-white transition-colors duration-300 relative group inline-flex items-center gap-3 w-fit">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                                        GitHub
                                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                                    </a>
                                    <a href="https://www.linkedin.com/in/vraj-patel-1a28762ba/" className="hover-trigger text-lg text-gray-300 hover:text-white transition-colors duration-300 relative group inline-flex items-center gap-3 w-fit">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                                        LinkedIn
                                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                    
                    {/* Copyright row */}
                    <motion.div variants={bottomItemVariants} className="mt-16 sm:mt-24 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-gray-400 font-light tracking-widest uppercase">
                        <p>© {new Date().getFullYear()} <span className="text-white font-bold">Vraj Patel</span>. All Rights Reserved.</p>
                        <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover-trigger hover:text-white transition-colors duration-300 uppercase tracking-widest flex items-center gap-2">
                            Back to top
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                        </button>
                    </motion.div>
                </div>
            </div>
            
        </motion.section>
    );
};

export default Contact;
