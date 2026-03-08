import { Github } from 'lucide-react';

export function Footer() {
    return (
        <footer className="w-full bg-black text-white border-t-[8px] border-primary">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-12 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
                    
                    {/* Left: Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-primary flex items-center justify-center p-1">
                                <svg viewBox="0 0 100 100" className="w-full h-full text-white" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10,90 Q50,22.627450980392155 90,10 Q93.68627450980392,50 10,90" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                                </svg>
                            </div>
                            <span className="font-bold uppercase tracking-wider">Permutations</span>
                        </div>
                        <p className="text-gray-500 text-xs font-mono leading-relaxed">
                            MCP Server v1.0.0<br />
                            Generates unique design DNA
                        </p>
                    </div>

                    {/* Center: DNA Attribution */}
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs mb-3">
                            Designed with Permutations DNA
                        </div>
                        <p className="text-gray-500 text-[10px] font-mono">
                            Topology: radial • Grid: masonry<br />
                            Motion: spring • Material: glass
                        </p>
                    </div>

                    {/* Right: Links */}
                    <div className="flex flex-col items-start md:items-end gap-3">
                        <a 
                            href="https://github.com/ObaIsSoft/Permutations" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs hover:text-primary transition-colors"
                        >
                            <Github size={14} />
                            View on GitHub
                        </a>
                        <div className="flex items-center gap-2 text-xs text-primary">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full bg-primary opacity-75 rounded-full"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            System Online
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 md:px-12 py-4">
                    <p className="text-center text-gray-500 text-xs tracking-widest uppercase">
                        No Templates. No Slop. Only Math.
                    </p>
                </div>
            </div>
        </footer>
    );
}
