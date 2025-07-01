import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-indigo-900 text-white">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">AstroBioGen</h3>
            <p className="text-indigo-200 text-sm">
              AI-Powered Genetic Insight Explorer for Space Biology
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-indigo-200 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-indigo-200 hover:text-white">
                  Explore Experiments
                </Link>
              </li>
              <li>
                <Link to="/insights" className="text-indigo-200 hover:text-white">
                  Insights
                </Link>
              </li>
              <li>
                <Link to="/space-data" className="text-indigo-200 hover:text-white">
                  Space Data
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://genelab.nasa.gov/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-200 hover:text-white"
                >
                  NASA GeneLab
                </a>
              </li>
              <li>
                <a 
                  href="https://groq.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-200 hover:text-white"
                >
                  Groq
                </a>
              </li>
              <li>
                <a 
                  href="https://tavily.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-200 hover:text-white"
                >
                  Tavily
                </a>
              </li>
              <li>
                <a 
                  href="https://spotthestation.nasa.gov/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-200 hover:text-white"
                >
                  ISS Tracker
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-indigo-800 pt-6 text-center text-sm text-indigo-300">
          <p>© {new Date().getFullYear()} AstroBioGen. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
