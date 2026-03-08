# Permutations Gap Fix Plan

## Executive Summary
Address 9 critical gaps between conversation vision and current implementation to achieve production-ready status.

---

## Phase 1: Branding & Label Cleanup (30 min)

### Task 1.1: Remove All "V3" Labels
**Files to modify:**
- `website/src/components/Hero.tsx` - Line 17: Change "V3: Biological Planetary Adaptation" → "Permutations Engine"
- `website/src/components/Navbar.tsx` - Remove V3 comment
- `website/src/components/DNA.tsx` - Line 30: Remove "V3:" prefix, keep "Biological Planetary Adaptation"
- `website/src/components/Footer.tsx` - Remove V3 comment
- `website/src/components/Procedural3D.tsx` - Remove V3 comment
- `website/src/components/Architecture.tsx` - Remove "V3" from subtitle
- `website/src/components/Installation.tsx` - Change "Coming in V3.1" → "Coming soon"

**Verification:**
```bash
grep -r "V3" website/src --include="*.tsx" | grep -v "// V3" | wc -l
# Should return 0
```

---

## Phase 2: Multi-LLM Support (90 min)

### Task 2.1: Add Google Gemini Support
**New dependency:** `@google/generative-ai`

**Modify `src/semantic/extractor.ts`:**
```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

type LLMProvider = "groq" | "openai" | "anthropic" | "gemini";

// Add to constructor
if (this.provider === "gemini" && key) {
    const genAI = new GoogleGenerativeAI(key);
    this.gemini = genAI.getGenerativeModel({ model: "gemini-pro" });
}

// Add to extractTraits
if (this.provider === "gemini" && this.gemini) {
    const result = await this.gemini.generateContent(prompt);
    const text = result.response.text();
    result = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] || "{}");
}
```

### Task 2.2: Add Anthropic Claude SDK
**New dependency:** `@anthropic-ai/sdk`

**Modify `src/semantic/extractor.ts`:**
```typescript
import Anthropic from "@anthropic-ai/sdk";

// Add to constructor
if (this.provider === "anthropic" && key) {
    this.anthropic = new Anthropic({ apiKey: key });
}

// Add to extractTraits
if (this.provider === "anthropic" && this.anthropic) {
    const response = await this.anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }]
    });
    const text = response.content[0].text;
    result = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] || "{}");
}
```

### Task 2.3: Update Provider Detection Priority
**Modify constructor logic:**
```typescript
// Priority: GROQ_API_KEY > OPENAI_API_KEY > ANTHROPIC_API_KEY > GEMINI_API_KEY
const key = apiKey || 
    process.env.GROQ_API_KEY || 
    process.env.OPENAI_API_KEY || 
    process.env.ANTHROPIC_API_KEY ||
    process.env.GEMINI_API_KEY;

// Auto-detect based on which env var is set
if (!apiKey) {
    if (process.env.GEMINI_API_KEY) this.provider = "gemini";
    else if (process.env.ANTHROPIC_API_KEY) this.provider = "anthropic";
    else if (process.env.OPENAI_API_KEY) this.provider = "openai";
    else this.provider = "groq";
}
```

### Task 2.4: Update Website Documentation
**Modify `website/src/components/Installation.tsx`:**
- List all 4 providers with correct status
- Update "Required Environment Variables" section

**Verification:**
```bash
npm install @anthropic-ai/sdk @google/generative-ai
npm run build
# Should compile without errors
```

---

## Phase 3: Functional Archetype Mode (60 min)

### Task 3.1: Create Archetype Definitions
**New file: `src/genome/archetypes.ts`**

