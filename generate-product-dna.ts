import { SemanticTraitExtractor } from "./src/semantic/extractor.js";
import { GenomeSequencer } from "./src/genome/sequencer.js";
import { CSSGenerator } from "./src/generators/css-generator.js";
import { HTMLTopologyGenerator } from "./src/generators/html-topology.js";
import { WebGLGenerator } from "./src/generators/webgl-generator.js";
import { FXGenerator } from "./src/generators/fx-generator.js";
import { SVGGenerator } from "./src/generators/svg-generator.js";
import { EpigeneticParser } from "./src/genome/epigenetics.js";

async function run() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        console.error("ERROR: Missing GROQ_API_KEY environment variable.");
        console.error("Run: GROQ_API_KEY=your_key npm run generate");
        process.exit(1);
    }

    // Dogfooding: Test the actual SemanticTraitExtractor class
    const extractor = new SemanticTraitExtractor(apiKey);
    const sequencer = new GenomeSequencer();
    const cssGen = new CSSGenerator();
    const htmlGen = new HTMLTopologyGenerator();
    const webglGen = new WebGLGenerator();
    const fxGen = new FXGenerator();
    const svgGen = new SVGGenerator();
    const epigeneticParser = new EpigeneticParser();

    // The payload structure - partial requirement with full context
    const intent = "A spectacular product landing page";
    const projectContext = "The Permutations Engine: A biological, planetary adaptation system where designs emerge as living organisms adapting to atmospheric conditions. Technical manifesto—avant-garde, uncompromising, deeply parametric.";

    console.log("🧬 PERMUTATIONS DOGFOODING\n");
    console.log("Intent:", intent);
    console.log("Context:", projectContext.slice(0, 80) + "...\n");

    try {
        // Use the ACTUAL SemanticTraitExtractor (not inline duplication)
        const traits = await extractor.extractTraits(intent, projectContext);
        console.log("✅ Extracted Traits:", JSON.stringify(traits, null, 2));

        // Parse any brand assets (V3 Epigenetics)
        const epigeneticData = await epigeneticParser.parseAssets([]);

        // Generate the full DNA
        const genome = sequencer.generate("Permutations Product Page", traits, epigeneticData);

        // Generate all design outputs
        const tailwindConfig = cssGen.generate(genome, "tailwind");
        const topology = htmlGen.generateTopology(genome);
        const webglComponents = webglGen.generateR3F(genome);
        const fxAtmosphere = fxGen.generateCSSClass(genome);
        const svgBiomarker = svgGen.generateBiomarker(genome);

        console.log("\n========= GENOME DNA =========");
        console.log(`Hash: ${genome.dnaHash.slice(0, 24)}...`);
        console.log(`Topology: ${genome.chromosomes.ch1_structure.topology}`);
        console.log(`Grid: ${genome.chromosomes.ch9_grid.logic}`);
        console.log(`Motion: ${genome.chromosomes.ch8_motion.physics}`);
        console.log(`FX: ${genome.chromosomes.ch13_atmosphere.fx}`);
        console.log(`Material: ${genome.chromosomes.ch14_physics.material}`);
        console.log(`Biomarker: ${genome.chromosomes.ch15_biomarker.geometry}`);
        console.log(`Viability Score: ${genome.viabilityScore}`);

        console.log("\n========= TAILWIND CONFIG =========");
        console.log(tailwindConfig);

        console.log("\n========= HTML TOPOLOGY =========");
        console.log(JSON.stringify(topology, null, 2));

        console.log("\n========= WEBGL / 3D =========");
        console.log(webglComponents);

        console.log("\n========= FX ATMOSPHERE =========");
        console.log(fxAtmosphere);

        console.log("\n========= SVG BIOMARKER =========");
        console.log(svgBiomarker);

        // Demonstrate archetype mode (no API key required)
        console.log("\n\n========= ARCHETYPE MODE (No API Key) =========");
        console.log("Generating dashboard archetype...\n");
        
        const archetypeGenome = sequencer.generateFromArchetype("dashboard", "demo-dashboard-001");
        console.log(`Archetype: Departure Board (dashboard)`);
        console.log(`Topology: ${archetypeGenome.chromosomes.ch1_structure.topology}`);
        console.log(`Motion: ${archetypeGenome.chromosomes.ch8_motion.physics}`);
        console.log(`Edge: ${archetypeGenome.chromosomes.ch7_edge.style} (${archetypeGenome.chromosomes.ch7_edge.radius}px)`);
        console.log(`Type: ${archetypeGenome.chromosomes.ch3_type_display.charge}`);
        console.log(`Forbidden: ${archetypeGenome.constraints.forbiddenPatterns.join(", ") || "none"}`);
        console.log(`Bonding Rules: ${archetypeGenome.constraints.bondingRules.join("; ")}`);

    } catch (e) {
        console.error("❌ Error generating DNA:", e);
        process.exit(1);
    }
}

run();
