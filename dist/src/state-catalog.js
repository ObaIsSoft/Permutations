/**
 * State Management Library Catalog
 *
 * Chromosome-driven selection — mirrors animation-catalog and icon-catalog.
 *
 * Philosophy: forbiddenFor defines what is psychologically WRONG for a state library.
 * The genome hash selects freely from all remaining eligible libraries.
 * Same approach as sector forbidden hue ranges — no whitelist, only exclusions.
 *
 * A library with empty forbiddenFor is valid for EVERY genome.
 * Selection is deterministic given genome chromosomes — same genome always
 * produces the same recommendation.
 */
// ── Catalog ───────────────────────────────────────────────────────────────────
export const STATE_LIBRARY_CATALOG = [
    // ── Local / no-library ──────────────────────────────────────────────────
    {
        name: "React Built-ins",
        package: "react",
        version: "18+",
        bundleSize: "0kb",
        license: "MIT",
        paradigm: "local",
        description: "useState + useReducer — zero extra dependencies, perfect for co-located state",
        devxScore: 0.85,
        installCmd: "# already in React",
        importExample: `import { useState, useReducer, useContext } from 'react';`,
        minimalExample: `const [count, setCount] = useState(0);`,
        reactFirst: true,
        typescript: "first-class",
        // Global stores, distributed sync, and federation require external libraries —
        // React built-ins are wrong for anything beyond component-scoped state
        forbiddenFor: {
            topologies: ["reactive_store", "distributed", "federated"],
            complexityAbove: 0.35,
        },
    },
    // ── Context ─────────────────────────────────────────────────────────────
    {
        name: "React Context",
        package: "react",
        version: "18+",
        bundleSize: "0kb",
        license: "MIT",
        paradigm: "context",
        description: "React Context + useReducer — lifted state across a single surface, no dep",
        devxScore: 0.75,
        installCmd: "# already in React",
        importExample: `import { createContext, useContext, useReducer } from 'react';`,
        minimalExample: `const Ctx = createContext(null);\nconst [state, dispatch] = useReducer(reducer, init);`,
        reactFirst: true,
        typescript: "first-class",
        // Context re-renders entire subtrees — wrong for reactive stores, distributed sync, federation
        // Wrong for high complexity (>0.55) where granular subscriptions matter for perf
        forbiddenFor: {
            topologies: ["reactive_store", "distributed", "federated"],
            complexityAbove: 0.55,
        },
    },
    // ── Flux / stores ────────────────────────────────────────────────────────
    {
        name: "Zustand",
        package: "zustand",
        version: "^4.5",
        bundleSize: "~1.1kb",
        license: "MIT",
        paradigm: "flux",
        description: "Minimal bear-necessities store — flat API, no boilerplate, works outside React",
        devxScore: 0.95,
        installCmd: "npm i zustand",
        importExample: `import { create } from 'zustand';`,
        minimalExample: `const useStore = create((set) => ({\n  count: 0,\n  inc: () => set((s) => ({ count: s.count + 1 }))\n}));`,
        reactFirst: false,
        typescript: "first-class",
        // Zustand is wrong for purely local (no external dep needed) and federated (needs persist middleware)
        // Wrong for trivially simple complexity (< 0.25) where useState is sufficient
        forbiddenFor: {
            topologies: ["local", "shared_context", "federated"],
            complexityBelow: 0.25,
        },
    },
    {
        name: "Redux Toolkit",
        package: "@reduxjs/toolkit",
        version: "^2.2",
        bundleSize: "~18kb",
        license: "MIT",
        paradigm: "flux",
        description: "Official Redux — opinionated slice pattern, RTK Query, DevTools — for complex apps",
        devxScore: 0.78,
        installCmd: "npm i @reduxjs/toolkit react-redux",
        importExample: `import { createSlice, configureStore } from '@reduxjs/toolkit';`,
        minimalExample: `const slice = createSlice({ name: 'counter', initialState: 0,\n  reducers: { inc: (s) => s + 1 } });`,
        reactFirst: true,
        typescript: "first-class",
        // 18kb overhead — wrong for local/context topology and low-complexity apps
        // Federated micro-frontends need dedicated module federation tooling, not Redux
        forbiddenFor: {
            topologies: ["local", "shared_context", "federated"],
            complexityBelow: 0.55,
        },
    },
    // ── Reactive / signals ───────────────────────────────────────────────────
    {
        name: "Jotai",
        package: "jotai",
        version: "^2.8",
        bundleSize: "~3.2kb",
        license: "MIT",
        paradigm: "reactive",
        description: "Atomic state model — bottom-up composability, minimal re-renders, derived atoms",
        devxScore: 0.92,
        installCmd: "npm i jotai",
        importExample: `import { atom, useAtom } from 'jotai';`,
        minimalExample: `const countAtom = atom(0);\nconst [count, setCount] = useAtom(countAtom);`,
        reactFirst: true,
        typescript: "first-class",
        // Atom model is wrong for purely local state (overkill) and cross-app federation
        forbiddenFor: {
            topologies: ["local", "distributed", "federated"],
            complexityBelow: 0.25,
        },
    },
    {
        name: "Valtio",
        package: "valtio",
        version: "^1.13",
        bundleSize: "~3.4kb",
        license: "MIT",
        paradigm: "reactive",
        description: "Proxy-based mutable state — write naturally, reads are automatically reactive",
        devxScore: 0.88,
        installCmd: "npm i valtio",
        importExample: `import { proxy, useSnapshot } from 'valtio';`,
        minimalExample: `const state = proxy({ count: 0 });\nconst snap = useSnapshot(state);`,
        reactFirst: true,
        typescript: "supported",
        // Proxy mutation model — wrong for local, distributed sync, and federation
        forbiddenFor: {
            topologies: ["local", "shared_context", "distributed", "federated"],
            complexityBelow: 0.25,
        },
    },
    {
        name: "MobX",
        package: "mobx",
        version: "^6.12",
        bundleSize: "~16kb",
        license: "MIT",
        paradigm: "reactive",
        description: "Observable object graph — automatic derivations, mature ecosystem, OOP-friendly",
        devxScore: 0.80,
        installCmd: "npm i mobx mobx-react-lite",
        importExample: `import { makeAutoObservable } from 'mobx';\nimport { observer } from 'mobx-react-lite';`,
        minimalExample: `class Store { count = 0; constructor() { makeAutoObservable(this); } inc() { this.count++; } }`,
        reactFirst: false,
        typescript: "first-class",
        // 16kb + class-based OOP — wrong for local/context topology and low complexity
        forbiddenFor: {
            topologies: ["local", "shared_context", "federated"],
            complexityBelow: 0.55,
        },
    },
    // ── Server state ─────────────────────────────────────────────────────────
    {
        name: "TanStack Query",
        package: "@tanstack/react-query",
        version: "^5.50",
        bundleSize: "~13kb",
        license: "MIT",
        paradigm: "server",
        description: "Async state powerhouse — caching, invalidation, optimistic updates, SSR-ready",
        devxScore: 0.94,
        installCmd: "npm i @tanstack/react-query",
        importExample: `import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';`,
        minimalExample: `const { data } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos });`,
        reactFirst: true,
        typescript: "first-class",
        // Server state library — wrong for purely local UI state and federated cross-app state
        forbiddenFor: {
            topologies: ["local", "shared_context", "federated"],
        },
    },
    {
        name: "SWR",
        package: "swr",
        version: "^2.2",
        bundleSize: "~4.5kb",
        license: "MIT",
        paradigm: "server",
        description: "Stale-while-revalidate — minimal API, built for Next.js patterns, auto-revalidation",
        devxScore: 0.90,
        installCmd: "npm i swr",
        importExample: `import useSWR from 'swr';`,
        minimalExample: `const { data, error } = useSWR('/api/user', fetcher);`,
        reactFirst: true,
        typescript: "first-class",
        // Minimal SWR is wrong for complex distributed multi-store and federation patterns
        forbiddenFor: {
            topologies: ["local", "shared_context", "distributed", "federated"],
        },
    },
    // ── State machines ────────────────────────────────────────────────────────
    {
        name: "XState",
        package: "xstate",
        version: "^5.14",
        bundleSize: "~22kb",
        license: "MIT",
        paradigm: "machine",
        description: "Finite state machines + statecharts — predictable flows, visual debugging, actor model",
        devxScore: 0.82,
        installCmd: "npm i xstate @xstate/react",
        importExample: `import { createMachine } from 'xstate';\nimport { useMachine } from '@xstate/react';`,
        minimalExample: `const machine = createMachine({ id: 'light', initial: 'green',\n  states: { green: { on: { NEXT: 'yellow' } }, yellow: { on: { NEXT: 'red' } }, red: { on: { NEXT: 'green' } } } });`,
        reactFirst: false,
        typescript: "first-class",
        // 22kb machine overhead — wrong for local and context topology, wrong for low complexity
        // Federated cross-app state isn't a FSM concern
        forbiddenFor: {
            topologies: ["local", "shared_context", "federated"],
            complexityBelow: 0.55,
        },
    },
    // ── Federated / cross-app ─────────────────────────────────────────────────
    {
        name: "Zustand + persist",
        package: "zustand",
        version: "^4.5",
        bundleSize: "~1.1kb",
        license: "MIT",
        paradigm: "federated",
        description: "Zustand with persist middleware — localStorage/sessionStorage synced cross-tab state",
        devxScore: 0.88,
        installCmd: "npm i zustand",
        importExample: `import { create } from 'zustand';\nimport { persist } from 'zustand/middleware';`,
        minimalExample: `const useStore = create(persist((set) => ({ bears: 0 }), { name: 'bear-storage' }));`,
        reactFirst: false,
        typescript: "first-class",
        // persist middleware is wrong for local/context (no need to persist), wrong for low complexity
        forbiddenFor: {
            topologies: ["local", "shared_context", "reactive_store"],
            complexityBelow: 0.55,
        },
    },
];
// ── Selection logic ──────────────────────────────────────────────────────────
/**
 * Select state library using exclude logic — same philosophy as sector forbidden hue ranges.
 *
 * 1. Filter out libraries that are wrong for this genome's topology and complexity.
 * 2. Sort eligible pool by devxScore descending (quality-weighted tiebreaker).
 * 3. Return primary (top) and alternative (second).
 *
 * Throws if the eligible pool is empty — check forbiddenFor entries for over-exclusion.
 */
export function selectStateLibrary(topology, complexityScore, dnaHashByte) {
    const eligible = STATE_LIBRARY_CATALOG.filter(lib => {
        const f = lib.forbiddenFor;
        if (f.topologies?.includes(topology))
            return false;
        if (f.complexityAbove !== undefined && complexityScore > f.complexityAbove)
            return false;
        if (f.complexityBelow !== undefined && complexityScore < f.complexityBelow)
            return false;
        return true;
    });
    // Fallback: if all excluded (shouldn't happen), use full catalog
    const pool = eligible.length > 0 ? eligible : STATE_LIBRARY_CATALOG;
    // Sort by devxScore descending — highest quality eligible library wins
    const sorted = [...pool].sort((a, b) => b.devxScore - a.devxScore);
    // Primary: deterministic pick from top half weighted by dnaHashByte
    const topHalf = sorted.slice(0, Math.max(1, Math.ceil(sorted.length / 2)));
    const primary = topHalf[dnaHashByte % topHalf.length];
    // Alternative: first in sorted pool that isn't primary
    const alternative = sorted.find(lib => lib !== primary) ?? sorted[0];
    return { primary, alternative };
}
