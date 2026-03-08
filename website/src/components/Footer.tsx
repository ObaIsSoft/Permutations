import { Dna, Github } from 'lucide-react';

export function Footer() {
    return (
        <footer className="w-full bg-black text-white py-12 px-4 md:px-12 font-mono text-xs md:text-sm border-t-[8px] border-primary">
            <div className="max-w-7xl mx-auto">
                {/* DNA Attribution */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-gray-800 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary border-2 border-white flex items-center justify-center p-1">
                            <svg viewBox="0 0 100 100" className="w-full h-full text-white" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10,90 Q50,22.627450980392155 90,10 Q93.68627450980392,50 10,90" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider">
                                <Dna size={14} />
                                Designed with Permutations DNA
                            </div>
                            <p className="text-gray-500 text-[10px] mt-1">
                                Topology: radial • Grid: masonry • Motion: spring • Material: glass
                            </p>
                        </div>
                    </div>
                    <a 
                        href="https://github.com/ObaIsSoft/Permutations" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 border border-gray-700 hover:border-primary hover:text-primary transition-colors"
                    >
                        <Github size={16} />
                        View on GitHub
                    </a>
                </div>

                {/* Bottom row */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                    <div>
                        <span className="block font-bold">Permutations MCP Server</span>
                        <span className="opacity-50 text-[10px]">Version 1.0.0 | Glass Organism</span>
                    </div>

                    <div className="opacity-50 tracking-widest">
                        No Templates. No Slop. Only Math.
                    </div>

                    <div className="text-primary flex items-center gap-3 font-bold bg-primary/10 border border-primary/30 px-4 py-2 rounded-genome">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full bg-primary opacity-75 rounded-full"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                        </span>
                        System Online
                    </div>
                </div>
            </div>
        </footer>
    );
}
