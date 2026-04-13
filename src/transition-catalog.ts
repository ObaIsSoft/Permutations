/**
 * Page Transition Catalog
 *
 * 12 page-to-page transition types. Selection driven by entropy, physics,
 * and WebGL availability. Catalog describes WHAT each transition is.
 * CSS/JS generation lives in generators/transition-engine.ts.
 */

import { DesignPhilosophy } from "./genome/types.js";

// ── Transition type ───────────────────────────────────────────────────────────

export type PageTransitionType =
    | "opacity_fade"
    | "clip_wipe_right"
    | "clip_circle_expand"
    | "clip_curtain_up"
    | "css_3d_flip"
    | "color_wash"
    | "glitch_shatter"
    | "morph_blob"
    | "grid_reveal"
    | "view_transition_api"
    | "noise_dissolve"
    | "text_scramble";

// ── Catalog entry ─────────────────────────────────────────────────────────────

export interface TransitionEntry {
    type: PageTransitionType;
    description: string;
    /** Duration hint in ms — actual timing uses genome vars */
    durationHint: number;
    forbiddenFor: {
        philosophies?: DesignPhilosophy[];
        requiresPhysicsNot?: string[];
        requiresWebGL?: boolean;
        maxEntropy?: number;
        minEntropy?: number;
    };
}

export const TRANSITION_CATALOG: TransitionEntry[] = [
    {
        type: "opacity_fade",
        description: "opacity 0→1 — universal, clean, works everywhere.",
        durationHint: 300,
        forbiddenFor: {},
    },
    {
        type: "view_transition_api",
        description: "Native document.startViewTransition() — browser-native, progressively enhanced.",
        durationHint: 400,
        forbiddenFor: {
            requiresPhysicsNot: ["none"],
        },
    },
    {
        type: "clip_wipe_right",
        description: "clip-path: inset(0 100% 0 0) → inset(0 0 0 0) — horizontal reveal.",
        durationHint: 600,
        forbiddenFor: {
            requiresPhysicsNot: ["none"],
            philosophies: ["minimalist"],
            minEntropy: 0.30,
        },
    },
    {
        type: "clip_curtain_up",
        description: "clip-path: inset(100% 0 0) → inset(0 0 0) — curtain rises from bottom.",
        durationHint: 700,
        forbiddenFor: {
            requiresPhysicsNot: ["none"],
            minEntropy: 0.35,
        },
    },
    {
        type: "clip_circle_expand",
        description: "clip-path: circle(0%) → circle(150%) — radial reveal from click point.",
        durationHint: 600,
        forbiddenFor: {
            requiresPhysicsNot: ["none"],
            minEntropy: 0.40,
        },
    },
    {
        type: "css_3d_flip",
        description: "perspective(1200px) rotateY(90deg) → rotateY(0) — card flip.",
        durationHint: 800,
        forbiddenFor: {
            requiresPhysicsNot: ["none"],
            minEntropy: 0.45,
            philosophies: ["minimalist", "swiss_grid"],
        },
    },
    {
        type: "color_wash",
        description: "Full-screen colour floods then drains — brand moment between pages.",
        durationHint: 900,
        forbiddenFor: {
            requiresPhysicsNot: ["none"],
            minEntropy: 0.40,
            philosophies: ["minimalist"],
        },
    },
    {
        type: "morph_blob",
        description: "border-radius: 50% scale(0.8) → normal — organic emergence.",
        durationHint: 700,
        forbiddenFor: {
            requiresPhysicsNot: ["none"],
            minEntropy: 0.50,
            philosophies: ["minimalist", "swiss_grid", "technical"],
        },
    },
    {
        type: "grid_reveal",
        description: "Grid cells stagger in — structured emergence.",
        durationHint: 1000,
        forbiddenFor: {
            requiresPhysicsNot: ["none"],
            minEntropy: 0.45,
            philosophies: ["minimalist"],
        },
    },
    {
        type: "glitch_shatter",
        description: "Glitch clip-path split on exit — digital disintegration.",
        durationHint: 600,
        forbiddenFor: {
            requiresPhysicsNot: ["glitch"],
            minEntropy: 0.65,
        },
    },
    {
        type: "text_scramble",
        description: "Title scrambles on exit, reforms on entry — language as transition.",
        durationHint: 800,
        forbiddenFor: {
            requiresPhysicsNot: ["none"],
            minEntropy: 0.55,
            philosophies: ["minimalist", "swiss_grid"],
        },
    },
    {
        type: "noise_dissolve",
        description: "Shader noise threshold dissolve — requires WebGL.",
        durationHint: 1000,
        forbiddenFor: {
            requiresWebGL: true,
            requiresPhysicsNot: ["none"],
            minEntropy: 0.60,
        },
    },
];

// ── Selector ──────────────────────────────────────────────────────────────────

export function getTransitionEntry(type: PageTransitionType): TransitionEntry {
    return TRANSITION_CATALOG.find(t => t.type === type) ?? TRANSITION_CATALOG[0];
}

export function selectPageTransition(opts: {
    philosophy: DesignPhilosophy;
    entropy: number;
    physics: string;
    hasWebGL: boolean;
}): PageTransitionType {
    const { philosophy, entropy, physics, hasWebGL } = opts;

    // Zero entropy or physics:none → opacity_fade or view_transition_api
    if (entropy < 0.25 || physics === "none") {
        return "opacity_fade";
    }

    // minimalist → opacity_fade
    if (philosophy === "minimalist") return "opacity_fade";

    // Glitch physics → glitch_shatter
    if (physics === "glitch" && entropy > 0.65) return "glitch_shatter";

    // WebGL + high entropy → noise_dissolve
    if (hasWebGL && entropy > 0.60) return "noise_dissolve";

    // High entropy
    if (entropy > 0.70) {
        if (philosophy === "chaotic") return "grid_reveal";
        if (philosophy === "expressive" || philosophy === "brand_heavy") return "color_wash";
    }

    // Mid entropy
    if (entropy > 0.50) {
        if (philosophy === "editorial") return "clip_curtain_up";
        if (philosophy === "technical") return "view_transition_api";
        return "clip_wipe_right";
    }

    // Low-mid entropy
    if (entropy > 0.30) return "clip_wipe_right";

    return "view_transition_api";
}
