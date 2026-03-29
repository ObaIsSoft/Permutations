# Genome Architecture
## Four-Layer SHA-256 Genome Chain — v2.0.0

---

## Core Principle

Genome is a **design constitution generator**. It produces four interlocking genomes — creator, design, ecosystem, civilization — each deterministically derived from the previous via SHA-256 hash. The same seed always produces the same four genomes. Different seeds always produce distinct genomes at all four layers.

**No vocabulary dependency.** Complexity tier is computed from structural product behavior (what the product *does*), not from keywords in the description.

---

## The Three-Layer Pipeline

```
seed (string)
     │
     │ sha256(seed)
     ▼
┌─────────────────────────────────────────────────────┐
│  Layer 1 — DesignGenome                             │
│                                                     │
│  "What does it LOOK like?"                          │
│  32 chromosomes: color, typography, motion,         │
│  grid, edge, hierarchy, hero, trust, texture,       │
│  atmosphere, iconography, state topology, routing   │
│                                                     │
│  hash = sha256(seed)                                │
└─────────────────────────────────────────────────────┘
     │
     │ sha256(designGenome.dnaHash)
     ▼
┌─────────────────────────────────────────────────────┐
│  Layer 2 — EcosystemGenome                          │
│                                                     │
│  "What KIND of components ARE these?"               │
│  11 chromosomes: biome, energy, symbiosis,          │
│  trophic, succession, adaptation, population,       │
│  temporal, spatial, capacity, mutation              │
│                                                     │
│  hash = sha256(designGenome.dnaHash)                │
│  parentHash = designGenome.dnaHash                  │
└─────────────────────────────────────────────────────┘
     │
     │ sha256(ecosystemGenome.hash)
     ▼
┌─────────────────────────────────────────────────────┐
│  Layer 3 — CivilizationGenome                       │
│                                                     │
│  "How is the APPLICATION structured?"               │
│  10 chromosomes: archetype, governance, economics,  │
│  technology, culture, resilience, knowledge,        │
│  expansion, age, fragility                          │
│                                                     │
│  hash = sha256(ecosystemGenome.hash)                │
│  parentHash = ecosystemGenome.hash                  │
└─────────────────────────────────────────────────────┘
```

Each layer's chromosome values **gravity-bias** the next layer's selections. This is not just hash ancestry — the actual chromosome values flow downstream.

---

## What Each Layer Tells the Agent

| Layer | Questions Answered | Agent Action |
|---|---|---|
| L1 DesignGenome | Colors, fonts, motion, grid, edge, hero | Write CSS tokens, style rules |
| L2 EcosystemGenome | Component relationships, nesting depth, coupling, data flow direction | Design component API and hierarchy |
| L3 CivilizationGenome | State topology, routing pattern, data strategy, resilience model | Structure the codebase |

---

## Full Generation Pipeline

