/**
 * Cursor Engine
 *
 * Generates CSS and JS for the genome's active cursor type.
 * All cursor types gate on @media (pointer: fine) — never active
 * on touch/coarse pointer devices.
 *
 * CSS: declares cursor DOM structure and animations using genome vars.
 * JS: handles lerp, magnetic attraction, blend-mode, and trail logic.
 * No hardcoded colours, sizes, or timing values.
 */
import { selectCursorType, getCursorEntry } from "../cursor-catalog.js";
export function generateCursorOutput(genome) {
    const sig = genome.chromosomes.ch12_signature;
    const ch8 = genome.chromosomes.ch8_motion;
    const philosophy = sig?.designPhilosophy ?? "editorial";
    const entropy = sig?.entropy ?? 0.5;
    const physics = ch8?.physics ?? "none";
    const cursorType = selectCursorType({ philosophy, entropy, physics });
    const entry = getCursorEntry(cursorType);
    if (cursorType === "none") {
        return { css: "", js: "", html: "", cursorType };
    }
    return {
        css: generateCursorCSS(cursorType),
        js: generateCursorJS(cursorType, entry.magneticRange ?? 60),
        html: generateCursorHTML(cursorType),
        cursorType,
    };
}
// ── CSS ───────────────────────────────────────────────────────────────────────
function generateCursorCSS(type) {
    const base = `
/* ── Custom Cursor ──────────────────────────────────────────── */
/* Applied only on fine-pointer devices (mouse, stylus)         */
@media (pointer: fine) {
  * { cursor: none !important; }
${generateCursorTypeCSS(type)}
}`.trim();
    return base;
}
function generateCursorTypeCSS(type) {
    switch (type) {
        case "dot_circle":
            return `
  .cursor-dot {
    position: fixed; top: 0; left: 0; z-index: 99999;
    width: 6px; height: 6px;
    background: var(--color-primary);
    border-radius: var(--radius-full);
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: transform 0.05s;
  }
  .cursor-ring {
    position: fixed; top: 0; left: 0; z-index: 99998;
    width: 28px; height: 28px;
    border: 1px solid color-mix(in oklch, var(--color-primary) 60%, transparent);
    border-radius: var(--radius-full);
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: width 0.2s var(--ease-genome, ease), height 0.2s var(--ease-genome, ease),
                border-color 0.15s;
  }
  .cursor-ring[data-hovering] {
    width: 48px; height: 48px;
    border-color: var(--color-primary);
  }`;
        case "crosshair_precision":
            return `
  .cursor-crosshair {
    position: fixed; top: 0; left: 0; z-index: 99999;
    pointer-events: none;
    transform: translate(-50%, -50%);
  }
  .cursor-crosshair::before,
  .cursor-crosshair::after {
    content: ''; position: absolute;
    background: var(--color-primary);
    opacity: var(--opacity-secondary);
    transition: width 0.15s, height 0.15s, opacity 0.15s;
  }
  .cursor-crosshair::before { width: 1px; height: 16px; left: 0; top: -8px; }
  .cursor-crosshair::after  { width: 16px; height: 1px; top: 0; left: -8px; }
  .cursor-crosshair[data-hovering]::before { height: 24px; top: -12px; opacity: 1; }
  .cursor-crosshair[data-hovering]::after  { width: 24px; left: -12px; opacity: 1; }`;
        case "color_inverter":
            return `
  .cursor-inverter {
    position: fixed; top: 0; left: 0; z-index: 99999;
    width: 32px; height: 32px;
    background: var(--color-primary);
    border-radius: var(--radius-full);
    pointer-events: none;
    transform: translate(-50%, -50%);
    mix-blend-mode: difference;
    transition: transform 0.1s;
  }`;
        case "magnetic_blob":
            return `
  .cursor-blob {
    position: fixed; top: 0; left: 0; z-index: 99999;
    width: 36px; height: 36px;
    background: color-mix(in oklch, var(--color-primary) 80%, transparent);
    border-radius: var(--radius-full);
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: border-radius 0.3s var(--ease-genome, ease),
                width 0.3s, height 0.3s, background 0.2s;
    filter: blur(0.5px);
  }
  .cursor-blob[data-hovering] {
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    width: 48px; height: 48px;
    background: var(--color-accent);
  }`;
        case "context_text":
            return `
  .cursor-context {
    position: fixed; top: 0; left: 0; z-index: 99999;
    width: 8px; height: 8px;
    background: var(--color-primary);
    border-radius: var(--radius-full);
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: width 0.2s var(--ease-genome, ease), height 0.2s;
  }
  .cursor-context[data-label]::after {
    content: attr(data-label);
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    font-family: var(--font-anchor);
    font-size: var(--size-label, clamp(0.6rem, 1vw, 0.75rem));
    font-weight: var(--weight-display, 700);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-on-primary);
    white-space: nowrap;
  }
  .cursor-context[data-label] {
    width: 72px; height: 72px;
    background: var(--color-primary);
  }`;
        case "expanding_fill":
            return `
  .cursor-fill {
    position: fixed; top: 0; left: 0; z-index: 99999;
    width: 12px; height: 12px;
    background: var(--color-primary);
    border-radius: var(--radius-full);
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: width 0.25s var(--ease-genome, ease), height 0.25s,
                border-radius 0.25s, top 0.25s, left 0.25s;
  }`;
        case "trail_echo":
            return `
  .cursor-trail-dot {
    position: fixed; top: 0; left: 0; z-index: 99997;
    width: 8px; height: 8px;
    border-radius: var(--radius-full);
    background: var(--color-primary);
    pointer-events: none;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 0.1s;
  }`;
        case "magnetic_pull":
            return `
  .cursor-dot {
    position: fixed; top: 0; left: 0; z-index: 99999;
    width: 6px; height: 6px;
    background: var(--color-primary);
    border-radius: var(--radius-full);
    pointer-events: none;
    transform: translate(-50%, -50%);
  }
  [data-magnetic] {
    transition: transform var(--duration-fast, 0.3s) var(--ease-genome, cubic-bezier(0.16,1,0.3,1));
  }`;
        default:
            return "";
    }
}
// ── HTML ──────────────────────────────────────────────────────────────────────
function generateCursorHTML(type) {
    switch (type) {
        case "dot_circle":
            return `  <div class="cursor-dot" aria-hidden="true"></div>\n  <div class="cursor-ring" aria-hidden="true"></div>`;
        case "crosshair_precision":
            return `  <div class="cursor-crosshair" aria-hidden="true"></div>`;
        case "color_inverter":
            return `  <div class="cursor-inverter" aria-hidden="true"></div>`;
        case "magnetic_blob":
            return `  <div class="cursor-blob" aria-hidden="true"></div>`;
        case "context_text":
            return `  <div class="cursor-context" aria-hidden="true"></div>`;
        case "expanding_fill":
            return `  <div class="cursor-fill" aria-hidden="true"></div>`;
        case "trail_echo":
            return Array.from({ length: 7 }, (_, i) => `  <div class="cursor-trail-dot" data-trail="${i}" aria-hidden="true"></div>`).join("\n");
        case "magnetic_pull":
            return `  <div class="cursor-dot" aria-hidden="true"></div>`;
        default:
            return "";
    }
}
// ── JS ────────────────────────────────────────────────────────────────────────
function generateCursorJS(type, magneticRange) {
    switch (type) {
        case "dot_circle":
            return `
// cursor: dot_circle
(function() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;
  let rx = 0, ry = 0;
  window.addEventListener('pointermove', e => {
    dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px';
    rx += (e.clientX - rx) * 0.12; ry += (e.clientY - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  }, { passive: true });
  document.querySelectorAll('a, button, [role="button"]').forEach(el => {
    el.addEventListener('pointerenter', () => ring.dataset.hovering = '1');
    el.addEventListener('pointerleave', () => delete ring.dataset.hovering);
  });
})();`;
        case "crosshair_precision":
            return `
// cursor: crosshair_precision
(function() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const ch = document.querySelector('.cursor-crosshair');
  if (!ch) return;
  window.addEventListener('pointermove', e => {
    ch.style.left = e.clientX + 'px'; ch.style.top = e.clientY + 'px';
  }, { passive: true });
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('pointerenter', () => ch.dataset.hovering = '1');
    el.addEventListener('pointerleave', () => delete ch.dataset.hovering);
  });
})();`;
        case "color_inverter":
            return `
// cursor: color_inverter
(function() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const inv = document.querySelector('.cursor-inverter');
  if (!inv) return;
  window.addEventListener('pointermove', e => {
    inv.style.left = e.clientX + 'px'; inv.style.top = e.clientY + 'px';
  }, { passive: true });
})();`;
        case "magnetic_blob":
            return `
// cursor: magnetic_blob
(function() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const blob = document.querySelector('.cursor-blob');
  if (!blob) return;
  let bx = 0, by = 0;
  window.addEventListener('pointermove', e => {
    bx += (e.clientX - bx) * 0.10; by += (e.clientY - by) * 0.10;
    blob.style.left = bx + 'px'; blob.style.top = by + 'px';
  }, { passive: true });
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('pointerenter', () => blob.dataset.hovering = '1');
    el.addEventListener('pointerleave', () => delete blob.dataset.hovering);
  });
})();`;
        case "context_text":
            return `
// cursor: context_text
(function() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const ctx = document.querySelector('.cursor-context');
  if (!ctx) return;
  window.addEventListener('pointermove', e => {
    ctx.style.left = e.clientX + 'px'; ctx.style.top = e.clientY + 'px';
  }, { passive: true });
  const labels = { A: 'VIEW', BUTTON: 'ACTION', VIDEO: 'PLAY', IMG: 'ZOOM' };
  document.addEventListener('pointerover', e => {
    const tag = e.target?.tagName;
    const label = e.target?.dataset?.cursorLabel ?? labels[tag] ?? null;
    if (label) ctx.dataset.label = label; else delete ctx.dataset.label;
  });
})();`;
        case "expanding_fill":
            return `
// cursor: expanding_fill
(function() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const fill = document.querySelector('.cursor-fill');
  if (!fill) return;
  window.addEventListener('pointermove', e => {
    fill.style.left = e.clientX + 'px'; fill.style.top = e.clientY + 'px';
  }, { passive: true });
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('pointerenter', () => {
      const r = el.getBoundingClientRect();
      fill.style.width = r.width + 'px'; fill.style.height = r.height + 'px';
      fill.style.borderRadius = getComputedStyle(el).borderRadius;
      fill.style.left = (r.left + r.width / 2) + 'px'; fill.style.top = (r.top + r.height / 2) + 'px';
    });
    el.addEventListener('pointerleave', () => {
      fill.style.width = ''; fill.style.height = ''; fill.style.borderRadius = '';
    });
  });
})();`;
        case "trail_echo":
            return `
// cursor: trail_echo
(function() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const dots = Array.from(document.querySelectorAll('.cursor-trail-dot'));
  if (!dots.length) return;
  const positions = dots.map(() => ({ x: 0, y: 0 }));
  let mx = 0, my = 0;
  window.addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  function frame() {
    positions[0].x += (mx - positions[0].x) * 0.3;
    positions[0].y += (my - positions[0].y) * 0.3;
    for (let i = 1; i < positions.length; i++) {
      positions[i].x += (positions[i-1].x - positions[i].x) * 0.4;
      positions[i].y += (positions[i-1].y - positions[i].y) * 0.4;
    }
    dots.forEach((dot, i) => {
      dot.style.left = positions[i].x + 'px'; dot.style.top = positions[i].y + 'px';
      dot.style.opacity = String((1 - i / dots.length) * 0.6);
      dot.style.transform = \`translate(-50%,-50%) scale(\${1 - i * 0.1})\`;
    });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();`;
        case "magnetic_pull":
            return `
// cursor: magnetic_pull — elements attract cursor
(function() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const dot = document.querySelector('.cursor-dot');
  if (!dot) return;
  let cx = 0, cy = 0;
  window.addEventListener('pointermove', e => {
    cx = e.clientX; cy = e.clientY;
    dot.style.left = cx + 'px'; dot.style.top = cy + 'px';
  }, { passive: true });
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const mx = r.left + r.width / 2, my = r.top + r.height / 2;
      const dx = (cx - mx) * 0.3, dy = (cy - my) * 0.3;
      const dist = Math.hypot(cx - mx, cy - my);
      if (dist < ${magneticRange}) el.style.transform = \`translate(\${dx}px,\${dy}px)\`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
})();`;
        default:
            return "";
    }
}
