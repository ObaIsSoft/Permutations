/**
 * Animation Library Catalog
 *
 * Chromosome-driven animation library selection — mirrors the sector color system.
 *
 * Philosophy: forbiddenFor defines what is psychologically WRONG for a library.
 * The genome hash selects freely from all remaining eligible libraries.
 * Same approach as sector forbidden hue ranges — no whitelist, only exclusions.
 *
 * A library with empty forbiddenFor is valid for EVERY genome.
 * A library excluded for certain physics/sectors won't appear for those contexts.
 * The hash byte then picks deterministically from the eligible pool.
 */

import type { MotionPhysics } from "./genome/types.js";

// ── Animation style taxonomy ──────────────────────────────────────────────────

export type AnimationStyle =
    | "css"          // Pure CSS, zero JS — class-based or keyframe
    | "spring"       // Physics spring simulation — natural, organic motion
    | "timeline"     // Sequence/timeline orchestration — precise, cinematic
    | "scroll"       // Scroll-driven reveal and parallax
    | "gesture"      // Pointer/touch interaction driven
    | "lottie"       // After Effects JSON playback — illustration animation
    | "3d";          // Three.js / WebGL spatial animation

// ── Choreography style ────────────────────────────────────────────────────────

export type ChoreographyStyle =
    | "elegant"      // Slow, refined, minimal — luxury, editorial
    | "energetic"    // Fast, punchy, bold — gaming, sports, crypto
    | "smooth"       // Continuous, flowing — healthcare, SaaS
    | "snappy"       // Quick, precise — fintech, productivity
    | "dramatic";    // Theatrical, high-impact — entertainment, fashion

// ── Library catalog ───────────────────────────────────────────────────────────

export interface AnimationLibraryEntry {
    name: string;
    package: string;
    reactPackage?: string;
    cdn: string;
    style: AnimationStyle;
    bundleSize: string;
    license: "MIT" | "commercial" | "ISC";
    description: string;
    choreography: ChoreographyStyle[];  // informational — used in format output
    importExample: string;
    usageExample: string;
    deps: string[];
    /**
     * What this library is WRONG for — same philosophy as sector forbiddenRanges.
     * The hash picks freely from all libraries NOT excluded by these conditions.
     * Empty object = valid for every genome.
     */
    forbiddenFor: {
        /** WRONG for these physics styles — fundamental mismatch in animation model */
        physics?: MotionPhysics[];
        /** WRONG for these sectors — psychological mismatch */
        sectors?: string[];
        /** WRONG when complexity exceeds this value (0.0–1.0) */
        complexityAbove?: number;
        /** WRONG when complexity is below this value (0.0–1.0) */
        complexityBelow?: number;
    };
}

