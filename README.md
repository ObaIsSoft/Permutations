# Permutations MCP Engine

A Model Context Protocol (MCP) server that generates **unique, reproducible design systems** using biological inheritance metaphors. Prevents AI-generated "slop" (identical Tailwind UI) by enforcing mathematical constraints.

**No Templates. No Slop. Only Math.**

---

## The Problem

Every AI-generated website looks the same:
- Inter font + blue-purple gradients
- Rounded-xl cards in a 3-column grid
- Generic hero section with "Trusted by" logos
- Parallax scroll that makes you dizzy

**This isn't a design choice—it's a failure of imagination.** LLMs default to "safe" patterns because they have no constraints forcing creativity.

## The Solution

Permutations is a **design constitution generator**, not a code generator. It produces 32-chromosome design DNA that gives agents, IDEs, and developers a precise design direction to implement from.

Each project gets unique DNA (ch0-sector through ch32-token_inheritance) that:
- ✅ Guarantees unique output (different seed = different design)
- ✅ Guarantees reproducibility (same seed = same design forever)
- ✅ Forbids generic patterns (forbidden ranges replace fixed hue prisons)
- ✅ Adapts to dark mode (dark-safe primary color lifted to 58–74% lightness)
- ✅ Respects functional requirements (dashboards MUST be scannable)

**Output:** A design constitution — CSS tokens, color system, typography, motion constraints, topology, and architecture direction. **You build from it. The tool doesn't build for you.**

---

## Quick Start

### 1. Install

```bash
npm install -g permutations-mcp
# or clone and build
git clone https://github.com/ObaIsSoft/Permutations.git
cd Permutations && npm install && npm run build
```

### 2. Configure Your IDE

Add to Cursor/Claude Desktop/Windsurf `mcp.json`:

```json
{
  "mcpServers": {
    "permutations": {
      "command": "node",
      "args": ["/path/to/permutations/dist/server.js"],
      "env": {
        "GROQ_API_KEY": "gsk_..."
      }
    }
  }
}
```

### 3. Generate DNA

Ask your AI to design something:

```
"Generate a design genome for a Japanese Y2K football stats dashboard"
```

Your AI receives:
- 32-chromosome DNA (colors, typography, motion, grid, hero, trust signals, personalization, color system, motion choreography, iconography, state topology, routing pattern, token inheritance)
- CSS custom property stylesheet
- Dark-mode-safe primary color variant (`darkModeHex`)
- WebGL component specs
- **Forbidden patterns list** (enforced at generation)
- **`genome_report`** — markdown explaining every chromosome sequenced and why
- **`suggested_next`** — which tools to call next and when

### 4. Build the UI

Your AI reads the genome report and design brief, then builds code from the constraints. The `validate_design` tool checks for slop violations before shipping.

---

## Tool Workflow (8 tools)

```
STEP 1  generate_design_genome    ← always start here
STEP 2  generate_design_brief     ← read before writing any code
STEP 3  generate_ecosystem        ← (optional) when building a component library
STEP 4  generate_civilization     ← (optional) when complexity ≥ 0.68
FINAL   validate_design           ← run before shipping any CSS/HTML

ALTERNATIVE  extract_genome_from_url  ← use instead of STEP 1 when you have a reference site
EXPORT       generate_formats         ← export tokens to Figma/Style Dictionary after STEP 1
ITERATE      update_design_genome     ← adjust chromosomes after STEP 1 ("make it warmer")
```

The `generate_design_genome` response includes `suggested_next` — a dynamic list telling the agent exactly which tools to call next based on the genome's complexity score.

---

## Available MCP Tools

### `generate_design_genome` — STEP 1
Full pipeline: content analysis → LLM extraction → DNA sequencing. Returns genome, CSS, topology, and a `genome_report` markdown explaining every chromosome.

Pass `offline: true` to skip LLM and use hash-based inference (no API key needed, fully deterministic).

### `generate_design_brief` — STEP 2
Converts the genome into human/agent-readable design direction: visual strategy, copy tone, implementation guidance. Read this before writing any code.

### `generate_ecosystem` — STEP 3 (optional)
Generates a biological component hierarchy: microbial (atomic), flora (composite), fauna (complex). Returns component specs, prop contracts, and containment relationships — **not code**. Includes `ecosystem_report` markdown.

### `generate_civilization` — STEP 4 (optional, complexity ≥ 0.68)
Returns application architecture direction: state topology, routing patterns, token inheritance rules. **Specs by default** (`generate_code: false`). Pass `generate_code: true` to opt into TSX output. Includes `civilization_report` markdown.

### `validate_design` — FINAL STEP
Check generated CSS/HTML against genome DNA constraints and forbidden slop patterns. Returns violation list and `slop_score`.

### `extract_genome_from_url` — ALTERNATIVE ENTRY
Reverse-engineer a genome from any website URL using Playwright. Use for "I love this site, make something like it" workflows.

### `generate_formats` — EXPORT
Export design tokens to Figma Tokens, Style Dictionary (CSS/SCSS/iOS/Android), styled-components, Emotion, Vue 3 SFC, or Svelte.

### `update_design_genome` — ITERATE
Adjust specific chromosomes in an existing genome. Use for "make it warmer", "change sector to fintech", "reduce motion" workflows.

---

