import { ArrowRight } from 'lucide-react';
import { Procedural3D } from './Procedural3D';

export function Hero() {
    return (
        <section className="w-full min-h-[90vh] flex flex-col justify-center px-4 md:px-12 border-b-2 border-black bg-surface relative overflow-hidden">
            {/* Permutations Procedural Spatial & Atmosphere DNA - Glass Organism */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[50vw] h-[80vh] hidden lg:block z-0 opacity-90">
                <Procedural3D />
            </div>
            
            {/* Subtle gradient fade on left side of 3D */}
            <div className="absolute right-0 top-0 bottom-0 w-[60vw] bg-gradient-to-l from-transparent via-transparent to-surface/80 hidden lg:block z-0 pointer-events-none" />
            
            <div className="fx-atmosphere" />

            <div className="max-w-7xl w-full mx-auto relative z-10">
                <div 
                    className="inline-flex items-center gap-2 bg-primary text-white font-body text-xs tracking-widest uppercase py-1 px-3 mb-6 rounded-genome"
                >
                    <div className="w-2 h-2 bg-white rounded-genome animate-pulse" />
                    Permutations Engine
                </div>
                <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-bold leading-[0.85] uppercase mb-8 max-w-6xl tracking-tighter">
                    LIFE ADAPTS.<br />SLOP DOESN'T.
                </h1>
                <p className="text-xl md:text-2xl font-body max-w-3xl mb-12 opacity-80 border-l-4 border-primary pl-6">
                    A template is a dead organism. The Permutations MCP intercepts human intent and mathematically evolves unique design systems. As life forces distinct mutations in different planetary environments, we force AI coders to generate UI biomes perfectly adapted to your context.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 font-display">
                    <a href="#docs" className="dna-btn flex items-center justify-center gap-2">
                        Install Permutations MCP <ArrowRight size={18} />
                    </a>
                    <a 
                        href="#manifesto" 
                        className="px-6 py-3 border-2 border-black hover:bg-black hover:text-white transition-all duration-genome font-bold uppercase tracking-wider flex items-center justify-center rounded-genome"
                        style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                    >
                        Read Story
                    </a>
                </div>
            </div>
        </section>
    );
}
