/**
 * Icon Catalog Service
 *
 * Chromosome-driven icon library selection — mirrors the sector color system.
 *
 * Philosophy: forbiddenFor defines what is psychologically WRONG for an icon library.
 * The genome hash selects freely from all remaining eligible libraries.
 * Same approach as sector forbidden hue ranges — no whitelist, only exclusions.
 *
 * A library with empty forbiddenFor is valid for EVERY genome.
 * Icon visual weight must match the design's edge style — a thin elegant icon
 * on a brutalist layout, or a heavy bold icon on a hand-drawn organic design,
 * are psychologically wrong. Only those conflicts are blocked.
 */
export const ICON_CATALOG = [
    // ── Thin / Elegant ────────────────────────────────────────────────────────
    {
        name: "Iconoir",
        package: "iconoir",
        reactPackage: "iconoir-react",
        cdn: "https://unpkg.com/iconoir@latest/icons",
        style: "thin",
        weightVariants: ["regular"],
        count: 1500,
        license: "MIT",
        description: "Clean thin-stroke icons with architectural precision — editorial and premium feel",
        importExample: `import { Home, User } from "iconoir-react";`,
        // Thin icons read as weak on brutalist/deconstructed/blob layouts
        // Expressive/slab type charge → editorial bold feel → thin icons contradict it
        forbiddenFor: {
            edgeStyles: ["brutalist", "deconstructed", "blob"],
            typeCharges: ["slab_serif", "expressive"],
        },
    },
    {
        name: "Feather",
        package: "feather",
        reactPackage: "feather-icons-react",
        cdn: "https://unpkg.com/feather-icons@latest/dist/feather.min.js",
        style: "thin",
        weightVariants: ["regular"],
        count: 287,
        license: "MIT",
        description: "Minimal open-source icons — sparse, airy, developer-beloved simplicity",
        importExample: `import FeatherIcon from "feather-icons-react"; // <FeatherIcon icon="home" />`,
        // Thin/minimal icons clash with heavy/organic/irregular edge styles
        // Slab serif and expressive typography signal boldness — thin Feather icons contradict it
        forbiddenFor: {
            edgeStyles: ["brutalist", "blob", "deconstructed", "organic"],
            typeCharges: ["slab_serif", "expressive"],
        },
    },
    // ── Sharp / Precise ───────────────────────────────────────────────────────
    {
        name: "Heroicons",
        package: "@heroicons/react",
        reactPackage: "@heroicons/react",
        cdn: "https://unpkg.com/@heroicons/react@latest",
        style: "sharp",
        weightVariants: ["outline", "solid", "mini", "micro"],
        count: 300,
        license: "MIT",
        description: "Tailwind's icons — crisp outlines and solid fills, system-quality precision",
        importExample: `import { HomeIcon } from "@heroicons/react/24/outline";`,
        // Sharp geometric icons clash with organic/amorphous/irregular edge styles
        forbiddenFor: {
            edgeStyles: ["blob", "hand_drawn", "organic", "scalloped"],
        },
    },
    {
        name: "Material Symbols",
        package: "@mui/icons-material",
        reactPackage: "@mui/icons-material",
        cdn: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined",
        style: "sharp",
        weightVariants: ["outlined", "rounded", "sharp", "variable-weight"],
        count: 2500,
        license: "Apache-2.0",
        description: "Google's variable-weight symbol system — vast coverage, systematic, scalable",
        importExample: `import HomeIcon from "@mui/icons-material/Home";`,
        // System icons clash with hand-drawn/organic edge styles
        forbiddenFor: {
            edgeStyles: ["blob", "hand_drawn", "organic"],
        },
    },
    {
        name: "Tabler Icons",
        package: "@tabler/icons-react",
        reactPackage: "@tabler/icons-react",
        cdn: "https://unpkg.com/@tabler/icons@latest/icons-sprite.svg",
        style: "sharp",
        weightVariants: ["outline", "filled"],
        count: 5000,
        license: "MIT",
        description: "Massive 2px-stroke library — the most comprehensive sharp set available",
        importExample: `import { IconHome } from "@tabler/icons-react";`,
        // Sharp stroke icons clash with amorphous/irregular edge styles
        forbiddenFor: {
            edgeStyles: ["blob", "hand_drawn", "organic", "scalloped"],
        },
    },
    // ── Rounded / Friendly ────────────────────────────────────────────────────
    {
        name: "Lucide",
        package: "lucide",
        reactPackage: "lucide-react",
        cdn: "https://unpkg.com/lucide@latest",
        style: "rounded",
        weightVariants: ["regular"],
        count: 1400,
        license: "ISC",
        description: "The most beautiful rounded icon set — consistent, warm, widely used",
        importExample: `import { Home, User } from "lucide-react";`,
        // Friendly rounded icons clash with brutal/aggressive/destructured edge styles
        forbiddenFor: {
            edgeStyles: ["brutalist", "serrated", "notched", "cutout", "deconstructed"],
        },
    },
    {
        name: "Phosphor Icons",
        package: "@phosphor-icons/core",
        reactPackage: "@phosphor-icons/react",
        cdn: "https://unpkg.com/@phosphor-icons/web@latest",
        style: "rounded",
        weightVariants: ["thin", "light", "regular", "bold", "fill", "duotone"],
        count: 1200,
        license: "MIT",
        description: "Six-weight flexible system — the most versatile rounded library, duotone capable",
        importExample: `import { House } from "@phosphor-icons/react";`,
        // Rounded icons clash with brutalist/serrated/notched edge styles
        forbiddenFor: {
            edgeStyles: ["brutalist", "serrated", "notched"],
        },
    },
    // ── Bold / Assertive ──────────────────────────────────────────────────────
    {
        name: "Bootstrap Icons",
        package: "bootstrap-icons",
        reactPackage: "react-bootstrap-icons",
        cdn: "https://cdn.jsdelivr.net/npm/bootstrap-icons@latest/font/bootstrap-icons.css",
        style: "bold",
        weightVariants: ["regular", "filled"],
        count: 2000,
        license: "MIT",
        description: "Solid, chunky icons with strong visual weight — assertive, no-nonsense",
        importExample: `import { HouseFill } from "react-bootstrap-icons";`,
        // Bold UI-component icons clash with organic/amorphous/sketch-like edge styles
        forbiddenFor: {
            edgeStyles: ["blob", "hand_drawn", "organic", "scalloped", "pill"],
        },
    },
    {
        name: "Remix Icon",
        package: "remixicon",
        reactPackage: "remixicon-react",
        cdn: "https://cdn.jsdelivr.net/npm/remixicon@latest/fonts/remixicon.css",
        style: "bold",
        weightVariants: ["line", "fill"],
        count: 2800,
        license: "Apache-2.0",
        description: "Dual-mode line/fill library — functional and expressive, media-native feel",
        importExample: `import HomeSmileLine from "remixicon-react/HomeSmileLine";`,
        // Bold icons clash with amorphous/sketch-like edge styles
        forbiddenFor: {
            edgeStyles: ["blob", "hand_drawn", "scalloped"],
        },
    },
    // ── Expressive / Personality ───────────────────────────────────────────────
    {
        name: "Hugeicons",
        package: "@hugeicons/react",
        reactPackage: "@hugeicons/react",
        cdn: "https://unpkg.com/@hugeicons/core-free@latest",
        style: "expressive",
        weightVariants: ["stroke", "solid", "bulk", "duotone", "twotone"],
        count: 4000,
        license: "MIT",
        description: "Rich multi-style system — the most expressive and personality-forward library",
        importExample: `import { Home01Icon } from "@hugeicons/react";`,
        // Expressive icons are psychologically wrong for trust-critical sectors
        // Monospace type charge = systematic / developer context → expressive icons are wrong
        forbiddenFor: {
            sectors: ["healthcare", "fintech", "legal", "government"],
            typeCharges: ["monospace"],
        },
    },
    {
        name: "Solar Icons",
        package: "@iconscout/react-unicons",
        reactPackage: "@solar-icons/react",
        cdn: "https://unpkg.com/solar-icon-set@latest",
        style: "expressive",
        weightVariants: ["outline", "bold", "broken", "linear", "line-duotone", "bold-duotone"],
        count: 7500,
        license: "MIT",
        description: "Ultra-comprehensive premium system — six weights including broken/duotone styles",
        importExample: `// Import by weight variant from solar-icon-set`,
        // Expressive/decorative icons wrong for high-trust sectors
        // Monospace = developer/systematic context → expressive personality icons wrong
        forbiddenFor: {
            sectors: ["healthcare", "legal", "government"],
            typeCharges: ["monospace"],
        },
    },
    // ── Systematic / UI-focused ──────────────────────────────────────────────
    {
        name: "Radix Icons",
        package: "@radix-ui/react-icons",
        reactPackage: "@radix-ui/react-icons",
        cdn: "https://unpkg.com/@radix-ui/react-icons@latest",
        style: "systematic",
        weightVariants: ["regular"],
        count: 318,
        license: "MIT",
        description: "Small curated UI-component set — precise, systematic, built for design systems",
        importExample: `import { HomeIcon } from "@radix-ui/react-icons";`,
        // Tiny systematic set (318 icons) clashes with expressive/organic edge styles
        // Expressive type charge needs icons with personality — the Radix systematic set is wrong
        forbiddenFor: {
            edgeStyles: ["blob", "hand_drawn", "organic", "scalloped", "brutalist", "serrated"],
            typeCharges: ["expressive", "slab_serif"],
        },
    },
];
// ── Selection logic ──────────────────────────────────────────────────────────
/**
 * Select icon library using exclude logic — same philosophy as sector forbidden hue ranges.
 *
 * 1. Filter out libraries that are psychologically WRONG for this genome's context.
 * 2. Pick deterministically from the eligible pool using dnaHashByte.
 *
 * Every library not explicitly forbidden is a valid candidate — the hash provides
 * variety without forcing arbitrary whitelist matches.
 */
