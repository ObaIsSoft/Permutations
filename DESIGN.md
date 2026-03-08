# Permutations Design Genome Architecture

## Core Philosophy

Permutations is a **parametric design system** that treats visual design as biological inheritance rather than template selection. Instead of choosing from pre-made themes, each project receives a unique genetic fingerprint derived from its content and purpose.

The system operates on three principles:

1. **Content Epigenetics**: Existing brand assets (colors, textures, documents) mutate the genome
2. **Functional Archetypes**: The purpose of the interface (dashboard, portfolio, blog) constrains viable expressions
3. **Deterministic Uniqueness**: The same seed always produces the same design; different seeds always produce different designs

---

## The 15 Chromosomes

The design genome consists of 15 chromosomes, each controlling a specific aspect of the visual system:

| Chromosome | Controls | Variants |
|------------|----------|----------|
| ch1_structure | HTML topology | flat, deep, graph, radial |
| ch2_rhythm | Spacing density | airtight, breathing, maximal, empty |
| ch3_type_display | Display typography | geometric, humanist, monospace, transitional |
| ch4_type_body | Body typography | x-height ratio, contrast |
| ch5_color_primary | Primary hue | 0-360°, saturation, lightness |
| ch6_color_temp | Background temp | warm, cool, neutral |
| ch7_edge | Border philosophy | sharp (0px), soft, organic, techno |
| ch8_motion | Physics system | none, spring, step, glitch |
| ch9_grid | Layout logic | column, masonry, radial, broken |
| ch10_hierarchy | Z-depth layering | flat, overlapping, 3d-stack |
| ch11_texture | Surface quality | flat, grain, glass, chrome |
| ch12_signature | Entropy/mutation | uniqueness factor |
| ch13_atmosphere | Atmospheric FX | glassmorphism, crt_noise, fluid_mesh, none |
| ch14_physics | Material system | neumorphism, metallic, glass, matte |
| ch15_biomarker | SVG geometry | monolithic, organic, fractal |

---

## Epistasis: The Anti-Slop Rules

Chromosomes are not independent. Changing one forces changes in others through **epistasis** (genetic interaction):

### Rule: Color Temperature Bonding
- Warm primary + Warm background = Muddy brown (FORBIDDEN)
- **Correction**: Warm primary forces cool background

### Rule: Font-Edge Bonding
- Geometric font + Organic edges = Visual dissonance (FORBIDDEN)
- **Correction**: Geometric fonts force sharp (0px) edges

### Rule: Dashboard Physics
- Dashboard + Animations = Motion sickness (FORBIDDEN)
- **Correction**: High-frequency data forces `physics: none`

### Rule: Typography Contrast
- Serif body + Low x-height = Illegible (FORBIDDEN)
- **Correction**: Long-form text forces high x-height ratio

---

## Content Analysis Pipeline

### Step 1: Ingestion
```typescript
const analysis = await analyzer.analyze({
    documents: [/* PDFs, text files */],
    images: [/* PNGs, JPGs */],
    brandAssets: [/* Logos, guidelines */],
    intent: "Japanese Y2K football dashboard"
});
```

### Step 2: Epigenetic Marker Extraction
- **Visual**: Dominant colors → Primary hue override
- **Text**: Average word length → Font charge selection
- **Structure**: Content volume → Grid density

### Step 3: Genome Generation
The sequencer combines:
1. **Hash entropy**: SHA-256(seed) provides uniqueness
2. **Trait vectors**: LLM extracts 5 semantic dimensions
3. **Epigenetic pressure**: Content markers force mutations

---

## Functional Archetypes

**What they are:** Pre-defined constraint templates that encode best practices for specific interface types. They answer "what is this FOR?" when no content is available.

**Why they exist:** 
- **No API key required**: Works offline with deterministic hash generation
- **Functional coherence**: A dashboard MUST be scannable (monospace, flat, no animations) regardless of aesthetic choices
- **Constraint foundation**: Provides hard limits that creativity works within

**How they differ from templates:**
- **Template**: "Here is Portfolio Template #3, change the colors"
- **Archetype**: "Portfolio function requires: deep topology, spring motion, masonry grid. Hash determines specific hue, exact spacing, font family."

Same archetype + Different seed = Different phenotype that still functions correctly.

### Available Archetypes:

