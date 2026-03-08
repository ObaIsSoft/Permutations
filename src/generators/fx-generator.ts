import { DesignGenome } from "../genome/types.js";

export class FXGenerator {
    generateCSSClass(genome: DesignGenome): string {
        const { fx, intensity } = genome.chromosomes.ch13_atmosphere;
        let css = '';

        if (fx === "glassmorphism") {
            css = `
.fx-atmosphere {
    background: rgba(255, 255, 255, ${0.1 * intensity});
    backdrop-filter: blur(${10 + Math.round(intensity * 20)}px);
    -webkit-backdrop-filter: blur(${10 + Math.round(intensity * 20)}px);
    border: 1px solid rgba(255, 255, 255, ${0.2 * intensity});
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}`;
        } else if (fx === "crt_noise") {
            css = `
.fx-atmosphere::before {
    content: "";
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    opacity: ${0.05 + intensity * 0.15};
    pointer-events: none;
    z-index: 50;
}`;
        } else if (fx === "fluid_mesh") {
            css = `
.fx-atmosphere {
    background: linear-gradient(45deg, var(--color-primary), #ff00ff);
    filter: blur(${Math.round(50 * intensity)}px);
    opacity: ${0.5 * intensity};
}`;
        } else {
            css = `.fx-atmosphere { /* No atmosphere effects */ }`;
        }

        return css.trim();
    }
}
