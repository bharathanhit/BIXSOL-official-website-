import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Process from './components/Process';
import Portfolio from './components/Portfolio';
import Testimonials from './components/Testimonials';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <Navbar />
      <Hero />
      <Services />
      <Process />
      <Portfolio />
      <Testimonials />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default App;
