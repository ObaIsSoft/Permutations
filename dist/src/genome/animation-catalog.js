/**
 * Animation Catalog Service
 *
 * Provides animation presets from established animation libraries.
 * Each preset maps a genome physics type to real library parameters.
 *
 * Libraries:
 *   framer-motion — Spring physics, keyframes, inertia (React)
 *   gsap          — CustomEase, physics plugins, timelines
 *   anime         — Easing functions, keyframe animations
 *   motion-one    — Spring physics, scroll animations
 *   popmotion     — Raw physics simulations (spring, decay, inertia)
 *
 * The genome's ch8_motion.physics selects a category, then the catalog
 * provides library-specific implementations with parameters derived from
 * genome values (durationScale, hoverIntensity, etc.).
 */
export const ANIMATION_CATALOG = [
    // ── Framer Motion Spring Presets ────────────────────────────────────────
    { id: "fm-spring-default", name: "Default Spring", library: "framer-motion", category: "spring", description: "Natural spring with moderate bounce", spring: { stiffness: 400, damping: 30, mass: 1 }, cssEasing: "cubic-bezier(0.34, 1.56, 0.64, 1)", fmType: "spring", usesStagger: false, repeats: false, complexity: 0.3, tags: ["spring", "bounce", "natural"], forbiddenFor: [] },
    { id: "fm-spring-gentle", name: "Gentle Spring", library: "framer-motion", category: "spring", description: "Soft, subtle spring for elegant interfaces", spring: { stiffness: 200, damping: 25, mass: 1.5 }, cssEasing: "cubic-bezier(0.25, 0.1, 0.25, 1)", fmType: "spring", usesStagger: false, repeats: false, complexity: 0.2, tags: ["spring", "gentle", "elegant"], forbiddenFor: [] },
    { id: "fm-spring-bouncy", name: "Bouncy Spring", library: "framer-motion", category: "spring", description: "Exaggerated bounce for playful interfaces", spring: { stiffness: 600, damping: 12, mass: 0.8 }, cssEasing: "cubic-bezier(0.34, 1.56, 0.64, 1)", fmType: "spring", usesStagger: false, repeats: false, complexity: 0.5, tags: ["spring", "bouncy", "playful"], forbiddenFor: [] },
    { id: "fm-spring-snappy", name: "Snappy Spring", library: "framer-motion", category: "spring", description: "Quick, tight spring for snappy interactions", spring: { stiffness: 800, damping: 50, mass: 0.5 }, cssEasing: "cubic-bezier(0.4, 0, 1, 1)", fmType: "spring", usesStagger: false, repeats: false, complexity: 0.4, tags: ["spring", "snappy", "fast"], forbiddenFor: [] },
    { id: "fm-spring-heavy", name: "Heavy Spring", library: "framer-motion", category: "spring", description: "Weighty spring for substantial elements", spring: { stiffness: 150, damping: 25, mass: 2 }, cssEasing: "cubic-bezier(0.4, 0, 0.2, 1)", fmType: "spring", usesStagger: false, repeats: false, complexity: 0.6, tags: ["spring", "heavy", "substantial"], forbiddenFor: [] },
    { id: "fm-spring-magnetic", name: "Magnetic Spring", library: "framer-motion", category: "spring", description: "Attraction/repulsion for cursor-following", spring: { stiffness: 300, damping: 20, mass: 0.5 }, cssEasing: "cubic-bezier(0.175, 0.885, 0.32, 1.275)", fmType: "spring", usesStagger: false, repeats: false, complexity: 0.5, tags: ["spring", "magnetic", "cursor"], forbiddenFor: [] },
    { id: "fm-spring-elastic", name: "Elastic Spring", library: "framer-motion", category: "spring", description: "Rubber-band overshoot and snap back", spring: { stiffness: 200, damping: 8, mass: 1.5 }, cssEasing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)", fmType: "spring", usesStagger: false, repeats: false, complexity: 0.6, tags: ["spring", "elastic", "rubber"], forbiddenFor: [] },
    { id: "fm-spring-harmonic", name: "Harmonic Spring", library: "framer-motion", category: "spring", description: "Sine-wave oscillation for rhythmic motion", spring: { stiffness: 250, damping: 18, mass: 1.2 }, cssEasing: "cubic-bezier(0.4, 0, 0.6, 1)", fmType: "spring", usesStagger: false, repeats: true, complexity: 0.5, tags: ["spring", "harmonic", "rhythmic"], forbiddenFor: [] },
    { id: "fm-spring-pendulum", name: "Pendulum Spring", library: "framer-motion", category: "spring", description: "Gravitational swing physics", spring: { stiffness: 180, damping: 10, mass: 1.8 }, cssEasing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)", fmType: "spring", usesStagger: false, repeats: false, complexity: 0.6, tags: ["spring", "pendulum", "swing"], forbiddenFor: [] },
    { id: "fm-spring-chaos", name: "Chaos Spring", library: "framer-motion", category: "spring", description: "Unpredictable, sensitive to initial conditions", spring: { stiffness: 100, damping: 5, mass: 2 }, cssEasing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)", fmType: "spring", usesStagger: false, repeats: true, complexity: 0.8, tags: ["spring", "chaos", "unpredictable"], forbiddenFor: [] },
    { id: "fm-spring-orbital", name: "Orbital Spring", library: "framer-motion", category: "spring", description: "Circular/elliptical paths", spring: { stiffness: 300, damping: 20, mass: 1 }, cssEasing: "cubic-bezier(0.4, 0, 0.2, 1)", fmType: "spring", usesStagger: false, repeats: false, complexity: 0.7, tags: ["spring", "orbital", "circular"], forbiddenFor: [] },
    { id: "fm-spring-vortex", name: "Vortex Spring", library: "framer-motion", category: "spring", description: "Spiral inward/outward motion", spring: { stiffness: 250, damping: 8, mass: 1.2 }, cssEasing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)", fmType: "spring", usesStagger: false, repeats: false, complexity: 0.8, tags: ["spring", "vortex", "spiral"], forbiddenFor: [] },
    { id: "fm-spring-snap", name: "Snap Spring", library: "framer-motion", category: "spring", description: "Magnetic snap-to points", spring: { stiffness: 800, damping: 50, mass: 0.5 }, cssEasing: "cubic-bezier(0.4, 0, 1, 1)", fmType: "spring", usesStagger: false, repeats: false, complexity: 0.4, tags: ["spring", "snap", "magnetic"], forbiddenFor: [] },
    { id: "fm-spring-momentum", name: "Momentum Spring", library: "framer-motion", category: "spring", description: "Heavy physics, weighty feel", spring: { stiffness: 120, damping: 30, mass: 2.5 }, cssEasing: "cubic-bezier(0.22, 1, 0.36, 1)", fmType: "spring", usesStagger: false, repeats: false, complexity: 0.7, tags: ["spring", "momentum", "heavy"], forbiddenFor: [] },
    // ── Framer Motion Inertia Presets ───────────────────────────────────────
    { id: "fm-inertia-default", name: "Default Inertia", library: "framer-motion", category: "inertia", description: "Momentum-based coasting after release", inertia: { velocity: 800, power: 0.8, timeConstant: 350 }, cssEasing: "cubic-bezier(0.25, 0.1, 0.25, 1)", fmType: "inertia", usesStagger: false, repeats: false, complexity: 0.5, tags: ["inertia", "momentum", "coast"], forbiddenFor: [] },
    { id: "fm-inertia-heavy", name: "Heavy Inertia", library: "framer-motion", category: "inertia", description: "Weighty feel, slow deceleration", inertia: { velocity: 1200, power: 0.6, timeConstant: 500 }, cssEasing: "cubic-bezier(0.22, 1, 0.36, 1)", fmType: "inertia", usesStagger: false, repeats: false, complexity: 0.7, tags: ["inertia", "heavy", "slow"], forbiddenFor: [] },
    { id: "fm-inertia-quick", name: "Quick Inertia", library: "framer-motion", category: "inertia", description: "Fast deceleration, quick stop", inertia: { velocity: 600, power: 0.4, timeConstant: 200 }, cssEasing: "cubic-bezier(0.25, 0.1, 0.25, 1)", fmType: "inertia", usesStagger: false, repeats: false, complexity: 0.4, tags: ["inertia", "quick", "fast"], forbiddenFor: [] },
    { id: "fm-inertia-momentum", name: "Momentum Inertia", library: "framer-motion", category: "momentum", description: "Heavy momentum coasting", inertia: { velocity: 1200, power: 0.6, timeConstant: 500 }, cssEasing: "cubic-bezier(0.22, 1, 0.36, 1)", fmType: "inertia", usesStagger: false, repeats: false, complexity: 0.7, tags: ["momentum", "heavy", "coast"], forbiddenFor: [] },
    { id: "fm-inertia-decay", name: "Decay Inertia", library: "framer-motion", category: "decay", description: "Exponential slow-down", inertia: { velocity: 600, power: 0.4, timeConstant: 200 }, cssEasing: "cubic-bezier(0.25, 0.1, 0.25, 1)", fmType: "inertia", usesStagger: false, repeats: false, complexity: 0.4, tags: ["decay", "slowdown", "exponential"], forbiddenFor: [] },
    // ── Framer Motion Keyframe Presets ──────────────────────────────────────
    { id: "fm-keyframes-glitch", name: "Glitch Keyframes", library: "framer-motion", category: "glitch", description: "Corrupted signal, digital artefact", spring: { stiffness: 800, damping: 5, mass: 0.2 }, cssEasing: "linear", fmType: "keyframes", usesStagger: false, repeats: false, complexity: 0.7, tags: ["glitch", "digital", "corrupt"], forbiddenFor: [] },
    // ── Stagger Presets ─────────────────────────────────────────────────────
    { id: "fm-stagger-particle", name: "Particle Stagger", library: "framer-motion", category: "particle", description: "Stochastic swarm behaviour", spring: { stiffness: 500, damping: 15, mass: 0.3 }, cssEasing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)", fmType: "spring", usesStagger: true, repeats: false, complexity: 0.7, tags: ["particle", "swarm", "stagger"], forbiddenFor: [] },
    { id: "fm-stagger-wave", name: "Wave Stagger", library: "framer-motion", category: "wave", description: "Propagation through medium", spring: { stiffness: 200, damping: 15, mass: 1.5 }, cssEasing: "cubic-bezier(0.4, 0, 0.6, 1)", fmType: "spring", usesStagger: true, repeats: false, complexity: 0.6, tags: ["wave", "propagation", "stagger"], forbiddenFor: [] },
    { id: "fm-stagger-ripple", name: "Ripple Stagger", library: "framer-motion", category: "ripple", description: "Concentric outward propagation", spring: { stiffness: 350, damping: 20, mass: 0.8 }, cssEasing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)", fmType: "spring", usesStagger: true, repeats: false, complexity: 0.5, tags: ["ripple", "concentric", "outward"], forbiddenFor: [] },
    { id: "fm-stagger-vortex", name: "Vortex Stagger", library: "framer-motion", category: "vortex", description: "Spiral inward/outward stagger", spring: { stiffness: 250, damping: 8, mass: 1.2 }, cssEasing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)", fmType: "spring", usesStagger: true, repeats: false, complexity: 0.8, tags: ["vortex", "spiral", "stagger"], forbiddenFor: [] },
    { id: "fm-stagger-harmonic", name: "Harmonic Stagger", library: "framer-motion", category: "harmonic", description: "Sine-wave staggered oscillation", spring: { stiffness: 250, damping: 18, mass: 1.2 }, cssEasing: "cubic-bezier(0.4, 0, 0.6, 1)", fmType: "spring", usesStagger: true, repeats: true, complexity: 0.5, tags: ["harmonic", "oscillation", "stagger"], forbiddenFor: [] },
    { id: "fm-stagger-pendulum", name: "Pendulum Stagger", library: "framer-motion", category: "pendulum", description: "Gravitational swing stagger", spring: { stiffness: 180, damping: 10, mass: 1.8 }, cssEasing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)", fmType: "spring", usesStagger: true, repeats: false, complexity: 0.6, tags: ["pendulum", "swing", "stagger"], forbiddenFor: [] },
    { id: "fm-stagger-orbital", name: "Orbital Stagger", library: "framer-motion", category: "orbital", description: "Circular/elliptical stagger", spring: { stiffness: 300, damping: 20, mass: 1 }, cssEasing: "cubic-bezier(0.4, 0, 0.2, 1)", fmType: "spring", usesStagger: true, repeats: false, complexity: 0.7, tags: ["orbital", "circular", "stagger"], forbiddenFor: [] },
    { id: "fm-stagger-chaos", name: "Chaos Stagger", library: "framer-motion", category: "chaos", description: "Unpredictable staggered motion", spring: { stiffness: 100, damping: 5, mass: 2 }, cssEasing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)", fmType: "spring", usesStagger: true, repeats: true, complexity: 0.8, tags: ["chaos", "unpredictable", "stagger"], forbiddenFor: [] },
    { id: "fm-stagger-magnetic", name: "Magnetic Stagger", library: "framer-motion", category: "magnetic", description: "Attraction/repulsion stagger", spring: { stiffness: 300, damping: 20, mass: 0.5 }, cssEasing: "cubic-bezier(0.175, 0.885, 0.32, 1.275)", fmType: "spring", usesStagger: true, repeats: false, complexity: 0.5, tags: ["magnetic", "attraction", "stagger"], forbiddenFor: [] },
    { id: "fm-stagger-momentum", name: "Momentum Stagger", library: "framer-motion", category: "momentum", description: "Heavy momentum stagger", spring: { stiffness: 120, damping: 30, mass: 2.5 }, cssEasing: "cubic-bezier(0.22, 1, 0.36, 1)", fmType: "spring", usesStagger: true, repeats: false, complexity: 0.7, tags: ["momentum", "heavy", "stagger"], forbiddenFor: [] },
    { id: "fm-stagger-snap", name: "Snap Stagger", library: "framer-motion", category: "snap", description: "Magnetic snap-to stagger", spring: { stiffness: 800, damping: 50, mass: 0.5 }, cssEasing: "cubic-bezier(0.4, 0, 1, 1)", fmType: "spring", usesStagger: true, repeats: false, complexity: 0.4, tags: ["snap", "magnetic", "stagger"], forbiddenFor: [] },
    // ── Fluid Presets ───────────────────────────────────────────────────────
    { id: "fm-fluid-default", name: "Fluid Motion", library: "framer-motion", category: "fluid", description: "Liquid-like continuous flow", spring: { stiffness: 150, damping: 25, mass: 2 }, cssEasing: "cubic-bezier(0.4, 0, 0.2, 1)", fmType: "spring", usesStagger: false, repeats: false, complexity: 0.5, tags: ["fluid", "liquid", "flow"], forbiddenFor: [] },
    // ── GSAP Presets ────────────────────────────────────────────────────────
    { id: "gsap-ease-power1", name: "GSAP Power1", library: "gsap", category: "smooth", description: "Smooth, gentle easing", cssEasing: "power1.out", fmType: "tween", usesStagger: false, repeats: false, complexity: 0.2, tags: ["smooth", "gentle"], forbiddenFor: [] },
    { id: "gsap-ease-power2", name: "GSAP Power2", library: "gsap", category: "smooth", description: "Moderate easing", cssEasing: "power2.out", fmType: "tween", usesStagger: false, repeats: false, complexity: 0.3, tags: ["smooth", "moderate"], forbiddenFor: [] },
    { id: "gsap-ease-power3", name: "GSAP Power3", library: "gsap", category: "strong", description: "Strong easing with snap", cssEasing: "power3.out", fmType: "tween", usesStagger: false, repeats: false, complexity: 0.5, tags: ["strong", "snap"], forbiddenFor: [] },
    { id: "gsap-ease-power4", name: "GSAP Power4", library: "gsap", category: "strong", description: "Very strong easing", cssEasing: "power4.out", fmType: "tween", usesStagger: false, repeats: false, complexity: 0.7, tags: ["strong", "dramatic"], forbiddenFor: [] },
    { id: "gsap-ease-back", name: "GSAP Back", library: "gsap", category: "overshoot", description: "Overshoot and return", cssEasing: "back.out(1.7)", fmType: "tween", usesStagger: false, repeats: false, complexity: 0.5, tags: ["overshoot", "elastic"], forbiddenFor: [] },
    { id: "gsap-ease-elastic", name: "GSAP Elastic", library: "gsap", category: "elastic", description: "Elastic bounce easing", cssEasing: "elastic.out(1, 0.3)", fmType: "tween", usesStagger: false, repeats: false, complexity: 0.7, tags: ["elastic", "bounce"], forbiddenFor: [] },
    { id: "gsap-ease-bounce", name: "GSAP Bounce", library: "gsap", category: "bounce", description: "Bouncing ball easing", cssEasing: "bounce.out", fmType: "tween", usesStagger: false, repeats: false, complexity: 0.5, tags: ["bounce", "playful"], forbiddenFor: [] },
    { id: "gsap-ease-circ", name: "GSAP Circ", library: "gsap", category: "smooth", description: "Circular easing", cssEasing: "circ.out", fmType: "tween", usesStagger: false, repeats: false, complexity: 0.3, tags: ["smooth", "circular"], forbiddenFor: [] },
    { id: "gsap-ease-sine", name: "GSAP Sine", library: "gsap", category: "smooth", description: "Sine wave easing", cssEasing: "sine.out", fmType: "tween", usesStagger: false, repeats: false, complexity: 0.2, tags: ["smooth", "sine"], forbiddenFor: [] },
    { id: "gsap-ease-expo", name: "GSAP Expo", library: "gsap", category: "strong", description: "Exponential easing", cssEasing: "expo.out", fmType: "tween", usesStagger: false, repeats: false, complexity: 0.6, tags: ["strong", "exponential"], forbiddenFor: [] },
    { id: "gsap-ease-none", name: "GSAP Linear", library: "gsap", category: "linear", description: "No easing, linear motion", cssEasing: "none", fmType: "tween", usesStagger: false, repeats: false, complexity: 0.1, tags: ["linear", "none"], forbiddenFor: [] },
    // ── Anime.js Presets ────────────────────────────────────────────────────
    { id: "anime-ease-easeOutElastic", name: "Anime Elastic", library: "anime", category: "elastic", description: "Elastic easing from Anime.js", cssEasing: "easeOutElastic(1, .5)", fmType: "tween", usesStagger: false, repeats: false, complexity: 0.7, tags: ["elastic", "bounce"], forbiddenFor: [] },
    { id: "anime-ease-easeOutBounce", name: "Anime Bounce", library: "anime", category: "bounce", description: "Bounce easing from Anime.js", cssEasing: "easeOutBounce", fmType: "tween", usesStagger: false, repeats: false, complexity: 0.5, tags: ["bounce", "playful"], forbiddenFor: [] },
    { id: "anime-ease-easeOutExpo", name: "Anime Expo", library: "anime", category: "strong", description: "Exponential easing from Anime.js", cssEasing: "easeOutExpo", fmType: "tween", usesStagger: false, repeats: false, complexity: 0.6, tags: ["strong", "exponential"], forbiddenFor: [] },
    { id: "anime-ease-easeOutCirc", name: "Anime Circ", library: "anime", category: "smooth", description: "Circular easing from Anime.js", cssEasing: "easeOutCirc", fmType: "tween", usesStagger: false, repeats: false, complexity: 0.3, tags: ["smooth", "circular"], forbiddenFor: [] },
    { id: "anime-ease-easeOutBack", name: "Anime Back", library: "anime", category: "overshoot", description: "Overshoot easing from Anime.js", cssEasing: "easeOutBack(1.7)", fmType: "tween", usesStagger: false, repeats: false, complexity: 0.5, tags: ["overshoot", "elastic"], forbiddenFor: [] },
    { id: "anime-ease-easeInOutQuad", name: "Anime Quad", library: "anime", category: "smooth", description: "Quadratic easing from Anime.js", cssEasing: "easeInOutQuad", fmType: "tween", usesStagger: false, repeats: false, complexity: 0.3, tags: ["smooth", "quadratic"], forbiddenFor: [] },
    { id: "anime-ease-easeInOutCubic", name: "Anime Cubic", library: "anime", category: "smooth", description: "Cubic easing from Anime.js", cssEasing: "easeInOutCubic", fmType: "tween", usesStagger: false, repeats: false, complexity: 0.4, tags: ["smooth", "cubic"], forbiddenFor: [] },
    { id: "anime-ease-easeInOutQuart", name: "Anime Quart", library: "anime", category: "strong", description: "Quartic easing from Anime.js", cssEasing: "easeInOutQuart", fmType: "tween", usesStagger: false, repeats: false, complexity: 0.5, tags: ["strong", "quartic"], forbiddenFor: [] },
    { id: "anime-ease-easeInOutQuint", name: "Anime Quint", library: "anime", category: "strong", description: "Quintic easing from Anime.js", cssEasing: "easeInOutQuint", fmType: "tween", usesStagger: false, repeats: false, complexity: 0.6, tags: ["strong", "quintic"], forbiddenFor: [] },
    // ── Motion One Presets ──────────────────────────────────────────────────
    { id: "motion-spring-default", name: "Motion Spring", library: "motion-one", category: "spring", description: "Spring physics from Motion One", spring: { stiffness: 400, damping: 30, mass: 1 }, cssEasing: "cubic-bezier(0.34, 1.56, 0.64, 1)", fmType: "spring", usesStagger: false, repeats: false, complexity: 0.3, tags: ["spring", "natural"], forbiddenFor: [] },
    { id: "motion-spring-gentle", name: "Motion Gentle", library: "motion-one", category: "spring", description: "Gentle spring from Motion One", spring: { stiffness: 200, damping: 25, mass: 1.5 }, cssEasing: "cubic-bezier(0.25, 0.1, 0.25, 1)", fmType: "spring", usesStagger: false, repeats: false, complexity: 0.2, tags: ["spring", "gentle"], forbiddenFor: [] },
    { id: "motion-spring-bouncy", name: "Motion Bouncy", library: "motion-one", category: "spring", description: "Bouncy spring from Motion One", spring: { stiffness: 600, damping: 12, mass: 0.8 }, cssEasing: "cubic-bezier(0.34, 1.56, 0.64, 1)", fmType: "spring", usesStagger: false, repeats: false, complexity: 0.5, tags: ["spring", "bouncy"], forbiddenFor: [] },
    // ── Popmotion Physics Presets ───────────────────────────────────────────
    { id: "popmotion-spring-default", name: "Popmotion Spring", library: "popmotion", category: "spring", description: "Raw spring physics from Popmotion", spring: { stiffness: 400, damping: 30, mass: 1 }, cssEasing: "cubic-bezier(0.34, 1.56, 0.64, 1)", fmType: "spring", usesStagger: false, repeats: false, complexity: 0.3, tags: ["spring", "physics"], forbiddenFor: [] },
    { id: "popmotion-decay-default", name: "Popmotion Decay", library: "popmotion", category: "decay", description: "Exponential slow-down from Popmotion", inertia: { velocity: 600, power: 0.4, timeConstant: 200 }, cssEasing: "cubic-bezier(0.25, 0.1, 0.25, 1)", fmType: "inertia", usesStagger: false, repeats: false, complexity: 0.4, tags: ["decay", "slowdown"], forbiddenFor: [] },
    { id: "popmotion-inertia-default", name: "Popmotion Inertia", library: "popmotion", category: "inertia", description: "Momentum-based from Popmotion", inertia: { velocity: 800, power: 0.8, timeConstant: 350 }, cssEasing: "cubic-bezier(0.25, 0.1, 0.25, 1)", fmType: "inertia", usesStagger: false, repeats: false, complexity: 0.5, tags: ["inertia", "momentum"], forbiddenFor: [] },
    // ── CSS-Only Presets ────────────────────────────────────────────────────
    { id: "css-none", name: "None", library: "css", category: "none", description: "No animation, static", cssEasing: "linear", fmType: "none", usesStagger: false, repeats: false, complexity: 0.0, tags: ["none", "static"], forbiddenFor: [] },
    { id: "css-step", name: "Step", library: "css", category: "step", description: "Discrete state jumps", cssEasing: "steps(1)", fmType: "none", usesStagger: false, repeats: false, complexity: 0.2, tags: ["step", "mechanical"], forbiddenFor: [] },
    { id: "css-ease", name: "CSS Ease", library: "css", category: "smooth", description: "Standard CSS ease", cssEasing: "ease", fmType: "tween", usesStagger: false, repeats: false, complexity: 0.1, tags: ["smooth", "standard"], forbiddenFor: [] },
    { id: "css-ease-in-out", name: "CSS Ease In Out", library: "css", category: "smooth", description: "CSS ease in out", cssEasing: "ease-in-out", fmType: "tween", usesStagger: false, repeats: false, complexity: 0.2, tags: ["smooth", "ease-in-out"], forbiddenFor: [] },
    { id: "css-ease-out", name: "CSS Ease Out", library: "css", category: "smooth", description: "CSS ease out", cssEasing: "ease-out", fmType: "tween", usesStagger: false, repeats: false, complexity: 0.2, tags: ["smooth", "ease-out"], forbiddenFor: [] },
    { id: "css-ease-in", name: "CSS Ease In", library: "css", category: "smooth", description: "CSS ease in", cssEasing: "ease-in", fmType: "tween", usesStagger: false, repeats: false, complexity: 0.2, tags: ["smooth", "ease-in"], forbiddenFor: [] },
    { id: "css-linear", name: "CSS Linear", library: "css", category: "linear", description: "Linear motion", cssEasing: "linear", fmType: "tween", usesStagger: false, repeats: false, complexity: 0.1, tags: ["linear"], forbiddenFor: [] },
];
// ── Selection Logic ──────────────────────────────────────────────────────────
/**
 * Select an animation preset based on genome values.
 * Filters by complexity and context, then picks deterministically from hash.
 */
export function selectAnimationPreset(params) {
    const { physics, complexity, context, dnaHashByte } = params;
    const eligible = ANIMATION_CATALOG.filter(p => {
        // Match physics category
        if (p.category !== physics && !(physics === "none" && p.category === "none"))
            return false;
        // Filter by complexity
        if (p.complexity > complexity + 0.2)
            return false;
        // Filter by forbidden contexts
        if (p.forbiddenFor.includes(context))
            return false;
        return true;
    });
    if (eligible.length === 0) {
        // Fallback: find any preset matching the physics category
        const fallback = ANIMATION_CATALOG.find(p => p.category === physics);
        return fallback ?? ANIMATION_CATALOG[0];
    }
    return eligible[dnaHashByte % eligible.length];
}
/**
 * Get all presets for a given physics category
 */
export function getPresetsForCategory(category) {
    return ANIMATION_CATALOG.filter(p => p.category === category);
}
/**
 * Get all available libraries
 */
export function getAvailableLibraries() {
    return [...new Set(ANIMATION_CATALOG.map(p => p.library))];
}
