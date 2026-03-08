import { useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';

export function Installation() {
    const [copied, setCopied] = useState(false);
    const command = "node /path/to/permutations/dist/server.js";

    const handleCopy = () => {
        navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section id="docs" className="w-full py-24 px-4 md:px-12 bg-surface">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-bold uppercase mb-8">Bring Your Own Key.</h2>
                <p className="text-xl opacity-80 mb-12 font-body max-w-2xl mx-auto">
                    The Permutations MCP is a local endpoint. It runs strictly within your IDE. To prevent algorithmic collapse, developers must provide their own API keys for the Semantic Extraction layer.
                </p>

                <div className="inline-block border-2 border-black bg-white shadow-[8px_8px_0px_#0a5c12] text-left w-full max-w-2xl overflow-hidden">
                    <div className="bg-gray-100 border-b-2 border-black p-3 flex justify-between items-center">
                        <code className="font-mono text-xs text-black uppercase tracking-widest font-bold flex items-center gap-2">
                            <Terminal size={14} /> Cursor / Windsurf Configuration
                        </code>
                    </div>
                    <div className="p-6 relative">
                        <code className="font-mono text-lg font-bold block mb-6">{command}</code>

                        <button
                            onClick={handleCopy}
                            className="absolute top-6 right-6 p-2 bg-gray-100 border border-gray-300 hover:bg-black hover:text-white transition-colors flex items-center gap-2 text-xs font-mono uppercase"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
                        </button>

                        <div className="border-t border-gray-200 pt-6 flex flex-wrap gap-4 items-center">
                            <span className="font-mono text-xs bg-gray-100 border border-gray-300 px-3 py-1.5 font-bold">ENV: MOONSHOT_API_KEY</span>
                            <span className="font-mono text-xs bg-primary/10 border border-primary text-primary px-3 py-1.5 animate-pulse flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary" /> Awaiting Extraction
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
