import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import GermanLandingPage from '../ula-German/pages/LandingPage';
import Login from './pages/admin/pages/Login';
import AdminLayout from './pages/admin/AdminLayout';
import RequireAdmin from './pages/admin/RequireAdmin';
// import Overview from './pages/admin/pages/Overview';
// import Leads from './pages/admin/pages/Leads';
// import HeroEditor from './pages/admin/pages/HeroEditor';
// import PainpointsEditor from './pages/admin/pages/PainpointsEditor';
// import SolutionEditor from './pages/admin/pages/SolutionEditor';
// import MethodologyEditor from './pages/admin/pages/MethodologyEditor';
// import LuckyWheelEditor from './pages/admin/pages/LuckyWheelEditor';
// import ExperienceEditor from './pages/admin/pages/ExperienceEditor';
// import Affiliates from './pages/admin/pages/Affiliates';
import WelcomePage from './pages/WelcomePage';
import { ProjectProvider } from './pages/admin/context/ProjectContext';
import { LandingSiteProvider } from './context/LandingSiteContext';

export default function App() {



  return (
    <ProjectProvider defaultProject="tieng-trung">
      <LandingSiteProvider siteKey="tieng-trung">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/chinese" element={<LandingPage />} />
            <Route path="/chinese/:tag" element={<LandingPage />} />
            <Route path="/german" element={<GermanLandingPage />} />
            <Route path="/german/:tag" element={<GermanLandingPage />} />
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
      </LandingSiteProvider>
    </ProjectProvider>
  );
}
