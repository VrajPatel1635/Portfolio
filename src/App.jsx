import React, { Suspense, lazy } from 'react';
import './styles/index.css';
import Cursor from './components/Cursor'
import Navbar from "./components/Navbar";
import Hero from './components/Hero';
import About from './components/About';
import Contact from './components/Contact';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Loader from './components/Loader';
import Scroll_Indicator from './components/Scroll_Indicator'
import SmoothCursor from './components/SmoothCursor'

// Lazy-load the heavy Three.js particle background so it doesn't
// block the main JS bundle / first paint.
const Partical_BG = lazy(() => import('./components/Partical_BG'));

const App = () => {
  return (
    <>
      <Suspense fallback={null}>
        <Partical_BG />
      </Suspense>
      <SmoothCursor/>
      <Loader/>

      <Navbar/>
      <Scroll_Indicator/>

      <main>
        <Hero/>
        <About/>
        <Skills/>
        <Projects/>
        <Contact/>
      </main>
    </>
  )
};

export default App;
