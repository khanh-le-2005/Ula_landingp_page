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
import { useLocation, useParams } from 'react-router-dom';
import { LandingSiteProvider } from '../context/LandingSiteContext';

export default function LandingPage() {
  const [wonPrize, setWonPrize] = useState<{ option: string; code: string } | null>(null);
  const location = useLocation();
  const { tag } = useParams();

  const searchParams = new URLSearchParams(location.search);
  // Ưu tiên: Path (:tag) -> ?campaign -> ?ref (để link KOC cũng hiện nội dung tag)
  const campaignTag = tag || searchParams.get('campaign') || searchParams.get('ref') || undefined;

  const siteKey = location.pathname.includes('/german') ? 'tieng-duc' : 'tieng-trung';

  useEffect(() => {
    // Capture tracking data (UTMs, Referral ID) on load
    resolveTrackingData();
  }, []);

  return (
    <LandingSiteProvider siteKey={siteKey} campaignTag={campaignTag}>
      <div className="font-sans bg-fixed-optimized min-h-screen">
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
          <LeadForm 
            wonPrize={wonPrize} 
            options={{ 
              variant: siteKey === 'tieng-duc' ? 'german' : 'chinese' 
            }} 
          />
        </main>
        <Footer />
      </div>
    </LandingSiteProvider>
  );
}