export const ANIMATION_CATALOG: AnimationLibraryEntry[] = [

    // ── CSS / Declarative ─────────────────────────────────────────────────────
    {
        name: "Animate.css",
        package: "animate.css",
        cdn: "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css",
        style: "css",
        bundleSize: "~78kb",
        license: "MIT",
        description: "80+ ready-to-use CSS animations via class names — zero JS, instant integration",
        choreography: ["snappy", "energetic"],
        importExample: `import "animate.css";`,
        usageExample: `<div class="animate__animated animate__fadeInUp">...</div>`,
        deps: [],
        // CSS class animations can't simulate spring/physics — wrong model
        forbiddenFor: {
            physics: ["spring", "elastic", "inertia", "magnetic", "particle", "fluid", "chaos", "orbital", "bounce", "harmonic", "momentum", "decay"],
            complexityAbove: 0.70,
        },
    },
    {
        name: "Motion One",
        package: "motion",
        reactPackage: "motion",
        cdn: "https://cdn.jsdelivr.net/npm/motion@latest/dist/motion.js",
        style: "css",
        bundleSize: "~3.8kb",
        license: "MIT",
        description: "Web Animations API wrapper — standards-based, near-zero bundle cost, hardware accelerated",
        choreography: ["smooth", "snappy", "elegant"],
        importExample: `import { animate, inView, scroll } from "motion";`,
        usageExample: `animate(".card", { opacity: [0, 1], y: [20, 0] }, { duration: 0.4, easing: [0.25, 0.1, 0.25, 1] });`,
        deps: [],
        // WAA doesn't support physics-spring simulation
        forbiddenFor: {
            physics: ["spring", "elastic", "inertia", "magnetic", "particle"],
        },
    },
    {
        name: "Hover.css",
        package: "hover.css",
        cdn: "https://cdnjs.cloudflare.com/ajax/libs/hover.css/2.3.1/css/hover-min.css",
        style: "css",
        bundleSize: "~20kb",
        license: "MIT",
        description: "CSS hover effect collection — 100+ effects, pure CSS micro-interactions",
        choreography: ["smooth", "elegant"],
        importExample: `import "hover.css";`,
        usageExample: `<button class="hvr-grow">Hover me</button>`,
        deps: [],
        // Hover-only CSS — wrong for interactive physics and complex apps
        forbiddenFor: {
            physics: ["spring", "glitch", "magnetic", "inertia", "elastic", "particle", "fluid", "chaos", "orbital", "bounce", "harmonic", "momentum", "decay"],
            complexityAbove: 0.50,
        },
    },

    // ── Spring / Physics ──────────────────────────────────────────────────────
    {
        name: "Framer Motion",
        package: "framer-motion",
        reactPackage: "framer-motion",
        cdn: "https://cdn.jsdelivr.net/npm/framer-motion@latest/dist/framer-motion.js",
        style: "spring",
        bundleSize: "~50kb",
        license: "MIT",
        description: "React-first production-grade animation — spring physics, gesture recognition, layout animation",
        choreography: ["elegant", "smooth", "energetic"],
        importExample: `import { motion, AnimatePresence } from "framer-motion";`,
        usageExample: `<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 24 }} />`,
        deps: ["react"],
        // Wrong only for zero-animation designs — everything else is valid
        forbiddenFor: {
            physics: ["none"],
        },
    },
    {
        name: "react-spring",
        package: "@react-spring/web",
        reactPackage: "@react-spring/web",
        cdn: "https://cdn.jsdelivr.net/npm/@react-spring/web@latest",
        style: "spring",
        bundleSize: "~40kb",
        license: "MIT",
        description: "Headless physics spring system — interpolates any value, framework-agnostic logic",
        choreography: ["smooth", "elegant", "snappy"],
        importExample: `import { useSpring, animated } from "@react-spring/web";`,
        usageExample: `const springs = useSpring({ from: { opacity: 0 }, to: { opacity: 1 }, config: { tension: 280, friction: 60 } });`,
        deps: ["react"],
        // Spring lib — wrong for zero-animation, rigid-step, or glitch paradigms
        forbiddenFor: {
            physics: ["none", "step", "glitch"],
        },
    },
    {
        name: "Popmotion",
        package: "popmotion",
        cdn: "https://cdn.jsdelivr.net/npm/popmotion@latest",
        style: "spring",
        bundleSize: "~12kb",
        license: "MIT",
        description: "Low-level animation primitives — tween, spring, decay; the engine under Framer Motion",
        choreography: ["snappy", "smooth"],
        importExample: `import { spring, animate } from "popmotion";`,
        usageExample: `spring({ from: 0, to: 100, stiffness: 300, damping: 20 }).start(v => el.style.transform = \`translateY(\${v}px)\`);`,
        deps: [],
        // Spring primitives — wrong for static or glitch designs
        forbiddenFor: {
            physics: ["none", "glitch"],
        },
    },

    // ── Timeline / Orchestration ──────────────────────────────────────────────
    {
        name: "GSAP",
        package: "gsap",
        cdn: "https://cdn.jsdelivr.net/npm/gsap@latest/dist/gsap.min.js",
        style: "timeline",
        bundleSize: "~30kb core + plugins",
        license: "commercial",
        description: "Industry-standard animation platform — ScrollTrigger, SplitText, MorphSVG; the professional choice",
        choreography: ["dramatic", "elegant", "energetic", "smooth"],
        importExample: `import gsap from "gsap"; import { ScrollTrigger } from "gsap/ScrollTrigger";`,
        usageExample: `gsap.timeline().from(".hero", { opacity: 0, y: 60, duration: 1, ease: "power3.out" }).from(".nav", { opacity: 0, duration: 0.4 }, "-=0.6");`,
        deps: [],
        // Timeline lib — wrong for spring physics (use Framer Motion / react-spring instead)
        forbiddenFor: {
            physics: ["spring"],
        },
    },
    {
        name: "Anime.js",
        package: "animejs",
        cdn: "https://cdn.jsdelivr.net/npm/animejs@latest/lib/anime.min.js",
        style: "timeline",
        bundleSize: "~17kb",
        license: "MIT",
        description: "Lightweight timeline orchestrator — SVG morphing, path animation, stagger control",
        choreography: ["elegant", "smooth", "dramatic"],
        importExample: `import anime from "animejs";`,
        usageExample: `anime.timeline({ easing: "easeOutExpo" }).add({ targets: ".element", translateX: 250, duration: 800 }).add({ targets: ".element", scale: 2, duration: 800 }, "-=600");`,
        deps: [],
        // Timeline lib — wrong for interactive physics (spring/gesture)
        forbiddenFor: {
            physics: ["spring", "magnetic", "inertia"],
        },
    },
    {
        name: "Theatre.js",
        package: "@theatre/core",
        reactPackage: "@theatre/react",
        cdn: "https://cdn.jsdelivr.net/npm/@theatre/core@latest",
        style: "timeline",
        bundleSize: "~100kb",
        license: "MIT",
        description: "Professional animation studio tooling — visual editor, sequencer, Three.js integration",
        choreography: ["dramatic", "elegant"],
        importExample: `import { getProject, types } from "@theatre/core";`,
        usageExample: `const project = getProject("MyProject"); const sheet = project.sheet("Main"); const obj = sheet.object("Box", { x: types.number(0) });`,
        deps: [],
        // Studio tooling — wrong for spring physics and simple products (massive overkill)
        forbiddenFor: {
            physics: ["spring"],
            complexityBelow: 0.50,
        },
    },

    // ── Scroll-driven ─────────────────────────────────────────────────────────
    {
        name: "AOS",
        package: "aos",
        cdn: "https://cdn.jsdelivr.net/npm/aos@latest/dist/aos.css",
        style: "scroll",
        bundleSize: "~13kb",
        license: "MIT",
        description: "Animate on scroll — dead-simple data-attribute API, 20+ preset animations",
        choreography: ["smooth", "snappy"],
        importExample: `import AOS from "aos"; import "aos/dist/aos.css"; AOS.init();`,
        usageExample: `<div data-aos="fade-up" data-aos-duration="800" data-aos-delay="100">...</div>`,
        deps: [],
        // Scroll-reveal only — wrong for interactive/physics-driven animation styles
        forbiddenFor: {
            physics: ["spring", "magnetic", "inertia", "elastic", "glitch", "fluid", "chaos", "particle"],
        },
    },
    {
        name: "ScrollReveal",
        package: "scrollreveal",
        cdn: "https://cdn.jsdelivr.net/npm/scrollreveal@latest/dist/scrollreveal.min.js",
        style: "scroll",
        bundleSize: "~5kb",
        license: "commercial",
        description: "Minimal scroll reveal with clean configuration API — easy, flexible, lightweight",
        choreography: ["smooth", "elegant"],
        importExample: `import ScrollReveal from "scrollreveal";`,
        usageExample: `ScrollReveal().reveal(".section", { distance: "30px", origin: "bottom", duration: 800, interval: 100 });`,
        deps: [],
        // Scroll-reveal only — wrong for interactive physics
        forbiddenFor: {
            physics: ["spring", "magnetic", "inertia", "elastic", "glitch", "fluid", "chaos", "particle"],
        },
    },
    {
        name: "Auto-Animate",
        package: "@formkit/auto-animate",
        reactPackage: "@formkit/auto-animate",
        cdn: "https://cdn.jsdelivr.net/npm/@formkit/auto-animate@latest",
        style: "scroll",
        bundleSize: "~2.3kb",
        license: "MIT",
        description: "Zero-config list/DOM transition animations — add/remove/reorder with one line",
        choreography: ["smooth", "snappy"],
        importExample: `import autoAnimate from "@formkit/auto-animate";`,
        usageExample: `const parent = useRef(null); useAutoAnimate(parent); // done — all child changes animate automatically`,
        deps: [],
        // Zero-config — wrong for high-physics-expressiveness contexts
        forbiddenFor: {
            physics: ["glitch", "magnetic", "chaos", "fluid", "particle"],
        },
    },

    // ── Lottie / Rich Illustration ────────────────────────────────────────────
    {
        name: "Lottie Web",
        package: "lottie-web",
        reactPackage: "@lottiefiles/react-lottie-player",
        cdn: "https://cdn.jsdelivr.net/npm/lottie-web@latest/build/player/lottie.min.js",
        style: "lottie",
        bundleSize: "~260kb / ~58kb light",
        license: "MIT",
        description: "After Effects JSON animation playback — complex illustration animation, brand storytelling",
        choreography: ["elegant", "dramatic", "smooth"],
        importExample: `import Lottie from "@lottiefiles/react-lottie-player";`,
        usageExample: `<Player autoplay loop src="https://assets.lottiefiles.com/animation.json" style={{ height: "300px" }} />`,
        deps: [],
        // JSON playback — wrong for interactive physics (it plays pre-authored animations)
        forbiddenFor: {
            physics: ["spring", "magnetic", "inertia", "elastic"],
        },
    },

    // ── 3D / WebGL ────────────────────────────────────────────────────────────
    {
        name: "Three.js",
        package: "three",
        reactPackage: "@react-three/fiber",
        cdn: "https://cdn.jsdelivr.net/npm/three@latest/build/three.min.js",
        style: "3d",
        bundleSize: "~160kb",
        license: "MIT",
        description: "WebGL 3D scene graph — the foundation for spatial/immersive web experiences",
        choreography: ["dramatic", "elegant"],
        importExample: `import * as THREE from "three"; // or: import { Canvas } from "@react-three/fiber";`,
        usageExample: `const mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({ color: 0x3b82f6 })); scene.add(mesh);`,
        deps: [],
        // 3D WebGL — wrong for simple low-complexity products (massive overkill)
        forbiddenFor: {
            complexityBelow: 0.50,
        },
    },
    {
        name: "use-gesture",
        package: "@use-gesture/react",
        reactPackage: "@use-gesture/react",
        cdn: "https://cdn.jsdelivr.net/npm/@use-gesture/react@latest",
        style: "gesture",
        bundleSize: "~15kb",
        license: "MIT",
        description: "Pointer/touch/scroll/drag gesture bindings — pairs with react-spring or Framer Motion",
        choreography: ["energetic", "snappy", "smooth"],
        importExample: `import { useDrag, useScroll } from "@use-gesture/react";`,
        usageExample: `const bind = useDrag(({ offset: [x, y] }) => api.start({ x, y })); return <animated.div {...bind()} style={springs} />;`,
        deps: ["react"],
        // Gesture lib — wrong for zero-animation and mechanical-step designs
        forbiddenFor: {
            physics: ["none", "step"],
        },
    },
];

