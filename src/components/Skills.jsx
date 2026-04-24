import React, { useEffect, useRef, useState } from "react";
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import Matter from "matter-js";
import { SKILLS } from '../constants/data';
import '../styles/skills.css';

const Skills = () => {
    const sceneRef = useRef(null);
    const bubbleRefs = useRef([]);
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' ? window.innerWidth < 768 : false
    );

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const pointerRef = useRef({ x: -1000, y: -1000 });

    useEffect(() => {
        const sceneEl = sceneRef.current;
        if (!sceneEl) return;

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

        const width = sceneEl.clientWidth;
        const height = sceneEl.clientHeight;
        const wallThickness = 100;

        // Boundaries to keep bubbles inside the screen
        const walls = [
            Bodies.rectangle(width / 2, -wallThickness/2, width, wallThickness, { isStatic: true }), // Top
            Bodies.rectangle(width / 2, height + wallThickness/2, width, wallThickness, { isStatic: true }), // Bottom
            Bodies.rectangle(-wallThickness/2, height / 2, wallThickness, height, { isStatic: true }), // Left
            Bodies.rectangle(width + wallThickness/2, height / 2, wallThickness, height, { isStatic: true }) // Right
        ];

        const bubbleRadius = isMobile ? 40 : 65; 
        
        // BIG BANG: start all skills at the center
        const skillBodies = SKILLS.map((skill, index) => {
            const x = width / 2 + (Math.random() - 0.5) * 10;
            const y = height / 2 + (Math.random() - 0.5) * 10;
            
            const body = Bodies.circle(x, y, bubbleRadius, {
                restitution: 0.8, // Bounciness
                friction: 0.001,
                frictionAir: 0.015, // Air resistance
                density: 0.04,
                label: `skill-${index}`,
            });

            // BIG BANG EXPLOSION FORCE
            const explodeForce = isMobile ? 0.05 : 0.15;
            Matter.Body.applyForce(body, body.position, {
                x: (Math.random() - 0.5) * explodeForce,
                y: (Math.random() - 0.5) * explodeForce
            });

            return body;
        });

        Composite.add(engine.world, [...walls, ...skillBodies]);

        // Native DOM Pointer Events for Dragging & Repulsion
        const handlePointerMove = (e) => {
            const rect = sceneEl.getBoundingClientRect();
            pointerRef.current.x = e.clientX - rect.left;
            pointerRef.current.y = e.clientY - rect.top;
        };

        const handlePointerDown = (e) => {
            pointerRef.current.isDown = true;
            const rect = sceneEl.getBoundingClientRect();
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

        sceneEl.addEventListener('pointermove', handlePointerMove);
        sceneEl.addEventListener('pointerdown', handlePointerDown);
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
                    
                    // Counter-rotate the image so the logo stays perfectly upright & add parallax based on velocity
                    const logoWrapper = el.querySelector('.skill-logo-wrapper');
                    if (logoWrapper) {
                        // Calculate parallax translation based on physics velocity
                        const rawParallaxX = body.velocity.x * -1.5;
                        const rawParallaxY = body.velocity.y * -1.5;
                        
                        // THE FIX: Clamp the max parallax distance.
                        // During a massive collision, velocity spikes infinitely, which was blasting the logo out of the overflow mask.
                        // We trap the logo inside a safe radius (40% of the bubble size) so it physically cannot leave the glass.
                        const maxParallax = bubbleRadius * 0.4; 
                        const clampedX = Math.max(-maxParallax, Math.min(maxParallax, rawParallaxX));
                        const clampedY = Math.max(-maxParallax, Math.min(maxParallax, rawParallaxY));
                        
                        logoWrapper.style.transform = `rotate(-${body.angle}rad) translate(${clampedX}px, ${clampedY}px)`;
                    }

                    // Slosh the liquid based on true physical acceleration (Not just velocity)
                    const tiltContainer = el.querySelector('.liquid-tilt-container');
                    const wave1 = el.querySelector('.liquid-wave-1');
                    const wave2 = el.querySelector('.liquid-wave-2');
                    
                    if (tiltContainer && wave1 && wave2) {
                        // Initialize physical properties for water inside the bubble
                        if (body.sloshAngle === undefined) {
                            body.sloshAngle = 0;
                            body.sloshVelocity = 0;
                            body.prevVelocity = { x: body.velocity.x, y: body.velocity.y };
                            body.waveAngle = Math.random() * 360;
                            body.waveSpeed = 0;
                        }

                        // 1. Calculate Acceleration (change in velocity). This handles wall smashes seamlessly.
                        const accelX = body.velocity.x - body.prevVelocity.x;
                        const accelY = body.velocity.y - body.prevVelocity.y;
                        body.prevVelocity = { x: body.velocity.x, y: body.velocity.y };

                        // 2. Liquid Tilt (Slosh) driven by Acceleration using a damped harmonic oscillator (spring)
                        // A hard smash against a wall creates massive acceleration, causing a huge visible water slosh.
                        // While drifting steadily, acceleration is 0, so the water levels out smoothly.
                        const targetSlosh = -accelX * 15; // Sensitivity to hits and drags
                        
                        body.sloshVelocity += (targetSlosh - body.sloshAngle) * 0.08; // Spring stiffness
                        body.sloshVelocity -= body.sloshAngle * 0.02; // Gravity pulling water flat
                        body.sloshVelocity *= 0.88; // Water friction/damping
                        body.sloshAngle += body.sloshVelocity;
                        
                        // Limit the max slosh angle to keep the water inside the glass sphere visual
                        body.sloshAngle = Math.max(-50, Math.min(50, body.sloshAngle));
                        
                        // Apply counter-rotation + slosh angle
                        tiltContainer.style.transform = `rotate(${-body.angle + (body.sloshAngle * Math.PI / 180)}rad)`;

                        // 3. Liquid Wave Surface (Churning/Spinning) driven by Kinetic Energy
                        const energy = Math.abs(accelX) + Math.abs(accelY) + (Math.abs(body.velocity.x) + Math.abs(body.velocity.y)) * 0.05;
                        
                        body.waveSpeed += energy * 0.8;
                        body.waveSpeed *= 0.94; // friction on the wave spinning
                        
                        if (body.waveSpeed > 0.05) {
                            body.waveAngle += body.waveSpeed;
                        } else {
                            // Perfect stabilization: settle into the nearest completely flat structural angle
                            const nearestFlatAngle = Math.round(body.waveAngle / 90) * 90;
                            body.waveAngle += (nearestFlatAngle - body.waveAngle) * 0.08;
                        }

                        wave1.style.transform = `rotate(${body.waveAngle}deg)`;
                        wave2.style.transform = `rotate(${-body.waveAngle * 0.85}deg)`;
                    }
                }
            });
        });

        const runner = Runner.create();
        Runner.run(runner, engine);

        return () => {
            if (sceneEl) {
                sceneEl.removeEventListener('pointermove', handlePointerMove);
                sceneEl.removeEventListener('pointerdown', handlePointerDown);
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
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0, filter: 'blur(10px)' }}
                transition={{ duration: 1.2, type: 'spring', bounce: 0.4, delay: 0.2 }}
                viewport={{ once: false }}
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
                            className="bubble-capsule group"
                            style={{
                                width: `${bubbleSize}px`,
                                height: `${bubbleSize}px`,
                                '--liquid-color': `rgba(255, 255, 255, 0.15)`, /* Almost transparent water front wave */
                                '--liquid-color-dark': `rgba(255, 255, 255, 0.08)` /* Almost transparent water back wave */
                            }}
                        >
                            {/* Inner Glass Boundary for overflow masking */}
                            <div className="bubble-capsule-glass">
                                {/* Dynamic Liquid Tilt Container */}
                                <div className="liquid-tilt-container">
                                    <div className="liquid-wave-2"></div>
                                    <div className="liquid-wave-1"></div>
                                </div>
                                
                                {/* 3D Glass Highlight */}
                                <div className="bubble-glare" />

                                {/* Skill Logo floating inside */}
                                <div className="skill-logo-wrapper">
                                    <img 
                                        src={`https://cdn.simpleicons.org/${skill.slug}/${skill.color.replace("#", "")}`} 
                                        alt={skill.name}
                                        draggable={false}
                                        className="skill-logo w-8 h-8 md:w-12 md:h-12"
                                    />
                                </div>
                            </div>

                            {/* Tooltip on hover */}
                            <div className="skill-tooltip">
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
