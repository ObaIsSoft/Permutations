import { Dna, Laptop, Palette, Bot } from 'lucide-react';

export function WhatIsThis() {
    return (
        <section className="w-full py-24 px-4 md:px-12 bg-primary text-white border-b-2 border-black">
            <div className="max-w-7xl mx-auto">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-black text-white font-mono text-xs tracking-widest uppercase py-2 px-4 mb-8">
                    <Dna size={14} />
                    This Website Uses Permutations DNA
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl md:text-6xl font-bold uppercase leading-[0.9] mb-6">
                            Stop AI From<br />Making Generic<br />Websites
                        </h2>
                        <p className="text-xl opacity-90 font-body leading-relaxed max-w-xl">
                            Every AI-generated site looks the same: Inter font, blue-purple gradients, 
                            rounded cards. <strong>Permutations is an MCP server that forces AI to generate 
                            unique designs</strong> based on your content—not templates.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-black p-6 border-2 border-white/20">
                            <Laptop className="mb-4 text-white" size={28} />
                            <h3 className="font-bold uppercase text-sm mb-2">For Developers</h3>
                            <p className="text-xs opacity-70 font-mono leading-relaxed">
                                Add to Cursor/Claude. Get unique Tailwind configs, not template slop.
                            </p>
                        </div>
                        <div className="bg-black p-6 border-2 border-white/20">
                            <Palette className="mb-4 text-white" size={28} />
                            <h3 className="font-bold uppercase text-sm mb-2">For Designers</h3>
                            <p className="text-xs opacity-70 font-mono leading-relaxed">
                                Upload brand assets. DNA extracts colors, forbids generic patterns.
                            </p>
                        </div>
                        <div className="bg-black p-6 border-2 border-white/20">
                            <Bot className="mb-4 text-white" size={28} />
                            <h3 className="font-bold uppercase text-sm mb-2">For AI Agents</h3>
                            <p className="text-xs opacity-70 font-mono leading-relaxed">
                                MCP tool for consistent, reproducible UI generation.
                            </p>
                        </div>
                    </div>
                </div>

                {/* How it works - simple */}
                <div className="mt-16 pt-16 border-t-2 border-white/20">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold mb-2">01</div>
                            <p className="text-sm opacity-80">Describe your project</p>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">02</div>
                            <p className="text-sm opacity-80">Get unique 15-chromosome DNA</p>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">03</div>
                            <p className="text-sm opacity-80">AI codes within constraints</p>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">04</div>
                            <p className="text-sm opacity-80">No more identical UIs</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