// ── Selection logic ───────────────────────────────────────────────────────────

/**
 * Select animation library using exclude logic — same philosophy as sector forbidden hue ranges.
 *
 * 1. Filter out libraries that are psychologically WRONG for this genome's context.
 * 2. Pick deterministically from the eligible pool using dnaHashByte.
 *
 * Every library not explicitly forbidden is a valid candidate.
 * The hash ensures variety — different seeds pick different libraries from the same eligible pool.
 */
export function selectAnimationLibrary(params: {
    physics: MotionPhysics;
    sector: string;
    complexity: number;     // 0.0–1.0 from complexityAnalyzer
    dnaHashByte: number;    // deterministic pick from eligible pool
}): AnimationLibraryEntry {
    const { physics, sector, complexity, dnaHashByte } = params;

    const eligible = ANIMATION_CATALOG.filter(lib => {
        const f = lib.forbiddenFor;
        if (f.physics?.includes(physics)) return false;
        if (f.sectors?.includes(sector)) return false;
        if (f.complexityAbove !== undefined && complexity > f.complexityAbove) return false;
        if (f.complexityBelow !== undefined && complexity < f.complexityBelow) return false;
        return true;
    });

    // Fallback: if all excluded (shouldn't happen), use full catalog
    const pool = eligible.length > 0 ? eligible : ANIMATION_CATALOG;

    return pool[dnaHashByte % pool.length];
}

/**
 * Format the animation library selection as a CSS comment block
 * for inclusion in the generated CSS output.
 */
export function formatAnimationLibraryNote(lib: AnimationLibraryEntry): string {
    return `/* ── Animation Library ───────────────────────────────────────
   Library  : ${lib.name}
   Style    : ${lib.style} — ${lib.description}
   Package  : ${lib.package}${lib.reactPackage && lib.reactPackage !== lib.package ? `\n   React    : ${lib.reactPackage}` : ""}
   Size     : ${lib.bundleSize}
   License  : ${lib.license}
   Timing   : ${lib.choreography.join(", ")}

   Install  : npm install ${lib.reactPackage ?? lib.package}
   Import   : ${lib.importExample}

   Usage    :
   ${lib.usageExample}
   CDN      : ${lib.cdn}
─────────────────────────────────────────────────────────── */`;
}
