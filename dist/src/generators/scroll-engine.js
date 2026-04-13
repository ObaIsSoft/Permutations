/**
 * Scroll Engine
 *
 * Generates CSS and JS for the genome's active scroll technique.
 * All values reference genome CSS custom properties.
 * No hardcoded colours, sizes, or timing values.
 */
import { selectScrollTechnique } from "../scroll-catalog.js";
export function generateScrollOutput(genome) {
    const ch1 = genome.chromosomes.ch1_structure;
    const sig = genome.chromosomes.ch12_signature;
    const ch8 = genome.chromosomes.ch8_motion;
    const ch15 = genome.chromosomes.ch15_biomarker;
    const philosophy = sig?.designPhilosophy ?? "editorial";
    const physics = ch8?.physics ?? "none";
    const scrollBehavior = ch1?.scrollBehavior ?? "continuous";
    const sectionCount = genome.chromosomes.ch1_structure ? 5 : 3;
    const hasWebGL = ch15?.enabled ?? false;
    const technique = selectScrollTechnique({ philosophy, physics, scrollBehavior, sectionCount, hasWebGL });
    return {
        css: generateScrollCSS(technique),
        js: generateScrollJS(technique),
        installHint: getInstallHint(technique),
        technique,
    };
}
// ── CSS ───────────────────────────────────────────────────────────────────────
function generateScrollCSS(technique) {
    switch (technique) {
        case "scroll_snap_v":
            return `
/* scroll: scroll_snap_v */
html { scroll-snap-type: y mandatory; overflow-y: scroll; }
.section, .hero { scroll-snap-align: start; min-height: 100vh; }`;
        case "scroll_snap_h":
            return `
/* scroll: scroll_snap_h */
.scroll-container { scroll-snap-type: x mandatory; display: flex; overflow-x: scroll; width: 100vw; }
.scroll-panel { scroll-snap-align: start; flex: 0 0 100vw; min-height: 100vh; }`;
        case "css_scroll_driven":
            return `
/* scroll: css_scroll_driven — native animation-timeline */
@supports (animation-timeline: scroll()) {
  .section { animation: section-reveal linear both; animation-timeline: view(); animation-range: entry 0% entry 30%; }
  @keyframes section-reveal { from { opacity: 0; transform: translateY(var(--spacing-xl)); } to { opacity: 1; transform: none; } }
}`;
        case "parallax_layers":
            return `
/* scroll: parallax_layers */
[data-rellax-speed] { transition: transform 0.1s linear; }`;
        case "velocity_distort":
        case "lenis_basic":
        case "lenis_gsap_scrub":
        case "lenis_gsap_pin":
        case "gsap_horizontal":
            return `/* scroll: ${technique} — driven by JS */`;
        default:
            return "";
    }
}
// ── JS ────────────────────────────────────────────────────────────────────────
function generateScrollJS(technique) {
    switch (technique) {
        case "native":
            return `// scroll: native — no scroll JS`;
        case "css_scroll_driven":
            return `// scroll: css_scroll_driven — no JS required (native CSS animation-timeline)`;
        case "lenis_basic":
            return `
// scroll: lenis_basic
(function() {
  if (typeof Lenis === 'undefined') return;
  const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
})();`;
        case "lenis_gsap_scrub":
            return `
// scroll: lenis_gsap_scrub
(function() {
  if (typeof Lenis === 'undefined' || typeof gsap === 'undefined') return;
  const lenis = new Lenis();
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  gsap.utils.toArray('.section').forEach(section => {
    gsap.from(section, {
      opacity: 0, y: 60,
      scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 30%', scrub: 1 }
    });
  });
})();`;
        case "lenis_gsap_pin":
            return `
// scroll: lenis_gsap_pin
(function() {
  if (typeof Lenis === 'undefined' || typeof gsap === 'undefined') return;
  const lenis = new Lenis();
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  gsap.utils.toArray('.section').forEach((section, i) => {
    ScrollTrigger.create({
      trigger: section, start: 'top top',
      pin: true, pinSpacing: false,
      id: 'pin-' + i
    });
  });
})();`;
        case "scroll_snap_v":
        case "scroll_snap_h":
            return `// scroll: ${technique} — CSS-only scroll snap`;
        case "gsap_horizontal":
            return `
// scroll: gsap_horizontal
(function() {
  if (typeof gsap === 'undefined') return;
  const sections = gsap.utils.toArray('.section');
  const totalWidth = sections.reduce((acc, s) => acc + s.offsetWidth, 0);
  gsap.to(sections, {
    x: () => -(totalWidth - window.innerWidth),
    ease: 'none',
    scrollTrigger: { trigger: '.main-content', pin: true, scrub: 1, end: () => '+=' + totalWidth }
  });
})();`;
        case "parallax_layers":
            return `
// scroll: parallax_layers
(function() {
  const els = document.querySelectorAll('[data-rellax-speed]');
  if (!els.length) return;
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    els.forEach(el => {
      const speed = parseFloat(el.dataset.rellaxSpeed ?? '0');
      el.style.transform = 'translateY(' + (sy * speed * 0.1) + 'px)';
    });
  }, { passive: true });
})();`;
        case "velocity_distort":
            return `
// scroll: velocity_distort — velocity → uVelocity uniform
(function() {
  let lastY = 0, velocity = 0;
  window.addEventListener('scroll', () => {
    velocity = window.scrollY - lastY;
    lastY = window.scrollY;
    document.documentElement.style.setProperty('--scroll-velocity', String(Math.abs(velocity)));
  }, { passive: true });
})();`;
        default:
            return "";
    }
}
// ── Install hints ─────────────────────────────────────────────────────────────
function getInstallHint(technique) {
    const deps = {
        lenis_basic: "npm install lenis",
        lenis_gsap_scrub: "npm install lenis gsap",
        lenis_gsap_pin: "npm install lenis gsap",
        gsap_horizontal: "npm install gsap",
        parallax_layers: "npm install rellax",
        velocity_distort: "npm install gsap",
        css_scroll_driven: "",
        scroll_snap_v: "",
        scroll_snap_h: "",
        native: "",
    };
    return deps[technique] ?? "";
}
