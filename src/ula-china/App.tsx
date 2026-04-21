import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import GermanLandingPage from '../ula-German/pages/LandingPage';
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
import WelcomePage from './pages/WelcomePage';
import { trackVisitor } from './pages/admin/adminApi';

export default function App() {
  React.useEffect(() => {
    // Luồng tracking chuyên nghiệp: Gửi query params cho Backend để đặt Cookie
    trackVisitor(window.location.search);
  }, []);

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1 });

    const observeNewElements = () => {
      const revealElements = document.querySelectorAll('.reveal');
      revealElements.forEach(el => observer.observe(el));
    };

    // Initial observation
    observeNewElements();

    // Watch for DOM changes to catch elements added after mount or route transitions
    const mutationObserver = new MutationObserver(() => {
      observeNewElements();
    });

    mutationObserver.observe(document.body, { 
      childList: true, 
      subtree: true 
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/china" element={<LandingPage />} />
        <Route path="/german" element={<GermanLandingPage />} />
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