```
Intent + Seed + Context + Brand Assets
              │
              ▼
┌─────────────────────────────────────────────────────┐
│  STRUCTURAL ANALYSIS (LLM call — single)            │
│                                                     │
│  LLM answers 10 binary/count questions:             │
│   • realtimeState    — state changes while watching?│
│   • entityCount      — how many data types managed? │
│   • sensitiveData    — medical/financial/legal data?│
│   • multiRole        — different UI per user role?  │
│   • financialTx      — payment processing?          │
│   • complexWorkflows — multi-step processes?        │
│   • deepNavigation   — 3+ levels of hierarchy?      │
│   • externalAPIs     — third-party integrations?    │
│   • screenCount      — distinct views?              │
│   • primarySurface   — data/content/media/tx/mixed  │
│                                                     │
│  + 8 design character trait vectors (0.0–1.0)       │
│  + sector detection + copy intelligence             │
└─────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────┐
│  COMPLEXITY SCORING (deterministic — no LLM)        │
│                                                     │
│  computeComplexityFromStructure(structural):        │
│    baseline:              +0.10                     │
│    realtimeState:         +0.15                     │
│    sensitiveData:         +0.18  (largest driver)   │
│    multiRole:             +0.12                     │
│    financialTransactions: +0.10                     │
│    complexWorkflows:      +0.08                     │
│    deepNavigation:        +0.06                     │
│    externalIntegrations:  +0.05                     │
│    entityCount (÷10):     up to +0.12               │
│    screenCount (÷15):     up to +0.08               │
│    primarySurface bonus:  up to +0.06               │
│                                                     │
│  → finalComplexity (0.0–1.0)                        │
│  → tier (abiotic → singularity)                     │
│                                                     │
│  Vocabulary-invariant: "a tool doctors use to       │
│  track patients" and "clinical monitoring           │
│  dashboard" produce the same tier.                  │
└─────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────┐
│  DNA SEQUENCING — Layer 1 (DesignGenome)            │
│                                                     │
│  sha256(seed) → 32-byte hash                        │
│  Each byte pair → one chromosome                   │
│  Sector profile → gravity biases selections         │
│  Epistasis rules → cross-chromosome constraints     │
│                                                     │
│  Key outputs:                                       │
│   ch5_color_primary: { hex, darkModeHex }           │
│   ch7_edge: { style, radius }                       │
│   ch8_motion: { physics, durationScale }            │
│   ch30_state_topology / ch31_routing_pattern        │
│   ch32_token_inheritance                            │
└─────────────────────────────────────────────────────┘
              │
              │ sha256(designGenome.dnaHash)
              ▼
┌─────────────────────────────────────────────────────┐
│  DNA SEQUENCING — Layer 2 (EcosystemGenome)         │
│                                                     │
│  sha256(designGenome.dnaHash) → 11 chromosomes      │
│  Gravity: design chromosome VALUES bias eco picks   │
│                                                     │
│  Examples:                                          │
│   dark + metallic → hydrothermal biome              │
│   spring physics  → photosynthetic energy           │
│   maximal density → parasitic symbiosis             │
│   deep topology   → top-down trophic structure      │
│                                                     │
│  Used by: component library sizing, nesting depth,  │
│  coupling model, organism count limits              │
└─────────────────────────────────────────────────────┘
              │
              │ sha256(ecosystemGenome.hash)
              ▼
┌─────────────────────────────────────────────────────┐
│  DNA SEQUENCING — Layer 3 (CivilizationGenome)      │
│                                                     │
│  sha256(ecosystemGenome.hash) → 16 chromosomes (L3) │
│  Gravity: ecosystem chromosome VALUES bias civ picks│
│                                                     │
│  Examples:                                          │
│   predatory energy   → warrior archetype            │
│   mutualistic symb   → federated governance         │
│   photosynthetic     → democratic / commons model   │
│   web trophic        → distributed knowledge        │
│                                                     │
│  Overrides L1 architecture chromosomes:             │
│   governance → stateTopology                        │
│   knowledge  → routingPattern                       │
└─────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────┐
│  OUTPUT                                             │
│                                                     │
│  CSS custom property stylesheet                     │
│  genome_report — explainability markdown            │
│  ecosystem_report — component hierarchy             │
│  civilization_report — architecture direction       │
│  suggested_next — dynamic workflow guide            │
└─────────────────────────────────────────────────────┘
```

---

## Gravity Biasing System

Each layer's chromosome selections are biased by predecessor values via `biasedPick`:

```typescript
function biasedPick<T>(options: T[], rawByte: number, gravity: number): T {
    const len = options.length;
    const target = ((Math.round(gravity) % len) + len) % len;

    // Build cumulative weights
    // target = 4× probability, target ± 1 = 2×, all others = 1×
    const cumulative: number[] = [];
    let total = 0;
    for (let i = 0; i < len; i++) {
        const d = Math.min(Math.abs(i - target), len - Math.abs(i - target));
        const w = d === 0 ? 4 : d === 1 ? 2 : 1;
        total += w;
        cumulative.push(total);
    }

    const pos = Math.floor((rawByte / 256) * total);
    for (let i = 0; i < len; i++) {
        if (pos < cumulative[i]) return options[i];
    }
    return options[len - 1];
}
```

