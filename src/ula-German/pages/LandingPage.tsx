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
import { fetchLandingPage } from './admin/adminApi';

export default function LandingPage() {
  // Kích hoạt Tracking tự động
  useTracking('tieng-duc');

  const [wonPrize, setWonPrize] = useState<{ option: string; code: string } | null>(null);
  const location = useLocation();
  const { tag } = useParams();

  const searchParams = new URLSearchParams(location.search);
  // Ưu tiên: Path (:tag) -> ?campaign -> ?ref (để link KOC cũng hiện nội dung tag)
  const campaignTag = tag || searchParams.get('campaign') || searchParams.get('ref') || undefined;

  // 1. Tạo state để cản trang web render khi chưa tải xong API
  const [isPageReady, setIsPageReady] = useState(false);

  useEffect(() => {
    // 2. Hàm gọi API "mồi" để kéo dữ liệu Campaign về trước
    const prepareData = async () => {
      try {
        await fetchLandingPage('tieng-duc', undefined, campaignTag);
      } catch (e) {
        console.error("Lỗi tải trang Đức:", e);
      } finally {
        setIsPageReady(true);
      }
    };
    prepareData();
  }, [campaignTag]);

  // 3. MÀN HÌNH CHỜ HIỂN THỊ TRONG KHI TẢI
  if (!isPageReady) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#f8fafc] z-[9999]">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">
          Vui lòng đợi trong giây lát...
        </p>
      </div>
    );
  }

  return (
    <LandingSiteProvider siteKey="tieng-duc" campaignTag={campaignTag}>
      <div className="font-sans bg-fixed-optimized min-h-screen animate-in fade-in duration-700">
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
