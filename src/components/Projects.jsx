import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { Button } from './ui/Button';
import { MacbookMockup } from './ui/MacbookMockup';
import { PROJECTS } from '../constants/data';

const ProjectCard = ({ project, index }) => {
    const containerRef = useRef(null);
    
    // Basic scroll tracking for the component
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Spring creates the buttery smooth premium feel
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 70,
        damping: 20,
        restDelta: 0.001
    });

    // Image slightly moves opposite to scroll (parallax)
    const imageY = useTransform(smoothProgress, [0, 1], ["-10%", "10%"]);
    // Text slightly moves with scroll
    const textY = useTransform(smoothProgress, [0, 1], ["10%", "-10%"]);
    // Huge background number moves drastically
    const numberY = useTransform(smoothProgress, [0, 1], ["-15%", "30%"]);
    
    const isEven = index % 2 === 0;

    return (
        <div ref={containerRef} className="w-full relative min-h-[90vh] flex items-center px-4 md:px-12 lg:px-24 py-24 mb-10 overflow-hidden border-b border-white/10 last:border-0">
            
            {/* Background huge number */}
            <motion.div 
                style={{ y: numberY }}
                className={`absolute top-0 ${isEven ? 'right-0 lg:right-10' : 'left-0 lg:left-10'} text-[12rem] md:text-[20rem] lg:text-[30rem] font-black text-white/5 leading-none select-none z-0 pointer-events-none mix-blend-difference`}
            >
                {project.id}
            </motion.div>

            <div className={`w-full max-w-350 mx-auto flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 lg:gap-32 z-10`}>
                
                {/* MacBook Mockup Section */}
                <div className="w-full lg:w-1/2 relative perspective-1000 mt-10 md:mt-0 flex justify-center">
                    <motion.div 
                        initial={{ z: -300, rotateY: isEven ? 45 : -45, rotateX: 20, filter: "blur(15px)", scale: 0.8 }}
                        whileInView={{ z: 0, rotateY: 0, rotateX: 0, filter: "blur(0px)", scale: 1 }}
                        exit={{ z: 300, rotateY: isEven ? -45 : 45, rotateX: -20, filter: "blur(15px)", scale: 1.1 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ margin: "-10%" }}
                        style={{ y: imageY, transformStyle: "preserve-3d" }} 
                        className="w-full"
                    >
                        <MacbookMockup 
                            image={project.image} 
                            url={project.demoLink ? project.demoLink.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'localhost:3000'} 
                            title={project.title} 
                        />
                    </motion.div>
                </div>

                {/* Text Section */}
                <motion.div 
                    initial={{ x: isEven ? 100 : -100, skewX: isEven ? -10 : 10, filter: "blur(15px)", scale: 0.9 }}
                    whileInView={{ x: 0, skewX: 0, filter: "blur(0px)", scale: 1 }}
                    exit={{ x: isEven ? -100 : 100, skewX: isEven ? 10 : -10, filter: "blur(15px)", scale: 0.9 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ margin: "-10%" }}
                    style={{ y: textY }}
                    className="w-full lg:w-1/2 flex flex-col justify-center py-10"
                >
                    <div className="flex items-center gap-6 mb-6">
                        <span className="font-mono text-sm md:text-base tracking-[0.2em] text-white/50 uppercase">FEATURED PROJECT</span>
                        <div className="grow h-px bg-white/20" />
                    </div>

                    <h3 className="text-4xl md:text-5xl lg:text-5xl font-black text-white tracking-tighter uppercase mb-4 leading-none wrap-break-word">
                        {project.title}
                    </h3>
                    
                    <p className="text-xl md:text-xl font-medium text-white/80 mb-6 tracking-tight">
                        {project.subtitle}
                    </p>

                    <p className="text-base md:text-lg text-white/60 leading-relaxed mb-10 max-w-xl font-light">
                        {project.description}
                    </p>

                    <div className="flex flex-wrap gap-3 mb-10">
                        {project.tags.map((tag, i) => (
                            <span
                                key={i}
                                className="text-xs font-mono uppercase tracking-widest px-4 py-2 border border-white/20 text-white/80 hover:bg-white hover:text-black transition-colors duration-500 cursor-default"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            as="a"
                            href={project.demoLink}
                            target="_blank" rel="noopener noreferrer"
                            variant="inversePrimary"
                            className="group"
                        >
                            <span>VIEW PROJECT</span>
                            <ExternalLink size={16} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </Button>
                        <Button
                            as="a"
                            href={project.repoLink}
                            target="_blank" rel="noopener noreferrer"
                            variant="inverseOutline"
                            className="group"
                        >
                            <span>SOURCE CODE</span>
                            <Github size={16} />
                        </Button>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

const Projects = () => {
    return (
        <section id="work" className="bg-transparent text-white relative w-full pt-32 md:pt-48 pb-32 selection:bg-white selection:text-black">
            
            <div className="w-full flex flex-col items-center justify-center mb-8 md:mb-16 px-4 relative z-20" style={{ perspective: '1000px' }}>
                <motion.div
                    initial={{ filter: "blur(20px)", scale: 0.8, rotateX: 45, y: 50 }}
                    whileInView={{ filter: "blur(0px)", scale: 1, rotateX: 0, y: 0 }}
                    exit={{ filter: "blur(20px)", scale: 1.1, rotateX: -45, y: -50 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ amount: 0.2 }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="flex flex-col items-center"
                >
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter orbitron-title text-center whitespace-nowrap uppercase">
                        SELECTED <span className="text-transparent" style={{ WebkitTextStroke: '1px white' }}>WORKS</span>
                    </h2>
                    <div className="w-16 md:w-32 h-0.5 bg-white mt-8 md:mt-12" />
                </motion.div>
            </div>

            <div className="w-full flex flex-col gap-0 border-t border-white/10">
                {PROJECTS.map((project, index) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        index={index}
                    />
                ))}
            </div>
            
        </section>
    );
};

export default Projects;