`gravity` is a **target index** — the preferred option. Weight distribution gives ~30% pull toward the ecologically coherent choice while preserving hash-driven diversity across the remaining options.

This replaces the old rotation+clamp approach, which collapsed distinct gravity values: for an 8-option array, gravity values 4, 5, 6, and 7 all clamped to the same ±2 rotation, making warrior, democratic, industrial, and emergent archetypes indistinguishable.

---

## StructuralProps — Vocabulary-Invariant Complexity

The complexity tier is the most consequential output of the pipeline — it determines how many components are generated, whether civilization architecture activates, and what state/routing patterns apply. It must not depend on vocabulary.

```typescript
export interface StructuralProps {
    realtimeState: boolean;        // State changes while user watches
    entityCount: number;           // Distinct data types managed (1–20)
    sensitiveData: boolean;        // Medical, financial, legal, auth data
    multiRole: boolean;            // Different UI per user role/permission
    financialTransactions: boolean;// Payment processing or account management
    complexWorkflows: boolean;     // Multi-step processes, wizards, approval chains
    deepNavigation: boolean;       // 3+ levels of navigation hierarchy
    externalIntegrations: boolean; // Third-party APIs or data sources
    screenCount: number;           // Distinct screens/views (1–30)
    primarySurface: 'data' | 'content' | 'media' | 'transaction' | 'balanced';
}
```

The LLM answers these as binary/count questions — not floating point scores. The mapping to complexity is deterministic code, not LLM judgment. Same product described differently → same structural answers → same tier.

**Calibration:**

| Product | Key structural facts | Score | Tier |
|---|---|---|---|
| Simple landing page | 1 entity, 1 screen, no sensitive data | ~0.12 | prokaryotic |
| Personal blog | 2 entities, 4 screens, content surface | ~0.16 | prokaryotic |
| Workout tracker | 3 entities, 4 screens, data surface | ~0.22 | protist |
| E-commerce store | 4 entities, sensitive data, financial tx, multi-role | ~0.82 | tribal |
| Healthcare portal | 5 entities, sensitive data, multi-role, complex workflows | ~0.76 | endotherm_fauna |
| Trading dashboard | real-time, sensitive, financial, multi-role, external APIs | ~1.00 | singularity |

---

## Chromosomes Reference

### Layer 1 — DesignGenome (32 Chromosomes)

#### Identity
| Chromosome | Purpose |
|---|---|
| ch0_sector | Primary + secondary sector, sub-sector, brand weight |

#### Visual Structure
| Chromosome | Purpose | Key Values |
|---|---|---|
| ch1_structure | Layout topology | flat, deep, radial, graph |
| ch2_rhythm | Spacing density + vertical rhythm | empty, breathing, airtight, maximal |
| ch9_grid | Grid logic + asymmetry | column, masonry, bento, broken, editorial, radial |
| ch10_hierarchy | Z-depth strategy | flat, layered, 3d-stack |

#### Color
| Chromosome | Purpose | Key Values |
|---|---|---|
| ch5_color_primary | Primary hue/sat/lightness + darkModeHex | hex, darkModeHex (58–74% L) |
| ch6_color_temp | Background temperature, isDark, surface stack | warm, cool, neutral |
| ch26_color_system | Full palette: secondary, accent, semantic, neutral scale | derived from ch5/ch6 |

#### Typography
| Chromosome | Purpose |
|---|---|
| ch3_type_display | Display font family + charge (geometric/humanist/transitional/slab/mono) |
| ch4_type_body | Body font family |
| ch16_typography | Full type scale with ratios |