export function selectIconLibrary(params) {
    const { edgeStyle, typeCharge, sector, dnaHashByte } = params;
    const eligible = ICON_CATALOG.filter(lib => {
        const f = lib.forbiddenFor;
        if (f.edgeStyles?.includes(edgeStyle))
            return false;
        if (f.typeCharges?.includes(typeCharge))
            return false;
        if (f.sectors?.includes(sector))
            return false;
        return true;
    });
    // Fallback: if all excluded (shouldn't happen), use full catalog
    const pool = eligible.length > 0 ? eligible : ICON_CATALOG;
    return pool[dnaHashByte % pool.length];
}
/**
 * Format the icon library selection as a CSS comment + import guidance block
 * for inclusion in the generated CSS output.
 */
export function formatIconLibraryNote(lib) {
    return `/* ── Icon Library ───────────────────────────────────────────
   Library  : ${lib.name}
   Style    : ${lib.style} — ${lib.description}
   Package  : ${lib.reactPackage}
   Count    : ~${lib.count.toLocaleString()} icons
   License  : ${lib.license}
   Variants : ${lib.weightVariants.join(", ")}

   Install  : npm install ${lib.reactPackage}
   Import   : ${lib.importExample}
   CDN      : ${lib.cdn}
─────────────────────────────────────────────────────────── */`;
}
