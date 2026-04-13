/**
 * Star Engine
 *
 * The Star is the one hero element in the first viewport that makes a user
 * stop scrolling. The engine reads the starType from ch19_hero_type and
 * generates the structural hero HTML built around that star.
 *
 * Layout rule: the hero is built AROUND the star, not the other way.
 *   - Headline scales DOWN when the star is visual (logo_as_art, 3d_object…)
 *   - Headline scales UP when the star IS the type (oversized_phrase, kinetic_type)
 *   - CTA is positioned relative to the star's ctaAnchor
 *   - Supporting text uses ghost opacity when ghostSupportingText is true
 *
 * No hardcoded colours, sizes, or values. All CSS references genome vars
 * set by star-catalog.ts / css-generator.ts.
 */
import { getStarEntry } from "../star-catalog.js";
/**
 * Generate the hero section HTML structured around the genome's star type.
 *
 * @param genome  The full DesignGenome
 * @param v       Pre-extracted genome values (headline, cta, companyName, etc.)
 * @param indent  Indentation prefix for each output line
 */
export function renderStarHero(genome, v, indent = "  ") {
    const starType = (genome.chromosomes.ch19_hero_type?.starType ?? "none");
    const star = getStarEntry(starType);
    const heroAttrs = {
        "class": "hero",
        "data-star": starType,
        "data-cta-anchor": star.ctaAnchor,
        "data-headline-scale": star.headlineScale,
    };
    const i = indent;
    const ii = indent + "  ";
    const iii = indent + "    ";
    // ── Star element ──────────────────────────────────────────────────────────
    const starElement = renderStarElement(starType, v, iii);
    // ── Headline — scales relative to star weight ─────────────────────────────
    const headlineClass = star.headlineScale === "up"
        ? "hero-headline hero-headline--up"
        : star.headlineScale === "down"
            ? "hero-headline hero-headline--down"
            : "hero-headline";
    // ── Supporting text — ghost when star is the visual centrepiece ───────────
    const supportingClass = star.ghostSupportingText
        ? "hero-supporting" // CSS sets opacity: var(--opacity-ghost)
        : "hero-subheadline";
    // ── CTA placement ─────────────────────────────────────────────────────────
    const ctaClass = `hero-ctas hero-ctas--${star.ctaAnchor.replace(/_/g, "-")}`;
    const headline = v.headline ?? v.companyName ?? "";
    const subheadline = v.subheadline ?? "";
    const ctaText = v.cta ?? "Get started";
    const ctaSecondaryText = v.ctaSecondary ?? "";
    // ── none — headline + whitespace, no star element ─────────────────────────
    if (starType === "none") {
        const html = [
            `${i}<section class="hero" data-star="none">`,
            `${ii}<div class="hero-container">`,
            `${iii}<h1 class="${headlineClass}">${headline}</h1>`,
            subheadline ? `${iii}<p class="hero-subheadline">${subheadline}</p>` : "",
            `${iii}<div class="${ctaClass}">`,
            `${iii}  <button class="btn btn-primary">${ctaText}</button>`,
            ctaSecondaryText ? `${iii}  <button class="btn btn-outline">${ctaSecondaryText}</button>` : "",
            `${iii}</div>`,
            `${ii}</div>`,
            `${i}</section>`,
        ].filter(Boolean).join("\n");
        return { html, heroAttrs: { "data-star": "none" } };
    }
    // ── Visual star types — star gets dominant real estate ────────────────────
    const isFullBleed = ["animated_gradient", "signature_image", "video_loop", "color_field", "noise_canvas"].includes(starType);
    let html;
    if (isFullBleed) {
        // Full-bleed: star is a background layer, content overlaid
        html = [
            `${i}<section${attrsString(heroAttrs)}>`,
            starElement,
            `${ii}<div class="hero-content hero-content--overlay">`,
            `${iii}<h1 class="${headlineClass}">${headline}</h1>`,
            subheadline ? `${iii}<p class="${supportingClass}">${subheadline}</p>` : "",
            `${iii}<div class="${ctaClass}">`,
            `${iii}  <button class="btn btn-primary">${ctaText}</button>`,
            ctaSecondaryText ? `${iii}  <button class="btn btn-outline">${ctaSecondaryText}</button>` : "",
            `${iii}</div>`,
            `${ii}</div>`,
            `${i}</section>`,
        ].filter(Boolean).join("\n");
    }
    else if (star.ctaAnchor === "adjacent_right") {
        // Star left, content right
        html = [
            `${i}<section${attrsString(heroAttrs)}>`,
            `${ii}<div class="hero-split">`,
            `${iii}<div class="hero-star-col">`,
            starElement,
            `${iii}</div>`,
            `${iii}<div class="hero-content-col">`,
            `${iii}  <h1 class="${headlineClass}">${headline}</h1>`,
            subheadline ? `${iii}  <p class="${supportingClass}">${subheadline}</p>` : "",
            `${iii}  <div class="${ctaClass}">`,
            `${iii}    <button class="btn btn-primary">${ctaText}</button>`,
            ctaSecondaryText ? `${iii}    <button class="btn btn-outline">${ctaSecondaryText}</button>` : "",
            `${iii}  </div>`,
            `${iii}</div>`,
            `${ii}</div>`,
            `${i}</section>`,
        ].filter(Boolean).join("\n");
    }
    else if (star.ctaAnchor === "bottom_right_of_star") {
        // Star centred, CTA bottom-right, headline scaled down above
        html = [
            `${i}<section${attrsString(heroAttrs)}>`,
            `${ii}<div class="hero-container">`,
            `${iii}<h1 class="${headlineClass}">${headline}</h1>`,
            `${iii}<div class="hero-star-wrapper">`,
            starElement,
            `${iii}  <div class="${ctaClass}">`,
            `${iii}    <button class="btn btn-primary">${ctaText}</button>`,
            ctaSecondaryText ? `${iii}    <button class="btn btn-outline">${ctaSecondaryText}</button>` : "",
            `${iii}  </div>`,
            `${iii}</div>`,
            subheadline ? `${iii}<p class="${supportingClass}">${subheadline}</p>` : "",
            `${ii}</div>`,
            `${i}</section>`,
        ].filter(Boolean).join("\n");
    }
    else {
        // below_center — default: headline above star, CTA below
        html = [
            `${i}<section${attrsString(heroAttrs)}>`,
            `${ii}<div class="hero-container">`,
            `${iii}<h1 class="${headlineClass}">${headline}</h1>`,
            subheadline ? `${iii}<p class="${supportingClass}">${subheadline}</p>` : "",
            starElement,
            `${iii}<div class="${ctaClass}">`,
            `${iii}  <button class="btn btn-primary">${ctaText}</button>`,
            ctaSecondaryText ? `${iii}  <button class="btn btn-outline">${ctaSecondaryText}</button>` : "",
            `${iii}</div>`,
            `${ii}</div>`,
            `${i}</section>`,
        ].filter(Boolean).join("\n");
    }
    return { html, heroAttrs };
}
// ── Internal helpers ──────────────────────────────────────────────────────────
function attrsString(attrs) {
    return Object.entries(attrs).map(([k, v]) => ` ${k}="${v}"`).join("");
}
/**
 * Render the inner star element for a given star type.
 * All CSS for these elements is declared in star-catalog.ts generateStarCSS().
 * No values are hardcoded here — the CSS vars do all the work.
 */
