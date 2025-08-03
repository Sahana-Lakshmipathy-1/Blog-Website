import React from 'react';
import AppRoutes from './routes/AppRoutes';
import NavBar from './components/Navbar'
import Footer from './components/Footer';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react"


const App = () => {
  return ( 
    <div >
      <NavBar />
      <div className="p-4">
        <Analytics />
        <SpeedInsights />
        <AppRoutes />
      </div>
      <Footer/>
    </div>
  );
};

export default App;
