import { DesignGenome } from "../genome/types.js";
import { CivilizationTier, ComponentSpec, AnimationSystem, ArchitectureSpec } from "../genome/civilization.js";

// ── Component token bag — genome values baked in as literals ─────────────────
interface CT {
    r: number;    // border-radius px
    hue: number; sat: number; light: number;
    dur: number;  // motion duration scale
    phys: string; // physics easing name
    surf: string; // surface background color
    elev: string; // elevated surface color
    dark: boolean;
    border: string;
    muted: string;
}

function ct(genome: DesignGenome): CT {
    const p = genome.chromosomes.ch5_color_primary;
    const bg = genome.chromosomes.ch6_color_temp;
    const m = genome.chromosomes.ch8_motion;
    return {
        r: genome.chromosomes.ch7_edge.radius,
        hue: p.hue,
        sat: Math.round(p.saturation * 100),
        light: Math.round(p.lightness * 100),
        dur: m.durationScale,
        phys: m.physics,
        surf: bg.surfaceColor,
        elev: bg.elevatedSurface,
        dark: bg.isDark,
        border: bg.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
        muted: bg.isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    };
}

// Components whose function body needs React.useState
const STATEFUL = new Set(['Dropdown', 'Combobox', 'Accordion']);
// Components that accept children
const CHILDREN_COMPONENTS = new Set(['Button', 'Card', 'Modal', 'Tooltip', 'Tabs']);

/**
 * Generates React component code from component specs.
 * Produces functional, wire-ready components with semantic HTML,
 * wired props, and genome-derived design tokens baked in.
 */
