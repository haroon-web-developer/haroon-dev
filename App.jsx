import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';

const Home = lazy(() => import('./components/Home'));
const PortfolioPage = lazy(() => import('./components/PortfolioPage'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const Assistant = lazy(() => import('./components/Assistant'));
const ServiceDetailPage = lazy(() => import('./components/ServiceDetailPage'));
const IslamabadLandingPage = lazy(() => import('./components/IslamabadLandingPage'));

import ScrollToTop from './components/ScrollToTop';

const App = () => {
  return (
    <Router>
      <ScrollToTop /> 
      {/* Layout wraps all pages */}
      <Layout>
        <Routes>
          {/* Home Agency Landing Page */}
          <Route
            path="/"
            element={
              <Suspense fallback={<div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center text-indigo-400 font-mono">Loading Agency Portal...</div>}>
                <Home />
              </Suspense>
            }
          />
          {/* Consolidated Personal Portfolio Tab */}
          <Route
            path="/portfolio"
            element={
              <Suspense fallback={<div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center text-indigo-400 font-mono">Loading Portfolio Hub...</div>}>
                <PortfolioPage />
              </Suspense>
            }
          />
          {/* Service Detail Page */}
          <Route
            path="/service/:id"
            element={
              <Suspense fallback={<div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center text-indigo-400 font-mono">Loading Service Details...</div>}>
                <ServiceDetailPage />
              </Suspense>
            }
          />
          {/* Dedicated Local Landing Page: Web Developer Islamabad */}
          <Route
            path="/web-developer-islamabad"
            element={
              <Suspense fallback={<div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center text-indigo-400 font-mono">Loading Islamabad Hub...</div>}>
                <IslamabadLandingPage />
              </Suspense>
            }
          />
          {/* Admin Command Console */}
          <Route
            path="/admin"
            element={
              <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-mono">Loading Dashboard...</div>}>
                <AdminDashboard />
              </Suspense>
            }
          />
        </Routes>
      </Layout>

      {/* Floating Elements */}
      <Suspense fallback={null}>
        <Assistant />
      </Suspense>
    </Router>
  );
};

export default App;