## Two Modes of Operation

### Mode 1: LLM-Aware (Default)

Requires one API key. The engine runs a single LLM call that returns traits + sector + copy intelligence together.

```json
{
  "intent": "Japanese Y2K football stats dashboard",
  "seed": "project-v1",
  "project_context": "Built for hardcore fans who live in the data",
  "brand_asset_paths": ["/assets/logo.png", "/assets/brand-brief.pdf"]
}
```

Supported providers: Groq, OpenAI, Anthropic, Google Gemini, OpenRouter, HuggingFace.

### Mode 2: Offline (No LLM)

No API key required. Pass `offline: true` to use hash-based trait inference:

```json
{
  "intent": "minimal portfolio site",
  "seed": "studio-portfolio-2026",
  "offline": true
}
```

Fully deterministic. Sector defaults to `technology`. Best when intent is precise and sector detection isn't critical.

---

## What You Get

```json
{
  "genome": {
    "dnaHash": "2f51eec6c7043eedf0fc9f69a4181997...",
    "chromosomes": {
      "ch5_color_primary": {
        "hue": 28,
        "hex": "#8b3a12",
        "darkModeHex": "#d4824a",
        "darkModeLightness": 0.62
      },
      "ch3_type_display": { "family": "Space Grotesk", "charge": "geometric" },
      "ch8_motion": { "physics": "spring", "durationScale": 0.3 },
      "ch9_grid": { "logic": "masonry", "asymmetry": 0.7 }
    }
  },
  "css": "/* Full design token stylesheet */",
  "topology": { "gridType": "masonry", "sections": ["..."] },
  "webglComponents": "/* React Three Fiber components */",
  "genome_report": "# Genome Report\n\n## Intent → DNA\n...",
  "suggested_next": [
    { "tool": "generate_design_brief", "reason": "Read before writing any code", "always": true },
    { "tool": "validate_design", "reason": "Run before shipping any CSS/HTML", "always": true }
  ]
}
```

---

## Color Philosophy

Sectors define **forbidden hue ranges** — what's psychologically wrong for that context. The hash then selects freely from the valid spectrum:

| Sector | Forbidden | Rationale |
|---|---|---|
| technology | none | Cloudflare=orange, GitHub=dark, Stripe=purple — fully open |
| healthcare | `[0°–20°]`, `[320°–360°]` | Blood red + magenta signal danger |
| fintech | `[60°–100°]` | Casual yellow-green reads amateur |
| food & beverage | `[220°–280°]` | Cold corporate blue kills appetite |
| gaming | `[160°–200°]` | Clinical teal kills energy |

Two different technology products with different seeds get different hues. Two different seeds in the same sector get different hues. **No more blue-purple prison.**

Dark mode: `ch5_color_primary.darkModeHex` is always generated at 58–74% lightness — visible on dark surfaces. The base `hex` (22–35%) is for light mode only.

---

## Anti-Slop Pattern Detection

The system detects and forbids:

| Pattern | Why It's Slop |
|---------|---------------|
| `font-inter` | Default AI font, overused |
| `bg-gradient-to-r from-blue-* to-purple-*` | Ultimate SaaS trope |
| `grid-cols-3` pricing | Most overused layout |
| `parallax` | Motion sickness trigger |
| `rounded-xl` cards | Generic component library look |

---

## How It Works

```
Intent + Seed + Context
         │
         ▼
  LLM Semantic Analysis  (traits + sector + copy intelligence — single call)
         │
         ▼
  SHA-256 Hash → 32 Chromosomes  (deterministic, reproducible)
         │
         ▼
  Epistasis Rules  (cross-chromosome constraint enforcement)
  ├─ Warm color primary → Cool background surface
  ├─ Geometric font → Sharp edge radius
  ├─ Dashboard archetype → No decorative animations
  └─ Sector forbidden ranges → Hue excluded from palette
         │
    ┌────┴────┐
    ▼         ▼
  CSS       genome_report
  Tokens    (explainability markdown)
```

---

## Supported LLM Providers

| Provider | Model | Best For | Environment Variable |
|----------|-------|----------|---------------------|
| Groq | llama-3.3-70b-versatile | Speed, cost | `GROQ_API_KEY` |
| OpenAI | gpt-4o-mini | JSON reliability | `OPENAI_API_KEY` |
| Anthropic | claude-3-5-sonnet | Reasoning quality | `ANTHROPIC_API_KEY` |
| Google | gemini-1.5-flash | Lowest latency | `GEMINI_API_KEY` |
| OpenRouter | configurable | Model flexibility | `OPENROUTER_API_KEY` |
| HuggingFace | configurable | Open source models | `HUGGINGFACE_API_KEY` |

Auto-detection priority: Groq → OpenAI → Anthropic → Gemini → OpenRouter → HuggingFace

---

## Website Demo

The `website/` directory is built entirely from Permutations DNA:

```bash
cd website
npm install
npm run build
npm run preview
```

---

## Development

```bash
# Run tests
npm test

# Type check
npx tsc --noEmit

# Build
npm run build

# Watch mode
npm run dev
```

---

## Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — Full technical architecture, epistasis rules, 32-chromosome reference
- **[.cursorrules](./.cursorrules)** — Agent workflow rules (10 rules for correct tool usage)

---

## License

MIT
