import { GenomeSequencer } from "./src/genome/sequencer.js";
import { CSSGenerator } from "./src/generators/css-generator.js";
import { HTMLTopologyGenerator } from "./src/generators/html-topology.js";

async function run() {
    console.log("Using pre-extracted semantic traits to bypass invalid API key...");

    const traits = {
        informationDensity: 0.7,
        temporalUrgency: 0.2,
        emotionalTemperature: 0.1,
        playfulness: 0.05
    };

    console.log("Extracted Traits:", traits);

    const sequencer = new GenomeSequencer();
    const cssGen = new CSSGenerator();
    const htmlGen = new HTMLTopologyGenerator();

    // The actual generating logic based on intent
    const genome = sequencer.generate("Permutations Product Page Live", traits);
    const tailwindConfig = cssGen.generate(genome, "tailwind");
    const topology = htmlGen.generateTopology(genome);

    console.log("\\n\\n========= TAILWIND CONFIG =========");
    console.log(tailwindConfig);

    console.log("\\n\\n========= HTML TOPOLOGY =========");
    console.log(JSON.stringify(topology, null, 2));
}

run();
