import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-indigo-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              {/* Replace with your logo */}
              <div className="h-8 w-8 bg-indigo-500 rounded-full mr-2"></div>
              <span className="font-bold text-xl">AstroBioGen</span>
            </Link>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-800">
                  Home
                </Link>
                <Link to="/explore" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-800">
                  Explore Experiments
                </Link>
                <Link to="/insights" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-800">
                  Insights
                </Link>
                <Link to="/space-data" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-800">
                  Space Data
                </Link>
                <Link to="/planets" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-800">
                  Planets
                </Link>
                <Link to="/game" className="px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 hover:bg-indigo-700">
                  Solar System Game
                </Link>
              </div>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-800 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon for menu */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              
              {/* Icon for close */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link 
            to="/" 
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-800"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/explore" 
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-800"
            onClick={() => setIsMenuOpen(false)}
          >
            Explore Experiments
          </Link>
          <Link 
            to="/insights" 
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-800"
            onClick={() => setIsMenuOpen(false)}
          >
            Insights
          </Link>
          <Link 
            to="/space-data" 
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-800"
            onClick={() => setIsMenuOpen(false)}
          >
            Space Data
          </Link>
          <Link 
            to="/planets" 
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-800"
            onClick={() => setIsMenuOpen(false)}
          >
            Planets
          </Link>
          <Link 
            to="/game" 
            className="block px-3 py-2 rounded-md text-base font-medium bg-indigo-600 hover:bg-indigo-700"
            onClick={() => setIsMenuOpen(false)}
          >
            Solar System Game
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
