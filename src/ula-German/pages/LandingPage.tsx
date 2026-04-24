import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Painpoints from '../components/Painpoints';
import Solution from '../components/Solution';
import Methodology from '../components/Methodology';
import Experience from '../components/Experience';
import Roadmap from '../components/Roadmap';
import Trust from '../components/SuccessStory';
import LuckyWheel from '../components/LuckyWheel';
import LeadForm from '../components/LeadForm';
import Footer from '../components/Footer';
import { useTracking } from '../hooks/useTracking';
import { useLocation, useParams } from 'react-router-dom';
import { LandingSiteProvider } from '../../ula-chinese/context/LandingSiteContext';

export default function LandingPage() {
  // Kích hoạt Tracking tự động
  useTracking('tieng-duc');

  const [wonPrize, setWonPrize] = useState<{ option: string; code: string } | null>(null);
  const location = useLocation();
  const { tag } = useParams();

  const searchParams = new URLSearchParams(location.search);
  // Ưu tiên: Path (:tag) -> ?campaign -> ?ref (để link KOC cũng hiện nội dung tag)
  const campaignTag = tag || searchParams.get('campaign') || searchParams.get('ref') || undefined;

  return (
    <LandingSiteProvider siteKey="tieng-duc" campaignTag={campaignTag}>
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
            options={{ variant: 'german' }}
          />
        </main>
        <Footer />
      </div>
    </LandingSiteProvider>
  );
}
