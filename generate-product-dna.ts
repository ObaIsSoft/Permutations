import { GenomeSequencer } from "./src/genome/sequencer.js";
import { CSSGenerator } from "./src/generators/css-generator.js";
import { HTMLTopologyGenerator } from "./src/generators/html-topology.js";

async function run() {
    const apiKey = process.env.MOONSHOT_API_KEY;
    if (!apiKey) {
        console.error("ERROR: Missing MOONSHOT_API_KEY environment variable.");
        console.error("You must provide a valid API key to extract the real semantic traits, bypasses are no longer allowed.");
        process.exit(1);
    }

    const intent = "A spectacular product landing page for a developer tool that mathematically generates unique design systems to prevent AI slop. It should feel like a technical manifesto—avant-garde, uncompromising, and deeply parametric.";

    console.log("Fetching real traits using Kimi API...");
    try {
        const response = await fetch("https://api.moonshot.cn/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "moonshot-v1-8k",
                messages: [
                    {
                        role: "system",
                        content: "You are a Semantic Trait Extractor for a parametric design system. Output ONLY valid JSON."
                    },
                    {
                        role: "user",
                        content: `Analyze the following design intent and project description, then map it to four continuous trait vectors between 0.0 and 1.0.

Traits:
1. informationDensity: 0.1 (sparse, luxurious, minimal) to 0.9 (chaotic, data-heavy, dashboard)
2. temporalUrgency: 0.1 (timeless, archival, deep reading) to 0.9 (real-time, scanning, high-frequency)
3. emotionalTemperature: 0.1 (clinical, technical, brutalist) to 0.9 (warm, humanist, empathetic)
4. playfulness: 0.1 (strict, rigid, enterprise) to 0.9 (organic, whimsical, experimental)

Intent: "${intent}"

Respond ONLY with a valid JSON object matching this exact shape:
{
  "informationDensity": 0.5,
  "temporalUrgency": 0.5,
  "emotionalTemperature": 0.5,
  "playfulness": 0.5
}`
                    }
                ],
                temperature: 0.3
            })
        });

        if (!response.ok) {
            console.error("Failed Kimi Fetch:", await response.text());
            process.exit(1);
        }

        const data = await response.json();
        let textResult = data.choices[0].message.content;

        // Safety matching for JSON
        const jsonMatch = textResult.match(/\{[\s\S]*\}/);
        if (jsonMatch) textResult = jsonMatch[0];

        const traits = JSON.parse(textResult);
        console.log("Authentic Extracted Traits:", traits);

        const sequencer = new GenomeSequencer();
        const cssGen = new CSSGenerator();
        const htmlGen = new HTMLTopologyGenerator();

        const genome = sequencer.generate("Permutations Product Page Live", traits);
        const tailwindConfig = cssGen.generate(genome, "tailwind");
        const topology = htmlGen.generateTopology(genome);

        console.log("\\n\\n========= TAILWIND CONFIG =========");
        console.log(tailwindConfig);

        console.log("\\n\\n========= HTML TOPOLOGY =========");
        console.log(JSON.stringify(topology, null, 2));

    } catch (e) {
        console.error("Error generating DNA", e);
        process.exit(1);
    }
}

run();
