/**
 * Scroll Catalog
 *
 * Maps genome scroll behavior to a concrete scroll technique.
 * Each technique generates different JS/CSS for the scroll experience.
 *
 * Catalog entries describe WHAT each technique is. Code generation
 * lives in generators/scroll-engine.ts.
 */
export const SCROLL_CATALOG = [
    {
        technique: "native",
        description: "Plain browser scroll — no JS, maximum performance, zero dependencies.",
        requires: [],
        forbiddenFor: {},
    },
    {
        technique: "css_scroll_driven",
        description: "animation-timeline: scroll() natively — zero JS, browser-native progress.",
        requires: [],
        forbiddenFor: {
            requiresPhysicsNot: ["none"],
        },
    },
    {
        technique: "lenis_basic",
        description: "Lenis smooth scroll + RAF loop — inertia without GSAP.",
        requires: ["lenis"],
        forbiddenFor: {
            requiresPhysicsNot: ["none"],
            philosophies: ["minimalist"],
        },
    },
    {
        technique: "lenis_gsap_scrub",
        description: "Lenis + GSAP ScrollTrigger with scrub — timeline-driven section reveals.",
        requires: ["lenis", "gsap"],
        forbiddenFor: {
            requiresPhysicsNot: ["none"],
            requiresScrollBehavior: ["parallax", "continuous"],
            philosophies: ["minimalist", "swiss_grid"],
        },
    },
    {
        technique: "lenis_gsap_pin",
        description: "Lenis + GSAP pinned sections — horizontal or depth reveal.",
        requires: ["lenis", "gsap"],
        forbiddenFor: {
            requiresPhysicsNot: ["none"],
            requiresScrollBehavior: ["paginated", "parallax"],
            minSectionCount: 5,
        },
    },
    {
        technique: "scroll_snap_v",
        description: "scroll-snap-type: y mandatory — full-screen snap sections.",
        requires: [],
        forbiddenFor: {
            requiresScrollBehavior: ["snap", "paginated"],
        },
    },
    {
        technique: "scroll_snap_h",
        description: "scroll-snap-type: x mandatory — horizontal snap carousel.",
        requires: [],
        forbiddenFor: {
            requiresScrollBehavior: ["paginated"],
            philosophies: ["minimalist", "swiss_grid"],
        },
    },
    {
        technique: "gsap_horizontal",
        description: "GSAP pinned horizontal scroll — layout pinned, content scrolls right.",
        requires: ["gsap"],
        forbiddenFor: {
            requiresPhysicsNot: ["none"],
            philosophies: ["minimalist", "swiss_grid"],
        },
    },
    {
        technique: "parallax_layers",
        description: "Multi-depth data-rellax-speed strata moving at different rates.",
        requires: ["rellax"],
        forbiddenFor: {
            requiresScrollBehavior: ["parallax"],
            requiresPhysicsNot: ["none"],
            philosophies: ["minimalist"],
        },
    },
    {
        technique: "velocity_distort",
        description: "Scroll velocity drives uVelocity uniform in WebGL — visual warp on speed.",
        requires: ["gsap"],
        forbiddenFor: {
            requiresPhysicsNot: ["none"],
            requiresWebGL: true,
        },
    },
];
// ── Selector ──────────────────────────────────────────────────────────────────
export function getScrollEntry(technique) {
    return SCROLL_CATALOG.find(s => s.technique === technique) ?? SCROLL_CATALOG[0];
}
/**
 * Select the scroll technique for a genome given its constraints.
 */
export function selectScrollTechnique(opts) {
    const { philosophy, physics, scrollBehavior, sectionCount, hasWebGL } = opts;
    // physics:none → css_scroll_driven or native
    if (physics === "none") {
        if (scrollBehavior === "snap" || scrollBehavior === "paginated")
            return "scroll_snap_v";
        return "css_scroll_driven";
    }
    // minimalist → native
    if (philosophy === "minimalist")
        return "native";
    // snap / paginated
    if (scrollBehavior === "snap" || scrollBehavior === "paginated")
        return "scroll_snap_v";
    // WebGL + velocity
    if (hasWebGL && physics !== "none")
        return "velocity_distort";
    // parallax
    if (scrollBehavior === "parallax") {
        return sectionCount >= 5 ? "lenis_gsap_pin" : "lenis_gsap_scrub";
    }
    // continuous
    if (scrollBehavior === "continuous")
        return "lenis_gsap_scrub";
    return "lenis_basic";
}
