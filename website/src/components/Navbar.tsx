
export function Navbar() {
    return (
        <nav className="w-full border-b-2 border-black bg-surface px-4 md:px-12 py-4 flex flex-col md:flex-row justify-between items-center sticky top-0 z-50">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-primary border-2 border-black flex items-center justify-center p-1">
                    {/* V2 Procedural Biomarker DNA (P(n,r) Monolithic) */}
                    <svg viewBox="0 0 100 100" className="w-full h-full text-white" xmlns="http://www.w3.org/2000/svg">
                        <g>
                            <path d="M20,90 L20,10 L80,10 L80,50 L20,50" fill="none" stroke="currentColor" strokeWidth="8" strokeLinejoin="miter" strokeLinecap="square" />
                        </g>
                    </svg>
                </div>
                <span className="font-display font-bold text-xl uppercase tracking-tighter">PERMUTATIONS.</span>
            </div>

            <div className="flex gap-8 font-mono text-sm uppercase items-center hidden md:flex">
                <a href="#manifesto" className="hover:text-primary transition-colors duration-genome">Story</a>
                <a href="#engine" className="hover:text-primary transition-colors duration-genome">The Engine</a>
                <a href="#docs" className="hover:text-primary transition-colors duration-genome">Docs</a>
                <a href="#docs" className="dna-btn py-2 px-4 text-xs inline-block">
                    Initialize
                </a>
            </div>
        </nav>
    );
}
