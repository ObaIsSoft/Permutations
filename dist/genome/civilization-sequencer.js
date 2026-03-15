/**
 * Permutations — Civilization Sequencer
 *
 * Sequences CivilizationGenome from an EcosystemGenome.
 * This is Layer 3 of the SHA-256 hash chain:
 *   civilizationHash = sha256(ecosystemGenome.hash)
 *
 * Ecological pressures bias civilizational character:
 *   parasitic ecosystem  → extractive/theocratic governance
 *   mutualistic ecosystem → cooperative/democratic governance
 *   predatory energy     → warrior/colonial archetype
 *   climax succession    → mature/federated civilization
 */
import * as crypto from "crypto";
// ── Option arrays ───────────────────────────────────────────────────────────
const ARCHETYPES = [
    'theological', 'scientific', 'mercantile', 'maritime',
    'warrior', 'democratic', 'industrial', 'emergent',
];
const GOVERNANCE_MODELS = [
    'centralized', 'federated', 'democratic', 'theocratic',
    'oligarchic', 'anarchic', 'militaristic', 'technocratic',
];
const ECONOMIC_MODELS = [
    'command', 'market', 'gift', 'commons', 'extractive', 'planned',
];
const TECHNOLOGY_CLASSES = [
    'biological', 'mechanical', 'digital', 'quantum', 'neural', 'hybrid',
];
const CULTURE_EMPHASES = [
    'oral', 'written', 'visual', 'numeric', 'ritual', 'algorithmic',
];
const RESILIENCE_PATTERNS = [
    'redundant', 'antifragile', 'modular', 'distributed', 'brittle',
];
const KNOWLEDGE_MODELS = [
    'centralized', 'distributed', 'oral', 'recorded', 'emergent',
];
const EXPANSION_MODES = [
    'organic', 'aggressive', 'sustainable', 'contracting', 'stable',
];
const CIVILIZATION_AGES = [
    'nascent', 'developing', 'mature', 'declining', 'resurgent',
];
// ── Gravity functions — ecosystem chromosome values bias civilization ────────
function archetypeGravity(eco) {
    const c = eco.chromosomes;
    // Predatory energy → warrior (4)
    if (c.eco_ch2_energy.source === 'predatory')
        return 4;
    // Parasitic → theological (0, doctrine-extractive)
    if (c.eco_ch2_energy.source === 'parasitic')
        return 0;
    // Photosynthetic → democratic (5)
    if (c.eco_ch2_energy.source === 'photosynthetic')
        return 5;
    // Decomposer → industrial (6, recycling/transformative)
    if (c.eco_ch2_energy.source === 'decomposer')
        return 6;
    // Chemosynthetic → scientific (1, internal processes, analytical, self-sufficient)
    if (c.eco_ch2_energy.source === 'chemosynthetic')
        return 1;
    // Mixotrophic → maritime (3, adaptive, context-switching, navigational)
    if (c.eco_ch2_energy.source === 'mixotrophic')
        return 3;
    // High mutation → emergent (7)
    if (c.eco_ch11_mutation.rate > 0.7)
        return 7;
    return 2; // mercantile default (fallback, should rarely be reached now)
}
function governanceGravity(eco) {
    const c = eco.chromosomes;
    // Parasitic symbiosis → theocratic (3) or militaristic (6)
    if (c.eco_ch3_symbiosis.pattern === 'parasitic')
        return 3;
    // Mutualistic → federated (1) or democratic (2)
    if (c.eco_ch3_symbiosis.pattern === 'mutualistic')
        return 1;
    // Competitive → oligarchic (4)
    if (c.eco_ch3_symbiosis.pattern === 'competitive')
        return 4;
    // Neutral/allelopathic → anarchic (5)
    if (c.eco_ch3_symbiosis.pattern === 'neutral' ||
        c.eco_ch3_symbiosis.pattern === 'allelopathic')
        return 5;
    // Top-down trophic → centralized (0)
    if (c.eco_ch4_trophic.structure === 'top-down')
        return 0;
    // Web/cascade → federated (1)
    if (c.eco_ch4_trophic.structure === 'web' ||
        c.eco_ch4_trophic.structure === 'cascade')
        return 1;
    return 0; // centralized default
}
function economicsGravity(eco) {
    const c = eco.chromosomes;
    // Predatory/parasitic → extractive (4)
    if (c.eco_ch2_energy.source === 'predatory' ||
        c.eco_ch2_energy.source === 'parasitic')
        return 4;
    // Decomposer → planned (5, cyclical batch processing)
    if (c.eco_ch2_energy.source === 'decomposer')
        return 5;
    // Chemosynthetic → gift (2, self-contained, freely produced)
    if (c.eco_ch2_energy.source === 'chemosynthetic')
        return 2;
    // Mixotrophic → market (1, adaptive, real-time bidirectional)
    if (c.eco_ch2_energy.source === 'mixotrophic')
        return 1;
    // Photosynthetic + mutualistic → commons (3)
    if (c.eco_ch2_energy.source === 'photosynthetic' &&
        c.eco_ch3_symbiosis.pattern === 'mutualistic')
        return 3;
    // Web trophic → market (1, many-to-many exchange)
    if (c.eco_ch4_trophic.structure === 'web')
        return 1;
    return 0; // command default
}
function technologyGravity(eco) {
    const c = eco.chromosomes;
    // High mutation rate → neural (4, learning/adaptive)
    if (c.eco_ch11_mutation.rate > 0.75)
        return 4;
    // Chemosynthetic → mechanical (1, internal, self-sufficient)
    if (c.eco_ch2_energy.source === 'chemosynthetic')
        return 1;
    // Fractal population → quantum (3, parallel states)
    if (c.eco_ch7_population.pattern === 'fractal')
        return 3;
    // Photosynthetic → biological (0, organic, adaptive)
    if (c.eco_ch2_energy.source === 'photosynthetic')
        return 0;
    return 2; // digital default
}
function cultureGravity(eco) {
    const c = eco.chromosomes;
    // Top-down trophic → ritual (4, process-driven)
    if (c.eco_ch4_trophic.structure === 'top-down')
        return 4;
    // High cascade → numeric (3, data-driven measurement)
    if (c.eco_ch4_trophic.cascade > 0.7)
        return 3;
    // Web trophic → oral (0, passed between components)
    if (c.eco_ch4_trophic.structure === 'web')
        return 0;
    // Linear → written (1, document-first)
    if (c.eco_ch4_trophic.structure === 'linear')
        return 1;
    // High adaptation strength → algorithmic (5)
    if (c.eco_ch6_adaptation.strength > 0.8)
        return 5;
    return 2; // visual default
}
function resilienceGravity(eco) {
    const c = eco.chromosomes;
    // High symbiosis depth → redundant (0, tightly coupled backups)
    if (c.eco_ch3_symbiosis.depth > 0.7)
        return 0;
    // Web trophic → distributed (3)
    if (c.eco_ch4_trophic.structure === 'web')
        return 3;
    // Low mutation → brittle (4, stable but fragile)
    if (c.eco_ch11_mutation.rate < 0.2)
        return 4;
    // Pioneer succession → antifragile (1, grows under pressure)
    if (c.eco_ch5_succession.stage === 'pioneer')
        return 1;
    return 2; // modular default
}
function knowledgeGravity(eco) {
    const c = eco.chromosomes;
    // Decomposer → recorded (3, event sourcing)
    if (c.eco_ch2_energy.source === 'decomposer')
        return 3;
    // Web trophic → distributed (1)
    if (c.eco_ch4_trophic.structure === 'web')
        return 1;
    // High isolation → centralized (0)
    if (c.eco_ch9_spatial.isolation > 0.7)
        return 0;
    // High mutation → emergent (4, computed at runtime)
    if (c.eco_ch11_mutation.rate > 0.7)
        return 4;
    return 0; // centralized default
}
function expansionGravity(eco) {
    const c = eco.chromosomes;
    // Pioneer succession → organic (0, grow where needed)
    if (c.eco_ch5_succession.stage === 'pioneer' ||
        c.eco_ch5_succession.stage === 'early')
        return 0;
    // Predatory energy → aggressive (1)
    if (c.eco_ch2_energy.source === 'predatory')
        return 1;
    // Post-climax → contracting (3)
    if (c.eco_ch5_succession.stage === 'post-climax')
        return 3;
    // Climax → stable (4, no new features)
    if (c.eco_ch5_succession.stage === 'climax')
        return 4;
    return 2; // sustainable default
}
function ageGravity(eco) {
    const c = eco.chromosomes;
    // Pioneer → nascent (0)
    if (c.eco_ch5_succession.stage === 'pioneer')
        return 0;
    // Early → developing (1)
    if (c.eco_ch5_succession.stage === 'early')
        return 1;
    // Mid → developing/mature
    if (c.eco_ch5_succession.stage === 'mid')
        return 1;
    // Climax → mature (2)
    if (c.eco_ch5_succession.stage === 'climax')
        return 2;
    // Post-climax → declining (3)
    if (c.eco_ch5_succession.stage === 'post-climax')
        return 3;
    // Disturbed → resurgent (4)
    if (c.eco_ch5_succession.stage === 'disturbed')
        return 4;
    return 2; // mature default
}
// ── Biased selection ────────────────────────────────────────────────────────
/**
 * Weighted probability pick — gravity is the preferred TARGET INDEX (not an offset).
 * Weight distribution: target = 4×, target ± 1 = 2×, all others = 1×.
 * This gives ~30% pull toward the ecologically coherent choice while preserving
 * broad hash-driven diversity. Previously used rotation + clamp which collapsed
 * warrior/industrial/emergent/democratic (indices 4–7) to the same effective shift.
 */