#### Motion + Texture
| Chromosome | Purpose | Key Values |
|---|---|---|
| ch7_edge | Border radius + style | sharp, soft, organic |
| ch8_motion | Animation physics + duration | none, spring, step, glitch, ease |
| ch11_texture | Surface material | grain, flat, glass, chrome |
| ch13_atmosphere | FX layer | none, glassmorphism, crt, fluid, glitch, aurora, holographic |
| ch14_physics | 3D material properties | flat, glass, metallic, organic |
| ch27_motion_choreography | Stagger timing, entry sequences, hover micro-interactions | |
| ch28_iconography | Icon style, stroke weight, set (lucide/phosphor/heroicons) | |

#### Content + Copy
| Chromosome | Purpose |
|---|---|
| ch15_biomarker | SVG geometry type + animation style |
| ch17_accessibility | WCAG profile + motion preferences |
| ch18_rendering | Rendering strategy (WebGL/CSS/SVG) |
| ch19_hero_type | Hero visual strategy (11 types) |
| ch20_visual_treatment | Photography/imagery approach |
| ch21_trust_signals | Trust-building approach + prominence |
| ch22_social_proof | Social validation type |
| ch23_content_depth | Section count + information architecture |
| ch24_personalization | Dynamic content approach |
| ch25_copy_engine | Generated page copy (headline, CTA, FAQ, features, footer) |
| ch29_copy_intelligence | Linguistic tone, formality, vocabulary complexity |

#### Architecture (active at complexity ≥ 0.81)
| Chromosome | Purpose | Key Values |
|---|---|---|
| ch30_state_topology | State management architecture | local, shared_context, reactive_store, distributed, federated |
| ch31_routing_pattern | Routing architecture | single_page, multi_page, protected, platform, federated |
| ch32_token_inheritance | Token governance model | flat, semantic, component, governed, cross_system |

> **Note:** ch30–ch32 are always sequenced from the hash. At civilization tiers (≥0.81), the CivilizationGenome (L3) post-patches these values: `governance → stateTopology`, `knowledge → routingPattern`.

---

### Layer 2 — EcosystemGenome (11 Chromosomes)

Sequenced from `sha256(designGenome.dnaHash)`. Values drive component library character.

| Chromosome | Purpose | Tells the Agent |
|---|---|---|
| eco_ch1_biome | Biome class (16 types) + intensity | Environmental character — rainforest=dense/layered, arctic=sparse/high-negative-space |
| eco_ch2_energy | Energy source + flux | Component generation model — photosynthetic=open/abundant, predatory=extractive/aggressive |
| eco_ch3_symbiosis | Symbiosis pattern + depth | Coupling model — mutualistic=tightly coupled collaborators, neutral=fully decoupled |
| eco_ch4_trophic | Trophic structure + cascade | Data flow direction — top-down=orchestrators drive atoms, web=many-to-many |
| eco_ch5_succession | Succession stage + drift | Maturity model — pioneer=experimental/rough, climax=stable/slow-change |
| eco_ch6_adaptation | Adaptation axis + strength | Environmental pressure — pressure=high-load, temporal=urgency-driven |
| eco_ch7_population | Population pattern + variance | Component distribution — clustered=hub-and-spoke, fractal=self-similar at every scale |
| eco_ch8_temporal | Temporal rhythm + intensity | Activity pattern — nocturnal=dark-mode primary, continuous=real-time/always-active |
| eco_ch9_spatial | Spatial axis + isolation | Layout depth — pelagic=z-depth layers, benthic=persistent chrome at bottom |
| eco_ch10_capacity | Capacity class + pressure | Component count ceiling — minimal=0–6, dense=25–38, maximal=39+ |
| eco_ch11_mutation | Mutation rate + variance | Entropy tolerance — high rate=polymorphic variants OK, low=stable/predictable |

**Gravity examples (L1 → L2):**

| L1 value | L2 gravity target |
|---|---|
| `ch6_color_temp.isDark && ch14_physics.material === 'metallic'` | hydrothermal biome |
| `ch8_motion.physics === 'spring'` | photosynthetic energy |
| `ch2_rhythm.density === 'maximal'` | parasitic symbiosis |
| `ch1_structure.topology === 'deep'` | top-down trophic |
| `ch6_color_temp.isDark` | nocturnal temporal rhythm |

