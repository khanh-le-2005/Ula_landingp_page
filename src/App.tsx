import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Painpoints from './components/Painpoints';
import Solution from './components/Solution';
import Experience from './components/Experience';
import Methodology from './components/Methodology';
import Roadmap from './components/Roadmap';
import Trust from './components/Trust';
import LuckyWheel from './components/LuckyWheel';
import LeadForm from './components/LeadForm';
import Footer from './components/Footer';

export default function App() {
  const [wonPrize, setWonPrize] = useState<{ option: string } | null>(null);

  return (
    <div className="font-sans">
      <Header />
      <main className="overflow-hidden">
        <Hero />
        <Painpoints />
        <Solution />
        <Experience />
        <Methodology />
        <Roadmap />
        <Trust />
        <LuckyWheel onWin={setWonPrize} />
        <LeadForm wonPrize={wonPrize} />
      </main>
      <Footer />
    </div>
  );
}