function biasedPick(options, rawByte, gravity) {
    const len = options.length;
    const target = ((Math.round(gravity) % len) + len) % len;
    const cumulative = [];
    let total = 0;
    for (let i = 0; i < len; i++) {
        const d = Math.min(Math.abs(i - target), len - Math.abs(i - target));
        const w = d === 0 ? 4 : d === 1 ? 2 : 1;
        total += w;
        cumulative.push(total);
    }
    const pos = Math.floor((rawByte / 256) * total);
    for (let i = 0; i < len; i++) {
        if (pos < cumulative[i])
            return options[i];
    }
    return options[len - 1];
}
function norm(byte) {
    return byte / 255;
}
// ── Main sequencer ──────────────────────────────────────────────────────────
export function sequenceCivilizationGenome(ecosystemGenome) {
    const hash = crypto.createHash("sha256").update(ecosystemGenome.hash).digest("hex");
    const b = Buffer.from(hash, "hex");
    const eco = ecosystemGenome;
    const chromosomes = {
        // bytes[0,1] — archetype
        civ_ch1_archetype: {
            class: biasedPick(ARCHETYPES, b[0], archetypeGravity(eco)),
            intensity: norm(b[1]),
        },
        // bytes[2,3] — governance
        civ_ch2_governance: {
            model: biasedPick(GOVERNANCE_MODELS, b[2], governanceGravity(eco)),
            rigidity: norm(b[3]),
        },
        // bytes[4,5] — economics
        civ_ch3_economics: {
            model: biasedPick(ECONOMIC_MODELS, b[4], economicsGravity(eco)),
            pressure: norm(b[5]),
        },
        // bytes[6,7] — technology
        civ_ch4_technology: {
            class: biasedPick(TECHNOLOGY_CLASSES, b[6], technologyGravity(eco)),
            maturity: norm(b[7]),
        },
        // bytes[8,9] — culture
        civ_ch5_culture: {
            emphasis: biasedPick(CULTURE_EMPHASES, b[8], cultureGravity(eco)),
            cohesion: norm(b[9]),
        },
        // bytes[10,11] — resilience
        civ_ch6_resilience: {
            pattern: biasedPick(RESILIENCE_PATTERNS, b[10], resilienceGravity(eco)),
            depth: norm(b[11]),
        },
        // bytes[12,13] — knowledge
        civ_ch7_knowledge: {
            model: biasedPick(KNOWLEDGE_MODELS, b[12], knowledgeGravity(eco)),
            entropy: norm(b[13]),
        },
        // bytes[14,15] — expansion
        civ_ch8_expansion: {
            mode: biasedPick(EXPANSION_MODES, b[14], expansionGravity(eco)),
            velocity: norm(b[15]),
        },
        // bytes[16,17] — age
        civ_ch9_age: {
            class: biasedPick(CIVILIZATION_AGES, b[16], ageGravity(eco)),
            stability: norm(b[17]),
        },
        // bytes[18,19] — fragility
        civ_ch10_fragility: {
            rate: norm(b[18]),
            variance: norm(b[19]),
        },
    };
    return { hash, parentHash: ecosystemGenome.hash, chromosomes };
}