### Departure Board (Dashboard)
- Topology: flat (2 levels max)
- Font: monospace (tabular numbers)
- Motion: none (instant updates)
- Edge: sharp (0px radius)

### Gallery (Portfolio)
- Topology: deep (nested sections)
- Font: transitional or humanist
- Motion: spring (organic feel)
- Edge: soft (2-8px radius)

### Monastic Library (Documentation)
- Topology: deep (hierarchical)
- Font: humanist serif
- Motion: none (static reading)
- Edge: soft (warm feel)

### Bazaar (Commerce)
- Topology: graph (category nodes)
- Font: geometric display
- Motion: spring (tactile feedback)
- Edge: organic (variable radius)

---

## Multi-LLM Architecture

The system supports 4 LLM providers with auto-detection:

| Provider | Model | Best For |
|----------|-------|----------|
| Groq | llama-3.3-70b-versatile | Speed, cost |
| OpenAI | gpt-4o-mini | JSON reliability |
| Anthropic | claude-3-5-sonnet | Reasoning quality |
| Google | gemini-1.5-flash | Lowest latency |

Auto-detection priority: `GROQ_API_KEY` > `OPENAI_API_KEY` > `ANTHROPIC_API_KEY` > `GEMINI_API_KEY`

---

## Pattern Enforcement (Anti-Slop)

**What it is:** A constraint system that detects AND prevents generic "AI slop" design patterns from entering the generated code.

**How it works:**
1. **Detection**: Scans CSS/HTML for known slop patterns (Inter font, blue-purple gradients, etc.)
2. **Prevention**: DNA constraints explicitly forbid certain patterns based on genome
3. **Validation**: `validate_design` tool checks if generated code violates constraints

**Why it matters:** Without enforcement, AI coders default to "safe" patterns (Tailwind UI, Material Design) that look like every other website. Pattern enforcement forces distinctiveness.

### Example Enforcement Flow
```
User: "Generate a dashboard"
DNA: forbids ["parallax", "bounce_animations", "rounded-xl"]
AI: Generates code
Validation: Checks for forbidden patterns
Result: Rejected if "bg-gradient-to-r" found, must use DNA solid colors
```

### Detected Patterns

The system detects and flags:

### Font Patterns
- `font-inter` (the default AI slop font)
- `font-roboto` (overused)

### Color Patterns
- `bg-gradient-to-r` (Tailwind gradient abuse)
- `from-blue-* to-purple-*` (the ultimate SaaS trope)

### Layout Patterns
- `rounded-xl` with cards (generic component library look)
- `grid-cols-3` pricing (most overused pattern)
- `testimonial-carousel` (conversion anti-pattern)

### Motion Patterns
- `parallax` (motion sickness)
- `backdrop-blur` (glassmorphism overuse)

---

## Usage Examples

### With Content (Epigenetic Mode)
```typescript
const genome = await mcp.call("generate_design_genome", {
    intent: "Architect portfolio",
    seed: "client-smith-2024",
    brand_asset_paths: ["/assets/logo.png", "/assets/brief.pdf"]
});
// Logo color extracts to primary hue
// Brief text influences typography
```

### Without Content (Archetype Mode)
```typescript
const genome = await mcp.call("generate_from_archetype", {
    archetype: "dashboard",
    seed: "crypto-tracker-v2"
});
// No API calls required
// Deterministic from hash
```

### Validation
```typescript
const validation = await mcp.call("validate_design", {
    genome,
    css: generatedCSS,
    html: generatedHTML
});
// Returns slop score and violations
```

---

## Mathematical Guarantees

### Uniqueness
With 15 chromosomes and conservative estimates:
- 360 hues × 3 temperatures × 4 topologies × 4 densities × 4 motions × 4 grids = **~27,000 variants**
- Plus mutation entropy (ch12_signature) = **Infinite unique phenotypes**

### Determinism
Same seed → Same DNA (forever)
Different seed → Different DNA (guaranteed)

### Viability
Epistasis rules filter out 90% of random combinations, leaving only coherent designs.

---

## Roadmap

- **v1.0**: Core genome, 4 LLM providers, 6 archetypes, pattern detection
- **v1.1**: Additional archetypes (documentation, commerce variants)
- **v1.2**: Visual breeding (combine two genomes)
- **v2.0**: Usage-based evolution (feedback loop from analytics)

---

## No Templates. No Slop. Only Math.