---

### Layer 3 — CivilizationGenome (10 Chromosomes)

Sequenced from `sha256(ecosystemGenome.hash)`. Values drive application architecture.

| Chromosome | Purpose | Maps to |
|---|---|---|
| civ_ch1_archetype | Civilizational character (8 types) | Design philosophy |
| civ_ch2_governance | Authority structure (8 types) | → `stateTopology` |
| civ_ch3_economics | Value distribution model (6 types) | Data strategy |
| civ_ch4_technology | Technology generation (6 types) | Implementation style |
| civ_ch5_culture | Knowledge transmission (6 types) | UI register |
| civ_ch6_resilience | Disruption survival pattern (5 types) | Error handling strategy |
| civ_ch7_knowledge | Knowledge storage model (5 types) | → `routingPattern` |
| civ_ch8_expansion | Growth mode (5 types) | Loading strategy |
| civ_ch9_age | Civilizational maturity (5 types) | Stability expectations |
| civ_ch10_fragility | Fragility rate + variance | Risk profile |

**Governance → State topology mapping:**

| Governance | State topology |
|---|---|
| centralized | local |
| federated | distributed |
| democratic | shared_context |
| theocratic | local |
| oligarchic | shared_context |
| anarchic | distributed |
| militaristic | reactive_store |
| technocratic | reactive_store |

**Knowledge → Routing pattern mapping:**

| Knowledge | Routing pattern |
|---|---|
| centralized | single_page |
| distributed | federated |
| oral | multi_page |
| recorded | platform |
| emergent | platform |

**Gravity examples (L2 → L3):**

| L2 value | L3 gravity target |
|---|---|
| `eco_ch2_energy.source === 'predatory'` | warrior archetype |
| `eco_ch2_energy.source === 'photosynthetic'` | democratic archetype |
| `eco_ch3_symbiosis.pattern === 'mutualistic'` | federated governance |
| `eco_ch3_symbiosis.pattern === 'parasitic'` | theocratic governance |
| `eco_ch4_trophic.structure === 'web'` | distributed knowledge |
| `eco_ch5_succession.stage === 'pioneer'` | organic expansion + nascent age |

---

## Color Architecture

### Forbidden Ranges (replaces hue prisons)

Sectors define what hues are **psychologically wrong**. The SHA-256 hash selects freely from everything else.

| Sector | Forbidden ranges | Rationale |
|---|---|---|
| technology | none | Cloudflare=orange, GitHub=dark, Stripe=purple — all correct |
| healthcare | [0°–20°], [320°–360°] | Blood red + magenta signal danger |
| fintech | [60°–100°] | Casual yellow-green reads amateur |
| legal | [0°–50°], [80°–150°] | Warm/playful hues undermine authority |
| food | [220°–280°] | Cold corporate blue kills appetite |
| gaming | [160°–200°] | Clinical teal kills energy |
| government | [0°–60°], [80°–160°] | Warm/casual hues undermine civic authority |
| nonprofit | [0°–20°], [300°–360°] | Red/magenta feel alarming vs compassionate |
| hospitality / travel | [220°–280°] | Cold blue undermines warmth/welcome |
| manufacturing | [300°–360°], [0°–30°] | Garish pinks/reds feel unsafe |

### Dark Mode Safety

Every genome emits two primary color values:
- `ch5_color_primary.hex` — 22–35% lightness, for light mode surfaces
- `ch5_color_primary.darkModeHex` — 58–74% lightness, for interactive elements on dark backgrounds

```css
--color-primary: #1b2054;           /* light mode — not for buttons on dark bg */
--color-primary-interactive: #8b9fde; /* dark mode buttons/links */
```

The CSSGenerator automatically emits both. `.btn-primary` uses `--color-primary-interactive` when dark mode is active.

