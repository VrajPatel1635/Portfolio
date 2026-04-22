import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

const PROJECTS = [
    {
        id: "01",
        title: "CineMaster",
        subtitle: "Movie Recommendation Engine",
        description: "A comprehensive movie discovery platform that leverages advanced algorithms to suggest personalized content. Users can explore trending titles, watch high-quality trailers, and manage their personal watchlists with a seamless, responsive interface.",
        tags: ["MERN", "JWT", "Tailwind", "TMDB API"],
        features: [
            "Secure user authentication with JWT",
            "Real-time movie data fetching from TMDB",
            "Personalized watchlist management",
            "Responsive design for all devices"
        ],
        demoLink: "https://cine-master-flame.vercel.app/",
        repoLink: "https://github.com/VrajPatel1635/CineMaster",
        image: "/images/projects/Cinemaster.png"
    },
    {
        id: "02", 
        title: "WatchWise", 
        subtitle: "AI Movie & TV Discovery + Watchlist", 
        description: "A full-stack movie and TV discovery platform powered by TMDB, featuring trending hubs, detailed content pages, trailer playback, and an AI chatbot for quick recommendations. Users can securely sign up/login, build a personal watchlist, and track progress with a smooth, responsive UI.", 
        tags: ["MERN", "JWT", "Tailwind", "TMDB API", "OpenRouter"], 
        features: [ "Secure user authentication with JWT", "Real-time movie/TV discovery and search via TMDB", "Personal watchlist with status tracking and favorites", "AI chatbot recommendations with TMDB-assisted context" ],
        demoLink: "https://watchwise-xi.vercel.app/",
        repoLink: "https://github.com/VrajPatel1635/WatchWise",
        image: "/images/projects/WatchWise.png"
    },
    {
        id: "03", 
        title: "MarkME", 
        subtitle: "AI Face-Recognition Attendance System", 
        description: "An automated attendance platform that marks presence from classroom group photos using a MERN backend + a FastAPI AI service. Includes role-based dashboards (Admin/Teacher/Principal), student/class management, bulk onboarding, and downloadable attendance reports.", tags: ["MERN", "FastAPI", "MongoDB", "Cloudinary", "InsightFace"], 
        features: [ "AI-based attendance from classroom photos (InsightFace embeddings)", "Role-based access for Admin, Teacher, and Principal", "Bulk student upload via Excel + ZIP photo upload", "Monthly attendance report export to Excel (.xlsx)" ], 
        demoLink: "https://markme-ai-online.vercel.app", 
        repoLink: "https://github.com/vedantx001/SIH-MarkME",
        image: "/images/projects/MarkME.png"
    }
];

// Reusable text component for both Left side (animated) and Right side (mobile static)
const ProjectDetails = ({ project, className = "" }) => (
    <div className={`flex flex-col justify-center ${className}`}>
        <div className="flex items-center gap-4 mb-4">
            <span className="font-mono text-sm text-zinc-500 tracking-wider">PROJECT {project.id}</span>
            <div className="h-px w-12 bg-zinc-800" />
        </div>
        
        <h3 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-zinc-100 mb-2 leading-none">
            {project.title}
        </h3>
        
        <p className="text-xl text-zinc-400 font-medium mb-6 mt-2">
            {project.subtitle}
        </p>

        <p className="text-zinc-400 mb-8 leading-relaxed text-base md:text-lg max-w-xl">
            {project.description}
        </p>

        <div className="flex flex-wrap gap-2 md:gap-3 mb-10">
            {project.tags.map((tag, i) => (
                <span
                    key={i}
                    className="text-xs font-mono uppercase tracking-wider border border-zinc-700/50 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-zinc-300 bg-black/30 backdrop-blur-md"
                >
                    {tag}
                </span>
            ))}
        </div>

        <div className="flex items-center gap-4 mt-auto">
            <a
                href={project.demoLink}
                target="_blank" rel="noopener noreferrer"
                className="hero-btn-primary-inverse group"
            >
                <span>VIEW PROJECT</span>
                <ExternalLink size={16} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
            <a
                href={project.repoLink}
                target="_blank" rel="noopener noreferrer"
                className="hero-btn-outline-inverse group"
            >
                <span>SOURCE CODE</span>
                <Github size={16} />
            </a>
        </div>
    </div>
);

