import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import ExploreExperiments from './pages/ExploreExperiments';
import Insights from './pages/Insights';
import SpaceData from './pages/SpaceData';
import Planets from './pages/Planets';
import Game from './pages/Game';

// Utils
import { detectServerPort } from './utils/serverPort';

function App() {
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [serverPort, setServerPort] = useState(localStorage.getItem('serverPort') || '5004');
  
  // Detect server port on app load
  useEffect(() => {
    const detectPort = async () => {
      try {
        const port = await detectServerPort();
        setServerPort(port);
      } catch (error) {
        console.error('Error detecting server port:', error);
      }
    };
    
    detectPort();
  }, []);
  
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/explore" 
              element={
                <ExploreExperiments 
                  selectedExperiment={selectedExperiment}
                  setSelectedExperiment={setSelectedExperiment}
                />
              } 
            />
            <Route 
              path="/insights" 
              element={
                <Insights 
                  selectedExperiment={selectedExperiment}
                />
              } 
            />
            <Route path="/space-data" element={<SpaceData />} />
            <Route path="/planets" element={<Planets />} />
            <Route path="/planets/:planetId" element={<Planets />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
