import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const MacbookMockup = ({ image, url, title, className = '' }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    // Mouse tracking for tilt effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };

    return (
        <div className={`relative w-full max-w-200 mx-auto perspective-1000 ${className}`}>
            {/* Optional Glow Effect */}
            <div className="absolute inset-0 bg-white/5 blur-[100px] rounded-full pointer-events-none transition-opacity duration-700" style={{ opacity: isHovered ? 1 : 0 }} />

            <motion.div 
                className="w-full relative"
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                animate={{ 
                    y: isHovered ? -12 : 0,
                    scale: isHovered ? 1.02 : 1
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
                {/* Screen Housing */}
                <div className="relative w-full aspect-16/10 bg-black rounded-t-3xl p-3 md:p-4 pb-0 md:pb-0 shadow-2xl border-x-4 border-t-4 border-[#222] flex flex-col z-20">
                    
                    {/* Screen Glass Reflection */}
                    <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-white/10 rounded-t-[1.2rem] pointer-events-none z-30 transition-opacity duration-1000" style={{ opacity: isHovered ? 0.3 : 1 }}/>

                    {/* Camera / Notch */}
                    <div className="absolute top-1 inset-x-0 flex justify-center z-40 pointer-events-none">
                        <div className="w-16 md:w-20 h-3 md:h-4 bg-black rounded-b-lg flex items-center justify-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-[#111]" />
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-900/40 border border-blue-500/20" />
                        </div>
                    </div>

                    {/* Inner Screen Surface */}
                    <div className="relative w-full h-full bg-[#111] rounded-t-lg overflow-hidden flex flex-col border border-white/10 border-b-0">
                        
                        {/* Browser Top Bar with Glassmorphism */}
                        <div className="w-full flex items-center px-4 py-2 md:py-2.5 bg-[#202020]/90 backdrop-blur-md border-b border-black/50 shrink-0 z-20">
                            {/* Traffic Light Buttons */}
                            <div className="flex gap-1.5 md:gap-2">
                                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#ff5f56] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]" />
                                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#ffbd2e] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]" />
                                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#27c93f] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]" />
                            </div>

                            {/* URL Bar */}
                            <div className="flex-1 flex justify-center mx-4">
                                <div className="flex items-center justify-center gap-2 bg-[#111] rounded-md text-[10px] md:text-[11px] font-medium text-white/50 px-4 md:px-8 py-1 md:py-1.5 max-w-[80%] md:max-w-[60%] w-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] border border-white/5">
                                    <svg className="w-2.5 h-2.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                    <span className="truncate">{url || 'localhost:3000'}</span>
                                </div>
                            </div>

                            {/* Browser Action Icons */}
                            <div className="flex gap-2.5">
                                <div className="w-3.5 h-3.5 rounded-[3px] border-2 border-white/20" />
                                <div className="w-3.5 h-3.5 rounded-full border-2 border-white/20" />
                            </div>
                        </div>

                        {/* Screen Content (Image Wrapper) */}
                        <div className="flex-1 relative w-full bg-zinc-950 group/screen overflow-hidden">
                            {image ? (
                                <img 
                                    src={image} 
                                    alt={title} 
                                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/screen:scale-[1.03]"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center font-mono text-white/20 bg-zinc-900">
                                    {/* Loading Spinner Placeholder */}
                                    <svg className="w-8 h-8 md:w-12 md:h-12 animate-spin text-white/20" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* MacBook Aluminum Body Lower Half / Chassis */}
                <div className="relative w-[114%] -ml-[7%] h-[5%] md:h-[6%] min-h-4 md:min-h-5.5 bg-linear-to-b from-[#e0e1e2] via-[#b3b4b5] to-[#88898a] border-t border-[#fcfcfc] rounded-b-3xl md:rounded-b-4xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] z-10 flex flex-col items-center">
                    
                    {/* Top deck (keyboard area visible thin strip) */}
                    <div className="w-full h-1 md:h-1.5 bg-linear-to-r from-[#efefef] via-white to-[#efefef] rounded-t-[1px] shadow-[inset_0_-1px_3px_rgba(0,0,0,0.15)] flex justify-center items-end" />

                    {/* Finger Indent to open laptop */}
                    <div className="w-1/6 max-w-20 h-2 md:h-2.5 bg-linear-to-b from-[#8f8f8f] to-[#cdcdcd] rounded-b-md shadow-[inset_0_2px_5px_rgba(0,0,0,0.4)] mt-0" />
                    
                    {/* Lower Edge Reflection & Bevel */}
                    <div className="absolute bottom-0 inset-x-8 h-1 bg-white/30 blur-[1px] rounded-full" />
                </div>

                {/* Drop Surface Shadow */}
                <div className="absolute -bottom-8 md:-bottom-12 inset-x-10 h-6 md:h-8 bg-black/60 blur-2xl rounded-[100%] pointer-events-none transition-opacity duration-700" style={{ opacity: isHovered ? 0.3 : 1 }} />
            </motion.div>
        </div>
    );
};
