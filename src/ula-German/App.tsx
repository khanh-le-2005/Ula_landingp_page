import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/admin/pages/Login';
import AdminLayout from './pages/admin/AdminLayout';
import RequireAdmin from './pages/admin/RequireAdmin';
import Overview from './pages/admin/pages/Overview';
import Leads from './pages/admin/pages/Leads';
import HeroEditor from './pages/admin/pages/HeroEditor';
import PainpointsEditor from './pages/admin/pages/PainpointsEditor';
import SolutionEditor from './pages/admin/pages/SolutionEditor';
import MethodologyEditor from './pages/admin/pages/MethodologyEditor';
import LuckyWheelEditor from './pages/admin/pages/LuckyWheelEditor';
import ExperienceEditor from './pages/admin/pages/ExperienceEditor';
import Affiliates from './pages/admin/pages/Affiliates';
import MarketingLinks from './pages/admin/pages/MarketingLinks';
import { trackVisitor } from './pages/admin/adminApi';
import { ProjectProvider } from '@/src/ula-chinese/pages/admin/context/ProjectContext';
import { LandingSiteProvider } from '@/src/ula-chinese/context/LandingSiteContext';

export default function App() {
  React.useEffect(() => {
    // Luồng tracking chuyên nghiệp: Gửi query params cho Backend để đặt Cookie
    trackVisitor(window.location.search);
  }, []);



  return (
    <ProjectProvider defaultProject="tieng-duc">
      <LandingSiteProvider siteKey="tieng-duc">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/:tag" element={<LandingPage />} />
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminLayout />
                </RequireAdmin>
              }
            >
              <Route index element={<Overview />} />
              <Route path="leads" element={<Leads />} />
              <Route path="affiliates" element={<Affiliates />} />
              <Route path="marketing-links" element={<MarketingLinks />} />
              <Route path="hero" element={<HeroEditor />} />
              <Route path="painpoints" element={<PainpointsEditor />} />
              <Route path="solution" element={<SolutionEditor />} />
              <Route path="methodology" element={<MethodologyEditor />} />
              <Route path="experience" element={<ExperienceEditor />} />
              <Route path="lucky-wheel" element={<LuckyWheelEditor />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </LandingSiteProvider>
    </ProjectProvider>
  );
}
