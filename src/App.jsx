import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Process from './components/Process';
import Portfolio from './components/Portfolio';
import Testimonials from './components/Testimonials';
import About from './components/About';
import Careers from './components/Careers';
import Hiring from './components/Hiring';
import HiringLanding from './components/HiringLanding';
import SalesCloserHiring from './components/SalesCloserHiring';
import LaunchProject from './components/LaunchProject';
import Contact from './components/Contact';
import Features from './components/Features';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import SalesPortal from './components/SalesPortal';
import './App.css';

const Home = ({ onLaunchClick }) => (
  <>
    <Hero onLaunchClick={onLaunchClick} />
    <Services />
    <Process />
    <Portfolio />
    <Testimonials />
    <About />
    <Features />
    <Careers />
    <Contact />
  </>
);

const App = () => {
  const [showLaunchModal, setShowLaunchModal] = React.useState(false);

  return (
    <Router>
      <Routes>
        {/* Main Site Routes - with Navbar and Footer */}
        <Route
          path="/"
          element={
            <div className="app-container">
              <Navbar onGetQuoteClick={() => setShowLaunchModal(true)} />
              <Home onLaunchClick={() => setShowLaunchModal(true)} />
              <LaunchProject isOpen={showLaunchModal} onClose={() => setShowLaunchModal(false)} />
              <Footer />
            </div>
          }
        />
        
        {/* Admin Route */}
        <Route path="/admin" element={<AdminPanel />} />

        {/* Sales Portal - Individual Salesperson Dashboard */}
        <Route path="/portal" element={<SalesPortal />} />

        {/* Dedicated Hiring Pages - Full Page, No Main Navbar/Footer */}
        <Route path="/hiring" element={<Hiring />} />
        <Route path="/hiring-landing" element={<HiringLanding />} />
        <Route path="/sales-closer" element={<SalesCloserHiring />} />
      </Routes>
    </Router>
  );
};

export default App;