const RightImage = ({ project }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });
    
    // Parallax effect for the image inside its container
    // When the container enters bottom of screen (0), image is translated up.
    // When it leaves the top (1), image is translated down.
    const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

    return (
        <div ref={ref} className="w-full aspect-video rounded-3xl overflow-hidden relative shadow-2xl border border-zinc-800 group bg-[rgba(15,15,18,0.8)] backdrop-blur-sm">
            {project.image ? (
                <motion.img 
                    style={{ y, willChange: "transform" }}
                    src={project.image}
                    className="w-full h-full object-cover absolute top-0 left-0 opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                    alt={project.title}
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-800 font-mono text-9xl font-black opacity-20 select-none">
                    {project.id}
                </div>
            )}
            
            {/* Inner vignette for premium blend */}
            <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] pointer-events-none transition-opacity duration-700 group-hover:opacity-50" />
            <div className="absolute inset-0 bg-zinc-900/20 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
        </div>
    );
};

const Projects = () => {
    const containerRef = useRef(null);
    
    // Track scroll over the entire container to trigger text swaps
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <section id="work" className="bg-transparent text-zinc-50 relative z-10 py-12 md:py-0">
            <div ref={containerRef} className="max-w-350 mx-auto w-full flex flex-col md:flex-row relative px-6 md:px-12 lg:px-24">
                
                {/* 
                    LEFT SIDE: Pinned Details (Desktop Only) 
                    It stays sticky while the right side natively scrolls.
                */}
                <div className="hidden md:flex w-1/2 sticky top-0 h-screen items-center justify-start pr-16 pointer-events-none">
                    
                    {/* Background Massive Watermark */}
                    <motion.div 
                        initial={{ opacity: 0, x: -150 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: false, amount: 0.1 }}
                        className="absolute -left-12 top-1/2 -translate-y-1/2 text-zinc-800/10 font-black text-[12rem] uppercase z-0 tracking-tighter select-none -rotate-90 origin-center"
                    >
                        Works
                    </motion.div>

                    {PROJECTS.map((project, index) => {
                        const step = 1 / (PROJECTS.length - 1);
                        const target = index * step;
                        
                        // Tight Opacity crossfade for a snappy transition
                        const opacity = useTransform(
                            scrollYProgress, 
                            [target - 0.15, target, target + 0.15], 
                            [0, 1, 0]
                        );
                        // Smash scale: Drops from large (1.5) to normal (1), then crushed back (0.8)
                        const scale = useTransform(
                            scrollYProgress, 
                            [target - 0.15, target, target + 0.15], 
                            [1.4, 1, 0.8]
                        );
                        // Hard drop: Drops in heavily from above, then gets pushed slightly down
                        const y = useTransform(
                            scrollYProgress, 
                            [target - 0.15, target, target + 0.15], 
                            ["-60px", "0px", "20px"]
                        );
                        
                        // Only enable interactions when fully visible
                        const pointerEvents = useTransform(
                            scrollYProgress, 
                            (p) => Math.abs(p - target) < 0.1 ? "auto" : "none"
                        );

                        return (
                            <motion.div 
                                key={project.id}
                                style={{ opacity, y, scale, pointerEvents, willChange: "transform, opacity" }}
                                className="absolute left-0 w-full flex items-center h-full z-10 origin-center"
                            >
                                <ProjectDetails project={project} className="w-full" />
                            </motion.div>
                        );
                    })}
                </div>

                {/* 
                    RIGHT SIDE: Scrolling Images 
                    Scrolls natively with the window for absolutely zero lag.
                */}
                <div className="w-full md:w-1/2 flex flex-col relative z-20">
                    {PROJECTS.map((project) => (
                        <div key={project.id} className="min-h-screen flex flex-col justify-center py-12 md:py-0">
                            <RightImage project={project} />
                            
                            {/* Mobile Text (Visible only on small screens) */}
                            <div className="md:hidden mt-12 w-full">
                                <ProjectDetails project={project} />
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Projects;
