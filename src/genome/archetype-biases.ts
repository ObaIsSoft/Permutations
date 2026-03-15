import { DesignGenome } from "./types.js";

export interface ArchetypeBias {
    /** One-paragraph design philosophy — what this archetype looks like visually */
    designPhilosophy: string;
    /** One-paragraph architecture intent — how this archetype shapes app structure */
    architectureIntent: string;
    /** Chromosome mutations applied after hash-based sequencing */
    chromosomeMutations: {
        edge_radius?: number;
        edge_componentRadius?: number;
        edge_style?: "sharp" | "soft" | "organic" | "techno" | "brutalist";
        motion_physics?: "none" | "spring" | "step" | "glitch";
        motion_durationScale?: number;
        grid_asymmetry?: number;
        grid_logic?: "column" | "masonry" | "radial" | "broken" | "bento" | "editorial";
        structure_topology?: "flat" | "deep" | "graph" | "radial" | "bento" | "editorial";
        physics_material?: "neumorphism" | "metallic" | "glass" | "matte";
        rhythm_density?: "airtight" | "breathing" | "maximal" | "empty";
    };
}

export const ARCHETYPE_BIASES: Record<string, ArchetypeBias> = {

    // ── TRIBAL (0.81–0.86) ──────────────────────────────────────────────────
    totemic: {
        designPhilosophy: 'Symbol-first. Each component is an icon with ritual weight. Sharp edges preserve symbol integrity — softness would dilute meaning. Maximum contrast, minimum chrome. No decoration beyond the symbol itself. The UI is a collection of marks, not surfaces.',
        architectureIntent: 'Icon registry as the source of truth. Components are symbol-wrappers, not the other way around. State is binary — present or absent. No transitions between states, only appearance and disappearance.',
        chromosomeMutations: {
            edge_radius: 0,
            edge_componentRadius: 0,
            edge_style: 'sharp',
            motion_physics: 'none',
            grid_asymmetry: 0,
        }
    },
    shamanistic: {
        designPhilosophy: 'Organic and liminal. Components breathe — they enter slowly, linger, depart with intention. Irregular spacing rhythms that resist the grid. The UI feels like it channels invisible forces rather than processing data. High radius, fluid asymmetry, spring physics.',
        architectureIntent: 'Event-driven flows that carry ceremony. State transitions are processions, not clicks. Animation is not decoration — it is the primary communication layer between states.',
        chromosomeMutations: {
            edge_radius: 28,
            edge_componentRadius: 24,
            edge_style: 'organic',
            motion_physics: 'spring',
            motion_durationScale: 1.4,
            grid_asymmetry: 0.75,
        }
    },
    nomadic: {
        designPhilosophy: 'Borderless and portable. No fixed chrome — content is the UI. Minimum viable visual system. Zero radius because there are no edges to round. Works on any surface without feeling degraded. White space is not empty — it is the terrain between content.',
        architectureIntent: 'Self-contained components with zero external dependencies. Each component carries its own state. No shared global state — components are waypoints, not rooms.',
        chromosomeMutations: {
            edge_radius: 0,
            edge_componentRadius: 0,
            edge_style: 'sharp',
            motion_physics: 'none',
            grid_asymmetry: 0,
            rhythm_density: 'empty',
        }
    },
    warrior: {
        designPhilosophy: 'Bold and decisive. Heavy display typography, maximum contrast, zero decorative radius. Components are weapons — each one has one job and executes it without hesitation. CTAs are unavoidable. The UI does not ask — it commands.',
        architectureIntent: 'Linear flows. No branching, no ambiguity in user paths. State is binary — success or retry. No undo, no cancel without consequence.',
        chromosomeMutations: {
            edge_radius: 0,
            edge_componentRadius: 0,
            edge_style: 'brutalist',
            motion_physics: 'step',
            grid_asymmetry: 0,
        }
    },
    maritime: {
        designPhilosophy: 'Navigational and fluid. Horizontal flow tendencies, wave-like spring motion, layered depth. Components understand orientation — they know port from starboard. The UI has current and tide. Medium radius, spring physics, slight asymmetry for the living-system feel.',
        architectureIntent: 'Route-based architecture. Navigation is primary, content is secondary. Deep linking is essential — every view is a named destination with a return path.',
        chromosomeMutations: {
            motion_physics: 'spring',
            grid_asymmetry: 0.3,
            edge_style: 'soft',
        }
    },

    // ── CITY-STATE (0.87–0.91) ───────────────────────────────────────────────
    mercantile: {
        designPhilosophy: 'Transaction efficiency above aesthetics. Pricing is prominent, conversion hierarchy is ruthless, trust signals are mechanical. No aesthetic waste — every pixel is working to close the deal. Step physics: motion should not distract from the exchange.',
        architectureIntent: 'Commerce-first state model. Cart, checkout, confirmation as primary flows. Everything else is secondary routing. Analytics event on every interaction.',
        chromosomeMutations: {
            motion_physics: 'none',
            grid_asymmetry: 0,
            rhythm_density: 'airtight',
        }
    },
    theocratic: {
        designPhilosophy: 'Sacred geometry governs spacing. Proportional systems (golden ratio, musical intervals) in every margin. Ceremonial typography — tall serifs or highly crafted display faces. Color is liturgical: the accent is sacred, used only for the primary action. Motion is slow and deliberate — entrances are processions.',
        architectureIntent: 'Doctrine flows downward. Truth originates at the top and is received below. State is immutable at its canonical source — revelations, not mutations.',
        chromosomeMutations: {
            motion_physics: 'spring',
            motion_durationScale: 1.2,
            grid_asymmetry: 0,
            edge_style: 'soft',
        }
    },
    democratic: {
        designPhilosophy: 'Equal visual weight — no component gets VIP treatment without earned hierarchy. Card grids, consistent sizing, accessible-first. The UI makes every user feel they belong. Medium radius, spring physics, zero asymmetry — the grid is the law.',
        architectureIntent: 'Flat component hierarchy. Roles and permissions are explicit, not implicit. Every user action is recoverable. Accessibility is not an afterthought.',
        chromosomeMutations: {
            grid_asymmetry: 0,
            motion_physics: 'spring',
            edge_radius: 12,
            edge_componentRadius: 8,
        }
    },
    scholarly: {
        designPhilosophy: 'Information over presentation. Wide margins for annotation, generous line height for reading, tables as first-class citizens. The UI respects that the reader came to think, not to be impressed. No physics — animation distracts from comprehension.',
        architectureIntent: 'Content-addressed routing. Every piece of information has a permanent URL. Search is a first-class navigation primitive. Reading progress is persistent state.',
        chromosomeMutations: {
            motion_physics: 'none',
            grid_asymmetry: 0,
            rhythm_density: 'breathing',
            grid_logic: 'editorial',
        }
    },
    militaristic: {
        designPhilosophy: 'Discipline and unambiguous chain of command. Strict grid, muted palette with a single tactical accent. Nothing moves without orders. Status is always visible. There is no decorative element — if it is there, it is load-bearing. Zero radius everywhere.',
        architectureIntent: 'Command-and-control state flow. Roles, permissions, and audit logs are first-class concerns. No action is undocumented. Reversibility requires authorization.',
        chromosomeMutations: {
            edge_radius: 0,
            edge_componentRadius: 0,
            edge_style: 'sharp',
            motion_physics: 'none',
            grid_asymmetry: 0,
        }
    },

    // ── NATION-STATE (0.92–0.94) ─────────────────────────────────────────────
    industrial: {
        designPhilosophy: 'Modular interchangeability. Components look mass-produced — consistent, functional, without individual personality. Blueprint or technical-drawing aesthetic. 2px radius: just enough to prevent sharp manufacturing defects. Step motion: purposeful and mechanical.',
        architectureIntent: 'Factory-floor architecture. Components are stamped from a single mold. Design tokens are tolerances, not suggestions. Consistency is enforced by process, not by taste.',
        chromosomeMutations: {
            edge_radius: 2,
            edge_componentRadius: 2,
            edge_style: 'techno',
            motion_physics: 'step',
            grid_asymmetry: 0,
            physics_material: 'metallic',
        }
    },
    agrarian: {
        designPhilosophy: 'Seasonal and cyclic. Growth metaphors — data grows, is harvested, is replanted. Components have natural variation, not mechanical uniformity. Organic edge style, spring physics, slight asymmetry. The UI breathes with the rhythm of seasons, not the tick of a clock.',
        architectureIntent: 'Batch-processing architecture. Data arrives in cycles, not streams. Reports, summaries, and harvest-views are primary UI patterns. Time-to-update is measured in hours, not milliseconds.',
        chromosomeMutations: {
            motion_physics: 'spring',
            grid_asymmetry: 0.3,
            edge_radius: 16,
            edge_componentRadius: 12,
            edge_style: 'organic',
            rhythm_density: 'breathing',
        }
    },
    federated: {
        designPhilosophy: 'Regional autonomy within shared constraints. Module boundaries are visible — each region has its own personality while speaking the same design language. The union is maintained; the individual is honored. Slight asymmetry acknowledges that regions are not identical.',
        architectureIntent: 'Module federation architecture. Each region is independently deployable. Shared design token contract is the constitution. Cross-region navigation is explicit, never implicit.',
        chromosomeMutations: {
            grid_asymmetry: 0.3,
            motion_physics: 'spring',
        }
    },
    bureaucratic: {
        designPhilosophy: 'Process visibility. Step indicators, approval hierarchies, audit trails made UI. Every action produces a record. The interface does not hide the machinery of governance — it makes the machinery legible. Small radius: formal but not hostile.',
        architectureIntent: 'Workflow engine architecture. Every user action is a transition in a named state machine. Forms and approval chains are primary primitives. Nothing ships without a signature.',
        chromosomeMutations: {
            edge_radius: 4,
            edge_componentRadius: 4,
            edge_style: 'sharp',
            motion_physics: 'step',
            grid_asymmetry: 0,
        }
    },

    // ── EMPIRE (0.95–0.96) ───────────────────────────────────────────────────
    colonial: {
        designPhilosophy: 'Extractive and expansionist. High data density with aggressive filtering UI. The interface is not neutral — it is structured to maximize intake, routing, and processing of information from every surface. Maximal density, step motion, zero asymmetry.',
        architectureIntent: 'Pipeline-first architecture. Data enters from all edges, is processed centrally, and distributed outward. Every feature either feeds the pipeline or reports from it. Extraction metrics are primary KPIs.',
        chromosomeMutations: {
            grid_asymmetry: 0,
            motion_physics: 'step',
            rhythm_density: 'maximal',
        }
    },
    theological: {
        designPhilosophy: 'Doctrine-driven with ceremonial weight. Everything serves a higher purpose. Motion is slow and deliberate — entrances are processions, not transitions. Sacred proportions govern layout. The accent color is consecrated, appearing only at the altar of the primary action. High duration, zero asymmetry, soft edges.',
        architectureIntent: 'Truth descends from a canonical source. State flows downward and is received, not negotiated. The source of truth is immutable — history is a log, not an undo stack.',
        chromosomeMutations: {
            motion_physics: 'spring',
            motion_durationScale: 1.6,
            grid_asymmetry: 0,
            edge_radius: 8,
            edge_componentRadius: 6,
            edge_style: 'soft',
        }
    },
    scientific: {
        designPhilosophy: 'Measurement as aesthetic. Charts and data visualizations are first-class content, not embellishment. Annotation layers, axis labels, and metadata are part of the visual design. Clean functional typography. Step motion for precision — no spring wobble in a laboratory.',
        architectureIntent: 'Observable state throughout. Every change is measurable and logged. Experiment/hypothesis/result is the primary UX pattern. Data integrity is the only doctrine.',
        chromosomeMutations: {
            motion_physics: 'step',
            grid_asymmetry: 0,
            edge_radius: 2,
            edge_componentRadius: 2,
            edge_style: 'sharp',
            physics_material: 'matte',
        }
    },

    // ── NETWORK (0.97–0.98) ──────────────────────────────────────────────────
    distributed: {
        designPhilosophy: 'No center of gravity. Radial or node-graph layouts where no element dominates. Peer-equal visual hierarchy — the UI acknowledges it is one node among many. Content radiates outward rather than stacking downward. Moderate asymmetry, spring physics.',
        architectureIntent: 'Peer-to-peer state model. No single authoritative store. Eventual consistency is a design constraint — the UI handles temporary divergence gracefully, showing local state until sync.',
        chromosomeMutations: {
            structure_topology: 'radial',
            grid_asymmetry: 0.4,
            motion_physics: 'spring',
        }
    },
    mesh: {
        designPhilosophy: 'Connection density as visual motif. The relationships between things are as important as the things themselves. Path-tracing, link-highlighting, and graph visualization are primary UI patterns. Broken or graph grid logic — traditional columns cannot contain a mesh.',
        architectureIntent: 'Graph-based data model. Connections are first-class entities, not foreign keys. Navigation follows edges, not hierarchies. Every view is a subgraph traversal.',
        chromosomeMutations: {
            structure_topology: 'graph',
            grid_logic: 'broken',
            grid_asymmetry: 0.5,
            motion_physics: 'spring',
        }
    },
    autonomous: {
        designPhilosophy: 'Self-declaring components. Each component communicates its own state without being asked. Ambient status signals throughout — the UI is alive with real-time feedback. Components feel like independent agents that have agreed to appear together.',
        architectureIntent: 'Event-sourced architecture. Components subscribe to event streams rather than pulling state. The UI is reactive by default — no polling, no manual refresh.',
        chromosomeMutations: {
            motion_physics: 'spring',
            grid_asymmetry: 0.4,
        }
    },
    quantum: {
        designPhilosophy: 'Multiple simultaneous states visible. Parallel view patterns — the UI shows two realities at once (comparison, A/B, before/after). Glass and translucency as primary material. Components exist in superposition until observed — overlapping, translucent, multi-state.',
        architectureIntent: 'Branching state model. Multiple parallel timelines maintained simultaneously. UI supports explicit state-comparison and branching as first-class operations — not as edge cases.',
        chromosomeMutations: {
            physics_material: 'glass',
            motion_physics: 'spring',
            grid_asymmetry: 0.4,
            edge_style: 'soft',
        }
    },

    // ── SINGULARITY (0.99–1.00) ──────────────────────────────────────────────
    convergent: {
        designPhilosophy: 'Ruthless reduction. Highest complexity collapsed to the fewest possible elements. Every remaining component earned its existence. Zero radius everywhere — reduction leaves no room for softness. No physics — the system has already decided. White space is not empty; it is the compressed residue of everything removed.',
        architectureIntent: 'Zero-waste architecture. Every API call, every state update, every render is justified. The system does exactly what is needed and nothing else. Complexity is managed below the UI surface, not expressed through it.',
        chromosomeMutations: {
            motion_physics: 'none',
            grid_asymmetry: 0,
            edge_radius: 0,
            edge_componentRadius: 0,
            edge_style: 'sharp',
            rhythm_density: 'empty',
        }
    },
    transcendent: {
        designPhilosophy: 'Beyond chrome. No UI scaffolding visible — only content surfaces. Glass and translucency as the primary material. Spatial computing aesthetic — the interface does not feel screen-bound. No borders, no backgrounds except depth. Maximum radius so containers disappear into their surfaces.',
        architectureIntent: 'Intent-based routing. The system infers the user\'s goal and adapts. There are no fixed pages — only surfaces that emerge when needed and dissolve when done.',
        chromosomeMutations: {
            physics_material: 'glass',
            edge_radius: 32,
            edge_componentRadius: 32,
            edge_style: 'organic',
            motion_physics: 'spring',
            rhythm_density: 'empty',
        }
    },
    recursive: {
        designPhilosophy: 'Self-similar at every scale. The same visual logic applies whether you are looking at a single field or an entire application. Zoom-based navigation, fractal layout, infinite drill-down. The detail at one scale reflects the structure at all scales.',
        architectureIntent: 'Fractal component architecture. Every container is also a composable unit. The page structure and component structure obey the same rules. Zoom is a first-class navigation primitive.',
        chromosomeMutations: {
            grid_asymmetry: 0.4,
            motion_physics: 'spring',
            structure_topology: 'deep',
        }
    },
    emergent: {
        designPhilosophy: 'No fixed component shape. Form emerges from the content — components are generative, not templated. High asymmetry. The system designs itself from its own constraints. Broken grid logic: traditional columns cannot contain something that has not decided its shape.',
        architectureIntent: 'Generative component model. Components are specifications, not implementations. The runtime interprets intent and produces appropriate UI. No two renders of the same data are identical.',
        chromosomeMutations: {
            grid_asymmetry: 0.85,
            motion_physics: 'spring',
            edge_radius: 20,
            edge_style: 'organic',
            grid_logic: 'broken',
        }
    },
    metamorphic: {
        designPhilosophy: 'No static state. Components are always in motion or mid-transformation. The resting state is still moving — breathing, pulsing, shifting. The user never catches the UI in a fixed pose. Maximum duration scale: the motion is constant but never frantic.',
        architectureIntent: 'Continuous state model. There is no idle. Every component is processing, updating, or transitioning at all times. The architecture is a living system — stasis is a bug.',
        chromosomeMutations: {
            motion_physics: 'spring',
            motion_durationScale: 1.8,
            grid_asymmetry: 0.6,
            edge_style: 'organic',
        }
    },
};

