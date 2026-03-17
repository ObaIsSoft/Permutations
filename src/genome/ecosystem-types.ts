/**
 * Permutations — EcosystemGenome Type System
 *
 * Layer 2 of the SHA-256 hash chain.
 *   hash = sha256(designGenome.dnaHash)
 *   Each chromosome pair: [class byte] + [intensity byte]
 *   24 of 32 hash bytes consumed → ~75% entropy used
 *
 * Every chromosome must change something real in the output.
 * No decorative chromosomes.
 */

import type { DesignPersonality } from "./types.js";

// ── Chromosome value types ─────────────────────────────────────────────────

/** 32 biome categories — derived from 5 bits */
export type BiomeClass =
    | 'volcanic'       // harsh, mineral, high-contrast surfaces
    | 'abyssal'        // deep, pressured, dark, minimal light
    | 'arctic'         // cold-efficient, sparse, high negative space
    | 'rainforest'     // dense, layered, rich feature count
    | 'desert'         // minimal, vast spacing, heat-shimmer effects
    | 'tidal'          // rhythmic, responsive, oscillating patterns
    | 'alpine'         // precise, high-altitude, clean edges
    | 'cave'           // enclosed, layered depth, bioluminescent accents
    | 'hydrothermal'   // reactive, warm-to-cool gradients, high energy
    | 'steppe'         // flat, wide, open-range scalability
    | 'wetland'        // composite, layered, hybrid component patterns
    | 'reef'           // high diversity, colour-dense, shallow depth
    | 'boreal'         // structured, repeating, tree-like hierarchy
    | 'savanna'        // open, spread, wide information landscapes
    | 'mangrove'       // tangled roots, multi-level nesting patterns
    | 'urban'          // grid-dense, modular, rectilinear
    | 'jungle'         // chaotic, overgrown, dense interconnections
    | 'tundra'         // frozen, static, endurance-focused
    | 'prairie'        // vast, horizon-focused, breathing room
    | 'marsh'          // murky, transitional, boundary-blurring
    | 'coral'          // fragile, interconnected, symbiotic
    | 'kelp_forest'    // vertical, swaying, layered depth
    | 'polar'          // extreme, minimal, survival-focused
    | 'temperate'      // balanced, seasonal, moderate cycles
    | 'monsoon'        // intense bursts, rapid change, high throughput
    | 'dune'           // shifting, wind-sculpted, impermanent
    | 'oasis'          // concentrated resources in sparse context
    | 'crater'         // enclosed, focused, impact-origin
    | 'fjord'          // narrow, deep, dramatic contrast
    | 'atoll'          // circular, protective, lagoon-centered
    | 'trench'         // deepest, pressurized, hidden
    | 'astrobleme';    // ancient impact, scarred, resilient

/** How the ecosystem produces and exchanges energy — 16 sources */
export type EnergySource =
    | 'photosynthetic'   // open, generative, abundance-oriented
    | 'chemosynthetic'   // self-sufficient, internal, hidden processes
    | 'predatory'        // extractive, aggressive, acquisition-driven
    | 'decomposer'       // recycling, transformative, cyclical
    | 'parasitic'        // dependent, attached, host-reliant
    | 'mixotrophic'      // adaptive, context-switching, hybrid
    | 'thermal'          // heat-driven, gradient-powered
    | 'kinetic'          // motion-driven, event-powered
    | 'electric'         // spark-driven, high-voltage bursts
    | 'magnetic'         // field-aligned, pull-oriented
    | 'gravitational'    // weight-driven, potential energy
    | 'nuclear'          // intense, high-output, chain-reactive
    | 'quantum'          // probabilistic, uncertainty-based
    | 'sonic'            // vibration-driven, resonance-powered
    | 'crystalline'      // structured, lattice-organized
    | 'void';            // absence-driven, negative-space powered

/** How organisms relate to and depend on each other — 16 patterns */
export type SymbiosisPattern =
    | 'mutualistic'      // both benefit — tightly coupled, collaborative
    | 'commensal'        // one benefits, one neutral — loose coupling
    | 'parasitic'        // one benefits at other's cost — extraction
    | 'competitive'      // both compete — minimal shared interface
    | 'neutral'          // independent — modular, decoupled
    | 'allelopathic'     // one inhibits others — exclusive, gatekeeping
    | 'amensalism'       // one harmed, one neutral
    | 'antagonistic'     // active opposition, destructive
    | 'cooperative'      // loose collaboration, shared goals
    | 'colonial'         // collective organism, shared identity
    | 'dominant'         // master-slave hierarchy
    | 'facultative'      // optional relationship, conditional
    | 'obligate'         // mandatory relationship, dependent
    | 'protective'       // shielding, defensive alliance
    | 'scavenging'       // secondary beneficiary of waste
    | 'epiphytic';       // surface-mounted, non-intrusive

