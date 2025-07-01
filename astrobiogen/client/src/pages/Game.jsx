import { useState, useEffect } from 'react';
import './Game.css';

const Game = () => {
  // State management
  const [view, setView] = useState('system'); // 'system', 'planet', 'quiz'
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [planetImages, setPlanetImages] = useState({});
  const [planetInfo, setPlanetInfo] = useState({});
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visitedPlanets, setVisitedPlanets] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Solar system data
  const planets = [
    { 
      id: 'mercury', 
      name: 'Mercury', 
      color: '#a6a6a6',
      size: 0.38,
      moons: []
    },
    { 
      id: 'venus', 
      name: 'Venus', 
      color: '#e39e54',
      size: 0.95,
      moons: []
    },
    { 
      id: 'earth', 
      name: 'Earth', 
      color: '#6b93d6',
      size: 1.0,
      moons: ['Moon']
    },
    { 
      id: 'mars', 
      name: 'Mars', 
      color: '#c1440e',
      size: 0.53,
      moons: ['Phobos', 'Deimos']
    },
    { 
      id: 'jupiter', 
      name: 'Jupiter', 
      color: '#e0ae6f',
      size: 11.2,
      moons: ['Io', 'Europa', 'Ganymede', 'Callisto']
    },
    { 
      id: 'saturn', 
      name: 'Saturn', 
      color: '#f4d4a9',
      size: 9.45,
      moons: ['Titan', 'Enceladus', 'Mimas', 'Rhea', 'Iapetus']
    },
    { 
      id: 'uranus', 
      name: 'Uranus', 
      color: '#d1e7e7',
      size: 4.0,
      moons: ['Miranda', 'Ariel', 'Umbriel', 'Titania', 'Oberon']
    },
    { 
      id: 'neptune', 
      name: 'Neptune', 
      color: '#5b5ddf',
      size: 3.88,
      moons: ['Triton', 'Nereid', 'Proteus']
    },
    { 
      id: 'pluto', 
      name: 'Pluto', 
      color: '#d3c8c0',
      size: 0.18,
      moons: ['Charon', 'Nix', 'Hydra']
    }
  ];

  // Hardcoded planet information
  const planetData = {
    mercury: {
      info: "Mercury is the smallest and innermost planet in the Solar System. It has a cratered surface similar to our Moon and virtually no atmosphere to retain heat, causing extreme temperature variations. Mercury orbits the Sun every 88 Earth days, making it the fastest planet in our solar system.",
      images: [
        {
          href: "https://solarsystem.nasa.gov/system/stellar_items/image_files/2_feature_1600x900_mercury.jpg",
          title: "Mercury - NASA Image"
        },
        {
          href: "https://solarsystem.nasa.gov/system/resources/detail_files/771_PIA16853.jpg",
          title: "Mercury's Colors - NASA Image"
        }
      ]
    },
    venus: {
      info: "Venus is the second planet from the Sun and the hottest planet in our solar system due to its thick atmosphere that traps heat. Often called Earth's sister planet because of their similar size, Venus rotates backwards compared to other planets and has a day longer than its year.",
      images: [
        {
          href: "https://solarsystem.nasa.gov/system/stellar_items/image_files/3_feature_1600x900_venus.jpg",
          title: "Venus - NASA Image"
        },
        {
          href: "https://solarsystem.nasa.gov/system/resources/detail_files/775_PIA00072.jpg",
          title: "Venus Surface - NASA Image"
        }
      ]
    },
    earth: {
      info: "Earth is the third planet from the Sun and the only astronomical object known to harbor life. About 71% of Earth's surface is covered with water, making it unique among planets in our solar system. Earth's atmosphere and magnetic field protect life from harmful solar radiation.",
      images: [
        {
          href: "https://solarsystem.nasa.gov/system/stellar_items/image_files/4_earth.jpg",
          title: "Earth - NASA Image"
        },
        {
          href: "https://solarsystem.nasa.gov/system/resources/detail_files/2335_epic_1b_20190204.png",
          title: "Earth from Space - NASA Image"
        }
      ]
    },
    mars: {
      info: "Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System. Known as the 'Red Planet' due to iron oxide on its surface, Mars has polar ice caps, seasons similar to Earth, and evidence of ancient water flows. It's the most explored planet beyond Earth, with multiple rovers and orbiters studying it.",
      images: [
        {
          href: "https://solarsystem.nasa.gov/system/stellar_items/image_files/6_mars.jpg",
          title: "Mars - NASA Image"
        },
        {
          href: "https://solarsystem.nasa.gov/system/resources/detail_files/683_6453_mars-opportunity-rocknest-pia17080-full2.jpg",
          title: "Mars Surface - NASA Image"
        }
      ]
    },
    jupiter: {
      info: "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It's a gas giant primarily composed of hydrogen and helium, with no solid surface. Jupiter has a strong magnetic field, at least 79 moons, and its most famous feature is the Great Red Spot, a giant storm that has existed for hundreds of years.",
      images: [
        {
          href: "https://solarsystem.nasa.gov/system/stellar_items/image_files/7_jupiter_new.jpg",
          title: "Jupiter - NASA Image"
        },
        {
          href: "https://solarsystem.nasa.gov/system/resources/detail_files/2486_stsci-h-p1936a_1800.jpg",
          title: "Jupiter's Great Red Spot - NASA Image"
        }
      ]
    },
    saturn: {
      info: "Saturn is the sixth planet from the Sun and is famous for its spectacular ring system. Like Jupiter, it's a gas giant composed mainly of hydrogen and helium. Saturn has at least 82 moons, including Titan, which has its own atmosphere and lakes of liquid methane.",
      images: [
        {
          href: "https://solarsystem.nasa.gov/system/stellar_items/image_files/38_saturn_1600x900.jpg",
          title: "Saturn - NASA Image"
        },
        {
          href: "https://solarsystem.nasa.gov/system/resources/detail_files/2490_stsci-h-p1943a-f_1200.jpg",
          title: "Saturn's Rings - NASA Image"
        }
      ]
    },
    uranus: {
      info: "Uranus is the seventh planet from the Sun and the first to be discovered through a telescope. It's an ice giant with a blue-green color due to methane in its atmosphere. Uniquely, Uranus rotates on its side with an axial tilt of about 98 degrees, likely caused by a massive collision in its past.",
      images: [
        {
          href: "https://solarsystem.nasa.gov/system/stellar_items/image_files/69_uranus_1600x900.jpg",
          title: "Uranus - NASA Image"
        },
        {
          href: "https://solarsystem.nasa.gov/system/resources/detail_files/599_PIA18182.jpg",
          title: "Uranus's Atmosphere - NASA Image"
        }
      ]
    },
    neptune: {
      info: "Neptune is the eighth and farthest known planet from the Sun. It's an ice giant similar to Uranus but with a more vivid blue color. Neptune has the strongest winds in the solar system and was predicted mathematically before it was observed. It has 14 known moons, including Triton, which orbits backwards and is likely a captured dwarf planet.",
      images: [
        {
          href: "https://solarsystem.nasa.gov/system/stellar_items/image_files/90_neptune_1600x900.jpg",
          title: "Neptune - NASA Image"
        },
        {
          href: "https://solarsystem.nasa.gov/system/resources/detail_files/611_PIA01142.jpg",
          title: "Neptune's Great Dark Spot - NASA Image"
        }
      ]
    },
    pluto: {
      info: "Pluto was reclassified from a planet to a dwarf planet in 2006. It's a small, icy world in the Kuiper Belt with a highly elliptical orbit. Pluto has five known moons, with Charon being the largest. NASA's New Horizons spacecraft provided the first close-up images of Pluto in 2015, revealing mountains and glaciers.",
      images: [
        {
          href: "https://solarsystem.nasa.gov/system/stellar_items/image_files/14_pluto_1600x900.jpg",
          title: "Pluto - NASA Image"
        },
        {
          href: "https://solarsystem.nasa.gov/system/resources/detail_files/933_BIG_P_COLOR_2_TRUE_COLOR1_1980.jpg",
          title: "Pluto's Surface - NASA Image"
        }
      ]
    }
  };

  // Quiz questions
  const quizData = [
    {
      question: "Which planet is closest to the Sun?",
      options: ["Venus", "Mercury", "Earth", "Mars"],
      correctAnswer: "Mercury"
    },
    {
      question: "Which planet has the Great Red Spot?",
      options: ["Mars", "Venus", "Jupiter", "Saturn"],
      correctAnswer: "Jupiter"
    },
    {
      question: "Which planet is known as the 'Red Planet'?",
      options: ["Jupiter", "Venus", "Mercury", "Mars"],
      correctAnswer: "Mars"
    },
    {
      question: "Which planet has the most prominent ring system?",
      options: ["Jupiter", "Uranus", "Neptune", "Saturn"],
      correctAnswer: "Saturn"
    },
    {
      question: "Which of these is classified as a dwarf planet?",
      options: ["Neptune", "Mercury", "Pluto", "Venus"],
      correctAnswer: "Pluto"
    },
    {
      question: "Which planet has the longest day?",
      options: ["Earth", "Venus", "Mars", "Jupiter"],
      correctAnswer: "Venus"
    },
    {
      question: "Which planet rotates on its side?",
      options: ["Saturn", "Uranus", "Neptune", "Jupiter"],
      correctAnswer: "Uranus"
    },
    {
      question: "Which planet has the strongest winds in the solar system?",
      options: ["Jupiter", "Saturn", "Neptune", "Uranus"],
      correctAnswer: "Neptune"
    },
    {
      question: "Which planet has a moon called Titan with its own atmosphere?",
      options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
      correctAnswer: "Saturn"
    },
    {
      question: "Which planet is similar in size to Earth?",
      options: ["Mars", "Mercury", "Venus", "Jupiter"],
      correctAnswer: "Venus"
    }
  ];
  
  // Preload planet images
  useEffect(() => {
    // Initialize planet data from our hardcoded data
    planets.forEach(planet => {
      if (planetData[planet.id]) {
        // Set planet info
        setPlanetInfo(prev => ({
          ...prev,
          [planet.id]: planetData[planet.id].info
        }));
        
        // Set planet images
        setPlanetImages(prev => ({
          ...prev,
          [planet.id]: planetData[planet.id].images
        }));
        
        // Preload images
        planetData[planet.id].images.forEach(image => {
          const img = new Image();
          img.src = image.href;
        });
      }
    });
  }, []);
  
  // Handle planet selection
  const handlePlanetClick = async (planet) => {
    setLoading(true);
    setError(null);
    setSelectedPlanet(planet);
    setCurrentImageIndex(0);
    
    try {
      // Add to visited planets if not already visited
      if (!visitedPlanets.includes(planet.id)) {
        setVisitedPlanets([...visitedPlanets, planet.id]);
      }
      
      // Switch to planet view
      setView('planet');
    } catch (err) {
      console.error('Error selecting planet:', err);
      setError('Failed to load planet information. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Navigate through planet images
  const handleImageNavigation = (direction) => {
    if (!selectedPlanet || !planetImages[selectedPlanet.id]) return;
    
    const images = planetImages[selectedPlanet.id];
    if (images.length <= 1) return;
    
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };
  
  // Return to solar system view
  const handleBackToSystem = () => {
    setView('system');
    setSelectedPlanet(null);
  };
  
  // Start the quiz
  const handleStartQuiz = () => {
    setLoading(true);
    setError(null);
    
    try {
      // Only allow quiz if user has visited at least 3 planets
      if (visitedPlanets.length < 3) {
        setError('Please explore at least 3 planets before taking the quiz!');
        setLoading(false);
        return;
      }
      
      // Generate quiz questions based on visited planets
      generateQuizQuestions();
      
      // Switch to quiz view
      setView('quiz');
    } catch (err) {
      console.error('Error generating quiz:', err);
      setError('Failed to generate quiz questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Generate quiz questions
  const generateQuizQuestions = () => {
    // Shuffle and select 5 questions from our quiz data
    const shuffled = [...quizData].sort(() => 0.5 - Math.random());
    setQuizQuestions(shuffled.slice(0, 5));
  };
  
  // Handle quiz answer selection
  const handleAnswerSelect = (questionIndex, answer) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };
  
  // Submit quiz answers
  const handleSubmitQuiz = () => {
    // Calculate score
    let correctCount = 0;
    quizQuestions.forEach((question, index) => {
      if (quizAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    const score = Math.round((correctCount / quizQuestions.length) * 100);
    setQuizScore(score);
  };
  
  // Reset the game
  const handleResetGame = () => {
    setView('system');
    setSelectedPlanet(null);
    setQuizScore(null);
    setQuizAnswers({});
  };
  
  return (
    <div className="game-container">
      <h1 className="game-title">Solar System Explorer</h1>
      
      {/* System View */}
      {view === 'system' && (
        <div className="solar-system-simple">
          <div className="sun-simple"></div>
          
          <div className="planets-container">
            {planets.map((planet) => (
              <div 
                key={planet.id}
                className={`planet-simple ${visitedPlanets.includes(planet.id) ? 'visited' : ''}`}
                style={{ 
                  backgroundColor: planet.color,
                  width: `${Math.max(planet.size * 8, 30)}px`,
                  height: `${Math.max(planet.size * 8, 30)}px`
                }}
                onClick={() => handlePlanetClick(planet)}
              >
                <div className="planet-name">{planet.name}</div>
                {planet.id === 'saturn' && <div className="saturn-ring"></div>}
              </div>
            ))}
          </div>
          
          <div className="game-controls">
            <button 
              className="quiz-button"
              onClick={handleStartQuiz}
              disabled={visitedPlanets.length < 3}
            >
              Take Quiz
            </button>
            
            {visitedPlanets.length < 3 && (
              <p className="explore-message">
                Explore at least 3 planets to unlock the quiz!
                <br />
                Explored: {visitedPlanets.length}/3
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Planet View */}
      {view === 'planet' && selectedPlanet && (
        <div className="planet-view">
          <button className="back-button" onClick={handleBackToSystem}>
            ← Back to Solar System
          </button>
          
          <h2 className="planet-title">{selectedPlanet.name}</h2>
          
          {loading ? (
            <div className="loading-spinner">Loading planet data...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="planet-content">
              <div className="planet-images">
                {planetImages[selectedPlanet.id]?.length > 0 ? (
                  <div className="image-carousel">
                    <img 
                      src={planetImages[selectedPlanet.id][currentImageIndex].href} 
                      alt={selectedPlanet.name} 
                      className="main-planet-image"
                      onError={(e) => {
                        console.error('Image failed to load:', e.target.src);
                        e.target.style.backgroundColor = selectedPlanet.color;
                        e.target.style.height = '250px';
                        e.target.alt = `${selectedPlanet.name} (Image failed to load)`;
                        e.target.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"; // Transparent placeholder
                      }}
                    />
                    
                    {planetImages[selectedPlanet.id].length > 1 && (
                      <div className="image-navigation">
                        <button 
                          onClick={() => handleImageNavigation('prev')}
                          className="nav-button"
                        >
                          ←
                        </button>
                        <span className="image-counter">
                          {currentImageIndex + 1} / {planetImages[selectedPlanet.id].length}
                        </span>
                        <button 
                          onClick={() => handleImageNavigation('next')}
                          className="nav-button"
                        >
                          →
                        </button>
                      </div>
                    )}
                    
                    <div className="image-thumbnails">
                      {planetImages[selectedPlanet.id].map((image, index) => (
                        <img 
                          key={index}
                          src={image.href}
                          alt={`${selectedPlanet.name} ${index + 1}`}
                          className={`image-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                          onClick={() => setCurrentImageIndex(index)}
                          onError={(e) => {
                            e.target.style.backgroundColor = selectedPlanet.color;
                            e.target.alt = `${selectedPlanet.name} (Thumbnail failed)`;
                            e.target.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"; // Transparent placeholder
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="placeholder-image">
                    <div className="planet-sphere" style={{ backgroundColor: selectedPlanet.color }}></div>
                  </div>
                )}
              </div>
              
              <div className="planet-moons">
                <h3>Moons of {selectedPlanet.name}</h3>
                {selectedPlanet.moons.length > 0 ? (
                  <div className="moon-list">
                    {selectedPlanet.moons.map(moon => (
                      <div key={moon} className="moon-item">
                        <div className="moon-icon"></div>
                        <span>{moon}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>This planet has no known moons.</p>
                )}
              </div>
              
              <div className="planet-news">
                <h3>About {selectedPlanet.name}</h3>
                <p>{planetInfo[selectedPlanet.id] || `${selectedPlanet.name} is one of the planets in our solar system. Scientists continue to study ${selectedPlanet.name} to better understand its unique characteristics and how it formed.`}</p>
              </div>
              
              <button 
                className="quiz-button planet-view-quiz"
                onClick={handleBackToSystem}
              >
                Back to Solar System
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Quiz View */}
      {view === 'quiz' && (
        <div className="quiz-view">
          <h2 className="quiz-title">Solar System Quiz</h2>
          
          {quizScore !== null ? (
            <div className="quiz-results">
              <div className="quiz-score">
                <h3>Your Score</h3>
                <div className="score-circle">
                  <span className="score-number">{quizScore}%</span>
                </div>
                <p className="score-message">
                  {quizScore >= 80 ? 'Amazing! You\'re a solar system expert!' :
                   quizScore >= 60 ? 'Good job! You know your planets well!' :
                   'Keep exploring to learn more about our solar system!'}
                </p>
              </div>
              
              <div className="quiz-answers">
                <h3>Correct Answers</h3>
                {quizQuestions.map((question, index) => (
                  <div 
                    key={index} 
                    className={`quiz-answer ${
                      quizAnswers[index] === question.correctAnswer ? 'correct' : 'incorrect'
                    }`}
                  >
                    <p className="question-text">{question.question}</p>
                    <p className="answer-text">
                      Your answer: <strong>{quizAnswers[index] || 'Not answered'}</strong>
                      {quizAnswers[index] !== question.correctAnswer && (
                        <span className="correct-answer">
                          Correct answer: <strong>{question.correctAnswer}</strong>
                        </span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
              
              <button className="reset-button" onClick={handleResetGame}>
                Explore Again
              </button>
            </div>
          ) : (
            <div className="quiz-questions">
              {quizQuestions.map((question, index) => (
                <div key={index} className="quiz-question">
                  <p className="question-text">{index + 1}. {question.question}</p>
                  <div className="question-options">
                    {question.options.map(option => (
                      <label key={option} className="option-label">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option}
                          checked={quizAnswers[index] === option}
                          onChange={() => handleAnswerSelect(index, option)}
                        />
                        <span className="option-text">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              
              <button 
                className="submit-button"
                onClick={handleSubmitQuiz}
                disabled={Object.keys(quizAnswers).length < quizQuestions.length}
              >
                Submit Answers
              </button>
              
              <button className="back-button quiz-back" onClick={handleBackToSystem}>
                Back to Solar System
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Game;
