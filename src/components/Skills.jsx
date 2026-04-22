import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Matter from "matter-js";
import '../styles/skills.css';

const SKILLS = [
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
];

const Skills = () => {
    const sceneRef = useRef(null);
    const bubbleRefs = useRef([]);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const pointerRef = useRef({ x: -1000, y: -1000 });

    useEffect(() => {
        if (!sceneRef.current) return;

        const Engine = Matter.Engine,
              Runner = Matter.Runner,
              Bodies = Matter.Bodies,
              Composite = Matter.Composite,
              Mouse = Matter.Mouse,
              MouseConstraint = Matter.MouseConstraint,
              Events = Matter.Events;

        const engine = Engine.create({
            gravity: { x: 0, y: 0, scale: 0.001 } // Zero gravity
        });

        const width = sceneRef.current.clientWidth;
        const height = sceneRef.current.clientHeight;
        const wallThickness = 100;

        // Boundaries to keep bubbles inside the screen
        const walls = [
            Bodies.rectangle(width / 2, -wallThickness/2, width, wallThickness, { isStatic: true }), // Top
            Bodies.rectangle(width / 2, height + wallThickness/2, width, wallThickness, { isStatic: true }), // Bottom
            Bodies.rectangle(-wallThickness/2, height / 2, wallThickness, height, { isStatic: true }), // Left
            Bodies.rectangle(width + wallThickness/2, height / 2, wallThickness, height, { isStatic: true }) // Right
        ];

        const bubbleRadius = isMobile ? 40 : 65; 
        
        const skillBodies = SKILLS.map((skill, index) => {
            const x = Math.random() * (width - bubbleRadius * 2) + bubbleRadius;
            const y = Math.random() * (height - bubbleRadius * 2) + bubbleRadius;
            
            return Bodies.circle(x, y, bubbleRadius, {
                restitution: 0.8, // Bounciness
                friction: 0.001,
                frictionAir: 0.015, // Air resistance
                density: 0.04,
                label: `skill-${index}`
            });
        });

        Composite.add(engine.world, [...walls, ...skillBodies]);

        // Native DOM Pointer Events for Dragging & Repulsion
        const handlePointerMove = (e) => {
            const rect = sceneRef.current.getBoundingClientRect();
            pointerRef.current.x = e.clientX - rect.left;
            pointerRef.current.y = e.clientY - rect.top;
        };

        const handlePointerDown = (e) => {
            pointerRef.current.isDown = true;
            const rect = sceneRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Find which body was clicked
            const clickedBodies = Matter.Query.point(skillBodies, { x, y });
            if (clickedBodies.length > 0) {
                const body = clickedBodies[0];
                body.isDragging = true;
                pointerRef.current.dragBody = body;
            }
        };

        const handlePointerUp = () => {
            pointerRef.current.isDown = false;
            if (pointerRef.current.dragBody) {
                pointerRef.current.dragBody.isDragging = false;
                pointerRef.current.dragBody = null;
            }
        };

        sceneRef.current.addEventListener('pointermove', handlePointerMove);
        sceneRef.current.addEventListener('pointerdown', handlePointerDown);
        window.addEventListener('pointerup', handlePointerUp);

        // Custom Physics Loop (Repulsion and Continuous Movement)
        Events.on(engine, 'beforeUpdate', () => {
            // Magnetic repulsion
            const { x, y, isDown } = pointerRef.current;
            
            skillBodies.forEach(body => {
                // Keep them moving slightly
                if (body.speed < 0.2 && !body.isDragging) {
                    Matter.Body.applyForce(body, body.position, {
                        x: (Math.random() - 0.5) * 0.005,
                        y: (Math.random() - 0.5) * 0.005
                    });
                }
                
                // Only repel if not actively clicking/dragging
                if (!isDown && x > -500) {
                    const dx = body.position.x - x;
                    const dy = body.position.y - y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 200) {
                        const forceMagnitude = 0.0003 * (200 - distance);
                        Matter.Body.applyForce(body, body.position, {
                            x: (dx / distance) * forceMagnitude,
                            y: (dy / distance) * forceMagnitude
                        });
                    }
                }
            });

            // Handle Manual Dragging Constraint
            if (isDown && pointerRef.current.dragBody) {
                const body = pointerRef.current.dragBody;
                
                // Calculate velocity to move body towards cursor
                const dx = x - body.position.x;
                const dy = y - body.position.y;
                
                // Apply velocity directly for snappy drag
                Matter.Body.setVelocity(body, {
                    x: dx * 0.2,
                    y: dy * 0.2
                });
            }
        });

        // Sync React UI with Physics coordinates at 60fps WITHOUT triggering React re-renders
        Events.on(engine, 'afterUpdate', () => {
            skillBodies.forEach((body, i) => {
                const el = bubbleRefs.current[i];
                if (el) {
                    // Update div position and rotation
                    el.style.transform = `translate(${body.position.x - bubbleRadius}px, ${body.position.y - bubbleRadius}px) rotate(${body.angle}rad)`;
                    
                    // Counter-rotate the image so the logo stays perfectly upright
                    const img = el.querySelector('.skill-logo');
                    if (img) {
                        img.style.transform = `rotate(-${body.angle}rad)`;
                    }
                }
            });
        });

        const runner = Runner.create();
        Runner.run(runner, engine);

        return () => {
            if (sceneRef.current) {
                sceneRef.current.removeEventListener('pointermove', handlePointerMove);
                sceneRef.current.removeEventListener('pointerdown', handlePointerDown);
            }
            window.removeEventListener('pointerup', handlePointerUp);
            Runner.stop(runner);
            Matter.World.clear(engine.world);
            Engine.clear(engine);
        };
    }, [isMobile]); 

    const bubbleRadius = isMobile ? 40 : 65;
    const bubbleSize = bubbleRadius * 2;

    return (
        <section id="skills" className="relative h-screen w-full flex items-center justify-center py-20 overflow-hidden z-10 bg-transparent" style={{ touchAction: 'pan-y' }}>
            {/* Massive Background Watermark */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] md:text-[20vw] font-black tracking-tighter uppercase text-zinc-800/10 select-none z-0 pointer-events-none"
            >
                SKILLS
            </motion.div>

            {/* Header / Intro */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-12 md:top-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20 pointer-events-none"
            >
                <div className="flex items-center gap-4">
                    <div className="h-px w-12 bg-zinc-600" />
                    <span className="font-mono text-xs tracking-[0.3em] text-zinc-400 uppercase">Interactive</span>
                    <div className="h-px w-12 bg-zinc-600" />
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter orbitron-title text-center whitespace-nowrap">
                    TECH <span className="text-transparent" style={{ WebkitTextStroke: '1px white' }}>STACK</span>
                </h2>
                <p className="text-zinc-400 text-xs md:text-sm tracking-widest font-light mt-2 uppercase text-center w-full">Play with the spheres</p>
            </motion.div>

            {/* Physics Scene Wrapper for Animations */}
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="absolute top-0 left-0 w-full h-full z-10"
            >
                <div 
                    ref={sceneRef} 
                    className="absolute top-0 left-0 w-full h-full z-10 overflow-hidden select-none"
                >
                    {SKILLS.map((skill, index) => (
                        <div
                            key={skill.slug}
                            ref={(el) => (bubbleRefs.current[index] = el)}
                            className="absolute top-0 left-0 flex flex-col items-center justify-center rounded-full bg-[rgba(20,20,22,0.6)] border border-zinc-600/30 backdrop-blur-lg shadow-[inset_0_4px_20px_rgba(255,255,255,0.1),0_10px_30px_rgba(0,0,0,0.5)] cursor-grab active:cursor-grabbing hover:bg-[rgba(30,30,35,0.8)] hover:border-zinc-400/50 transition-colors duration-300 group"
                            style={{
                                width: `${bubbleSize}px`,
                                height: `${bubbleSize}px`,
                                willChange: 'transform' // Hardware acceleration
                            }}
                        >
                            {/* 3D Glass Highlight */}
                            <div className="absolute top-[10%] left-[20%] w-[30%] h-[20%] bg-white opacity-20 rounded-full blur-[2px] pointer-events-none" />

                            {/* Skill Logo (Counter-rotated dynamically) */}
                            <img 
                                src={`https://cdn.simpleicons.org/${skill.slug}/${skill.color.replace("#", "")}`} 
                                alt={skill.name}
                                draggable={false}
                                className="skill-logo w-8 h-8 md:w-12 md:h-12 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 pointer-events-none"
                                style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.2))" }}
                            />

                            {/* Hidden skill name that shows on hover */}
                            <div className="absolute -bottom-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-mono text-[10px] md:text-xs font-bold tracking-widest text-white whitespace-nowrap bg-black/80 px-3 py-1 rounded-full border border-zinc-700 pointer-events-none">
                                {skill.name}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default Skills;