/** How energy and information flows — 16 structures */
export type TrophicStructure =
    | 'bottom-up'        // atomic drives whole — data feeds up
    | 'top-down'         // orchestrators drive atoms — command flows down
    | 'cascade'          // event chain — one change ripples through all
    | 'web'              // graph — every organism connects to many others
    | 'linear'           // strict pipeline — A → B → C, no branching
    | 'detrital'         // decomposition-based — recycle, reuse, transform
    | 'hub_spoke'        // central node, radial connections
    | 'mesh'             // redundant multi-path connections
    | 'star'             // single center, no inter-node links
    | 'ring'             // circular, cyclic dependencies
    | 'tree'             // hierarchical, parent-child
    | 'dag'              // directed acyclic, no cycles
    | 'fully_connected'  // every node connects to every other
    | 'small_world'      // local clusters, global shortcuts
    | 'scale_free'       // power-law distribution, hub-heavy
    | 'random';          // stochastic connections, no pattern

/** Ecological succession — 12 stages */
export type SuccessionStage =
    | 'pioneer'        // bare substrate, first arrivals, minimal structure
    | 'early'          // colonisation underway, sparse, fast-changing
    | 'mid'            // establishing, moderate complexity, stabilising
    | 'climax'         // mature, stable, high diversity, slow change
    | 'post-climax'    // old-growth, maximum complexity, slow decay
    | 'disturbed'      // recovering from disruption, chaotic, rebuilding
    | 'degraded'       // declining, resource-depleted
    | 'renascent'      // rebirth, new growth from ashes
    | 'stable'         // equilibrium, balanced inputs/outputs
    | 'cyclic'         // seasonal/repeating patterns
    | 'chaotic'        // unpredictable, non-linear dynamics
    | 'frozen';        // static, preserved, no change

/** Environmental pressure adaptations — 16 axes */
export type AdaptationAxis =
    | 'thermal'          // temperature extremes — performance, efficiency
    | 'pressure'         // high-load, compressed environments
    | 'chemical'         // reactive, data-rich, transformation focus
    | 'radiation'        // high-exposure, visibility-first
    | 'temporal'         // time-sensitive, urgency-driven
    | 'gravitational'    // weight, hierarchy, elevation-conscious
    | 'electric'         // shock-resistant, conductive
    | 'magnetic'         // field-sensitive, aligned
    | 'sonic'            // vibration-adapted, resonant
    | 'optic'            // light-sensitive, visual-acuity
    | 'tactile'          // touch-responsive, haptic
    | 'kinetic'          // motion-adapted, momentum-based
    | 'social'           // interaction-optimized, collaborative
    | 'cognitive'        // complexity-adapted, learning
    | 'competitive'      // rivalrous, edge-seeking
    | 'symbiotic';       // cooperation-optimized, mutualistic

/** Spatial distribution patterns — 16 types */
export type PopulationPattern =
    | 'sparse'           // few, spread, high breathing room
    | 'clustered'        // grouped, hub-and-spoke, focal points
    | 'gradient'         // density changes smoothly across the surface
    | 'fractal'          // self-similar at every scale
    | 'uniform'          // evenly distributed, grid-like
    | 'stratified'       // layered bands, distinct zones
    | 'random'           // stochastic placement
    | 'regular'          // evenly spaced intervals
    | 'aggregated'       // clumped, patchy distribution
    | 'dispersed'        // actively spread out
    | 'colonial'         // clustered around origin points
    | 'linear'           // arranged in lines or strips
    | 'radial'           // circular arrangement from center
    | 'checkerboard'     // alternating occupied/empty
    | 'network'          // connected node distribution
    | 'percolated';      // near-critical connectivity

/** Temporal activity rhythms — 16 types */
export type TemporalRhythm =
    | 'diurnal'          // active in light — light-mode primary
    | 'nocturnal'        // active in dark — dark-mode primary
    | 'tidal'            // oscillating, bidirectional, rhythmic
    | 'seasonal'         // periodic, batch-cycle updates
    | 'continuous'       // always active, real-time, no rest state
    | 'crepuscular'      // active at dawn/dusk, twilight-focused
    | 'cathemeral'       // irregular activity throughout day
    | 'circadian'        // ~24 hour internal cycle
    | 'ultradian'        // cycles shorter than 24 hours
    | 'infradian'        // cycles longer than 24 hours
    | 'arhythmic'        // no discernible pattern
    | 'pulsed'           // burst activity, then rest
    | 'aperiodic'        // random timing
    | 'entrained'        // synchronized to external cue
    | 'free_running'     // internal rhythm, no external sync
    | 'biphasic';        // two distinct active periods

