/**
 * Permutations — CivilizationGenome Type System
 *
 * Layer 3 of the SHA-256 hash chain.
 *   hash = sha256(ecosystemGenome.hash)
 *   Each chromosome pair: [class byte] + [intensity byte]
 *   20 of 32 hash bytes consumed → ~65% entropy used
 *
 * The civilization grows FROM ecological pressures.
 * A parasitic-predatory ecosystem tends toward extractive governance.
 * A mutualistic-photosynthetic ecosystem tends toward cooperative governance.
 * Every chromosome must change something an agent implements differently.
 */

// ── Chromosome value types ─────────────────────────────────────────────────

/** The civilizational character — drives design philosophy + chromosome mutations */
export type CivilizationArchetype =
    | 'theological'  // doctrine-driven, ceremonial, sacred proportions
    | 'scientific'   // measurement-first, observable, annotation-rich
    | 'mercantile'   // transaction-optimised, conversion-ruthless
    | 'maritime'     // navigational, routing-primary, flow-visible
    | 'warrior'      // decisive, bold, zero-ambiguity command
    | 'democratic'   // equal-weight, accessible, no VIP treatment
    | 'industrial'   // modular, mass-produced, blueprint aesthetic
    | 'emergent';    // generative, self-organising, no fixed shape

/** How authority and decision-making are structured */
export type GovernanceModel =
    | 'centralized'   // single authority — simple state, one source of truth
    | 'federated'     // regional autonomy — module federation, zone independence
    | 'democratic'    // distributed authority — flat hierarchy, consensus
    | 'theocratic'    // doctrine authority — immutable truth, downward flow
    | 'oligarchic'    // small council — shared context, restricted routes
    | 'anarchic'      // no authority — each component self-governs
    | 'militaristic'  // command chain — strict routing, audit logs
    | 'technocratic'; // expertise authority — algorithm-driven decisions

/** How value is produced and distributed in the system */
export type EconomicModel =
    | 'command'     // central allocation — top-down data distribution
    | 'market'      // exchange-driven — real-time data, bidirectional
    | 'gift'        // freely shared — open APIs, no gatekeeping
    | 'commons'     // shared resource — pooled state, collaborative
    | 'extractive'  // resource capture — aggressive data collection
    | 'planned';    // scheduled cycles — batch processing, periodic sync

/** Technology generation and approach */
export type TechnologyClass =
    | 'biological'  // organic, adaptive, growth-based patterns
    | 'mechanical'  // engineered, precise, step-driven
    | 'digital'     // network-native, async, event-driven
    | 'quantum'     // superposition, parallel states, branching
    | 'neural'      // learning, adaptive, pattern-recognition
    | 'hybrid';     // composite, multi-paradigm

/** Primary cultural emphasis — how the civilization records and transmits knowledge */
export type CultureEmphasis =
    | 'oral'         // narrative, story-driven, conversational UI
    | 'written'      // document-first, long-form, annotation-heavy
    | 'visual'       // image-primary, show-don't-tell
    | 'numeric'      // data-first, measurement, dashboard-heavy
    | 'ritual'       // ceremony, process, step-by-step flows
    | 'algorithmic'; // computed, emergent, no fixed content

/** How the civilization survives disruption */
export type ResiliencePattern =
    | 'redundant'    // multiple fallbacks — deep error boundary trees
    | 'antifragile'  // grows stronger under stress — adaptive error handling
    | 'modular'      // isolated failures — component-level error boundaries
    | 'distributed'  // no single point of failure — graceful degradation
    | 'brittle';     // fragile but fast — minimal error handling

/** How knowledge is stored and accessed */
export type KnowledgeModel =
    | 'centralized'   // single library — one router, one data source
    | 'distributed'   // many nodes — federated routing, many data sources
    | 'oral'          // passed between components — prop drilling, callbacks
    | 'recorded'      // persistent log — event sourcing, history
    | 'emergent';     // derived at runtime — computed state, no raw storage

/** How the civilization grows and expands */
export type ExpansionMode =
    | 'organic'       // grows where needed — lazy loading, on-demand
    | 'aggressive'    // captures territory — eager loading, prefetch
    | 'sustainable'   // controlled growth — code-split, budget-aware
    | 'contracting'   // shrinking — remove, simplify, reduce
    | 'stable';       // no growth — fixed scope, no new features

/** Civilizational age — how mature and established the system is */
export type CivilizationAge =
    | 'nascent'      // just forming — rough edges, rapid change
    | 'developing'   // growing — active construction, frequent updates
    | 'mature'       // established — stable, well-tested
    | 'declining'    // degrading — tech debt, legacy patterns
    | 'resurgent';   // rebuilding — refactor, modernisation

// ── Chromosome structure ────────────────────────────────────────────────────

export interface CivilizationChromosomes {
    /** bytes[0,1] — archetype (8 options) + intensity (0–1) */
    civ_ch1_archetype:  { class: CivilizationArchetype; intensity: number };
    /** bytes[2,3] — governance model (8 options) + rigidity (0–1, high = inflexible) */
    civ_ch2_governance: { model: GovernanceModel;       rigidity: number };
    /** bytes[4,5] — economic model (6 options) + pressure (0–1, high = aggressive) */
    civ_ch3_economics:  { model: EconomicModel;         pressure: number };
    /** bytes[6,7] — technology class (6 options) + maturity (0–1) */
    civ_ch4_technology: { class: TechnologyClass;       maturity: number };
    /** bytes[8,9] — culture emphasis (6 options) + cohesion (0–1) */
    civ_ch5_culture:    { emphasis: CultureEmphasis;    cohesion: number };
    /** bytes[10,11] — resilience pattern (5 options) + depth (0–1) */
    civ_ch6_resilience: { pattern: ResiliencePattern;   depth: number };
    /** bytes[12,13] — knowledge model (5 options) + entropy (0–1, high = chaotic) */
    civ_ch7_knowledge:  { model: KnowledgeModel;        entropy: number };
    /** bytes[14,15] — expansion mode (5 options) + velocity (0–1) */
    civ_ch8_expansion:  { mode: ExpansionMode;          velocity: number };
    /** bytes[16,17] — age class (5 options) + stability (0–1) */
    civ_ch9_age:        { class: CivilizationAge;       stability: number };
    /** bytes[18,19] — fragility rate (0–1) + variance (0–1) */
    civ_ch10_fragility: { rate: number;                 variance: number };
}

// ── Genome ──────────────────────────────────────────────────────────────────

export interface CivilizationGenome {
    /** sha256(ecosystemGenome.hash) — Layer 3 hash */
    hash: string;
    /** The ecosystemHash this was derived from — maintains chain provenance */
    parentHash: string;
    chromosomes: CivilizationChromosomes;
}
