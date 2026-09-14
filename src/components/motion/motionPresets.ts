/** Shared motion curves — marketing site wide. */
export const easeOutExpo = [0.22, 1, 0.36, 1] as const;
export const easeOutBack = [0.34, 1.45, 0.64, 1] as const;

export const springSnappy = { type: "spring" as const, stiffness: 280, damping: 26, mass: 0.85 };
export const springBouncy = { type: "spring" as const, stiffness: 200, damping: 18, mass: 0.9 };
export const springSoft = { type: "spring" as const, stiffness: 120, damping: 22, mass: 1 };

export const pageEnterTransition = {
  duration: 0.65,
  ease: easeOutExpo,
};