/** Spatial axes — 16 dimensions */
export type SpatialAxis =
    | 'surface'          // top-level, above-fold primary
    | 'subsurface'       // below surface, nested, contextual
    | 'pelagic'          // mid-water, floating layers, z-depth
    | 'benthic'          // bottom-dwelling, footer, persistent chrome
    | 'terrestrial'      // ground level, full viewport
    | 'arboreal'         // tree-like, vertical hierarchy
    | 'aerial'           // above, overlay, floating
    | 'subterranean'     // deep nested, hidden underground
    | 'littoral'         // edge, boundary, transition zone
    | 'riparian'         // along flow, stream-like
    | 'montane'          // elevated, peaks and valleys
    | 'lacustrine'       // lake-like, contained bodies
    | 'estuarine'        // mixing zone, brackish
    | 'hadal'            // deepest trench levels
    | 'intertidal'       // alternating exposed/submerged
    | 'supralittoral';   // splash zone, occasionally wet

/** Carrying capacity — 16 density levels */
export type CapacityClass =
    | 'void'          // 0 organisms
    | 'single'        // 1 organism
    | 'minimal'       // 2–6 organisms
    | 'sparse'        // 7–14 organisms
    | 'sub_optimal'   // 15–19 organisms
    | 'optimal'       // 20–24 organisms
    | 'super_optimal' // 25–29 organisms
    | 'dense'         // 30–38 organisms
    | 'high_density'  // 39–49 organisms
    | 'maximal'       // 50–64 organisms
    | 'saturated'     // 65–80 organisms
    | 'supersaturated'// 81–100 organisms
    | 'extreme'       // 101–128 organisms
    | 'critical'      // 129–200 organisms
    | 'collapse_risk' // 201–500 organisms
    | 'infinite';     // 500+ organisms

// ── Chromosome structure ────────────────────────────────────────────────────

export interface EcosystemChromosomes {
    /** bytes[0,1] — biome class (16 options) + intensity (0–1) */
    eco_ch1_biome:      { class: BiomeClass;        intensity: number };
    /** bytes[2,3] — energy source + flux (0–1, high = active energy flow) */
    eco_ch2_energy:     { source: EnergySource;     flux: number };
    /** bytes[4,5] — symbiosis pattern + depth (0–1, high = tight coupling) */
    eco_ch3_symbiosis:  { pattern: SymbiosisPattern; depth: number };
    /** bytes[6,7] — trophic structure + cascade strength (0–1) */
    eco_ch4_trophic:    { structure: TrophicStructure; cascade: number };
    /** bytes[8,9] — succession stage + drift (0–1, high = unstable) */
    eco_ch5_succession: { stage: SuccessionStage;   drift: number };
    /** bytes[10,11] — adaptation axis + strength (0–1) */
    eco_ch6_adaptation: { axis: AdaptationAxis;     strength: number };
    /** bytes[12,13] — population pattern + variance (0–1) */
    eco_ch7_population: { pattern: PopulationPattern; variance: number };
    /** bytes[14,15] — temporal rhythm + intensity (0–1) */
    eco_ch8_temporal:   { rhythm: TemporalRhythm;   intensity: number };
    /** bytes[16,17] — spatial axis + isolation (0–1, high = isolated zones) */
    eco_ch9_spatial:    { axis: SpatialAxis;         isolation: number };
    /** bytes[18,19] — capacity class + pressure (0–1, high = near ceiling) */
    eco_ch10_capacity:  { class: CapacityClass;      pressure: number };
    /** bytes[20,21] — mutation rate (0–1) + variance (0–1) */
    eco_ch11_mutation:  { rate: number;              variance: number };
    /**
     * bytes[22,23] — design personality + expressiveness score.
     *
     * Sector does NOT gate this. Any personality is valid in any sector.
     * Oscar Health (healthcare) is expressive. Vercel (technology) is disruptive.
     * The hash alone determines which personality emerges.
     *
     * Expressiveness score drives bold choices in L1 generators:
     *   ≥0.55 → expressive_type   ≥0.75 → asymmetric_layout
     *   ≥0.65 → bold_fx           ≥0.85 → brutalist_edge
     *                              ≥0.90 → glitch_motion
     */
    eco_ch12_expressiveness: {
        personality: DesignPersonality;
        score: number;   // 0.0–1.0, monotonically mapped from personality bucket
        unlocks: Array<"expressive_type" | "brutalist_edge" | "glitch_motion" | "bold_fx" | "asymmetric_layout">;
    };
}

// ── Genome ──────────────────────────────────────────────────────────────────

export interface EcosystemGenome {
    /** sha256(designGenome.dnaHash) — Layer 2 hash */
    hash: string;
    /** The dnaHash this was derived from — maintains chain provenance */
    parentHash: string;
    chromosomes: EcosystemChromosomes;
}