```typescript
export interface FunctionalArchetype {
    name: string;
    constraints: {
        minInformationDensity: number;
        maxInformationDensity: number;
        preferredTopology: string;
        forbiddenFonts: string[];
        requiredFonts: string[];
        motionPreference: string;
    };
    epigeneticMarkers: Partial<ContentAnalysis>;
}

export const ARCHETYPES: Record<string, FunctionalArchetype> = {
    dashboard: {
        name: "Departure Board",
        constraints: {
            minInformationDensity: 0.7,
            maxInformationDensity: 0.9,
            preferredTopology: "flat",
            forbiddenFonts: ["script", "decorative"],
            requiredFonts: ["monospace"],
            motionPreference: "none"
        },
        epigeneticMarkers: {
            structuralMarkers: {
                contentType: "high_frequency_data",
                updateFrequency: "realtime",
                itemCount: 50
            },
            textMarkers: {
                scanVsReadRatio: 0.9,
                textVolume: "minimal"
            }
        }
    },
    portfolio: {
        name: "Gallery",
        constraints: {
            minInformationDensity: 0.3,
            maxInformationDensity: 0.6,
            preferredTopology: "broken",
            forbiddenFonts: ["monospace"],
            requiredFonts: [],
            motionPreference: "spring"
        },
        epigeneticMarkers: {
            structuralMarkers: {
                contentType: "portfolio",
                updateFrequency: "static",
                itemCount: 12
            },
            visualMarkers: {
                visualDensity: "medium"
            }
        }
    },
    // Add: documentation, commerce, blog, landing
};
```

### Task 3.2: Modify Sequencer for Archetype Mode
**Modify `src/genome/sequencer.ts`:**

```typescript
// New method for archetype-based generation
generateFromArchetype(archetypeName: string, seed: string): DesignGenome {
    const archetype = ARCHETYPES[archetypeName];
    if (!archetype) throw new Error(`Unknown archetype: ${archetypeName}`);
    
    // Generate base genome
    const genome = this.hashToGenome(seed);
    
    // Force archetype constraints
    genome.chromosomes.ch1_structure.topology = archetype.constraints.preferredTopology;
    genome.chromosomes.ch3_type_display.charge = archetype.constraints.requiredFonts[0] || "geometric";
    genome.chromosomes.ch8_motion.physics = archetype.constraints.motionPreference;
    
    // Apply viability with archetype markers
    return this.ensureViability(genome, archetype.epigeneticMarkers as ContentAnalysis);
}
```

### Task 3.3: Add MCP Tool for Archetype Mode
**Modify `src/server.ts`:**

Add new tool: `generate_from_archetype`
- Input: `archetype` (string), `seed` (string)
- Output: DesignGenome without requiring API key

**Verification:**
```typescript
// Test: Should work without GROQ_API_KEY
const genome = sequencer.generateFromArchetype("dashboard", "test-seed");
assert(genome.chromosomes.ch1_structure.topology === "flat");
assert(genome.chromosomes.ch8_motion.physics === "none");
```

---

## Phase 4: Strict Pattern Enforcement (90 min)

### Task 4.1: Create Forbidden Pattern Detector
**New file: `src/constraints/pattern-detector.ts`**

```typescript
export const SLOP_PATTERNS = {
    visual: [
        { pattern: /bg-gradient-to-r/, name: "tailwind_gradient", severity: "warning" },
        { pattern: /rounded-(lg|xl|2xl|3xl)/, name: "excessive_rounding", severity: "error" },
        { pattern: /font-(inter|roboto)/i, name: "generic_font", severity: "error" },
        { pattern: /shadow-(lg|xl|2xl)/, name: "heavy_shadow", severity: "warning" },
        { pattern: /backdrop-blur/, name: "glassmorphism", severity: "info" }
    ],
    structural: [
        { pattern: /<section[^>]*className="hero/, name: "hero_section", severity: "warning" },
        { pattern: /grid-cols-3.*pricing/i, name: "pricing_cards", severity: "error" },
        { pattern: /testimonial.*carousel/i, name: "testimonial_slider", severity: "error" }
    ]
};

export class PatternDetector {
    detect(css: string, html: string): Violation[] {
        const violations: Violation[] = [];
        
        // Check each pattern
        SLOP_PATTERNS.visual.forEach(({ pattern, name, severity }) => {
            if (pattern.test(css)) {
                violations.push({ type: "visual", pattern: name, severity, line: this.findLine(css, pattern) });
            }
        });
        
        return violations;
    }
}
```

### Task 4.2: Add Validation to CSS Generator
**Modify `src/generators/css-generator.ts`:**