---

## Library Selection Philosophy — forbiddenFor Pattern

All library catalogs (animation, icon, chart, organism, interaction, state, styling) use the same **exclude-then-pick** pattern as sector forbidden hue ranges.

### Philosophy

A library with an empty `forbiddenFor` is valid for **every genome**. Only hard mismatches are excluded — visual weight conflicts, architectural mismatches, psychological wrong fits.

```typescript
// WRONG — whitelist scoring (old pattern, abandoned)
// Any new EdgeStyle/MotionPhysics value not in fitsWith scores 0.
// The "best" library is picked by max score — arbitrary for unknown values.
fitsWith: { edgeStyles: ["sharp", "soft"], physics: ["spring", "ease"] }

// RIGHT — exclusion logic (current pattern)
// Define only what is psychologically WRONG. Hash picks freely from the rest.
forbiddenFor: { edgeStyles: ["blob", "hand_drawn"], physics: ["none"] }
```

### How it works

```typescript
const eligible = CATALOG.filter(lib => {
    const f = lib.forbiddenFor;
    if (f.edgeStyles?.includes(edgeStyle)) return false;   // wrong visual weight
    if (f.typeCharges?.includes(typeCharge)) return false; // wrong character
    if (f.sectors?.includes(sector)) return false;         // psychological mismatch
    return true;  // everything not explicitly forbidden is valid
});

// Fallback: if somehow all excluded, use full catalog
const pool = eligible.length > 0 ? eligible : CATALOG;
return pool[dnaHashByte % pool.length];
```

### Font Catalog — fail-fast, no fallbacks

`FontCatalogService` fetches live catalogs (Fontshare / Google / Bunny) at server startup.

- `warmCache()` — async, must complete before genome generation. `process.exit(1)` on failure.
- `getFonts()` — throws if the cache is cold. No hardcoded fallback fonts.
- SLOP_FONTS — Inter, Roboto, Open Sans, Lato, Noto Sans, Noto Serif — excluded from all selections.

### Catalog summary

| Catalog | Key exclusion axes |
|---|---|
| `animation-catalog.ts` | `physics`, `sectors`, `complexityAbove/Below` |
| `icon-catalog.ts` | `edgeStyles`, `typeCharges`, `sectors` |
| `chart-catalog.ts` | `complexityBelow` (D3/Visx require high complexity) |
| `organism-catalog.ts` | `personalities`, `complexityAbove/Below` |
| `interaction-catalog.ts` | `motionPhysics`, `personalities`, `complexityAbove/Below` |
| `state-catalog.ts` | `topologies`, `complexityAbove/Below` |
| `styling-catalog.ts` | `personalities`, `edgeStyles`, `complexityAbove/Below` |

---

## Complexity Tiers (14 levels)

### Ecosystem Tiers (0.00–0.80)

| Tier | Range | Organisms | Description |
|---|---|---|---|
| abiotic | 0.00–0.10 | 0 | HTML/CSS scaffold only |
| prokaryotic | 0.11–0.22 | few microbial | Atomic tokens, sparse elements |
| protist | 0.23–0.33 | microbial | First interaction states |
| bryophyte | 0.34–0.44 | microbial + flora | Cards, modals, basic layout |
| vascular_flora | 0.45–0.56 | flora-heavy | Stateful components, dropdowns |
| invertebrate_fauna | 0.57–0.65 | flora + fauna | Tables, wizards |
| ectotherm_fauna | 0.66–0.73 | all three | Complex data flows, editors |
| endotherm_fauna | 0.74–0.80 | full ecosystem | All 38 organisms, all 32 chromosomes |

### Civilization Tiers (0.81–1.00)

