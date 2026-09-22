export const easeOutExpo = [0.16, 1, 0.3, 1];
export const easeSpring = [0.32, 0.72, 0, 1];

export const scrollReveal = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: 'blur(6px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.65,
      ease: easeOutExpo,
    },
  },
};

export const staggerContainer = (stagger = 0.08, delay = 0.05) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOutExpo,
    },
  },
};

export const buttonMotion = {
  whileHover: { y: -1 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.15 },
};

export const cardHoverMotion = {
  whileHover: {
    y: -3,
    transition: { duration: 0.25, ease: easeOutExpo },
  },
};

export const modalMotion = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: -8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: easeOutExpo,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: -6,
    transition: {
      duration: 0.18,
    },
  },
};