export function generateComponentCode(spec: ComponentSpec, genome: DesignGenome): string {
    const t = ct(genome);
    const primary = `hsl(${t.hue}, ${t.sat}%, ${t.light}%)`;

    const propsInterface = spec.props
        .map(p => `  ${p.name}${p.required ? '' : '?'}: ${p.type}${p.default !== undefined ? `; // default: ${JSON.stringify(p.default)}` : ''}`)
        .join('\n');

    const propsWithDefaults = spec.props
        .map(p => p.default !== undefined ? `${p.name} = ${JSON.stringify(p.default)}` : p.name)
        .join(', ');

    const variantsBlock = spec.variants.length > 1
        ? `  const variantStyles: Record<string, string> = {\n${spec.variants.map(v => `    ${v}: '${generateVariantStyle(v, genome)}',`).join('\n')}\n  };\n`
        : '';

    const needsState = STATEFUL.has(spec.name);
    const stateImport = needsState ? ', { useState }' : '';
    const stateBlock = buildStateBlock(spec.name);

    const needsChildren = CHILDREN_COMPONENTS.has(spec.name);
    const childrenInterface = needsChildren ? `\n  children?: React.ReactNode;` : '';
    const childrenDestructure = needsChildren ? ', children' : '';

    const jsxBody = dispatchJSX(spec, t, primary);

    return `import React${stateImport} from 'react';
import { motion } from 'framer-motion';

// DNA: ${primary} | ${t.phys} | radius: ${t.r}px
// a11y: role="${spec.accessibility.role}" | keys: ${spec.accessibility.keyboard.join(', ') || 'none'}

interface ${spec.name}Props {
${propsInterface}${childrenInterface}
}

export function ${spec.name}({ ${propsWithDefaults}${childrenDestructure} }: ${spec.name}Props) {
${variantsBlock}${stateBlock}  return (
${jsxBody}
  );
}
`;
}

function buildStateBlock(name: string): string {
    if (name === 'Dropdown' || name === 'Combobox') {
        return '  const [isOpen, setIsOpen] = useState(false);\n';
    }
    if (name === 'Accordion') {
        return [
            '  const [open, setOpen] = useState<Set<number>>(new Set());',
            '  const toggle = (i: number) => setOpen(prev => {',
            '    const next = new Set(prev);',
            '    next.has(i) ? next.delete(i) : next.add(i);',
            '    return next;',
            '  });\n',
        ].join('\n  ');
    }
    return '';
}

// ── Per-component JSX dispatchers ────────────────────────────────────────────

function dispatchJSX(spec: ComponentSpec, t: CT, primary: string): string {
    switch (spec.name) {
        case 'Button':         return jsxButton(t, primary);
        case 'Card':           return jsxCard(t);
        case 'Input':          return jsxInput(t);
        case 'Navigation':     return jsxNavigation(t, primary);
        case 'Modal':          return jsxModal(t, primary);
        case 'Dropdown':       return jsxDropdown(t, primary);
        case 'Toast':          return jsxToast(t, primary);
        case 'Tooltip':        return jsxTooltip(t);
        case 'Tabs':           return jsxTabs(t, primary);
        case 'Accordion':      return jsxAccordion(t);
        case 'DataTable':      return jsxDataTable(t, primary);
        case 'Chart':          return jsxChart(t);
        case 'Form':           return jsxForm(t, primary);
        case 'CommandPalette': return jsxCommandPalette(t, primary);
        case 'VirtualList':    return jsxVirtualList(t);
        case 'Combobox':       return jsxCombobox(t, primary);
        case 'GenerativeLayout': return jsxGenerativeLayout(t);
        case 'SmartComponent': return jsxSmartComponent(t);
        default:               return jsxGenericFallback(spec, t);
    }
}

function jsxButton(t: CT, primary: string): string {
    return `    <motion.button
      role="button"
      className={variantStyles[variant] ?? ''}
      style={{ borderRadius: '${t.r}px', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1 }}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      transition={{ duration: ${t.dur}, ease: '${t.phys}' }}
      disabled={disabled}
      aria-disabled={disabled}
      onClick={onClick}
    >
      {children}
    </motion.button>`;
}

function jsxCard(t: CT): string {
    return `    <motion.article
      style={{
        borderRadius: '${t.r}px',
        background: '${t.elev}',
        border: '1px solid ${t.border}',
        padding: '24px',
        overflow: 'hidden',
      }}
      whileHover={interactive ? { y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.18)' } : {}}
      transition={{ duration: ${t.dur}, ease: '${t.phys}' }}
    >
      {children}
    </motion.article>`;
}

function jsxInput(t: CT): string {
    return `    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <input
        type={type}
        value={value}
        style={{
          borderRadius: '${t.r}px',
          border: error ? '1px solid hsl(0,70%,55%)' : '1px solid ${t.border}',
          padding: '10px 14px',
          background: '${t.surf}',
          color: '${t.dark ? '#fff' : '#000'}',
          outline: 'none',
          width: '100%',
          boxSizing: 'border-box' as const,
          transition: 'border-color ${t.dur}s',
        }}
        onChange={e => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? 'input-err' : undefined}
      />
      {error && (
        <span id="input-err" role="alert" style={{ fontSize: '0.75rem', color: 'hsl(0,70%,55%)' }}>
          {error}
        </span>
      )}
    </div>`;
}

function jsxNavigation(t: CT, primary: string): string {
    return `    <nav
      role="navigation"
      style={{ display: 'flex', flexDirection: orientation === 'vertical' ? 'column' : 'row', gap: '8px' }}
    >
      <ul role="list" style={{ display: 'contents', listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map((item: { id?: string; label: string; href: string; active?: boolean }) => (
          <li key={item.id ?? item.label}>
            <a
              href={item.href}
              aria-current={item.active ? 'page' : undefined}
              style={{
                display: 'block',
                padding: '8px 14px',
                borderRadius: '${t.r}px',
                color: item.active ? '${primary}' : '${t.dark ? '#fff' : '#000'}',
                background: item.active ? '${t.elev}' : 'transparent',
                textDecoration: 'none',
                transition: 'color ${t.dur}s, background ${t.dur}s',
              }}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>`;
}

function jsxModal(t: CT, primary: string): string {
    return `    <>
      {isOpen && (
        <div
          onClick={onClose}
          aria-hidden="true"
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 40,
          }}
        />
      )}
      <dialog
        open={isOpen}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '${t.r}px',
          background: '${t.elev}',
          border: '1px solid ${t.border}',
          padding: '28px',
          maxWidth: size === 'sm' ? '360px' : size === 'lg' ? '720px' : size === 'fullscreen' ? '100vw' : '520px',
          width: '90vw',
          zIndex: 50,
          margin: 0,
        }}
      >
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 id="modal-title" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '${t.muted}' }}
          >
            ✕
          </button>
        </header>
        <div>{children}</div>
      </dialog>
    </>`;
}

function jsxDropdown(t: CT, primary: string): string {
    return `    <div
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(o => !o)}
        style={{
          borderRadius: '${t.r}px',
          border: '1px solid ${t.border}',
          padding: '10px 14px',
          background: '${t.surf}',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          minWidth: '160px',
        }}
      >
        <span style={{ flex: 1, textAlign: 'left' }}>
          {multi
            ? (value as string[]).length ? (value as string[]).join(', ') : 'Select...'
            : options.find((o: { value: string; label: string }) => o.value === value)?.label ?? 'Select...'}
        </span>
        <span aria-hidden="true">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <ul
          role="listbox"
          style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            margin: '4px 0 0',
            padding: '4px',
            borderRadius: '${t.r}px',
            border: '1px solid ${t.border}',
            background: '${t.elev}',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            zIndex: 10,
            listStyle: 'none',
          }}
        >
          {options.map((opt: { value: string; label: string }) => {
            const selected = multi ? (value as string[]).includes(opt.value) : value === opt.value;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={selected}
                onClick={() => multi
                  ? onChange((value as string[]).includes(opt.value)
                      ? (value as string[]).filter(v => v !== opt.value)
                      : [...(value as string[]), opt.value])
                  : onChange(opt.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '${Math.max(0, t.r - 2)}px',
                  cursor: 'pointer',
                  background: selected ? '${primary}' : 'transparent',
                  color: selected ? '#fff' : 'inherit',
                }}
              >
                {opt.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>`;
}

function jsxToast(t: CT, primary: string): string {
    return `    <motion.div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: ${t.dur}, ease: '${t.phys}' }}
      style={{
        borderRadius: '${t.r}px',
        padding: '14px 18px',
        background: type === 'error' ? 'hsl(0,70%,45%)' : type === 'success' ? 'hsl(145,60%,35%)' : type === 'warning' ? 'hsl(38,90%,45%)' : '${primary}',
        color: '#fff',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        maxWidth: '380px',
        fontWeight: 500,
      }}
    >
      {message}
    </motion.div>`;
}

function jsxTooltip(t: CT): string {
    return `    <div style={{ position: 'relative', display: 'inline-block' }}>
      {children}
      <motion.div
        role="tooltip"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: ${t.dur * 0.7}, delay: delay / 1000 }}
        style={{
          position: 'absolute',
          ...(placement === 'top'    ? { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '6px' } :
              placement === 'bottom' ? { top: '100%',    left: '50%', transform: 'translateX(-50%)', marginTop: '6px' } :
              placement === 'left'   ? { right: '100%',  top: '50%',  transform: 'translateY(-50%)', marginRight: '6px' } :
                                       { left: '100%',   top: '50%',  transform: 'translateY(-50%)', marginLeft: '6px' }),
          background: '${t.dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.85)'}',
          color: '${t.dark ? '#111' : '#fff'}',
          padding: '6px 10px',
          borderRadius: '${Math.max(4, Math.round(t.r * 0.5))}px',
          fontSize: '0.8rem',
          whiteSpace: 'nowrap',
          zIndex: 100,
          pointerEvents: 'none',
        }}
      >
        {content}
      </motion.div>
    </div>`;
}

function jsxTabs(t: CT, primary: string): string {
    return `    <div>
      <div role="tablist" style={{ display: 'flex', gap: '2px', borderBottom: '1px solid ${t.border}' }}>
        {tabs.map((tab: { id: string; label: string; content?: React.ReactNode }) => (
          <button
            key={tab.id}
            role="tab"
            id={'tab-' + tab.id}
            aria-selected={activeTab === tab.id}
            aria-controls={'panel-' + tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              padding: '10px 16px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              borderBottom: activeTab === tab.id ? '2px solid ${primary}' : '2px solid transparent',
              color: activeTab === tab.id ? '${primary}' : '${t.muted}',
              fontWeight: activeTab === tab.id ? 600 : 400,
              transition: 'color ${t.dur}s, border-color ${t.dur}s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab: { id: string; label: string; content?: React.ReactNode }) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={'panel-' + tab.id}
          aria-labelledby={'tab-' + tab.id}
          hidden={activeTab !== tab.id}
          style={{ padding: '20px 0' }}
        >
          {tab.content ?? children}
        </div>
      ))}
    </div>`;
}

function jsxAccordion(t: CT): string {
    return `    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {items.map((item: { title: string; content: React.ReactNode }, i: number) => (
        <div key={i} style={{ borderRadius: '${t.r}px', border: '1px solid ${t.border}', overflow: 'hidden' }}>
          <button
            type="button"
            aria-expanded={open.has(i)}
            aria-controls={'acc-panel-' + i}
            id={'acc-btn-' + i}
            onClick={() => toggle(i)}
            style={{
              width: '100%', textAlign: 'left',
              padding: '14px 18px',
              background: 'none', border: 'none',
              cursor: 'pointer',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontWeight: 600,
            }}
          >
            {item.title}
            <span aria-hidden="true" style={{ transition: 'transform ${t.dur}s', transform: open.has(i) ? 'rotate(180deg)' : 'none' }}>▼</span>
          </button>
          {open.has(i) && (
            <div
              id={'acc-panel-' + i}
              role="region"
              aria-labelledby={'acc-btn-' + i}
              style={{ padding: '0 18px 18px' }}
            >
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>`;
}

function jsxDataTable(t: CT, primary: string): string {
    return `    <div role="region" aria-label="Data table" style={{ overflowX: 'auto' }}>
      <table
        role="table"
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        <thead>
          <tr>
            {selectable && (
              <th scope="col" style={{ padding: '10px 14px', borderBottom: '2px solid ${t.border}', width: '40px' }}>
                <input type="checkbox" aria-label="Select all rows" />
              </th>
            )}
            {columns.map((col: { key: string; label: string; sortDir?: 'ascending' | 'descending' }) => (
              <th
                key={col.key}
                scope="col"
                aria-sort={col.sortDir}
                style={{
                  padding: '10px 14px',
                  textAlign: 'left',
                  borderBottom: '2px solid ${t.border}',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {sortable ? (
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'inherit', padding: 0 }}>
                    {col.label}
                  </button>
                ) : col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: Record<string, unknown>, i: number) => (
            <tr
              key={i}
              aria-selected={selectable ? !!row._selected : undefined}
              style={{ borderBottom: '1px solid ${t.border}', background: i % 2 === 0 ? 'transparent' : '${t.dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'}' }}
            >
              {selectable && (
                <td style={{ padding: '10px 14px' }}>
                  <input type="checkbox" checked={!!row._selected} onChange={e => onSelectionChange?.(i, e.target.checked)} aria-label={'Select row ' + (i + 1)} />
                </td>
              )}
              {columns.map((col: { key: string; label: string }) => (
                <td key={col.key} style={{ padding: '10px 14px' }}>{row[col.key] as React.ReactNode}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>`;
}

function jsxChart(t: CT): string {
    return `    <div
      role="img"
      aria-label={String(type) + ' chart'}
      style={{
        background: '${t.surf}',
        borderRadius: '${t.r}px',
        border: '1px solid ${t.border}',
        padding: '20px',
        position: 'relative',
        minHeight: '240px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Render data using your preferred charting library (recharts, visx, d3) */}
      {/* data: {JSON.stringify(data).slice(0, 80)}... */}
      {animated && (
        <svg aria-hidden="true" width="100%" height="200" style={{ overflow: 'visible' }}>
          <text x="50%" y="50%" textAnchor="middle" fill="${t.muted}" fontSize="14">
            {String(type)} chart — wire to recharts/visx/d3
          </text>
        </svg>
      )}
    </div>`;
}

function jsxForm(t: CT, primary: string): string {
    return `    <form
      role="form"
      onSubmit={e => { e.preventDefault(); onSubmit(Object.fromEntries(new FormData(e.currentTarget))); }}
      style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
    >
      {schema.map((field: { name: string; label?: string; type?: string; required?: boolean }) => (
        <div key={field.name} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {field.label && (
            <label htmlFor={'field-' + field.name} style={{ fontWeight: 600, fontSize: '0.875rem' }}>
              {field.label}{field.required && <span aria-hidden="true" style={{ color: 'hsl(0,70%,55%)' }}> *</span>}
            </label>
          )}
          <input
            id={'field-' + field.name}
            name={field.name}
            type={field.type ?? 'text'}
            required={field.required}
            style={{
              borderRadius: '${t.r}px',
              border: '1px solid ${t.border}',
              padding: '10px 14px',
              background: '${t.surf}',
              outline: 'none',
            }}
          />
        </div>
      ))}
      <button
        type="submit"
        style={{
          borderRadius: '${t.r}px',
          padding: '12px 24px',
          background: '${primary}',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 600,
          alignSelf: 'flex-start',
        }}
      >
        Submit
      </button>
    </form>`;
}

function jsxCommandPalette(t: CT, primary: string): string {
    return `    <>
      {isOpen && (
        <div
          onClick={onClose}
          aria-hidden="true"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 50 }}
        />
      )}
      <dialog
        open={isOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        style={{
          position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
          borderRadius: '${t.r}px',
          background: '${t.elev}',
          border: '1px solid ${t.border}',
          padding: 0,
          width: '560px',
          maxWidth: '92vw',
          zIndex: 60,
          boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
          margin: 0,
          overflow: 'hidden',
        }}
      >
        <div style={{ borderBottom: '1px solid ${t.border}', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
          <span aria-hidden="true" style={{ color: '${t.muted}', marginRight: '8px' }}>⌘</span>
          <input
            type="search"
            placeholder={placeholder}
            aria-label="Search commands"
            autoFocus
            onKeyDown={e => e.key === 'Escape' && onClose()}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              padding: '16px 0',
              fontSize: '1rem',
              outline: 'none',
              color: 'inherit',
            }}
          />
        </div>
        <ul role="listbox" style={{ listStyle: 'none', margin: 0, padding: '8px', maxHeight: '320px', overflowY: 'auto' }}>
          {commands.map((cmd: { label: string; action?: () => void; shortcut?: string }, i: number) => (
            <li
              key={i}
              role="option"
              aria-selected={false}
              onClick={() => { cmd.action?.(); onClose(); }}
              style={{
                padding: '10px 12px',
                borderRadius: '${Math.max(0, t.r - 2)}px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '${t.dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span>{cmd.label}</span>
              {cmd.shortcut && <kbd style={{ fontSize: '0.75rem', opacity: 0.5 }}>{cmd.shortcut}</kbd>}
            </li>
          ))}
        </ul>
      </dialog>
    </>`;
}

function jsxVirtualList(t: CT): string {
    return `    <div
      role="list"
      aria-rowcount={items.length}
      style={{ height: itemHeight * Math.min(items.length, 10), overflowY: 'auto', position: 'relative' }}
    >
      {items.map((item: unknown, i: number) => (
        <div
          key={i}
          role="listitem"
          aria-rowindex={i + 1}
          style={{
            height: itemHeight,
            overflow: 'hidden',
            borderBottom: '1px solid ${t.border}',
          }}
        >
          {renderItem(item, i)}
        </div>
      ))}
    </div>`;
}

function jsxCombobox(t: CT, primary: string): string {
    return `    <div
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-autocomplete="list"
      style={{ position: 'relative', display: 'inline-block', minWidth: '200px' }}
    >
      <div style={{ display: 'flex', border: '1px solid ${t.border}', borderRadius: '${t.r}px', overflow: 'hidden' }}>
        <input
          type="text"
          placeholder="Search or select..."
          onChange={() => setIsOpen(true)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={e => { if (e.key === 'Escape') setIsOpen(false); }}
          style={{
            flex: 1,
            border: 'none',
            padding: '10px 14px',
            background: '${t.surf}',
            outline: 'none',
          }}
        />
        {creatable && (
          <button type="button" onClick={() => {}} style={{ padding: '0 12px', border: 'none', background: '${t.elev}', cursor: 'pointer' }}>
            + New
          </button>
        )}
      </div>
      {isOpen && (
        <ul
          role="listbox"
          style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            margin: '4px 0 0',
            padding: '4px',
            borderRadius: '${t.r}px',
            border: '1px solid ${t.border}',
            background: '${t.elev}',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            zIndex: 10,
            listStyle: 'none',
            maxHeight: '240px',
            overflowY: 'auto',
          }}
        >
          {options.map((opt: { value: string; label: string }) => {
            const sel = Array.isArray(value) ? (value as string[]).includes(opt.value) : value === opt.value;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={sel}
                onClick={() => { onChange(opt.value); if (!async) setIsOpen(false); }}
                style={{
                  padding: '8px 12px',
                  borderRadius: '${Math.max(0, t.r - 2)}px',
                  cursor: 'pointer',
                  background: sel ? '${primary}' : 'transparent',
                  color: sel ? '#fff' : 'inherit',
                }}
              >
                {opt.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>`;
}

function jsxGenerativeLayout(t: CT): string {
    return `    <div
      role="region"
      aria-label={intent}
      style={{
        display: adaptive ? 'grid' : 'block',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
      }}
    >
      {content.map((item: unknown, i: number) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: ${t.dur}, delay: i * 0.05, ease: '${t.phys}' }}
          style={{
            borderRadius: '${t.r}px',
            background: '${t.elev}',
            border: '1px solid ${t.border}',
            padding: '20px',
          }}
        >
          {String(item)}
        </motion.div>
      ))}
    </div>`;
}

function jsxSmartComponent(t: CT): string {
    return `    <div
      role="region"
      aria-busy={false}
      aria-live="polite"
      style={{
        display: renderStrategy === 'grid' ? 'grid' : renderStrategy === 'spatial' ? 'flex' : 'block',
        gridTemplateColumns: renderStrategy === 'grid' ? 'repeat(auto-fill, minmax(200px, 1fr))' : undefined,
        gap: '16px',
      }}
    >
      {Array.isArray(dataSource)
        ? dataSource.map((item: unknown, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: ${t.dur}, delay: i * 0.04 }}
              style={{ borderRadius: '${t.r}px', background: '${t.elev}', padding: '16px' }}
            >
              {String(item)}
            </motion.div>
          ))
        : <span style={{ color: '${t.muted}' }}>Connect dataSource to render items</span>}
    </div>`;
}

function jsxGenericFallback(spec: ComponentSpec, t: CT): string {
    return `    <div
      role="${spec.accessibility.role}"
      style={{
        borderRadius: '${t.r}px',
        background: '${t.elev}',
        border: '1px solid ${t.border}',
        padding: '20px',
      }}
    >
      {/* ${spec.name} — ${spec.category} */}
    </div>`;
}

function generateVariantStyle(variant: string, genome: DesignGenome): string {
    const hue = genome.chromosomes.ch5_color_primary.hue;
    const sat = Math.round(genome.chromosomes.ch5_color_primary.saturation * 100);
    const light = Math.round(genome.chromosomes.ch5_color_primary.lightness * 100);
    const accentHue = (hue + 30) % 360; // Complementary for danger
    
    switch (variant) {
        case 'primary': return `bg-[hsl(${hue},${sat}%,${light}%)] text-white`;
        case 'secondary': return `bg-[hsl(${hue},${Math.max(20, sat - 20)}%,${Math.min(95, light + 40)}%)] text-[hsl(${hue},${sat}%,${Math.max(20, light - 20)}%)]`;
        case 'ghost': return `bg-transparent border border-[hsl(${hue},${sat}%,${light}%)]`;
        case 'danger': return `bg-[hsl(${accentHue},${sat}%,${Math.min(50, light)}%)] text-white`;
        default: return '';
    }
}

/**
 * Generates animation configuration based on animation system spec
 */
export function generateAnimationConfig(system: AnimationSystem, genome: DesignGenome): string {
    const configs: string[] = [];
    
    // Physics configuration
    configs.push(`export const physics = {
  type: "${system.physics}",
  stiffness: ${genome.chromosomes.ch8_motion.physics === 'spring' ? 100 : 50},
  damping: ${genome.chromosomes.ch8_motion.physics === 'spring' ? 10 : 20},
};`);
    
    // Animation variants
    configs.push(`export const transitions = {
${system.types.map(type => `  ${type}: {
    duration: ${genome.chromosomes.ch8_motion.durationScale},
    ease: "${genome.chromosomes.ch8_motion.physics}",
  },`).join('\n')}
};`);
    
    // Choreography patterns
    if (system.choreography === 'staggered') {
        configs.push(`export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};`);
    }
    
    // Reduced motion support
    configs.push(`export const prefersReducedMotion = typeof window !== 'undefined' 
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
  : false;`);
    
    return configs.join('\n\n');
}

/**
 * Generates architecture setup (state topology, routing pattern, token inheritance)
 */
export function generateArchitectureSetup(arch: ArchitectureSpec, genome: DesignGenome): string {
    const outputs: string[] = [];

    // State topology
    if (arch.stateTopology === 'shared_context') {
        outputs.push(`// State: React Context (shared_context)
import React, { createContext, useContext, useState } from 'react';

interface AppContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  return (
    <AppContext.Provider value={{ theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};`);
    } else if (arch.stateTopology === 'reactive_store') {
        outputs.push(`// State: Zustand Store (reactive_store)
import { create } from 'zustand';

interface AppState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}));`);
    } else if (arch.stateTopology === 'distributed') {
        outputs.push(`// State: Zustand with persist middleware (distributed)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'app-storage' }
  )
);`);
    } else if (arch.stateTopology === 'federated') {
        outputs.push(`// State: Cross-app event bus (federated)
type EventMap = Record<string, unknown>;

class EventBus {
  private handlers: Map<string, Array<(payload: unknown) => void>> = new Map();

  on<K extends keyof EventMap>(event: K, handler: (payload: EventMap[K]) => void): () => void {
    const existing = this.handlers.get(event as string) ?? [];
    this.handlers.set(event as string, [...existing, handler as (p: unknown) => void]);
    return () => this.off(event, handler);
  }

  off<K extends keyof EventMap>(event: K, handler: (payload: EventMap[K]) => void): void {
    const existing = this.handlers.get(event as string) ?? [];
    this.handlers.set(event as string, existing.filter((h) => h !== handler));
  }

  emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): void {
    (this.handlers.get(event as string) ?? []).forEach((h) => h(payload));
  }
}

export const appBus = new EventBus();`);
    }
    // stateTopology === 'local' → no setup; useState is used per-component

    // Routing pattern
    if (arch.routingPattern === 'multi_page') {
        outputs.push(`// Routing: React Router — multi-page (multi_page)
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Suspense, lazy } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/settings', element: <Settings /> },
]);

export function Router() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}`);
    } else if (arch.routingPattern === 'protected') {
        outputs.push(`// Routing: React Router with auth guard (protected)
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = false; // wire to your auth state
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/dashboard', element: <RequireAuth><Dashboard /></RequireAuth> },
]);

export function Router() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}`);
    } else if (arch.routingPattern === 'platform') {
        outputs.push(`// Routing: Shell + lazy remote modules (platform)
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Remote modules loaded lazily — replace with actual Module Federation imports
const Shell = lazy(() => import('./shell/Shell'));
const RemoteApp = lazy(() => import('./remotes/RemoteApp'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Shell />,
    children: [
      { path: 'app/*', element: <RemoteApp /> },
    ],
  },
]);

export function Router() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}`);
    } else if (arch.routingPattern === 'federated') {
        outputs.push(`// Routing: Module Federation cross-app routing (federated)
// Each federated app registers its own routes; the shell composes them.
// Wire remoteEntry.js URLs in webpack.config.js ModuleFederationPlugin.
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Loaded at runtime via Module Federation
const FederatedHome = lazy(() => import('host/Home'));
const FederatedDashboard = lazy(() => import('host/Dashboard'));

const router = createBrowserRouter([
  { path: '/', element: <FederatedHome /> },
  { path: '/dashboard', element: <FederatedDashboard /> },
]);

export function Router() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}`);
    }
    // routingPattern === 'single_page' → no routing setup; single root component

    // Token inheritance hint (no runnable code — guides implementation)
    outputs.push(`// Token inheritance: ${arch.tokenInheritance}
// ${tokenInheritanceHint(arch.tokenInheritance)}`);

    return outputs.join('\n\n');
}

function tokenInheritanceHint(inheritance: ArchitectureSpec['tokenInheritance']): string {
    switch (inheritance) {
        case 'flat':         return 'All tokens in one :root block — no layering.';
        case 'semantic':     return 'Primitive → semantic alias layers (color-primary → brand-action).';
        case 'component':    return 'Semantic layer + per-component token namespaces (button-bg, card-border).';
        case 'governed':     return 'Component layer + governance rules: tokens only changed via design system PRs.';
        case 'cross_system': return 'Federated token graph — tokens published as packages, consumed across apps.';
    }
}

/**
 * Generates design tokens as a CSS :root block (tokens.css)
 */
export function generateDesignTokensCSS(tier: CivilizationTier, genome: DesignGenome): string {
    const primary = genome.chromosomes.ch5_color_primary;
    const ch6 = genome.chromosomes.ch6_color_temp;
    const radius = genome.chromosomes.ch7_edge.radius;
    const motion = genome.chromosomes.ch8_motion;
    const surfaceStack = ch6.surfaceStack;

    return `:root {
  /* Colors — from genome chromosomes */
  --color-primary: hsl(${primary.hue}, ${Math.round(primary.saturation * 100)}%, ${Math.round(primary.lightness * 100)}%);
  --primary-hue: ${primary.hue};
  --primary-sat: ${Math.round(primary.saturation * 100)}%;
  --primary-light: ${Math.round(primary.lightness * 100)}%;
  --color-primary-dim: hsla(${primary.hue}, ${Math.round(primary.saturation * 100)}%, ${Math.round(primary.lightness * 100)}%, 0.12);
  --color-primary-glow: hsla(${primary.hue}, ${Math.round(primary.saturation * 100)}%, ${Math.round(primary.lightness * 100)}%, 0.35);
  --color-background: ${surfaceStack[0]};
  --color-surface: ${surfaceStack[1]};
  --color-surface-elevated: ${surfaceStack[2]};
  --color-surface-overlay: ${surfaceStack[3]};

  /* Spacing — base unit: ${genome.chromosomes.ch2_rhythm.baseSpacing}px */
  --spacing-unit: ${genome.chromosomes.ch2_rhythm.baseSpacing}px;
  --space-xs: ${Math.round(genome.chromosomes.ch2_rhythm.baseSpacing * 0.25)}px;
  --space-sm: ${Math.round(genome.chromosomes.ch2_rhythm.baseSpacing * 0.5)}px;
  --space-md: ${genome.chromosomes.ch2_rhythm.baseSpacing}px;
  --space-lg: ${genome.chromosomes.ch2_rhythm.baseSpacing * 2}px;
  --space-xl: ${genome.chromosomes.ch2_rhythm.baseSpacing * 4}px;
  --space-2xl: ${genome.chromosomes.ch2_rhythm.baseSpacing * 8}px;

  /* Typography */
  --font-display: ${genome.chromosomes.ch3_type_display.family};
  --font-body: ${genome.chromosomes.ch4_type_body.family};

  /* Shape */
  --radius-genome: ${radius}px;
  --radius-sm: ${Math.max(0, Math.round(radius * 0.5))}px;
  --radius-lg: ${radius * 2}px;

  /* Motion */
  --duration-genome: ${Math.round(motion.durationScale * 1000)}ms;
  --easing-genome: ${motion.physics === 'spring' ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : 'ease-out'};

  /* Accessibility */
  --focus-ring: 0 0 0 3px hsla(${primary.hue}, ${Math.round(primary.saturation * 100)}%, ${Math.round(primary.lightness * 100)}%, 0.5);
}`;
}

/**
 * Generates Tailwind config extension (tailwind.config.js)
 */
export function generateTailwindConfig(tier: CivilizationTier, genome: DesignGenome): string {
    const primary = genome.chromosomes.ch5_color_primary;
    const motion = genome.chromosomes.ch8_motion;
    const radius = genome.chromosomes.ch7_edge.radius;

    return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          dim: 'var(--color-primary-dim)',
          glow: 'var(--color-primary-glow)',
        },
        background: 'var(--color-background)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          elevated: 'var(--color-surface-elevated)',
          overlay: 'var(--color-surface-overlay)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        genome: '${radius}px',
      },
      transitionTimingFunction: {
        genome: '${motion.physics === 'spring' ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : 'ease-out'}',
      },
      transitionDuration: {
        genome: '${Math.round(motion.durationScale * 1000)}ms',
      },
    },
  },
};`;
}

/**
 * @deprecated Use generateDesignTokensCSS + generateTailwindConfig separately.
 * Kept for call-site compatibility — returns CSS only.
 */
export function generateDesignTokens(tier: CivilizationTier, genome: DesignGenome): string {
    return generateDesignTokensCSS(tier, genome);
}

/**
 * Generates the full component library index file
 */
export function generateComponentLibraryIndex(components: ComponentSpec[], tier: CivilizationTier['tier']): string {
    const exports = components.map(c => `export { ${c.name} } from './${c.name}';`).join('\n');
    
    const compoundExports = components
        .filter(c => c.compound)
        .flatMap(c => c.compound || [])
        .map(name => `export { ${name.split('.')[0]} } from './${name.split('.')[0]}';`)
        .join('\n');
    
    return `// Component Library: ${tier} tier