```typescript
import { PatternDetector } from "../constraints/pattern-detector.js";

generateWithValidation(genome: DesignGenome, format: string): { css: string; violations: Violation[] } {
    const css = this.generate(genome, format);
    const detector = new PatternDetector();
    const violations = detector.detect(css, "");
    
    // Remove forbidden patterns automatically
    let cleanedCSS = css;
    genome.constraints.forbidden_patterns.forEach(pattern => {
        const regex = new RegExp(pattern, 'g');
        cleanedCSS = cleanedCSS.replace(regex, '/* FORBIDDEN: $& */');
    });
    
    return { css: cleanedCSS, violations };
}
```

### Task 4.3: Fix Website CSS to Obey Constraints
**Modify `website/src/index.css`:**

Audit and fix:
- Remove hardcoded gradients if genome forbids them
- Ensure border-radius uses `rounded-genome` not hardcoded values
- Remove `backdrop-blur` if genome forbids glassmorphism

**Verification:**
```bash
# Run pattern detector on built CSS
grep -E "(bg-gradient|backdrop-blur|font-inter)" website/dist/assets/*.css
# Should return nothing if constraints enforced
```

---

## Phase 5: Fix Dogfooding Script (30 min)

### Task 5.1: Refactor to Use SemanticTraitExtractor
**Modify `generate-product-dna.ts`:**

Replace inline Groq call (lines 23-56) with:
```typescript
import { SemanticTraitExtractor } from "./src/semantic/extractor.js";

const extractor = new SemanticTraitExtractor(apiKey);
const traits = await extractor.extractTraits(intent, projectContext);
```

Remove duplicate prompt definition.

**Verification:**
```bash
npm run build
GROQ_API_KEY=test node dist/generate-product-dna.js
# Should use actual extractor class
```

---

## Phase 6: Visual Proof Gallery (60 min)

### Task 6.1: Create Variation Generator Script
**New file: `scripts/generate-variations.mjs`**

```javascript
import { GenomeSequencer } from "../dist/genome/sequencer.js";
import { CSSGenerator } from "../dist/generators/css-generator.js";

const sequencer = new GenomeSequencer();
const cssGen = new CSSGenerator();

// Same prompt, different seeds
const prompt = "Japanese Y2K football stats dashboard";
const contexts = [
    { seed: "client-a", context: "Tokyo street culture, aggressive, neon" },
    { seed: "client-b", context: "Traditional, minimal, paper textures" },
    { seed: "client-c", context: "Cyberpunk, metallic, high-tech" }
];

for (const { seed, context } of contexts) {
    // Note: Would need to call LLM or use archetype
    const genome = sequencer.generate(seed, {
        informationDensity: 0.8,
        temporalUrgency: 0.9,
        emotionalTemperature: 0.4,
        playfulness: 0.7,
        spatialDependency: 0.6
    });
    
    const css = cssGen.generate(genome, "tailwind");
    await fs.writeFile(`./gallery/${seed}.config.js`, css);
}
```

### Task 6.2: Create Gallery Page
**New file: `website/gallery.html`**

Simple static page showing:
- Side-by-side comparison of 3 variations
- DNA hash for each
- Trait values table
- Color palette visualization

**Verification:**
```bash
ls -la website/gallery/
# Should show 3+ different configs
```

---

## Phase 7: Mathematical Logo (45 min)

### Task 7.1: Create P(n,r) SVG Symbol
**Modify `website/src/components/Logo.tsx`** (new component):

```typescript
export function PermutationsLogo({ color = "currentColor" }) {
    return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* P(n,r) mathematical notation stylized */}
            <text x="10" y="60" fontFamily="serif" fontSize="40" fill={color}>P</text>
            <text x="50" y="40" fontFamily="serif" fontSize="20" fill={color}>(</text>
            <text x="60" y="40" fontFamily="serif" fontSize="20" fill={color}>n</text>
            <text x="75" y="40" fontFamily="serif" fontSize="20" fill={color}>,</text>
            <text x="85" y="40" fontFamily="serif" fontSize="20" fill={color}>r</text>
            <text x="95" y="40" fontFamily="serif" fontSize="20" fill={color}>)</text>
            
            {/* DNA helix curve connecting */}
            <path 
                d="M10,70 Q30,90 50,70 T90,70" 
                fill="none" 
                stroke={color} 
                strokeWidth="3"
            />
        </svg>
    );
}
```

