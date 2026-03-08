export function Footer() {
    return (
        <footer className="w-full bg-black text-white py-12 px-4 md:px-12 font-mono text-xs md:text-sm flex flex-col md:flex-row justify-between items-center uppercase gap-6 border-t-[8px] border-primary">
            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                <div className="w-6 h-6 bg-primary border-2 border-white flex items-center justify-center p-0.5">
                    {/* Permutations Organic Biomarker */}
                    <svg viewBox="0 0 100 100" className="w-full h-full text-white biomarker-organic" xmlns="http://www.w3.org/2000/svg">
                        <g>
                            <path d="M10,90 Q50,22.627450980392155 90,10 Q93.68627450980392,50 10,90" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                        </g>
                    </svg>
                </div>
                <div>
                    <span className="block font-bold">Permutations MCP Server</span>
                    <span className="opacity-50 text-[10px]">Version 3.0.0 | Glass Organism</span>
                </div>
            </div>

            <div className="opacity-50 tracking-widest text-center">
                No Templates. No Slop. Only Math.
            </div>

            <div className="text-primary flex items-center gap-3 font-bold bg-primary/10 border border-primary/30 px-4 py-2 rounded-genome">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full bg-primary opacity-75 rounded-full"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                System Online
            </div>
        </footer>
    );
}
