import { DesignGenome } from "../genome/types.js";

export class SVGGenerator {
    generateBiomarker(genome: DesignGenome): string {
        const { geometry, complexity } = genome.chromosomes.ch15_biomarker;
        let paths = "";

        if (geometry === "organic") {
            paths = `<path d="M10,90 Q50,${10 + complexity * 100} 90,10 Q${100 - complexity * 50},50 10,90" fill="none" stroke="currentColor" stroke-width="4"/>`;
        } else if (geometry === "fractal") {
            paths = `<rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" stroke-width="2"/>
                     <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" stroke-width="2"/>
                     <rect x="30" y="30" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2"/>`;
        } else {
            // monolithic
            paths = `<path d="M20,90 L20,10 L80,10 L80,50 L20,50" fill="none" stroke="currentColor" stroke-width="8" stroke-linejoin="miter" stroke-linecap="square"/>`;
        }

        return `<svg viewBox="0 0 100 100" class="w-full h-full text-current" xmlns="http://www.w3.org/2000/svg">
            <!-- Procedural Permutation P(n,r) Biomarker -->
            <g>
                ${paths}
            </g>
        </svg>`;
    }
}
