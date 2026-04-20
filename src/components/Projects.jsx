import { useEffect, useRef, useState } from 'react';
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
        image: "/images/projects/cinema.png"
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
        image: "/images/projects/watchwise.png"
    },
    {
        id: "03", 
        title: "MarkME", 
        subtitle: "AI Face-Recognition Attendance System", 
        description: "An automated attendance platform that marks presence from classroom group photos using a MERN backend + a FastAPI AI service. Includes role-based dashboards (Admin/Teacher/Principal), student/class management, bulk onboarding, and downloadable attendance reports.", tags: ["MERN", "FastAPI", "MongoDB", "Cloudinary", "InsightFace"], 
        features: [ "AI-based attendance from classroom photos (InsightFace embeddings)", "Role-based access for Admin, Teacher, and Principal", "Bulk student upload via Excel + ZIP photo upload", "Monthly attendance report export to Excel (.xlsx)" ], 
        demoLink: "https://markme-ai-online.vercel.app", 
        repoLink: "https://github.com/vedantx001/SIH-MarkME",
        image: "/images/projects/markme.png"
    }
];

const ProjectCard = ({ project, index }) => {
    const cardRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const isEven = index % 2 === 0;

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (cardRef.current) observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={cardRef}
            className={`relative flex flex-col md:flex-row items-center w-full mb-24 md:mb-40 transition-all duration-1000 ease-out
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-24'}`}
        >
            {/* Timeline Node Dot */}
            <div className={`absolute left-1.5 md:left-[calc(50%-10px)] top-8 md:top-1/2 w-5 h-5 rounded-full border-4 z-10 md:-translate-y-1/2 transition-colors duration-700 delay-300
                ${isVisible ? 'bg-zinc-100 border-zinc-950' : 'bg-[rgba(9,9,11,0.5)] border-zinc-950'}`}
            />

            {/* Content Container (Alternates left/right on desktop) */}
            <div className={`w-full flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} pl-12 md:pl-0`}>

                {/* Image Section */}
                <div className={`w-full md:w-1/2 ${isEven ? 'md:pr-16' : 'md:pl-16'}`}>
                    <div className="w-full aspect-video bg-[rgba(24,24,27,0.5)] border border-zinc-800 rounded-lg relative overflow-hidden group mb-8 md:mb-0 backdrop-blur-sm">
                        {project.image ? (
                            <img 
                                src={project.image} 
                                alt={project.title} 
                                className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-zinc-800 font-mono text-9xl font-black opacity-20 select-none transition-transform duration-700 group-hover:scale-110">
                                {project.id}
                            </div>
                        )}
                        <div className="absolute inset-0 bg-zinc-900/40 group-hover:bg-transparent transition-colors duration-500" />
                    </div>
                </div>

                {/* Text Section */}
                <div className={`w-full md:w-1/2 flex flex-col justify-center ${isEven ? 'md:pl-16' : 'md:pr-16 md:items-end md:text-right'}`}>
                    <div className={`flex items-center gap-4 mb-4 ${!isEven && 'md:flex-row-reverse'}`}>
                        <span className="font-mono text-sm text-zinc-500">{project.id}</span>
                        <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-100">
                            {project.title}
                        </h3>
                    </div>

                    <p className="text-xl text-zinc-400 mb-6 font-medium">
                        {project.subtitle}
                    </p>

                    <p className="text-zinc-400 mb-8 leading-relaxed max-w-xl">
                        {project.description}
                    </p>

                    <div className="mb-8 w-full">
                        <ul className={`flex flex-col gap-3 ${!isEven && 'md:items-end'}`}>
                            {project.features.map((feature, i) => (
                                <li key={i} className={`flex items-center gap-3 text-sm text-zinc-400 ${!isEven ? 'md:flex-row-reverse' : ''}`}>
                                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={`flex flex-wrap gap-3 mb-10 ${!isEven && 'md:justify-end'}`}>
                        {project.tags.map((tag, i) => (
                            <span
                                key={i}
                                className="text-xs font-mono uppercase tracking-wider border border-zinc-800 px-3 py-1.5 rounded-full text-zinc-400 backdrop-blur-sm bg-black/20"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className={`flex items-center gap-4 ${!isEven && 'md:flex-row-reverse'} pointer-events-auto mt-4`}>
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
            </div>
        </div>
    );
};

const Projects = () => {
    const containerRef = useRef(null);
    // Direct DOM ref — avoids setState/re-renders on every scroll tick
    const spineProgressRef = useRef(null);

    // Track scroll position to fill the timeline spine
    useEffect(() => {
        let rafId = null;
        const handleScroll = () => {
            if (rafId !== null) return;
            rafId = requestAnimationFrame(() => {
                rafId = null;
                if (!containerRef.current || !spineProgressRef.current) return;
                const rect = containerRef.current.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                const current = windowHeight / 2 - rect.top;
                const progress = Math.max(0, Math.min(1, current / rect.height));
                spineProgressRef.current.style.height = `${progress * 100}%`;
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafId !== null) cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <section id="work" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-transparent text-zinc-50 min-h-screen">
            <div className="max-w-7xl mx-auto">

                <div className="flex flex-col gap-4 mb-24 md:mb-40">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase text-zinc-100">
                        Selected Works
                    </h2>
                    <div className="w-24 h-1 bg-zinc-800" />
                </div>

                <div className="relative" ref={containerRef}>
                    {/* Background Timeline Spine */}
                    <div className="absolute left-3.75 md:left-[calc(50%-1px)] top-0 bottom-0 w-0.5 bg-[rgba(24,24,27,0.5)]" />

                    {/* Animated Scroll Progress Spine */}
                    <div
                        ref={spineProgressRef}
                        className="absolute left-3.75 md:left-[calc(50%-1px)] top-0 w-0.5 bg-zinc-100"
                        style={{ height: '0%', willChange: 'height' }}
                    />

                    {/* Project Items */}
                    <div className="relative z-10">
                        {PROJECTS.map((project, index) => (
                            <ProjectCard key={project.id} project={project} index={index} />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Projects;
