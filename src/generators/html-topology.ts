import { DesignGenome } from "../genome/types.js";

export class HTMLTopologyGenerator {
    generateTopology(genome: DesignGenome) {
        const topology = {
            gridType: genome.chromosomes.ch9_grid.logic,
            maxNesting: genome.chromosomes.ch1_structure.maxNesting,
            sections: [] as any[]
        };

        // Use traits to determine section structures
        if (genome.traits.informationDensity > 0.8) {
            topology.sections = [
                { type: "header", sticky: true, compact: true },
                { type: "data_grid", columns: "auto-fit" },
                { type: "sidebar", collapsible: true }
            ];
        } else if (genome.traits.temporalUrgency < 0.3 && genome.traits.informationDensity < 0.6) {
            topology.sections = [
                { type: "article", maxWidth: "65ch", centered: true },
                { type: "toc", sticky: true, side: "left" }
            ];
        } else {
            topology.sections = [
                { type: "hero", fullViewport: true },
                { type: "content_blocks", layout: genome.chromosomes.ch9_grid.logic },
                { type: "footer", minimal: false }
            ];
        }

        return {
            ...topology,
            forbidden: genome.constraints.forbiddenPatterns,
            required: genome.constraints.requiredPatterns
        };
    }
}
