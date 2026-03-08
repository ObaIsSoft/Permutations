import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WhatIsThis } from './components/WhatIsThis';
import { Architecture } from './components/Architecture';
import { DNA } from './components/DNA';
import { Installation } from './components/Installation';
import { Footer } from './components/Footer';

function App() {
    return (
        <div className="min-h-screen flex flex-col items-center bg-background scroll-smooth fx-atmosphere">
            <Navbar />

            <main className="w-full relative z-10">
                <Hero />
                <WhatIsThis />
                <Architecture />
                <DNA />
                <Installation />
            </main>

            <Footer />
        </div>
    );
}

export default App;