// Generated by Permutations MCP

${exports}
${compoundExports}

// Types (co-locate each component's Props interface in its own file)
// ${components.map(c => `${c.name}Props`).join(', ')}
`;
}

/**
 * Generates interaction/gesture handlers
 */
export function generateInteractionHandlers(interactions: CivilizationTier['interactions']): string {
    const handlers: string[] = [];
    
    if (interactions.gestures.includes('swipe') || interactions.gestures === 'predictive') {
        handlers.push(`// Swipe gesture handler
export function useSwipe(onSwipeLeft?: () => void, onSwipeRight?: () => void) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const minSwipeDistance = 50;
  
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe && onSwipeLeft) onSwipeLeft();
    if (isRightSwipe && onSwipeRight) onSwipeRight();
  };
  
  return { onTouchStart, onTouchMove, onTouchEnd };
}`);
    }
    
    if (interactions.keyboard === 'full' || interactions.keyboard === 'command-palette') {
        handlers.push(`// Keyboard navigation
export function useKeyboardNavigation(
  items: string[],
  onSelect: (item: string) => void
) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % items.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + items.length) % items.length);
        break;
      case 'Enter':
        onSelect(items[focusedIndex]);
        break;
    }
  };
  
  return { focusedIndex, handleKeyDown };
}`);
    }
    
    if (interactions.keyboard === 'command-palette') {
        handlers.push(`// Command palette
