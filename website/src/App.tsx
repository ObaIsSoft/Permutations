import React from 'react';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-background">
      {/* EXPLICIT DISCLAIMER */}
      <div className="w-full bg-black text-white text-center py-2 text-xs font-mono uppercase tracking-widest border-b-2 border-primary">
        Notice: This UI was programmatically built via Permutations MCP. No human aesthetic bias was explicitly used.
      </div>

      {/* 1. HERO SECTION (Full Viewport) */}
      <section className="w-full min-h-[90vh] flex flex-col justify-center px-4 md:px-12 border-b-2 border-black bg-surface relative overflow-hidden">
        {/* Abstract geometric background elements obeying 0px radius */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-100 -z-10 border-l border-gray-200"></div>
        <div className="absolute top-20 right-20 w-64 h-64 border-4 border-primary opacity-20 hidden md:block"></div>

        <div className="max-w-7xl w-full mx-auto relative z-10">
          <div className="inline-block bg-primary text-white font-body text-xs tracking-widest uppercase py-1 px-3 mb-6">
            Procedural Design Engine
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.9] uppercase mb-8 max-w-5xl tracking-tighter">
            KILL<br />TEMPLATE<br />SLOP.
          </h1>
          <p className="text-xl md:text-2xl font-body max-w-2xl mb-12 opacity-80 border-l-4 border-primary pl-6">
            A Model Context Protocol (MCP) server that intercepts fuzzy human intent and mathematically forces AI coders to build unique, avant-garde design systems.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 font-display">
            <button className="dna-btn">
              Install Permutations MCP
            </button>
            <button className="px-6 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors duration-genome font-bold uppercase tracking-wider">
              Read Manifesto
            </button>
          </div>
        </div>
      </section>

      {/* 2. BROKEN GRID CONTENT (Data Display & Architecture) */}
      <section className="w-full py-24 px-4 md:px-12 bg-white border-b-2 border-black">
        <div className="max-w-7xl w-full mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b-2 border-black pb-4">
            <h2 className="text-5xl font-bold uppercase tracking-tight">The Parametric DNA</h2>
            <div className="font-mono text-sm opacity-60">Computed via cryptographic epistasis</div>
          </div>

          {/* True Broken Grid Layout per Topological DNA */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[600px]">

            {/* Block A: Hash */}
            <div className="md:col-span-4 dna-card bg-gray-100 flex flex-col justify-between p-8 border-2 border-black">
              <div>
                <h3 className="font-bold text-2xl uppercase mb-4 border-b border-gray-300 pb-2">01 / Hash Matrix</h3>
                <p className="font-body opacity-80 leading-relaxed">
                  Deterministic cryptography ensures absolute consistency. The same project seed yields the same DNA, forever. State is maintained mathematically, not in a database.
                </p>
              </div>
              <div className="mt-8">
                <div className="text-xs uppercase font-bold mb-1 opacity-50">SHA-256 Output Seed</div>
                <div className="font-mono text-sm text-primary break-all bg-white p-4 border border-gray-300 shadow-[4px_4px_0px_#000]">
                  3cd02634a22de5029b5359ce0da8003e585a3b45df68559022acf378cb77df77
                </div>
              </div>
            </div>

            {/* Block B: Semantic Vectors (The dominant broken column) */}
            <div className="md:col-span-5 dna-card bg-black text-white p-8 md:-translate-y-12 relative shadow-[12px_12px_0px_#0a5c12] border-2 border-black">
              <div className="absolute top-6 right-6 text-xs font-mono text-primary animate-pulse flex items-center gap-2">
                <div className="w-2 h-2 bg-primary"></div>
                LIVE EXTRACTION
              </div>
              <h3 className="text-4xl font-display font-bold uppercase mb-10 text-primary">Semantic Vectors</h3>
              <ul className="font-body text-xl space-y-6 font-mono">
                <li className="flex justify-between border-b border-gray-800 pb-2 transition-all hover:pl-4">
                  <span>InformationDensity</span> <span className="text-primary font-bold">0.70</span>
                </li>
                <li className="flex justify-between border-b border-gray-800 pb-2 transition-all hover:pl-4">
                  <span>TemporalUrgency</span> <span className="text-primary font-bold">0.20</span>
                </li>
                <li className="flex justify-between border-b border-gray-800 pb-2 transition-all hover:pl-4">
                  <span>EmotionalTemp</span> <span className="text-primary font-bold">0.10</span>
                </li>
                <li className="flex justify-between pb-2 transition-all hover:pl-4">
                  <span>Playfulness</span> <span className="text-primary font-bold">0.05</span>
                </li>
              </ul>

              <div className="mt-12 p-6 bg-gray-900 border-l-4 border-primary">
                <p className="text-sm font-mono leading-relaxed">
                  <strong className="text-white block mb-2 uppercase tracking-widest text-xs">Epistasis Rule Applied:</strong>
                  <span className="text-gray-400">Low Emotional Temp (<span className="text-white">0.1</span>) + Zero Playfulness (<span className="text-white">0.05</span>) mathematically forbids border radii > 0px and enforces step-based CSS transitions. Softness is mathematically impossible in this biome.</span>
                </p>
              </div>
            </div>

            {/* Block C: Image/Visual (Abstract Data Representation) */}
            <div className="md:col-span-3 dna-card bg-primary text-white flex flex-col justify-end p-8 md:translate-y-16 border-2 border-black">
              <div className="w-full h-32 border-b-2 border-white/20 mb-6 relative">
                {/* Decorative math/waveform generated via CSS */}
                <div className="absolute bottom-0 w-8 h-full bg-white/20 left-0"></div>
                <div className="absolute bottom-0 w-8 h-[70%] bg-white/40 left-12"></div>
                <div className="absolute bottom-0 w-8 h-[90%] bg-white/60 left-24"></div>
                <div className="absolute bottom-0 w-8 h-[40%] bg-white left-36"></div>
              </div>
              <h3 className="font-display font-bold text-3xl uppercase leading-[1.1]">
                12 Chromosomes. Infinite Biomes.
              </h3>
            </div>

            {/* Block D: Code Output */}
            <div className="md:col-span-12 mt-12 md:mt-0 p-8 bg-gray-50 border-2 border-black">
              <h3 className="font-bold text-2xl uppercase mb-6">Generated output: Architecture Config</h3>
              <pre className="bg-black text-green-400 p-6 font-mono text-sm overflow-x-auto shadow-[4px_4px_0px_#0a5c12]">
                <code>{`{
  "gridType": "broken",
  "maxNesting": 1,
  "sections": [
    {
      "type": "hero",
      "fullViewport": true
    },
    {
      "type": "content_blocks",
      "layout": "broken"
    },
    {
      "type": "footer",
      "minimal": false
    }
  ],
  "forbidden": [
    "bounce_animations",
    "comic_sans",
    "heavy_blur_effects"
  ],
  "required": [
    "high_contrast_text",
    "tabular_numerals"
  ]
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MANIFESTO / USAGE SECTION */}
      <section className="w-full py-24 px-4 md:px-12 bg-surface">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold uppercase mb-8">Bring Your Own Key.</h2>
          <p className="text-xl opacity-80 mb-12 font-body">
            The Permutations MCP is a local endpoint. It runs strictly within your IDE. To prevent algorithmic collapse, developers must provide their own API keys for the Semantic Extraction layer.
          </p>
          <div className="inline-block border-2 border-black p-6 bg-white shadow-[8px_8px_0px_#0a5c12] text-left">
            <code className="font-mono text-sm text-black block mb-2 opacity-50"># Setup in Cursor / Windsurf</code>
            <code className="font-mono text-lg font-bold">node /path/to/permutations/dist/server.js</code>
            <div className="mt-4 border-t border-gray-200 pt-4 flex gap-4">
              <span className="font-mono text-xs bg-gray-100 px-2 py-1">ENV: MOONSHOT_API_KEY</span>
              <span className="font-mono text-xs bg-gray-100 px-2 py-1 text-primary animate-pulse">Awaiting Trait Extraction</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="w-full bg-black text-white py-12 px-4 md:px-12 font-mono text-xs md:text-sm flex flex-col md:flex-row justify-between items-center uppercase gap-4">
        <div className="flex items-center gap-4">
          <div className="w-4 h-4 bg-primary rounded-genome border border-white"></div>
          Permutations MCP Server (v1.0.0)
        </div>
        <div className="opacity-50">No Templates. No Slop. Only Math.</div>
        <div className="text-primary flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
          System Online
        </div>
      </footer>
    </div>
  );
}

export default App;
