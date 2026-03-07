import * as crypto from "crypto";
export class GenomeSequencer {
    generate(seed, traits) {
        const hash = crypto.createHash("sha256").update(seed).digest("hex");
        const bytes = Buffer.from(hash, 'hex');
        // 1. Base generation from hash (0.0 to 1.0)
        const b = (index) => bytes[index] / 255;
        // 2. Mathematical Epistasis (Hash + Traits)
        // Structure Topology
        let topology = "flat";
        if (traits.informationDensity > 0.7 && traits.temporalUrgency > 0.6) {
            topology = "flat"; // Dashboards
        }
        else if (traits.temporalUrgency < 0.4 && traits.informationDensity < 0.6) {
            topology = "deep"; // Long form reading
        }
        else {
            topology = this.selectFromHash(bytes[0], ["flat", "deep", "graph", "radial"]);
        }
        // Rhythm Density
        let density = "breathing";
        if (traits.informationDensity > 0.8)
            density = "maximal";
        else if (traits.informationDensity > 0.6)
            density = "airtight";
        else if (traits.informationDensity < 0.3)
            density = "empty";
        // Edge Radius (Brutal/Strict = 0px, Organic/Whimsical = higher)
        // Map playfulness 0.0-1.0 to a radius multiplier
        const maxRadius = 32;
        const radius = Math.round(b(1) * maxRadius * traits.playfulness);
        // Grid Asymmetry (Organic = more asymmetry)
        const asymmetry = 0.5 + (b(2) * 1.5 * traits.playfulness);
        // Color Temperature
        let temp = "neutral";
        if (traits.emotionalTemperature > 0.6)
            temp = "warm";
        else if (traits.emotionalTemperature < 0.4)
            temp = "cool";
        // Motion Physics
        let physics = "none";
        if (traits.temporalUrgency > 0.8)
            physics = "none"; // Instant for fast scanning
        else if (traits.playfulness > 0.7)
            physics = "spring";
        else if (traits.emotionalTemperature < 0.3)
            physics = "step";
        // Type Charge
        let charge = "transitional";
        if (traits.temporalUrgency > 0.7 && traits.informationDensity > 0.6) {
            charge = "monospace";
        }
        else if (traits.emotionalTemperature > 0.7) {
            charge = "humanist";
        }
        else if (traits.emotionalTemperature < 0.4) {
            charge = "geometric";
        }
        // Assemble Genome
        const genome = {
            dnaHash: hash,
            traits,
            chromosomes: {
                ch1_structure: { topology, maxNesting: Math.floor(b(3) * 4) + 1 },
                ch2_rhythm: { density, baseSpacing: Math.floor(b(4) * 16) + 4 },
                ch3_type_display: { family: this.selectDisplayFont(bytes[5], charge), charge, weight: [400, 700, 900][bytes[6] % 3] },
                ch4_type_body: { family: this.selectBodyFont(bytes[7], charge), xHeightRatio: 0.5 + b(8) * 0.2, contrast: 0.8 + b(9) * 0.4 },
                ch5_color_primary: { hue: Math.round(b(10) * 360), saturation: Math.max(0.2, b(11)), lightness: Math.max(0.2, b(12)), temperature: temp },
                ch6_color_temp: { backgroundTemp: temp === "warm" ? "cool" : "neutral", contrastRatio: 4.5 + b(13) * 10 },
                ch7_edge: { radius, style: radius === 0 ? "sharp" : (radius > 16 ? "organic" : "soft") },
                ch8_motion: { physics, durationScale: 0.2 + b(14) * 1.8 },
                ch9_grid: { logic: traits.informationDensity > 0.8 ? "column" : this.selectFromHash(bytes[15], ["column", "masonry", "broken"]), asymmetry },
                ch10_hierarchy: { depth: traits.informationDensity > 0.7 ? "flat" : "overlapping", zIndexBehavior: "isolation" },
                ch11_texture: { surface: traits.emotionalTemperature > 0.6 ? "grain" : "flat", noiseLevel: b(16) * 0.5 },
                ch12_signature: { entropy: b(17), uniqueMutation: hash.slice(0, 8) }
            },
            constraints: {
                forbiddenPatterns: [],
                requiredPatterns: [],
                bondingRules: []
            },
            viabilityScore: 1.0
        };
        return this.applyViabilityConstraints(genome);
    }
    selectFromHash(byte, options) {
        return options[byte % options.length];
    }
    selectDisplayFont(byte, charge) {
        if (charge === "monospace")
            return "Space Mono, JetBrains Mono, monospace";
        if (charge === "humanist")
            return "Fraunces, Playfair Display, serif";
        if (charge === "geometric")
            return "Space Grotesk, Inter, sans-serif";
        return "Helvetica Neue, system-ui, sans-serif";
    }
    selectBodyFont(byte, charge) {
        if (charge === "monospace")
            return "IBM Plex Mono, Courier, monospace";
        if (charge === "humanist")
            return "Merriweather, Georgia, serif";
        return "Inter, Roboto, sans-serif";
    }
    applyViabilityConstraints(genome) {
        // Determine strict required/forbidden patterns based on mathematical traits
        if (genome.traits.temporalUrgency > 0.8) {
            genome.constraints.forbiddenPatterns.push("scroll_animations", "parallax", "heavy_blur_effects");
            genome.constraints.requiredPatterns.push("high_contrast_text", "tabular_numerals");
            genome.constraints.bondingRules.push("High Temporal Urgency -> Forbidden complex animations.");
        }
        if (genome.traits.informationDensity > 0.8) {
            genome.constraints.forbiddenPatterns.push("large_hero_images", "generous_whitespace", "rounded_cards");
            genome.constraints.requiredPatterns.push("compact_base_spacing");
            genome.constraints.bondingRules.push("High Information Density -> Forced compact rhythm.");
        }
        if (genome.traits.playfulness < 0.2) {
            genome.chromosomes.ch7_edge.radius = 0;
            genome.constraints.forbiddenPatterns.push("bounce_animations", "comic_sans");
            genome.constraints.bondingRules.push("Low Playfulness -> Forced brutalist radius (0px).");
        }
        return genome;
    }
}