export function useCommandPalette(commands: Command[]) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );
  
  return { isOpen, setIsOpen, search, setSearch, filteredCommands };
}`);
    }
    
    if (handlers.length === 0) return '';
    return `import { useState, useEffect } from 'react';\n\n` + handlers.join('\n\n');
}

/**
 * Generates the complete civilization tier output.
 * tokensCss  → write as tokens.css (CSS :root block only)
 * tailwindConfig → write as tailwind.config.js (module.exports block only)
 * components → valid TypeScript file with multiple named exports, no --- separators
 *
 * @param organisms - When provided (from EcosystemGenerator), uses their topology-derived
 *   specs instead of the tier's generic component list. Civilization should always emerge
 *   from an ecosystem — pass organisms whenever available.
 */
export function generateCivilizationOutput(
    tier: CivilizationTier,
    genome: DesignGenome,
    cssOutput?: string,
    topologyOutput?: string,
    organisms?: Array<{ spec: ComponentSpec }>  // ecosystem organisms, preferred over tier.components.list
): {
    components: string;
    animations: string;
    architecture: string;
    /** @deprecated Use tokensCss instead */
    tokens: string;
    tokensCss: string;
    tailwindConfig: string;
    interactions: string;
    index: string;
    css?: string;
    topology?: string;
} {
    const tokensCss = generateDesignTokensCSS(tier, genome);
    const tailwindConfig = generateTailwindConfig(tier, genome);

    // Use ecosystem organisms (topology-derived, relationship-aware) when provided.
    // Fall back to tier's generic component list only when no ecosystem was run.
    const componentSpecs = organisms
        ? organisms.map(o => o.spec)
        : tier.components.list;

    return {
        // Valid TS file: named exports separated by blank lines, no --- markers
        components: componentSpecs
            .map(c => generateComponentCode(c, genome))
            .join('\n\n'),
        animations: generateAnimationConfig(tier.animations, genome),
        architecture: generateArchitectureSetup(tier.architecture, genome),
        tokens: tokensCss, // kept for backwards compat — CSS only
        tokensCss,
        tailwindConfig,
        interactions: generateInteractionHandlers(tier.interactions),
        index: generateComponentLibraryIndex(tier.components.list, tier.tier),
        css: cssOutput,  // UNIFIED: Pass through from CSSGenerator
        topology: topologyOutput  // UNIFIED: Pass through from HTMLGenerator
    };
}
