

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* 
        TOPOLOGY REQUIRED: 
        gridType: "broken", maxNesting: 1
        Sections: Hero (full viewport) -> content_blocks (broken)
      */}

      {/* 1. HERO SECTION */}
      <section className="w-full min-h-[90vh] flex flex-col justify-center px-4 md:px-12 border-b-2 border-black">
        <div className="max-w-6xl w-full mx-auto">
          <div className="inline-block bg-primary text-white font-body text-xs tracking-widest uppercase py-1 px-3 mb-6">
            Procedural Design Engine
          </div>
          <h1 className="text-6xl md:text-8xl font-bold leading-tight uppercase mb-8 max-w-4xl">
            Kill Template <br /> Slop.
          </h1>
          <p className="text-xl md:text-2xl font-body max-w-2xl mb-12 opacity-80 border-l-4 border-primary pl-6">
            A Model Context Protocol (MCP) server that intercepts fuzzy human intent and mathematically forces AI coders to build unique, avant-garde design systems.
          </p>

          <div className="flex gap-4 font-display">
            <button className="dna-btn">
              Install Permutations MCP
            </button>
            <button className="px-6 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors duration-genome">
              Read Manifesto
            </button>
          </div>
        </div>
      </section>

      {/* 2. BROKEN GRID CONTENT */}
      <section className="w-full py-24 px-4 md:px-12 bg-white">
        <div className="max-w-6xl w-full mx-auto">
          <h2 className="text-4xl font-bold mb-16 uppercase border-b-2 border-black pb-4">The Parametric DNA</h2>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_2.5fr_0.8fr] gap-6">
            {/* Column 1 */}
            <div className="dna-card bg-gray-100 flex flex-col justify-between min-h-[300px]">
              <div>
                <h3 className="font-bold text-lg uppercase mb-2">01 / Hash</h3>
                <p className="text-sm font-body opacity-70">Deterministic cryptography ensures consistency. The same project seed yields the same DNA, forever.</p>
              </div>
              <div className="font-mono text-xs text-primary break-all mt-8 p-2 bg-white border border-gray-300">
                3cd02634a22de...
              </div>
            </div>

            {/* Column 2 (The dominant broken column) */}
            <div className="dna-card bg-black text-white p-8 md:-translate-y-8 relative">
              <div className="absolute top-4 right-4 text-xs font-mono text-primary animate-pulse">
                [LIVE EXTRACTION]
              </div>
              <h3 className="text-4xl font-display font-bold uppercase mb-6 text-primary">Semantic Vectors</h3>
              <ul className="font-body text-lg space-y-4 font-mono">
                <li className="flex justify-between border-b border-gray-800 pb-2">
                  <span>InformationDensity</span> <span className="text-primary">0.70</span>
                </li>
                <li className="flex justify-between border-b border-gray-800 pb-2">
                  <span>TemporalUrgency</span> <span className="text-primary">0.20</span>
                </li>
                <li className="flex justify-between border-b border-gray-800 pb-2">
                  <span>EmotionalTemp</span> <span className="text-primary">0.10</span>
                </li>
                <li className="flex justify-between pb-2">
                  <span>Playfulness</span> <span className="text-primary">0.05</span>
                </li>
              </ul>

              <div className="mt-12 p-4 bg-gray-900 border-l-4 border-primary">
                <p className="text-sm">
                  <strong>Epistasis Rule Applied:</strong> Low Emotional Temp + Zero Playfulness mathematically forbids border radii {`>`} 0px and enforces step-based CSS transitions.
                </p>
              </div>
            </div>

            {/* Column 3 */}
            <div className="dna-card bg-primary text-white flex items-end min-h-[200px] md:translate-y-12">
              <h3 className="font-display font-bold text-2xl uppercase leading-none">
                12 Chromosomes. Infinite Biomes.
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOOTER */}
      <footer className="w-full bg-black text-white py-12 px-12 font-mono text-sm flex justify-between uppercase">
        <div>Permutations MCP Server (BYOK Architecture)</div>
        <div className="text-primary">System Online</div>
      </footer>
    </div>
  );
}

export default App;
