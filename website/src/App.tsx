import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Architecture } from './components/Architecture';
import { DNA } from './components/DNA';
import { Installation } from './components/Installation';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-background scroll-smooth">
      {/* EXPLICIT DISCLAIMER */}
      <div className="w-full bg-black text-white text-center py-2 text-xs font-mono uppercase tracking-widest border-b-2 border-primary z-50 relative">
        Notice: This UI was programmatically built via Permutations MCP. No human aesthetic bias was explicitly used.
      </div>

      <Navbar />

      <main className="w-full">
        <Hero />
        <Architecture />
        <DNA />
        <Installation />
      </main>

      <Footer />
    </div>
  );
}

export default App;
