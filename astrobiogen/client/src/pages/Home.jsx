import { useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

const Home = () => {
  useEffect(() => {
    // GSAP animation for the hero section
    gsap.from(".hero-content", {
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.2,
    });

    // Simple animation for features without ScrollTrigger
    gsap.from(".feature-card", {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.15,
      delay: 0.5,
    });
  }, []);

  return (
    <div>
      {/* Hero Section */}
      {/* <section className="bg-gradient-to-r from-indigo-900 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="hero-content text-4xl md:text-5xl font-bold mb-6 text-white">
              Explore Space Biology with AI
            </h1>
            <p className="hero-content text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-white ">
              Visualize and understand how microgravity and radiation affect genes using NASA data and AI insights
            </p>
            <div className="hero-content">
              <Link 
                to="/explore" 
                className="bg-white text-indigo-900 px-8 py-3 rounded-full font-medium text-lg hover:bg-indigo-100 transition-colors"
              >
                Explore Experiments
              </Link>
            </div>
          </div>
        </div>
      </section> */}

      <section className="relative bg-gradient-to-r from-indigo-900 to-purple-800 text-white py-20">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Explore Space Biology with AI
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-white">
              Visualize and understand how microgravity and radiation affect
              genes using NASA data and AI insights
            </p>
            <div>
              <Link
                to="/explore"
                className="bg-white text-indigo-900 px-8 py-3 rounded-full font-medium text-lg hover:bg-indigo-100 transition-colors"
              >
                Explore Experiments
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}

      <section style={{ backgroundColor: '#f3f4f6', padding: '4rem 1rem' }}>
  <div style={{ maxWidth: '1280px', margin: '0 auto', color: '#111827' }}>
    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>
      Discover the Power of AstroBioGen
    </h2>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
      <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Visualize Gene Expression</h3>
        <p style={{ color: '#4b5563' }}>
          Interactive charts and heatmaps make complex genetic data easy to understand and explore.
        </p>
      </div>

      <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>AI-Powered Insights</h3>
        <p style={{ color: '#4b5563' }}>
          Groq explains complex biological effects in plain language, making space biology accessible to everyone.
        </p>
      </div>

      <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Earth-Based Applications</h3>
        <p style={{ color: '#4b5563' }}>
          Discover how space biology research connects to medical breakthroughs and health innovations on Earth.
        </p>
      </div>
    </div>
  </div>
</section>


     

      {/* Call to Action */}
      <section className="bg-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-indigo-900">
            Ready to Explore Space Biology?
          </h2>
          <p className="text-lg mb-8 text-indigo-800 max-w-3xl mx-auto">
            Start your journey through NASA's GeneLab data and discover how
            space affects life at the molecular level.
          </p>
          <Link
            to="/explore"
            className="bg-indigo-600 text-white px-8 py-3 rounded-full font-medium text-lg hover:bg-indigo-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
