/**
 * Set-Theoretic Constraint Solver (FIX 8)
 *
 * Replaces priority-based winner-takes-all with set intersection.
 * When constraints conflict, finds the intersection of valid values,
 * or nearest neighbor compromise if intersection is empty.
 */
/** Physics value distance graph for compromise finding */
const PHYSICS_DISTANCE = {
    none: { none: 0, step: 1, inertia: 2, elastic: 3, spring: 4, magnetic: 5, particle: 6, glitch: 7 },
    step: { none: 1, step: 0, inertia: 1, elastic: 2, spring: 3, magnetic: 4, particle: 5, glitch: 6 },
    inertia: { none: 2, step: 1, inertia: 0, elastic: 1, spring: 2, magnetic: 3, particle: 4, glitch: 5 },
    elastic: { none: 3, step: 2, inertia: 1, elastic: 0, spring: 1, magnetic: 2, particle: 3, glitch: 4 },
    spring: { none: 4, step: 3, inertia: 2, elastic: 1, spring: 0, magnetic: 1, particle: 2, glitch: 3 },
    magnetic: { none: 5, step: 4, inertia: 3, elastic: 2, spring: 1, magnetic: 0, particle: 1, glitch: 2 },
    particle: { none: 6, step: 5, inertia: 4, elastic: 3, spring: 2, magnetic: 1, particle: 0, glitch: 1 },
    glitch: { none: 7, step: 6, inertia: 5, elastic: 4, spring: 3, magnetic: 2, particle: 1, glitch: 0 }
};
/** Edge style distance graph */
const EDGE_DISTANCE = {
    sharp: { sharp: 0, soft: 1, pill: 2, organic: 3 },
    soft: { sharp: 1, soft: 0, pill: 1, organic: 2 },
    pill: { sharp: 2, soft: 1, pill: 0, organic: 1 },
    organic: { sharp: 3, soft: 2, pill: 1, organic: 0 }
};
export class SetTheoreticConstraintSolver {
    constraints = [];
    compromises = [];
    rationale = [];
    /**
     * Solve constraints using set intersection
     */
    solve(genome) {
        this.constraints = [];
        this.compromises = [];
        this.rationale = [];
        // Step 1: Collect constraints as valid sets
        this.collectConstraints(genome);
        // Step 2: Group by target property
        const byTarget = this.groupByTarget();
        // Step 3: Intersect sets for each target
        const results = new Map();
        for (const [target, constraints] of byTarget) {
            const result = this.intersectConstraints(target, constraints);
            results.set(target, result);
        }
        // Step 4: Apply results to genome
        this.applyResults(genome, results);
        return {
            genome,
            appliedSets: results,
            compromises: this.compromises,
            rationale: this.rationale
        };
    }
    /**
     * Collect constraints from traits as valid sets
     */
    collectConstraints(genome) {
        const traits = genome.traits;
        // Temporal urgency constraints (FIX 8 example)
        const urgencySet = new Set();
        if (traits.temporalUrgency > 0.8) {
            urgencySet.add("none");
            urgencySet.add("step");
        }
        else if (traits.temporalUrgency > 0.5) {
            urgencySet.add("none");
            urgencySet.add("step");
            urgencySet.add("inertia");
        }
        else {
            // No restriction - all values valid
            ["none", "step", "inertia", "elastic", "spring", "magnetic", "particle", "glitch"].forEach(v => urgencySet.add(v));
        }
        this.addConstraint({
            id: "urgency_physics",
            target: "chromosomes.ch8_motion.physics",
            validValues: urgencySet,
            source: `temporalUrgency: ${traits.temporalUrgency.toFixed(2)}`,
            reason: "Temporal urgency restricts valid physics values"
        });
        // Playfulness constraints
        const playfulSet = new Set();
        if (traits.playfulness > 0.7) {
            playfulSet.add("spring");
            playfulSet.add("elastic");
            playfulSet.add("magnetic");
            playfulSet.add("particle");
        }
        else if (traits.playfulness < 0.2) {
            playfulSet.add("none");
            playfulSet.add("step");
        }
        else {
            // Moderate - all valid
            ["none", "step", "inertia", "elastic", "spring", "magnetic", "particle", "glitch"].forEach(v => playfulSet.add(v));
        }
        this.addConstraint({
            id: "playfulness_physics",
            target: "chromosomes.ch8_motion.physics",
            validValues: playfulSet,
            source: `playfulness: ${traits.playfulness.toFixed(2)}`,
            reason: "Playfulness restricts valid physics values"
        });
        // Information density constraints
        const densitySet = new Set();
        if (traits.informationDensity > 0.8) {
            densitySet.add("flat");
            densitySet.add("graph");
        }
        else if (traits.informationDensity < 0.3) {
            densitySet.add("deep");
            densitySet.add("radial");
        }
        else {
            ["flat", "deep", "graph", "radial"].forEach(v => densitySet.add(v));
        }
        this.addConstraint({
            id: "density_topology",
            target: "chromosomes.ch1_structure.topology",
            validValues: densitySet,
            source: `informationDensity: ${traits.informationDensity.toFixed(2)}`,
            reason: "Information density restricts valid topology values"
        });
        // Emotional temperature constraints
        const tempFontSet = new Set();
        if (traits.emotionalTemperature > 0.7) {
            tempFontSet.add("humanist");
            tempFontSet.add("expressive");
        }
        else if (traits.emotionalTemperature < 0.3) {
            tempFontSet.add("geometric");
            tempFontSet.add("grotesque");
        }
        else {
            ["geometric", "humanist", "monospace", "transitional", "grotesque", "slab_serif", "expressive"].forEach(v => tempFontSet.add(v));
        }
        this.addConstraint({
            id: "temperature_font",
            target: "chromosomes.ch3_type_display.charge",
            validValues: tempFontSet,
            source: `emotionalTemperature: ${traits.emotionalTemperature.toFixed(2)}`,
            reason: "Emotional temperature restricts valid typography charge"
        });
    }
    addConstraint(constraint) {
        this.constraints.push(constraint);
    }
    /**
     * Group constraints by target property
     */
    groupByTarget() {
        const byTarget = new Map();
        for (const constraint of this.constraints) {
            const existing = byTarget.get(constraint.target) || [];
            existing.push(constraint);
            byTarget.set(constraint.target, existing);
        }
        return byTarget;
    }
    /**
     * Intersect multiple constraint sets
     */
    intersectConstraints(target, constraints) {
        if (constraints.length === 0) {
            return new Set();
        }
        if (constraints.length === 1) {
            return new Set(constraints[0].validValues);
        }
        // Start with first constraint's values
        let intersection = new Set(constraints[0].validValues);
        // Intersect with each subsequent constraint
        for (let i = 1; i < constraints.length; i++) {
            const current = constraints[i].validValues;
            intersection = new Set([...intersection].filter(x => current.has(x)));
        }
        // If intersection is empty, find compromise
        if (intersection.size === 0) {
            const compromise = this.findCompromise(target, constraints);
            intersection.add(compromise);
        }
        return intersection;
    }
    /**
     * Find compromise when sets don't intersect
     * Uses nearest neighbor in constraint graph
     */
    findCompromise(target, constraints) {
        // Get all candidate values from all constraints
        const allValues = new Set();
        for (const c of constraints) {
            for (const v of c.validValues) {
                if (typeof v === "string") {
                    allValues.add(v);
                }
            }
        }
        // Use appropriate distance metric
        let distanceGraph = {};
        if (target.includes("physics")) {
            distanceGraph = PHYSICS_DISTANCE;
        }
        else if (target.includes("edge")) {
            distanceGraph = EDGE_DISTANCE;
        }
        // Find value with minimum total distance to all constraint sets
        let bestValue = [...allValues][0];
        let minDistance = Infinity;
        for (const candidate of allValues) {
            let totalDistance = 0;
            for (const constraint of constraints) {
                // Distance to this constraint's valid set
                let minConstraintDistance = Infinity;
                for (const validValue of constraint.validValues) {
                    if (typeof validValue === "string" && distanceGraph[candidate]?.[validValue] !== undefined) {
                        minConstraintDistance = Math.min(minConstraintDistance, distanceGraph[candidate][validValue]);
                    }
                }
                totalDistance += minConstraintDistance === Infinity ? 10 : minConstraintDistance;
            }
            if (totalDistance < minDistance) {
                minDistance = totalDistance;
                bestValue = candidate;
            }
        }
        // Record compromise
        const constraintNames = constraints.map(c => c.id).join(", ");
        this.compromises.push({
            property: target,
            requested: `intersection of [${constraintNames}]`,
            actual: bestValue,
            reason: `Sets don't intersect; '${bestValue}' is nearest neighbor (distance ${minDistance})`
        });
        this.rationale.push(`[${target}] Compromise: '${bestValue}' (nearest neighbor to ${constraintNames})`);
        return bestValue;
    }
    /**
     * Apply solved constraint sets to genome
     */
    applyResults(genome, results) {
        for (const [target, values] of results) {
            // Pick first value from intersection
            const value = [...values][0];
            // Apply to genome path
            this.setPath(genome, target, value);
            this.rationale.push(`[${target}] = ${value} (from set intersection)`);
        }
    }
    /**
     * Set a value at a path in genome
     */
    setPath(obj, path, value) {
        const parts = path.split(".");
        let current = obj;
        for (let i = 0; i < parts.length - 1; i++) {
            current = current[parts[i]];
            if (!current)
                return;
        }
        current[parts[parts.length - 1]] = value;
    }
}
/**
 * Factory function to use set-theoretic solver
 */
export function solveWithSetTheory(genome) {
    const solver = new SetTheoreticConstraintSolver();
    return solver.solve(genome);
}