function renderStarElement(starType, v, indent) {
    const i = indent;
    switch (starType) {
        case "none":
            return "";
        case "oversized_phrase":
            // The phrase IS the star — display at clamp(5rem,14vw,18rem) via CSS
            return `${i}<div class="hero-star hero-star-type" aria-hidden="true">${v.headline ?? v.companyName ?? ""}</div>`;
        case "kinetic_type":
            // Per-character wrapping for animation — JS splits chars, CSS animates
            return [
                `${i}<div class="hero-star hero-star-type" data-kinetic="true">`,
                `${i}  <span class="kinetic-phrase">${v.headline ?? ""}</span>`,
                `${i}</div>`,
            ].join("\n");
        case "logo_as_art":
            return [
                `${i}<div class="hero-star">`,
                `${i}  <img class="hero-star-logo" src="" alt="${v.companyName ?? ""} logo">`,
                `${i}</div>`,
            ].join("\n");
        case "svg_mark":
            return [
                `${i}<div class="hero-star">`,
                `${i}  <svg class="hero-star-svg" viewBox="0 0 200 200" role="img" aria-label="${v.companyName ?? ""} mark">`,
                `${i}    <path d="M 20 100 Q 100 20 180 100 Q 100 180 20 100 Z" fill="none" stroke-linecap="round"/>`,
                `${i}  </svg>`,
                `${i}</div>`,
            ].join("\n");
        case "animated_gradient":
            return `${i}<div class="hero-star-gradient" aria-hidden="true"></div>`;
        case "noise_canvas":
            return [
                `${i}<div class="hero-star-noise" aria-hidden="true">`,
                `${i}  <canvas data-noise-canvas></canvas>`,
                `${i}</div>`,
            ].join("\n");
        case "color_field":
            return `${i}<div class="hero-star-color-field" aria-hidden="true"></div>`;
        case "signature_image":
            return [
                `${i}<div class="hero-star-image">`,
                `${i}  <img src="" alt="${v.companyName ?? ""} hero image" loading="eager">`,
                `${i}</div>`,
            ].join("\n");
        case "video_loop":
            return [
                `${i}<div class="hero-star-video">`,
                `${i}  <video autoplay muted loop playsinline>`,
                `${i}    <source src="" type="video/mp4">`,
                `${i}  </video>`,
                `${i}</div>`,
            ].join("\n");
        case "data_number":
            return [
                `${i}<div class="hero-star">`,
                `${i}  <span class="hero-star-number" data-counter>0</span>`,
                `${i}</div>`,
            ].join("\n");
        case "3d_object":
            return [
                `${i}<div class="hero-star" data-webgl-scene>`,
                `${i}  <canvas data-three-canvas></canvas>`,
                `${i}</div>`,
            ].join("\n");
        case "grid_mosaic":
            return [
                `${i}<div class="hero-star hero-star-mosaic">`,
                `${i}  <div class="mosaic-item"><img src="" alt="" loading="eager"></div>`,
                `${i}  <div class="mosaic-item"><img src="" alt="" loading="lazy"></div>`,
                `${i}  <div class="mosaic-item"><img src="" alt="" loading="lazy"></div>`,
                `${i}</div>`,
            ].join("\n");
        default:
            return `${i}<div class="hero-star" data-star-type="${starType}"></div>`;
    }
}