### Task 7.2: Replace Logo in Navbar and Footer
**Modify `website/src/components/Navbar.tsx` and `Footer.tsx`:**

Replace organic SVG with `PermutationsLogo` component.

---

## Phase 8: Test Suite (90 min)

### Task 8.1: Add Jest Configuration
**New files:**
- `jest.config.js`
- `tests/sequencer.test.ts`
- `tests/extractor.test.ts`

### Task 8.2: Write Critical Tests

```typescript
// tests/sequencer.test.ts
describe("GenomeSequencer", () => {
    test("same seed produces same genome", () => {
        const seq = new GenomeSequencer();
        const g1 = seq.generate("seed-a", traits);
        const g2 = seq.generate("seed-a", traits);
        expect(g1.dnaHash).toBe(g2.dnaHash);
    });
    
    test("different seeds produce different genomes", () => {
        const seq = new GenomeSequencer();
        const g1 = seq.generate("seed-a", traits);
        const g2 = seq.generate("seed-b", traits);
        expect(g1.dnaHash).not.toBe(g2.dnaHash);
        expect(g1.chromosomes.ch5_color_primary.hue).not.toBe(g2.chromosomes.ch5_color_primary.hue);
    });
    
    test("dashboard archetype forces flat topology", () => {
        const seq = new GenomeSequencer();
        const genome = seq.generateFromArchetype("dashboard", "test");
        expect(genome.chromosomes.ch1_structure.topology).toBe("flat");
        expect(genome.chromosomes.ch8_motion.physics).toBe("none");
    });
});
```

### Task 8.3: Integration Tests

```typescript
// tests/integration.test.ts
test("end-to-end: content analysis → genome → CSS", async () => {
    const analyzer = new ContentAnalyzer();
    const analysis = await analyzer.analyze({
        intent: "architect portfolio",
        images: [/* warm tones */],
        documents: []
    });
    
    const sequencer = new GenomeSequencer();
    const genome = sequencer.generate({
        contentAnalysis: analysis,
        seed: "arch-test",
        mutationRate: 0.3
    });
    
    // Should be influenced by warm tones
    expect(genome.chromosomes.ch5_color_primary.temperature).toBe("warm");
});
```

**Verification:**
```bash
npm test
# All tests should pass
```

---

## Phase 9: Documentation (45 min)

### Task 9.1: Create DESIGN.md
**New file: `DESIGN.md`**

Contents:
1. Core Philosophy (biological metaphor)
2. The 15 Chromosomes (detailed)
3. Epistasis Rules (bonding constraints)
4. Content Analysis Pipeline
5. Multi-LLM Architecture
6. Usage Examples

### Task 9.2: Update README.md
Add:
- Quick start with all 4 LLM options
- Gallery link
- Architecture diagram

### Task 9.3: Add inline code documentation
JSDoc comments for all public methods.

---

## Timeline & Dependencies

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| 1: Branding | 30 min | None |
| 2: Multi-LLM | 90 min | npm packages |
| 3: Archetypes | 60 min | None |
| 4: Enforcement | 90 min | Phase 3 |
| 5: Dogfooding | 30 min | Phase 2 |
| 6: Gallery | 60 min | Phase 5 |
| 7: Logo | 45 min | None |
| 8: Tests | 90 min | All above |
| 9: Docs | 45 min | All above |
| **Total** | **~9 hours** | |

---

## Success Criteria

- [ ] Zero "V3" strings in codebase (except git history)
- [ ] All 4 LLM providers functional
- [ ] Archetype mode works without API key
- [ ] Forbidden patterns are blocked, not just warned
- [ ] Dogfooding script uses extractor class
- [ ] Gallery shows 3+ variations of same prompt
- [ ] Logo reflects P(n,r) permutation concept
- [ ] Test coverage > 70%
- [ ] DESIGN.md explains architecture

---

## Risk Mitigation

1. **Anthropic SDK issues**: Have fallback to fetch API
2. **Gemini rate limits**: Implement caching layer
3. **Tests flaky**: Use deterministic seeds
4. **Breaking changes**: Tag v1.0 before fixes
