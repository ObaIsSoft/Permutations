# Permutations MCP Engine

A Model Context Protocol (MCP) server that generates unique, content-aware design systems using biological inheritance metaphors. Prevents AI-generated "slop" (generic Tailwind UI) by enforcing mathematical constraints.

**No Templates. No Slop. Only Math.**

## How It Works

### 1. Content Epigenetics
Upload brand assets (logos, PDFs, images). The engine extracts:
- **Dominant colors** → Primary hue override
- **Text patterns** → Typography selection
- **Image ratios** → Grid logic

### 2. Functional Archetypes
No content? Use deterministic archetypes:
- **Dashboard** → Flat, monospace, no motion
- **Portfolio** → Deep, spring physics, masonry
- **Documentation** → Single column, humanist serif
- **Commerce** → Graph topology, organic edges

### 3. Unique DNA Generation
Each project gets a 15-chromosome genome:
```
Hash(seed + content) → 15 chromosomes → Tailwind/CSS
```

Same seed = Same design forever. Different seed = Different design guaranteed.

## Quick Start

### Installation

```bash
npm install
npm run build
```

### Option 1: With LLM (Content-Aware)

Set any supported API key:
```bash
export GROQ_API_KEY="gsk_..."
# OR
export OPENAI_API_KEY="sk-..."
# OR
export ANTHROPIC_API_KEY="sk-ant-..."
# OR
export GEMINI_API_KEY="..."
```

Run the server:
```bash
npm start
```

### Option 2: Archetype Mode (No API Key)

Works offline with deterministic hash generation:
```bash
npm start
# Use generate_from_archetype tool with "dashboard", "portfolio", etc.
```

## MCP Configuration

Add to your IDE (Cursor, Windsurf, Claude Desktop):

```json
{
  "mcpServers": {
    "permutations": {
      "command": "node",
      "args": ["/path/to/permutations/dist/server.js"],
      "env": {
        "GROQ_API_KEY": "your-key-here"
      }
    }
  }
}
```

## Available Tools

### `generate_design_genome`
Full content-aware generation with LLM semantic extraction.

```json
{
  "intent": "Japanese Y2K football stats dashboard",
  "seed": "client-project-v1",
  "project_context": "Street culture, neon, aggressive energy",
  "brand_asset_paths": ["/path/to/logo.png"]
}
```

### `generate_from_archetype`
Offline generation using functional archetypes.

```json
{
  "archetype": "dashboard",
  "seed": "crypto-tracker-v2"
}
```

Available archetypes: `dashboard`, `portfolio`, `documentation`, `commerce`, `landing`, `blog`

### `validate_design`
Check CSS/HTML against forbidden slop patterns.

```json
{
  "genome": { ... },
  "css": "/* your css */",
  "html": "<!-- your html -->"
}
```

### `list_archetypes`
List all available functional archetypes.

## Example Output

```json
{
  "genome": {
    "dnaHash": "2f51eec6c7043eedf0fc9f69a4181997...",
    "chromosomes": {
      "ch1_structure": { "topology": "flat", "maxNesting": 2 },
      "ch5_color_primary": { "hue": 224, "saturation": 0.4, "lightness": 0.6 },
      "ch8_motion": { "physics": "spring", "durationScale": 0.3 }
    },
    "constraints": {
      "forbiddenPatterns": ["parallax", "bounce_animations"],
      "bondingRules": ["High temporal urgency -> No animations"]
    }
  },
  "tailwindConfig": "/* Generated tailwind.config.js */",
  "topology": { "gridType": "masonry", "sections": [...] }
}
```

## Website Demo

The `website/` directory is built entirely from Permutations DNA:

```bash
cd website
npm install
npm run build
```

Live at: [Permutations Demo](http://localhost:4173)

## Architecture

See [DESIGN.md](./DESIGN.md) for full technical architecture.

Key concepts:
- **15 Chromosomes**: Control every visual aspect
- **Epistasis Rules**: Prevent invalid combinations
- **Pattern Detection**: Auto-reject slop (Inter font, blue-purple gradients, etc.)
- **Multi-LLM**: Groq, OpenAI, Anthropic, Gemini support

## Supported LLM Providers

| Provider | Model | Environment Variable |
|----------|-------|---------------------|
| Groq | llama-3.3-70b-versatile | `GROQ_API_KEY` |
| OpenAI | gpt-4o-mini | `OPENAI_API_KEY` |
| Anthropic | claude-3-5-sonnet | `ANTHROPIC_API_KEY` |
| Google | gemini-1.5-flash | `GEMINI_API_KEY` |

Auto-detection: Set any key. The engine routes to available provider.

## Development

```bash
# Run dogfooding script
GROQ_API_KEY=xxx npx tsx generate-product-dna.ts

# Build
npm run build

# Watch mode
npm run dev
```

## License

MIT
