import { GenomeSequencer } from "./src/genome/sequencer.js";
import { CSSGenerator } from "./src/generators/css-generator.js";
import { HTMLTopologyGenerator } from "./src/generators/html-topology.js";
import { WebGLGenerator } from "./src/generators/webgl-generator.js";
import { FXGenerator } from "./src/generators/fx-generator.js";
import { SVGGenerator } from "./src/generators/svg-generator.js";

import Groq from "groq-sdk";

async function run() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        console.error("ERROR: Missing GROQ_API_KEY environment variable.");
        console.error("You must provide a valid API key to extract the real semantic traits, bypasses are no longer allowed.");
        process.exit(1);
    }

    const intent = "A spectacular product landing page for a developer tool that mathematically generates unique design systems to prevent AI slop. It should feel like a technical manifesto—avant-garde, uncompromising, and deeply parametric.";

    console.log("Fetching real traits using Groq API (`llama-3.3-70b-versatile`)...");
    try {
        const groq = new Groq({ apiKey });
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are a Semantic Trait Extractor for a parametric design system. Output ONLY valid JSON containing the 5 exact traits."
                },
                {
                    role: "user",
                    content: `Analyze the following design intent and project description, then map it to five continuous trait vectors between 0.0 and 1.0.

Traits:
1. informationDensity: 0.1 (sparse, luxurious, minimal) to 0.9 (chaotic, data-heavy, dashboard)
2. temporalUrgency: 0.1 (timeless, archival, deep reading) to 0.9 (real-time, scanning, high-frequency)
3. emotionalTemperature: 0.1 (clinical, technical, brutalist) to 0.9 (warm, humanist, empathetic)
4. playfulness: 0.1 (strict, rigid, enterprise) to 0.9 (organic, whimsical, experimental)
5. spatialDependency: 0.1 (flat, Cartesian CSS, text-heavy) to 0.9 (immersive, WebGL, 3D particles, z-depth)

Intent: "${intent}"

Respond ONLY with a valid JSON object matching this exact shape:
{
  "informationDensity": 0.5,
  "temporalUrgency": 0.5,
  "emotionalTemperature": 0.5,
  "playfulness": 0.5,
  "spatialDependency": 0.5
}`
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0.2
        });
        let textResult = response.choices[0]?.message?.content || "{}";

        // Safety matching for JSON
        const jsonMatch = textResult.match(/\{[\s\S]*\}/);
        if (jsonMatch) textResult = jsonMatch[0];

        const traits = JSON.parse(textResult);
        console.log("Authentic Extracted Traits:", traits);

        const sequencer = new GenomeSequencer();
        const cssGen = new CSSGenerator();
        const htmlGen = new HTMLTopologyGenerator();
        const webglGen = new WebGLGenerator();
        const fxGen = new FXGenerator();
        const svgGen = new SVGGenerator();

        const genome = sequencer.generate("Permutations Product Page Live V2", traits);
        const tailwindConfig = cssGen.generate(genome, "tailwind");
        const topology = htmlGen.generateTopology(genome);
        const webglComponents = webglGen.generateR3F(genome);
        const fxAtmosphere = fxGen.generateCSSClass(genome);
        const svgBiomarker = svgGen.generateBiomarker(genome);

        console.log("\\n\\n========= TAILWIND CONFIG =========");
        console.log(tailwindConfig);

        console.log("\\n\\n========= HTML TOPOLOGY =========");
        console.log(JSON.stringify(topology, null, 2));

        console.log("\\n\\n========= WEBGL / 3D COMPONENTS =========");
        console.log(webglComponents);

        console.log("\\n\\n========= CSS FX ATMOSPHERE =========");
        console.log(fxAtmosphere);

        console.log("\\n\\n========= SVG BIOMARKER =========");
        console.log(svgBiomarker);

    } catch (e) {
        console.error("Error generating DNA", e);
        process.exit(1);
    }
}

run();