/**
 * Apply archetype chromosome biases to a genome.
 * Returns a new genome (deep clone) with specific chromosomes biased
 * toward the archetype's design philosophy.
 *
 * The hash-sequenced values are the foundation.
 * The archetype biases the expression within that foundation.
 */
export function applyArchetypeBias(genome: DesignGenome, archetype: string): DesignGenome {
    const bias = ARCHETYPE_BIASES[archetype];
    if (!bias) return genome;

    // Deep clone — never mutate the original genome
    const mutated: DesignGenome = JSON.parse(JSON.stringify(genome));
    const m = bias.chromosomeMutations;

    if (m.edge_radius !== undefined) {
        mutated.chromosomes.ch7_edge.radius = m.edge_radius;
    }
    if (m.edge_componentRadius !== undefined) {
        mutated.chromosomes.ch7_edge.componentRadius = m.edge_componentRadius;
    }
    if (m.edge_style !== undefined) {
        mutated.chromosomes.ch7_edge.style = m.edge_style;
    }
    if (m.motion_physics !== undefined) {
        mutated.chromosomes.ch8_motion.physics = m.motion_physics;
    }
    if (m.motion_durationScale !== undefined) {
        mutated.chromosomes.ch8_motion.durationScale = m.motion_durationScale;
    }
    if (m.grid_asymmetry !== undefined) {
        mutated.chromosomes.ch9_grid.asymmetry = m.grid_asymmetry;
    }
    if (m.grid_logic !== undefined) {
        mutated.chromosomes.ch9_grid.logic = m.grid_logic;
    }
    if (m.structure_topology !== undefined) {
        mutated.chromosomes.ch1_structure.topology = m.structure_topology;
    }
    if (m.physics_material !== undefined) {
        mutated.chromosomes.ch14_physics.material = m.physics_material;
    }
    if (m.rhythm_density !== undefined) {
        mutated.chromosomes.ch2_rhythm.density = m.rhythm_density;
    }

    return mutated;
}
