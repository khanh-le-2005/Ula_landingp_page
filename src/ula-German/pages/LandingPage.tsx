import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Painpoints from '../components/Painpoints';
import Solution from '../components/Solution';
import Methodology from '../components/Methodology';
import Experience from '../components/Experience';
import Roadmap from '../components/Roadmap';
import Trust from '../components/Trust';
import LuckyWheel from '../components/LuckyWheel';
import LeadForm from '../components/LeadForm';
import Footer from '../components/Footer';
import { resolveTrackingData } from '../utils/tracking';

export default function LandingPage() {
  const [wonPrize, setWonPrize] = useState<{ option: string; code: string } | null>(null);

  useEffect(() => {
    // Capture tracking data (UTMs, Referral ID) on load
    resolveTrackingData();
  }, []);

  return (
    <div className="font-sans bg-[url('https://i.postimg.cc/GtXV371d/cover4.png')] bg-fixed bg-cover">
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
