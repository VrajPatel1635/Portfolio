export const SKILLS = [
  { name: "React",       color: "#61DAFB", slug: "react"            },
  { name: "Next.js",     color: "#FFFFFF", slug: "nextdotjs"        },
  { name: "JavaScript",  color: "#F7DF1E", slug: "javascript"       },
  { name: "Tailwind",    color: "#06B6D4", slug: "tailwindcss"      },
  { name: "HTML5",       color: "#E34F26", slug: "html5"            },
  { name: "CSS3",        color: "#1572B6", slug: "css"              },
  { name: "Node.js",     color: "#339933", slug: "nodedotjs"        },
  { name: "Express.js",  color: "#FFFFFF", slug: "express"          },
  { name: "MongoDB",     color: "#47A248", slug: "mongodb"          },
  { name: "MySQL",       color: "#4479A1", slug: "mysql"            },
  { name: "JWT Auth",    color: "#FB015B", slug: "jsonwebtokens"    },
  { name: "REST API",    color: "#85EA2D", slug: "swagger"          },
  { name: "Git",         color: "#F05032", slug: "git"              },
  { name: "GitHub",      color: "#FFFFFF", slug: "github"           },
  { name: "Python",      color: "#3776AB", slug: "python"           },
  { name: "Numpy",       color: "#013243", slug: "numpy"            },
  { name: "Pandas",      color: "#150458", slug: "pandas"           },
  { name: "Matplotlib",  color: "#11557C", slug: "matplotlib", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/matplotlib/matplotlib-original.svg" },
  { name: "Scikit-learn",color: "#F7931E", slug: "scikitlearn"      }
];

export const PROJECTS = [
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