| Tier | Range | State | Routing | Tokens |
|---|---|---|---|---|
| tribal | 0.81–0.86 | local (useState) | single/multi-page | flat |
| city_state | 0.87–0.91 | shared_context | protected | semantic |
| nation_state | 0.92–0.94 | reactive_store (Zustand) | platform | component |
| empire | 0.95–0.96 | Zustand + persist | platform + federated | governed |
| network | 0.97–0.98 | distributed/federated | Module Federation | cross-system |
| singularity | 0.99–1.00 | federated + event bus | full Module Federation | cross-system graph |

---

## Diversity Guarantees

Three mechanisms ensure distinct outputs across similar inputs:

### 1. Hash-Driven Variance in Motion
25% of seeds deviate to an adjacent motion physics value regardless of sector default:
```typescript
if (b(30) > 0.75) {
    const adjacent = { spring: 'step', step: 'spring', none: 'step', ease: 'spring', glitch: 'spring' };
    physics = adjacent[physics] ?? physics;
}
```

### 2. Edge Style Range Enforcement
`effectivePlayfulness = Math.max(0.3, traits.playfulness)` ensures all three styles (sharp/soft/organic) are reachable even at low-playfulness sectors. `sharpCeiling` expands the sharp classification for sharp-preference sectors.

### 3. Full Byte Biome Selection
Biome uses the full `b[0]` byte (0–255) — not `b[0] >> 4` (0–15). The old nibble approach blocked 5 of 16 biomes from the weighted probability distribution.

---

## Anti-Slop Pattern Detection

The system detects and blocks known slop patterns at generation time:

| Pattern | Why Forbidden |
|---|---|
| `font: Inter` + blue gradient | Ultimate SaaS trope — overused in 80%+ of AI outputs |
| `grid-cols-3` pricing sections | Most overused layout in landing pages |
| `bg-gradient-to-r from-blue-* to-purple-*` | Signals no design intent |
| `parallax` | Motion sickness trigger with no functional benefit |
| `rounded-xl` on every card | Generic component library look |

Epistasis rules also enforce cross-chromosome consistency:
- High `informationDensity` + high `temporalUrgency` → low `playfulness` (serious data work)
- Warm `color_primary` → cool background (contrast balance)
- Geometric font → sharp/soft edges (not organic)
- Dashboard archetype → suppressed decorative animations
- `isDark` → `nocturnal` temporal rhythm in EcosystemGenome

---

## File Structure

```
src/
├── server.ts                          — MCP server, 11 tools
│
├── genome/
│   ├── sequencer.ts                   — L1 DesignGenome sequencer + entropy pool
│   ├── types.ts                       — DesignGenome types, ContentTraits
│   ├── sector-profiles.ts             — 23 sector forbidden ranges + weights
│   ├── complexity-analyzer.ts         — Tier computation (StructuralProps-first)
│   ├── constraint-solver.ts           — Set-theoretic constraint solver
│   ├── constraint-solver-v2.ts        — Distance-graph compromise detection
│   ├── entropy-pool.ts                — HKDF-style entropy expansion (unlimited bytes)
│   ├── epigenetics.ts                 — Cross-chromosome epistasis rules
│   ├── ecosystem.ts                   — EcosystemGenerator (organism naming)
│   ├── ecosystem-types.ts             — EcosystemGenome + chromosome types
│   ├── ecosystem-sequencer.ts         — L2 EcosystemGenome sequencer + gravity
│   ├── civilization.ts                — CivilizationGenerator (architecture)
│   ├── civilization-types.ts          — CivilizationGenome + chromosome types
│   ├── civilization-sequencer.ts      — L3 CivilizationGenome sequencer + gravity
│   ├── archetype-biases.ts            — Archetype gravity helpers
│   ├── archetypes.ts                  — Archetype definitions
│   ├── copy-patterns.ts               — Copy generation patterns
│   ├── extractor-url.ts               — URL-based genome extraction (Playwright / fetch)
│   └── index.ts                       — Public genome API exports
│
├── ── Library Catalogs (forbiddenFor pattern) ──
├── font-catalog.ts                    — Live font catalog service (Fontshare/Google/Bunny)
├── animation-catalog.ts               — Animation library selection (Framer Motion, GSAP, etc.)
├── icon-catalog.ts                    — Icon library selection (Lucide, Heroicons, Tabler, etc.)
├── chart-catalog.ts                   — Chart library selection (D3, Recharts, Visx, etc.)
├── organism-catalog.ts                — UI component library selection (shadcn, MUI, Radix, etc.)
├── interaction-catalog.ts             — Interaction library selection (react-spring, motion, etc.)
├── state-catalog.ts                   — State management selection (Zustand, Jotai, XState, etc.)
├── styling-catalog.ts                 — CSS styling system selection (Tailwind, CSS Modules, etc.)
│
├── semantic/
│   └── extractor.ts                   — SemanticTraitExtractor + StructuralProps analysis
│
├── css-generator.ts                   — CSSGenerator — full page stylesheet from genome
│
├── generators/
│   ├── svg-generator.ts               — SVG biomarker generation
│   ├── webgl-generator.ts             — React Three Fiber component specs
│   ├── fx-generator.ts                — Visual FX layer generator
│   ├── design-brief-generator.ts      — Design brief generation
│   ├── format-generators.ts           — Figma/Style Dictionary export
│   └── civilization-generators.ts     — Civilization architecture code generation
│
├── brief/
│   └── generator.ts                   — LLM-powered design brief (no fallback)
│
├── bridge/
│   └── persona-to-design.ts           — L0 Creator Persona → L1 genome bridge
│
├── creator/
│   ├── generator.ts                   — L0 CreatorGenome sequencer (16 chromosomes)
│   └── types.ts                       — CreatorGenome types
│
└── constraints/
    ├── pattern-detector.ts            — AST-based slop pattern detection
    └── ast-pattern-detector.ts        — AST parser for pattern violations
```

