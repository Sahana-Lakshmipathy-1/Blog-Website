import React from 'react';
import AppRoutes from './routes/AppRoutes';
import NavBar from './components/Navbar'
import Footer from './components/Footer';


const App = () => {
  return ( 
    <div >
      <NavBar />
      <div className="p-4">
        <AppRoutes />
      </div>
      <Footer/>
    </div>
  );
};

export default App;
