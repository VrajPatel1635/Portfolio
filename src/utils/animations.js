export const PRESETS = {
  ease: [0.16, 1, 0.3, 1], // Consistent premium easing
  duration: 0.8
};

export const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: PRESETS.duration, ease: PRESETS.ease }
  }
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    }
  }
};

export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: PRESETS.duration, ease: PRESETS.ease }
  }
};

export const scaleLine = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: { 
    scaleX: 1, 
    opacity: 1, 
    transition: { duration: PRESETS.duration, ease: PRESETS.ease } 
  }
};
