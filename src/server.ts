import * as fs from "fs/promises";
import * as fsSync from "fs";
import * as path from "path";
import * as crypto from "crypto";

// Load .env if present (no dotenv dep — pure Node.js)
// Does NOT override vars already set in the environment, so shell vars win.
try {
    const envFile = path.join(path.dirname(new URL(import.meta.url).pathname), "../.env");
    if (fsSync.existsSync(envFile)) {
        const lines = fsSync.readFileSync(envFile, "utf-8").split("\n");
        for (const line of lines) {
            const m = line.match(/^\s*([^#=\s][^=]*?)\s*=\s*(.*)\s*$/);
            if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
        }
    }
} catch { /* ignore */ }
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    ErrorCode,
    McpError
} from "@modelcontextprotocol/sdk/types.js";
import { SemanticTraitExtractor } from "./semantic/extractor.js";
import { GenomeSequencer } from "./genome/sequencer.js";
import { CSSGenerator } from "./css-generator.js";
import { HTMLGenerator } from "./html-generator.js";
import { WebGLGenerator } from "./generators/webgl-generator.js";
import { FXGenerator } from "./generators/fx-generator.js";
import { SVGGenerator } from "./generators/svg-generator.js";
import { EpigeneticParser } from "./genome/epigenetics.js";
import { detectArchetype } from "./genome/archetypes.js";
import { PatternDetector } from "./constraints/pattern-detector.js";
import { ecosystemGenerator, Ecosystem } from "./genome/ecosystem.js";
import { CivilizationGenerator } from "./genome/civilization.js";
import { ComplexityAnalyzer } from "./genome/complexity-analyzer.js";
import { generateCivilizationOutput } from "./generators/civilization-generators.js";

import { formatGenerator } from "./generators/format-generators.js";
import { designBriefGenerator } from "./generators/design-brief-generator.js";
import { urlGenomeExtractor } from "./genome/extractor-url.js";

class DesignGenomeServer {
    private server: Server;
    private extractor: SemanticTraitExtractor;
    private sequencer: GenomeSequencer;
    private cssGen: CSSGenerator;
    private htmlGen: HTMLGenerator;
    private webglGen: WebGLGenerator;
    private fxGen: FXGenerator;
    private svgGen: SVGGenerator;
    private epigeneticParser: EpigeneticParser;
    private patternDetector: PatternDetector;

    private civilizationGen: CivilizationGenerator;
    private complexityAnalyzer: ComplexityAnalyzer;


    constructor() {
        this.server = new Server(
            { name: "permutations", version: "0.0.7" },
            { capabilities: { tools: {} } }
        );

        this.extractor = new SemanticTraitExtractor();
        this.sequencer = new GenomeSequencer();
        this.cssGen = new CSSGenerator();
        this.htmlGen = new HTMLGenerator();
        this.webglGen = new WebGLGenerator();
        this.fxGen = new FXGenerator();
        this.svgGen = new SVGGenerator();
        this.epigeneticParser = new EpigeneticParser();
        this.patternDetector = new PatternDetector();

        this.civilizationGen = new CivilizationGenerator();
        this.complexityAnalyzer = new ComplexityAnalyzer();


        this.setupHandlers();
    }

    private setupHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: "generate_design_genome",
                    description: "STEP 1 — Start here for every design task. Sequences a 32-chromosome design genome from a natural language intent. Returns CSS tokens, color system, typography, spacing, motion constraints, and a suggested_next workflow guide. All other tools require the genome this produces.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            intent: { type: "string", description: "Natural language design intent (e.g., 'Japanese Y2K football site')" },
                            seed: { type: "string", description: "Unique project seed or timestamp to ensure specific DNA generation" },
                            project_context: { type: "string", description: "Overarching narrative or biological metaphor guiding the project" },
                            brand_asset_paths: {
                                type: "array",
                                items: { type: "string" },
                                description: "Absolute paths to any brand guidelines (PDF) or logos (PNG) for Epigenetic modification"
                            },
                            font_provider: {
                                type: "string",
                                enum: ["bunny", "google"],
                                description: "Typography provider (default: bunny)"
                            },
                            offline: {
                                type: "boolean",
                                description: "Skip LLM semantic extraction — use hash-based trait inference instead. Faster, no API cost, deterministic. Use when you have a clear seed and don't need sector detection.",
                                default: false
                            }
                        },
                        required: ["intent", "seed"]
                    }
                },
                {
                    name: "validate_design",
                    description: "FINAL STEP — Call before shipping any CSS or HTML. Validates code against genome DNA constraints and checks for forbidden slop patterns (gradients on text, bootstrap shadows, AI tells). Returns violation list and slop score.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            genome: { type: "object", description: "The design genome from generate_design_genome" },
                            css: { type: "string", description: "CSS code to validate" },
                            html: { type: "string", description: "HTML code to validate (optional)" }
                        },
                        required: ["genome", "css"]
                    }
                },
                {
                    name: "generate_ecosystem",
                    description: "STEP 3 (optional) — Call after generate_design_genome when building a component library or design system. Returns a biological component hierarchy: microbial (atomic), flora (composite), fauna (complex). Provides component specs, prop contracts, containment relationships, and civilization readiness — NOT generated code.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            intent: { type: "string", description: "Natural language design intent" },
                            seed: { type: "string", description: "Unique ecosystem seed" },
                            project_context: { type: "string", description: "Environment context" },
                            options: {
                                type: "object",
                                properties: {
                                    microbialCount: { type: "number", description: "Number of microbial organisms (default: auto-scaled from complexity tier)" },
                                    floraCount: { type: "number", description: "Number of flora organisms (default: auto-scaled from complexity tier)" },
                                    faunaCount: { type: "number", description: "Number of fauna organisms (default: auto-scaled from complexity tier)" }
                                }
                            }
                        },
                        required: ["intent", "seed"]
                    }
                },
                {
                    name: "generate_civilization",
                    description: "STEP 4 (optional) — Call after generate_ecosystem when complexity >= 0.68. Returns application architecture direction: state topology, routing patterns, token inheritance rules, and component composition contracts. Does NOT generate code by default (set generate_code: true to opt in). The agent implements from these specs.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            intent: { type: "string", description: "Natural language design intent. Use complex keywords: dashboard, platform, 3D, real-time, collaborative" },
                            seed: { type: "string", description: "Unique project seed" },
                            project_context: { type: "string", description: "Detailed project context (longer = more sophisticated)" },
                            ecosystem: {
                                type: "object",
                                description: "OPTIONAL: Ecosystem from generate_ecosystem. If provided, civilization will use those organisms and add architecture. Recommended for component library → application flow."
                            },
                            min_tier: {
                                type: "string",
                                enum: ["tribal", "city_state", "nation_state", "empire", "network", "singularity"],
                                description: "Minimum civilization tier (optional - forces complexity). tribal=0.81+, city_state=0.87+, nation_state=0.92+, empire=0.95+, network=0.97+, singularity=0.99+"
                            },
                            generate_code: {
                                type: "boolean",
                                description: "Whether to generate actual React/TypeScript code (default: false — returns architecture specs only)",
                                default: false
                            },
                            font_provider: {
                                type: "string",
                                enum: ["bunny", "google"],
                                description: "Typography provider"
                            }
                        },
                        required: ["intent", "seed"]
                    }
                },
                {
                    name: "update_design_genome",
                    description: "ITERATE — Call after generate_design_genome to adjust specific chromosomes. Use for 'make it warmer', 'increase motion', 'change the sector to fintech' workflows. Returns a diff of changed chromosomes and the updated genome.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            original_genome: { type: "object", description: "The original design genome to modify" },
                            changes: {
                                type: "object",
                                description: "Specific changes to apply",
                                properties: {
                                    primary_hue: { type: "number", description: "New primary color hue (0-360)" },
                                    motion_physics: { type: "string", enum: ["none", "spring", "step", "glitch"] },
                                    edge_radius: { type: "number" },
                                    hero_type: { type: "string" },
                                    sector: { type: "string" },
                                    new_seed: { type: "string", description: "Generate completely new DNA with this seed" }
                                }
                            },
                            preserve_traits: {
                                type: "boolean",
                                description: "Keep original trait analysis (default: true)",
                                default: true
                            }
                        },
                        required: ["original_genome", "changes"]
                    }
                },
                {
                    name: "generate_formats",
                    description: "EXPORT — Call after generate_design_genome to export design tokens for external tools. Outputs Figma Tokens, Style Dictionary (CSS/SCSS/iOS/Android), styled-components theme, Emotion theme, Vue 3 SFC, or Svelte scoped styles.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            genome: { type: "object", description: "Design genome from generate_design_genome" },
                            tier: { type: "object", description: "Optional: Civilization tier for component generation" },
                            formats: {
                                type: "array",
                                items: {
                                    type: "string",
                                    enum: ["figma-tokens", "style-dictionary", "styled-components", "emotion", "vue", "svelte", "all"]
                                },
                                description: "Formats to generate"
                            }
                        },
                        required: ["genome", "formats"]
                    }
                },
                {
                    name: "generate_design_brief",
                    description: "STEP 2 — Call after generate_design_genome before writing any code. Converts the genome into a human/agent-readable design brief: visual direction, strategic decisions, copy intelligence, and implementation guidance. This is what a designer hands to a developer or an agent reads before making implementation choices.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            genome: {
                                type: "object",
                                description: "The design genome from generate_design_genome or generate_civilization"
                            },
                            format: {
                                type: "string",
                                enum: ["prose", "json", "markdown"],
                                description: "Output format (default: prose)",
                                default: "prose"
                            }
                        },
                        required: ["genome"]
                    }
                },
                {
                    name: "extract_genome_from_url",
                    description: "ALTERNATIVE ENTRY — Use instead of generate_design_genome when you have a reference site. Reverse-engineers an approximate genome from a URL using Playwright browser automation. Extracts colors, fonts, spacing, and animation from computed styles. Best for 'I love this site, make something like it' workflows.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            url: {
                                type: "string",
                                description: "Website URL to analyze (e.g., https://stripe.com)"
                            }
                        },
                        required: ["url"]
                    }
                }
            ]
        }));

        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const args = request.params.arguments as any;

            // === Input Validation Helpers ===
            const validateArgs = (
                fields: { name: string; required: boolean; maxLength?: number }[]
            ) => {
                for (const field of fields) {
                    const val = args[field.name];
                    if (field.required && (val === undefined || val === null || val === "")) {
                        throw new McpError(
                            ErrorCode.InvalidParams,
                            `Missing required parameter: '${field.name}'`
                        );
                    }
                    if (val !== undefined && typeof val === "string" && field.maxLength && val.length > field.maxLength) {
                        throw new McpError(
                            ErrorCode.InvalidParams,
                            `Parameter '${field.name}' exceeds maximum length of ${field.maxLength} characters`
                        );
                    }
                }
            };
            const sanitize = (s: string): string => s.trim().replace(/\0/g, "");

            try {
                switch (request.params.name) {
                    case "generate_design_genome": {
                        validateArgs([
                            { name: "intent", required: true, maxLength: 32_768 },
                            { name: "seed", required: true, maxLength: 256 },
                            { name: "project_context", required: false, maxLength: 16_384 },
                        ]);
                        const intent = sanitize(args.intent);
                        const seed = sanitize(args.seed);
                        const context = args.project_context ? sanitize(args.project_context) : undefined;

                        // 1. Epigenetic Parsing (if assets provided)
                        let epigeneticData = undefined;
                        if (args.brand_asset_paths && Array.isArray(args.brand_asset_paths) && args.brand_asset_paths.length > 0) {
                            epigeneticData = await this.epigeneticParser.parseAssets(
                                args.brand_asset_paths.slice(0, 10) // cap at 10 files
                            );
                        }

                        // 2. Semantic Extraction (single LLM call: traits + sector + archetype + copy intelligence)
                        // When offline: true, skip LLM and use hash-based trait inference
                        const finalContext = epigeneticData?.brandContext || context;
                        let traits: any, detectedSector: any, copyIntelligence: any, copy: any;
                        if (args.offline) {
                            traits = await this.extractor.extractTraits(intent, finalContext ?? "");
                            detectedSector = "technology";
                            copyIntelligence = undefined;
                            copy = undefined;
                        } else {
                            const analysis = await this.extractor.analyze(intent, finalContext);
                            traits = analysis.traits;
                            detectedSector = analysis.sector.primary as any;
                            copyIntelligence = analysis.copyIntelligence;
                            copy = analysis.copy;
                        }

                        // 4. DNA Sequencing (pass copy intelligence + LLM copy to sequencer)
                        const genome = this.sequencer.generate(seed, traits, {
                            primarySector: detectedSector,
                            options: {
                                fontProvider: args.font_provider,
                                copyIntelligence,
                                copy
                            }
                        }, epigeneticData);

                        // 5. Complexity Analysis — determines output tier
                        const complexityResult = this.complexityAnalyzer.analyze(intent, finalContext ?? "", traits);
                        const { finalComplexity, tier } = complexityResult;

                        // 6. CSS (always generated)
                        const css = this.cssGen.generate(genome, { format: "expanded" });
                        const topology = this.htmlGen.generateTopology(genome);
                        const webglComponents = this.webglGen.generateR3F(genome);
                        const fxAtmosphere = this.fxGen.generateCSSClass(genome);
                        const svgBiomarker = this.svgGen.generateBiomarker(genome);

                        // 7. Ecosystem-first civilization pipeline
                        //
                        // Biology rule: civilization cannot precede ecosystem.
                        // Ecosystem (organisms + relationships) must exist before civilization
                        // (architecture) can emerge from it.
                        //
                        // Thresholds:
                        //   < 0.11  abiotic           — HTML/CSS only, organism counts are zero
                        //   0.11–0.80 ecosystem tiers — organisms scale from prokaryotic to endotherm_fauna
                        //   0.81+  civilization tiers — emerges FROM ecosystem (tribal → singularity)
                        //
                        // When below civilization threshold: ecosystemOutput is populated,
                        // civilizationOutput is null, and civilizationGap tells the caller
                        // how far complexity needs to increase to cross the tribal (0.81) threshold.

                        // HTML always generated for every tier
                        const html = this.htmlGen.generate(genome, {
                            includeHeader: true,
                            includeFooter: true,
                            includeSections: true
                        });

                        let ecosystemOutput: unknown | undefined;
                        let civilizationOutput: unknown | undefined;

                        // Ecosystem always runs — organism counts scale from 0 (abiotic) to max (endotherm_fauna)
                        {
                            const eco = ecosystemGenerator.generate(seed, traits, {
                                primarySector: detectedSector
                            });

                            const allOrganisms = [
                                ...eco.organisms.microbial,
                                ...eco.organisms.flora,
                                ...eco.organisms.fauna
                            ];

                            ecosystemOutput = {
                                organisms: {
                                    counts: {
                                        microbial: eco.organisms.microbial.length,
                                        flora:     eco.organisms.flora.length,
                                        fauna:     eco.organisms.fauna.length,
                                        total:     eco.organisms.total
                                    },
                                    microbial: eco.organisms.microbial.map(o => ({
                                        id: o.id, name: o.name, category: o.category,
                                        colorTreatment: o.characteristics.colorTreatment
                                    })),
                                    flora: eco.organisms.flora.map(o => ({
                                        id: o.id, name: o.name, category: o.category,
                                        motionStyle: o.characteristics.motionStyle
                                    })),
                                    fauna: eco.organisms.fauna.map(o => ({
                                        id: o.id, name: o.name, category: o.category,
                                        complexity: o.adaptation.entropy
                                    }))
                                },
                                relationships: eco.relationships
                                    .filter(r => r.type === "containment")
                                    .slice(0, 10)
                                    .map(r => ({
                                        container: r.organisms[0],
                                        contained: r.organisms[1],
                                        pattern: r.pattern
                                    })),
                                evolution: eco.evolution,
                                civilizationReady: eco.civilizationReady,
                                // How far complexity needs to grow to reach tribal (0.81) threshold
                                civilizationGap: parseFloat(
                                    Math.max(0, 0.81 - eco.evolution.complexity).toFixed(3)
                                )
                            };

                            // Civilization emerges from ecosystem when complexity crosses tribal (0.81)
                            if (finalComplexity >= 0.81) {
                                try {
                                    const civTier = this.civilizationGen.generate(
                                        intent, finalContext ?? "", traits, genome
                                    );
                                    // Pass ecosystem organisms — civilization uses topology-derived
                                    // organism specs, not the generic tier component list
                                    civilizationOutput = generateCivilizationOutput(
                                        civTier, genome, css, undefined, allOrganisms
                                    );
                                } catch { /* ecosystem output still valid without civilization */ }
                            }
                        }

                        // 8. Auto pattern detection on generated output
                        const patternViolations = this.patternDetector.detectInGenome(
                            genome as any,
                            css,
                            html ?? ""
                        );
                        const patternReport = this.patternDetector.generateReport(patternViolations);

                        const genome_report = this.buildGenomeReport(genome, {
                            intent,
                            seed,
                            sector: detectedSector,
                            complexity: finalComplexity,
                            tier: String(tier),
                            offline: args.offline ?? false,
                            traits
                        });

                        const suggested_next = [
                            {
                                tool: "generate_design_brief",
                                reason: "Human/agent-readable design direction — call this before writing any code",
                                always: true
                            },
                            {
                                tool: "generate_ecosystem",
                                reason: "Component library architecture — call when building a design system or multiple components",
                                when: "building multiple components or a full UI library"
                            },
                            ...(finalComplexity >= 0.68 ? [{
                                tool: "generate_civilization",
                                reason: `Application architecture direction — complexity ${finalComplexity.toFixed(2)} qualifies`,
                                when: `complexity >= 0.68 — this genome qualifies (${finalComplexity.toFixed(2)})`
                            }] : []),
                            {
                                tool: "validate_design",
                                reason: "Run before shipping any CSS or HTML to catch slop patterns",
                                always: true
                            }
                        ];

                        return {
                            content: [{
                                type: "text",
                                text: JSON.stringify({
                                    genome,
                                    tier,
                                    finalComplexity,
                                    topology,
                                    css,
                                    html,
                                    // ecosystem: always present — organism counts scale with complexity tier
                                    // abiotic returns empty organism arrays, not null
                                    ecosystemOutput: ecosystemOutput ?? null,
                                    // civilization: present when complexity >= 0.81 (tribal+)
                                    // emerges FROM ecosystem, never standalone
                                    // null when complexity < 0.81 — use ecosystemOutput.civilizationGap
                                    civilizationOutput: civilizationOutput ?? null,
                                    webglComponents,
                                    fxAtmosphere,
                                    svgBiomarker,
                                    patternReport,
                                    patternViolations: patternViolations.filter(v => v.severity === "error"),
                                    suggested_next,
                                    genome_report
                                }, null, 2)
                            }]
                        };
                    }


                    case "validate_design": {
                        if (!args.genome || !args.css) {
                            throw new McpError(ErrorCode.InvalidParams, "Missing genome or css");
                        }

                        const violations = this.patternDetector.detectInGenome(
                            args.genome,
                            args.css,
                            args.html
                        );

                        const report = this.patternDetector.generateReport(violations);
                        const valid = violations.filter(v => v.severity === "error").length === 0;

                        return {
                            content: [{
                                type: "text",
                                text: JSON.stringify({
                                    valid,
                                    violations,
                                    report,
                                    slop_score: violations.length
                                }, null, 2)
                            }]
                        };
                    }

                    case "generate_ecosystem": {
                        if (!args.intent || !args.seed) {
                            throw new McpError(ErrorCode.InvalidParams, "Missing intent or seed");
                        }

                        // M-13: Use analyze() to extract traits AND sector together
                        // Previously used extractTraits() which discarded sector info,
                        // then passed args.options (user-supplied) which loses the inferred sector
                        const context = args.project_context || "";
                        let ecoTraits: any;
                        let ecoSector: string = "technology";
                        try {
                            const ecoAnalysis = await this.extractor.analyze(args.intent, context);
                            ecoTraits = ecoAnalysis.traits;
                            ecoSector = ecoAnalysis.sector?.primary || "technology";
                        } catch {
                            // Offline fallback
                            ecoTraits = await this.extractor.extractTraits(args.intent, context);
                        }

                        // Generate ecosystem - pass inferred sector so organisms reflect correct domain
                        const ecosystem = ecosystemGenerator.generate(args.seed, ecoTraits, {
                            ...(args.options || {}),
                            primarySector: ecoSector
                        });

                        // Generate CSS from the shared genome
                        const css = this.cssGen.generate(ecosystem.environment.genome, { format: "compressed" });
                        const topology = this.htmlGen.generateTopology(ecosystem.environment.genome);

                        // Organize organisms by category
                        const organisms = {
                            microbial: ecosystem.organisms.microbial.map(o => ({
                                id: o.id,
                                name: o.name,
                                variants: o.spec.variants,
                                props: o.spec.props.map(p => p.name),
                                containedBy: o.relationships.predator,
                                colorTreatment: o.characteristics.colorTreatment
                            })),
                            flora: ecosystem.organisms.flora.map(o => ({
                                id: o.id,
                                name: o.name,
                                variants: o.spec.variants,
                                props: o.spec.props.map(p => p.name),
                                contains: o.relationships.prey,
                                containedBy: o.relationships.predator,
                                motionStyle: o.characteristics.motionStyle
                            })),
                            fauna: ecosystem.organisms.fauna.map(o => ({
                                id: o.id,
                                name: o.name,
                                variants: o.spec.variants,
                                props: o.spec.props.map(p => p.name),
                                contains: o.relationships.prey,
                                complexity: o.adaptation.entropy
                            }))
                        };

                        // Key relationships for composition patterns
                        const keyRelationships = ecosystem.relationships
                            .filter(r => r.type === 'containment')
                            .slice(0, 10)
                            .map(r => ({
                                container: r.organisms[0],
                                contained: r.organisms[1],
                                pattern: r.pattern
                            }));

                        const ecosystemReportLines = [
                            `# Ecosystem Report`,
                            ``,
                            `## Seed → Organisms`,
                            `| Field | Value |`,
                            `|---|---|`,
                            `| Intent | ${args.intent} |`,
                            `| Seed | \`${args.seed}\` |`,
                            `| Sector | **${ecoSector}** |`,
                            `| Complexity | ${ecosystem.evolution.complexity.toFixed(3)} |`,
                            `| Civilization ready | ${ecosystem.civilizationReady ? "Yes — call generate_civilization" : `No — gap: ${(ecosystem.civilizationThreshold - ecosystem.evolution.complexity).toFixed(3)}`} |`,
                            ``,
                            `## Organism Hierarchy`,
                            ``,
                            `### Microbial (atomic components) — ${ecosystem.organisms.microbial.length}`,
                            ...ecosystem.organisms.microbial.map(o => `- **${o.name}** (${o.id}) — color: ${o.characteristics.colorTreatment}`),
                            ``,
                            `### Flora (composite components) — ${ecosystem.organisms.flora.length}`,
                            ...ecosystem.organisms.flora.map(o => `- **${o.name}** (${o.id}) — motion: ${o.characteristics.motionStyle}`),
                            ``,
                            `### Fauna (complex components) — ${ecosystem.organisms.fauna.length}`,
                            ...ecosystem.organisms.fauna.map(o => `- **${o.name}** (${o.id}) — entropy: ${o.adaptation.entropy.toFixed(2)}`),
                            ``,
                            `## Containment Map`,
                            ...ecosystem.relationships.filter((r: any) => r.type === "containment").slice(0, 10).map((r: any) => `- **${r.organisms[0]}** → contains → **${r.organisms[1]}** (pattern: ${r.pattern})`),
                            ``,
                            `## What This Means for Implementation`,
                            `- Microbial = atoms: build these first`,
                            `- Flora = molecules: compose from microbial`,
                            `- Fauna = organisms: compose from flora + microbial`,
                            `- All components share one genome — colors, spacing, and motion are inherited, not redefined per component`,
                        ];
                        const ecosystem_report = ecosystemReportLines.join("\n");

                        return {
                            content: [{
                                type: "text",
                                text: JSON.stringify({
                                    ecosystem_report,
                                    ecosystem: {
                                        environment: {
                                            dnaHash: ecosystem.environment.genome.dnaHash,
                                            habitabilityScore: ecosystem.environment.habitabilityScore,
                                            carryingCapacity: ecosystem.environment.carryingCapacity
                                        },
                                        organisms: {
                                            counts: {
                                                microbial: ecosystem.organisms.microbial.length,
                                                flora: ecosystem.organisms.flora.length,
                                                fauna: ecosystem.organisms.fauna.length,
                                                total: ecosystem.organisms.total
                                            },
                                            ...organisms
                                        },
                                        evolution: ecosystem.evolution,
                                        relationships: {
                                            total: ecosystem.relationships.length,
                                            containment: keyRelationships,
                                            symbiosis: ecosystem.relationships
                                                .filter(r => r.type === 'symbiosis')
                                                .slice(0, 5)
                                                .map(r => ({ organisms: r.organisms, pattern: r.pattern }))
                                        },
                                        civilization: {
                                            ready: ecosystem.civilizationReady,
                                            threshold: ecosystem.civilizationThreshold,
                                            currentComplexity: ecosystem.evolution.complexity,
                                            gap: Math.max(0, ecosystem.civilizationThreshold - ecosystem.evolution.complexity)
                                        }
                                    },
                                    sharedGenome: ecosystem.environment.genome,
                                    css,
                                    topology,
                                    usage: {
                                        whenCivilizationReady: ecosystem.civilizationReady
                                            ? "Call generate_civilization with the same seed to get architecture, state management, and advanced patterns"
                                            : `Add complexity (dashboard, 3D, real-time keywords) or increase counts to reach threshold ${ecosystem.civilizationThreshold}`,
                                        componentHierarchy: "Fauna contain Flora contain Microbial — use relationships.containment for composition",
                                        implementation: "Each organism is a component spec. Implement from its prop contract and colorTreatment — the agent writes the actual code."
                                    }
                                }, null, 2)
                            }]
                        };
                    }

                    case "generate_civilization": {
                        if (!args.intent || !args.seed) {
                            throw new McpError(ErrorCode.InvalidParams, "Missing intent or seed");
                        }

                        // M-12: Single LLM call — use analyze() to get both traits AND sector at once
                        const context = args.project_context || "";
                        let civTraits: any;
                        let civSector: string = "technology";
                        try {
                            const civAnalysis = await this.extractor.analyze(args.intent, context);
                            civTraits = civAnalysis.traits;
                            civSector = civAnalysis.sector?.primary || "technology";
                        } catch {
                            // Fallback: extractTraits with default sector
                            civTraits = await this.extractor.extractTraits(args.intent, context);
                        }

                        // ECOSYSTEM INTEGRATION: Use provided ecosystem or generate standalone
                        let ecosystem = args.ecosystem;
                        let baseGenome = null;
                        let organisms = null;
                        
                        if (ecosystem) {
                            // Use ecosystem's organisms and genome
                            baseGenome = ecosystem.environment?.genome;
                            organisms = ecosystem.organisms;
                        }
                        
                        // If no ecosystem or genome, generate using already-derived sector (no second LLM call)
                        if (!baseGenome) {
                            baseGenome = this.sequencer.generate(args.seed, civTraits, { primarySector: civSector as any });
                        }
                        const traits = civTraits;

                        // Generate civilization tier
                        const tier = this.civilizationGen.generate(
                            args.intent,
                            context,
                            traits,
                            baseGenome,
                            args.min_tier
                        );

                        // Generate code and structured file outputs
                        let codeOutputs = null;
                        let fileStructure = null;

                        if (args.generate_code === true) {
                            // UNIFIED CSS: Use CSSGenerator like other tools
                            const css = this.cssGen.generate(baseGenome, { format: "compressed" });
                            const topology = this.htmlGen.generateTopology(baseGenome);
                            
                            // Generate code using genome with unified CSS/topology
                            codeOutputs = generateCivilizationOutput(tier, baseGenome, css, topology);

                            // Use ecosystem organisms if available, otherwise use tier components
                            const componentList = organisms 
                                ? [...organisms.microbial, ...organisms.flora, ...organisms.fauna]
                                : tier.components.list;

                            // Generate file structure for easy consumption
                            fileStructure = {
                                components: componentList.map((c: any) => ({
                                    name: c.name,
                                    file: `components/${c.name}.tsx`,
                                    category: c.category,
                                    variants: c.spec?.variants || c.variants
                                })),
                                styles: ["styles/tokens.css", "styles/genome.css"],
                                lib: ["lib/animations.ts", "lib/interactions.ts"],
                                config: ["tailwind.config.js"]
                            };
                        }

                        const civReportLines = [
                            `# Civilization Report`,
                            ``,
                            `## Intent → Architecture`,
                            `| Field | Value |`,
                            `|---|---|`,
                            `| Intent | ${args.intent} |`,
                            `| Seed | \`${args.seed}\` |`,
                            `| Sector | **${civSector}** |`,
                            `| Tier reached | **${tier.tier}** (complexity: ${tier.complexity.toFixed(3)}) |`,
                            `| Source | ${ecosystem ? "ecosystem-derived" : "standalone (no ecosystem provided)"} |`,
                            `| Code generated | ${args.generate_code === true ? "Yes" : "No — architecture specs only"} |`,
                            ``,
                            `## Architecture Direction`,
                            ...(tier.architecture ? Object.entries(tier.architecture).map(([k, v]) => `- **${k}:** ${JSON.stringify(v)}`) : ["- (no architecture data)"]),
                            ``,
                            `## Design System Constraints`,
                            ...(tier.designSystem ? Object.entries(tier.designSystem).map(([k, v]) => `- **${k}:** ${JSON.stringify(v)}`) : ["- (no design system data)"]),
                            ``,
                            `## What This Means for Implementation`,
                            `- This is architecture direction, NOT code — implement from these specs`,
                            `- State topology, routing patterns, and token inheritance tell you HOW to structure your app`,
                            `- Component composition contracts tell you WHAT components to build and how they nest`,
                            `- Run validate_design on any CSS/HTML you produce from this direction`,
                        ];
                        const civilization_report = civReportLines.join("\n");

                        return {
                            content: [{
                                type: "text",
                                text: JSON.stringify({
                                    civilization_report,
                                    tier: tier.tier,
                                    complexity: tier.complexity,
                                    architecture: tier.architecture,
                                    source: ecosystem ? "ecosystem" : "standalone",
                                    components: {
                                        count: organisms 
                                            ? organisms.microbial.length + organisms.flora.length + organisms.fauna.length
                                            : tier.components.count,
                                        list: organisms
                                            ? [...organisms.microbial, ...organisms.flora, ...organisms.fauna].map(o => ({
                                                name: o.name,
                                                category: o.category,
                                                variants: o.spec?.variants
                                            }))
                                            : tier.components.list,
                                        categories: organisms
                                            ? [...new Set([...organisms.microbial, ...organisms.flora, ...organisms.fauna].map(o => o.category))]
                                            : [...new Set(tier.components.list.map(c => c.category))]
                                    },
                                    animations: tier.animations,
                                    designSystem: tier.designSystem,
                                    interactions: tier.interactions,
                                    ai: tier.ai,
                                    files: fileStructure,
                                    code: codeOutputs,
                                    genome: baseGenome,
                                    organisms: organisms ? {
                                        microbial: organisms.microbial.length,
                                        flora: organisms.flora.length,
                                        fauna: organisms.fauna.length
                                    } : null
                                }, null, 2)
                            }]
                        };
                    }


                    case "update_design_genome": {
                        if (!args.original_genome || !args.changes) {
                            throw new McpError(ErrorCode.InvalidParams, "Missing original_genome or changes");
                        }

                        const original = args.original_genome;
                        const changes = args.changes;
                        const preserveTraits = args.preserve_traits !== false;

                        // Track what changed
                        const diff: Record<string, { old: any; new: any }> = {};
                        const newGenome = JSON.parse(JSON.stringify(original)); // Deep clone

                        // Apply changes
                        if (changes.new_seed) {
                            // Generate completely new genome
                            const traits = preserveTraits ? original.traits : await this.extractor.extractTraits("updated", "");
                            const config = { primarySector: changes.sector || original.sectorContext.primary };
                            const regenerated = this.sequencer.generate(changes.new_seed, traits, config);
                            
                            diff["dnaHash"] = { old: original.dnaHash, new: regenerated.dnaHash };
                            diff["full_regeneration"] = { old: false, new: true };
                            
                            return {
                                content: [{
                                    type: "text",
                                    text: JSON.stringify({
                                        type: "full_regeneration",
                                        seed: changes.new_seed,
                                        diff,
                                        genome: regenerated,
                                        previousHash: original.dnaHash
                                    }, null, 2)
                                }]
                            };
                        }

                        // Apply specific chromosome changes
                        if (changes.primary_hue !== undefined) {
                            const oldHue = original.chromosomes?.ch5_color_primary?.hue;
                            newGenome.chromosomes.ch5_color_primary.hue = changes.primary_hue;
                            newGenome.chromosomes.ch5_color_primary.hex = this.hslToHex(
                                changes.primary_hue,
                                newGenome.chromosomes.ch5_color_primary.saturation,
                                newGenome.chromosomes.ch5_color_primary.lightness
                            );
                            diff["ch5_color_primary.hue"] = { old: oldHue, new: changes.primary_hue };
                        }

                        if (changes.motion_physics) {
                            const oldMotion = original.chromosomes?.ch8_motion?.physics;
                            newGenome.chromosomes.ch8_motion.physics = changes.motion_physics;
                            diff["ch8_motion.physics"] = { old: oldMotion, new: changes.motion_physics };
                        }

                        if (changes.edge_radius !== undefined) {
                            const oldRadius = original.chromosomes?.ch7_edge?.radius;
                            newGenome.chromosomes.ch7_edge.radius = changes.edge_radius;
                            diff["ch7_edge.radius"] = { old: oldRadius, new: changes.edge_radius };
                        }

                        if (changes.hero_type) {
                            const oldHero = original.chromosomes?.ch19_hero_type?.type;
                            newGenome.chromosomes.ch19_hero_type.type = changes.hero_type;
                            diff["ch19_hero_type.type"] = { old: oldHero, new: changes.hero_type };
                        }

                        if (changes.sector) {
                            const oldSector = original.sectorContext?.primary;
                            newGenome.sectorContext.primary = changes.sector;
                            diff["sectorContext.primary"] = { old: oldSector, new: changes.sector };
                        }

                        // Recalculate hash if anything changed
                        if (Object.keys(diff).length > 0) {
                            const crypto = await import("crypto");
                            newGenome.dnaHash = crypto.createHash("sha256")
                                .update(JSON.stringify(newGenome.chromosomes))
                                .digest("hex");
                            diff["dnaHash"] = { 
                                old: original.dnaHash, 
                                new: newGenome.dnaHash 
                            };
                        }

                        return {
                            content: [{
                                type: "text",
                                text: JSON.stringify({
                                    type: "partial_update",
                                    changesApplied: Object.keys(diff).length,
                                    diff,
                                    genome: newGenome,
                                    canRevert: true
                                }, null, 2)
                            }]
                        };
                    }

                    case "generate_formats": {
                        if (!args.genome || !args.formats) {
                            throw new McpError(ErrorCode.InvalidParams, "Missing genome or formats");
                        }

                        const genome = args.genome;
                        const tier = args.tier;
                        const requestedFormats = args.formats as string[];
                        const generateAll = requestedFormats.includes("all");

                        const outputs: Record<string, any> = {};

                        if (generateAll || requestedFormats.includes("figma-tokens")) {
                            outputs.figmaTokens = formatGenerator.generateFigmaTokens(genome);
                        }

                        if (generateAll || requestedFormats.includes("style-dictionary")) {
                            outputs.styleDictionary = formatGenerator.generateStyleDictionary(genome);
                        }

                        if (generateAll || requestedFormats.includes("styled-components")) {
                            outputs.styledComponents = formatGenerator.generateStyledComponents(genome);
                        }

                        if (generateAll || requestedFormats.includes("emotion")) {
                            outputs.emotion = formatGenerator.generateEmotion(genome);
                        }

                        if (generateAll || requestedFormats.includes("vue")) {
                            outputs.vue = formatGenerator.generateVueLibrary(genome, tier);
                        }

                        if (generateAll || requestedFormats.includes("svelte")) {
                            outputs.svelte = formatGenerator.generateSvelteLibrary(genome, tier);
                        }

                        return {
                            content: [{
                                type: "text",
                                text: JSON.stringify({
                                    formatsGenerated: Object.keys(outputs).length,
                                    outputs,
                                    usage: {
                                        figmaTokens: "Import into Figma Tokens Studio plugin",
                                        styleDictionary: "Use with Amazon Style Dictionary to generate CSS/SCSS/iOS/Android",
                                        styledComponents: "Import theme into styled-components ThemeProvider",
                                        emotion: "Use with @emotion/react ThemeProvider",
                                        vue: "Single File Components for Vue 3",
                                        svelte: "Svelte components with scoped styles"
                                    }
                                }, null, 2)
                            }]
                        };
                    }

                    case "generate_design_brief": {
                        if (!args.genome) {
                            throw new McpError(ErrorCode.InvalidParams, "Missing genome");
                        }

                        const brief = designBriefGenerator.generate(args.genome);
                        const format = args.format || "prose";

                        let output: string;
                        if (format === "prose" || format === "markdown") {
                            output = brief.prose;
                        } else {
                            output = JSON.stringify(brief, null, 2);
                        }

                        return {
                            content: [{
                                type: "text",
                                text: output
                            }]
                        };
                    }

                    case "extract_genome_from_url": {
                        if (!args.url) {
                            throw new McpError(ErrorCode.InvalidParams, "Missing URL");
                        }

                        // Use Playwright to scrape the URL and extract CSS/design tokens
                        const extracted = await urlGenomeExtractor.extract(args.url);
                        
                        // Clean up browser after extraction
                        await urlGenomeExtractor.closeBrowser();
                        
                        return {
                            content: [{
                                type: "text",
                                text: JSON.stringify({
                                    url: args.url,
                                    sector: extracted.sector,
                                    confidence: extracted.confidence,
                                    colors: extracted.colors,
                                    typography: extracted.typography,
                                    layout: extracted.layout,
                                    animation: extracted.animation,
                                    extractedAt: extracted.extractedAt,
                                    note: "This is an approximation based on computed styles. For better results, use generate_design_genome() to create a purpose-built genome."
                                }, null, 2)
                            }]
                        };
                    }

                    default:
                        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
                }
            } catch (error: any) {
                return {
                    content: [{ type: "text", text: `Error: ${error.message}` }],
                    isError: true
                };
            }
        });
    }

    private buildGenomeReport(genome: any, opts: {
        intent: string;
        seed: string;
        sector: string;
        complexity: number;
        tier: string;
        offline?: boolean;
        traits?: any;
    }): string {
        const ch = genome?.chromosomes ?? {};
        const primary = ch.ch5_color_primary ?? {};
        const temp = ch.ch6_color_temp ?? {};
        const structure = ch.ch1_structure ?? {};
        const motion = ch.ch8_motion ?? {};
        const edge = ch.ch7_edge ?? {};
        const typeDisplay = ch.ch3_type_display ?? {};
        const typeBody = ch.ch4_type_body ?? {};
        const hero = ch.ch19_hero_type ?? {};
        const texture = ch.ch11_texture ?? {};
        const hierarchy = ch.ch10_hierarchy ?? {};
        const colorSystem = ch.ch26_color_system ?? {};

        const pHue = typeof primary.hue === "number" ? `${primary.hue}°` : "–";
        const pSat = typeof primary.saturation === "number" ? `${Math.round(primary.saturation * 100)}%` : "–";
        const pLight = typeof primary.lightness === "number" ? `${Math.round(primary.lightness * 100)}%` : "–";
        const pDark = typeof primary.darkModeLightness === "number" ? `${Math.round(primary.darkModeLightness * 100)}%` : "–";

        const lines = [
            `# Genome Report`,
            ``,
            `## Intent → DNA`,
            `| Field | Value |`,
            `|---|---|`,
            `| Intent | ${opts.intent} |`,
            `| Seed | \`${opts.seed}\` |`,
            `| DNA Hash | \`${genome?.dnaHash ?? "–"}\` |`,
            `| Sector detected | **${opts.sector}**${opts.offline ? " *(offline — hash-inferred, not LLM)*" : ""} |`,
            `| Complexity | ${opts.complexity.toFixed(3)} → **${opts.tier}** tier |`,
            ``,
            `## Chromosomes Sequenced`,
            ``,
            `### ch0 — Sector Identity`,
            `- Primary: **${ch.ch0_sector_primary?.name ?? opts.sector}**`,
            ...(ch.ch0_sector_secondary?.name ? [`- Secondary: ${ch.ch0_sector_secondary.name}`] : []),
            ``,
            `### ch5 + ch6 — Color System`,
            `- Primary hex: \`${primary.hex ?? "–"}\` (hue ${pHue}, sat ${pSat}, light ${pLight})`,
            `- Dark mode interactive: \`${primary.darkModeHex ?? "–"}\` (lightness ${pDark} — visible on dark surfaces)`,
            `- Temperature: ${primary.temperature ?? "–"} | Mode: ${temp.isDark ? "dark" : "light"}`,
            ...(colorSystem.palette ? [`- Palette scale: ${Array.isArray(colorSystem.palette) ? colorSystem.palette.length : "–"} steps`] : []),
            ``,
            `### ch3 + ch4 — Typography`,
            `- Display: **${typeDisplay.family ?? typeDisplay.name ?? "–"}** @ ${typeDisplay.size ?? "–"}`,
            `- Body: **${typeBody.family ?? typeBody.name ?? "–"}** @ ${typeBody.size ?? "–"}`,
            ``,
            `### ch1 + ch9 — Layout & Grid`,
            `- Structure: ${structure.layout ?? structure.type ?? structure.name ?? JSON.stringify(structure).slice(0, 80)}`,
            ``,
            `### ch7 — Edge Geometry`,
            `- Radius: ${edge.radius ?? edge.corner ?? edge.value ?? JSON.stringify(edge).slice(0, 60)}`,
            ``,
            `### ch8 — Motion`,
            `- Physics: ${motion.physics ?? motion.type ?? motion.name ?? JSON.stringify(motion).slice(0, 60)}`,
            ``,
            `### ch11 — Texture`,
            `- Treatment: ${texture.type ?? texture.name ?? JSON.stringify(texture).slice(0, 60)}`,
            ``,
            `### ch10 — Visual Hierarchy`,
            `- Strategy: ${hierarchy.strategy ?? hierarchy.type ?? JSON.stringify(hierarchy).slice(0, 60)}`,
            ``,
            `### ch19 — Hero`,
            `- Type: ${hero.type ?? hero.name ?? JSON.stringify(hero).slice(0, 60)}`,
            ``,
            `## Active Constraints`,
            `- Sector **${opts.sector}** forbidden hue ranges excluded from palette — primary is freely selected from valid spectrum`,
            `- Dark mode buttons use \`darkModeHex\` (${pDark} lightness) to remain visible on dark surfaces`,
            `- All slop patterns (gradient text, generic shadows, generic font stacks) are enforced by \`validate_design\``,
            ``,
            `## Suggested Workflow`,
            `\`\`\``,
            `generate_design_genome  ← you are here`,
            `  ↓`,
            `generate_design_brief   ← read before writing any code`,
            `  ↓ (if building a UI library)`,
            `generate_ecosystem      ← component specs + containment map`,
            ...(opts.complexity >= 0.68 ? [
                `  ↓ (complexity ${opts.complexity.toFixed(2)} qualifies)`,
                `generate_civilization   ← architecture direction`
            ] : []),
            `  ↓`,
            `validate_design         ← run before shipping CSS/HTML`,
            `\`\`\``,
        ];

        return lines.join("\n");
    }

    private hslToHex(h: number, s: number, l: number): string {
        const saturation = s;
        const lightness = l;
        const k = (n: number) => (n + h / 30) % 12;
        const a = saturation * Math.min(lightness, 1 - lightness);
        const f = (n: number) => {
            const color = lightness - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
            return Math.round(255 * color).toString(16).padStart(2, "0");
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error("Permutations MCP server running on stdio");
    }
}

const server = new DesignGenomeServer();
server.run().catch(console.error);

// === Startup environment check ===
if (!SemanticTraitExtractor.isAvailable()) {
    console.error(
        "[ERROR] No LLM API key found in environment. " +
        "Set one of: GROQ_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY, OPENROUTER_API_KEY, or HUGGINGFACE_API_KEY."
    );
    process.exit(1);
}