---

## Implementation Status — v1.0.0

| Component | Status | Description |
|---|---|---|
| L1 DesignGenome | ✅ | 32 chromosomes, sector profiles, epistasis rules, forbidden ranges |
| L2 EcosystemGenome | ✅ | 12 chromosomes, full gravity biasing from L1, wired into ecosystem.ts |
| L3 CivilizationGenome | ✅ | 16 chromosomes, full gravity biasing from L2, overrides ch30/ch31 in civilization.ts |
| SHA-256 hash chain | ✅ | seed → L1 → L2 → L3, fully deterministic, provenance tracked via parentHash |
| StructuralProps | ✅ | Vocabulary-invariant complexity — binary/count questions, deterministic tier computation |
| biasedPick (weighted) | ✅ | Target-index gravity replaces rotation+clamp — distinct gravity values produce distinct distributions |
| Edge diversity | ✅ | effectivePlayfulness floor, sharpCeiling, proportional organicThreshold |
| Motion diversity | ✅ | 25% hash-driven variance via b(30) — same sector, different seeds, different physics |
| Dark mode safety | ✅ | darkModeHex at 58–74% lightness on all color paths |
| forbiddenRanges (color) | ✅ | All 23 sectors converted from hueRange prison to forbidden zone inversion |
| forbiddenFor (libraries) | ✅ | All 7 catalogs use exclude-then-pick — no whitelists, no fallback lists |
| Live font catalogs | ✅ | Fontshare (~100), Google Fonts (1000+), Bunny (mirrors Google) — 24h cache, fail-fast |
| SLOP_FONTS | ✅ | Inter, Roboto, Open Sans, Lato, Noto Sans, Noto Serif excluded from all selections |
| Anti-slop detection | ✅ | 5 pattern classes, runs automatically on every generate_design_genome |
| 11-tool surface | ✅ | Full L0→L1→L2→L3 workflow + extract/format/update/validate tools |
| 49 tests | ✅ | Determinism, uniqueness, sector-awareness, epistasis, ecosystem-civilization bridge |

---

*Architecture: Four-layer SHA-256 genome chain — creator, design, ecosystem, civilization*
*v2.0.0 — March 2026*
