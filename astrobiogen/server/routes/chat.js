const express = require('express');
const router = express.Router();
const axios = require('axios');

// Groq API configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Tavily API configuration
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const TAVILY_API_URL = 'https://api.tavily.com/v1/search';

/**
 * @route   POST /api/chat
 * @desc    Process chat messages and get AI response
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request format. Messages array is required.' });
    }
    
    // Extract planet name and user message
    const systemMessage = messages.find(m => m.role === 'system')?.content || '';
    const planetName = systemMessage.match(/expert on the planet ([A-Za-z]+)/)?.[1] || 'unknown';
    const userMessage = messages.find(m => m.role === 'user')?.content || '';
    
    // Check if we should use Tavily for research-based questions
    const researchKeywords = ['research', 'discovery', 'mission', 'spacecraft', 'recent', 'latest', 'study', 'scientist'];
    const shouldUseResearch = researchKeywords.some(keyword => userMessage.toLowerCase().includes(keyword));
    
    let response;
    
    if (shouldUseResearch && TAVILY_API_KEY) {
      // Use Tavily for research-based questions
      response = await getResearchResponse(planetName, userMessage);
    } else {
      // Use Groq for general questions
      response = await getGroqResponse(planetName, userMessage, messages);
    }
    
    res.json({ response });
  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(500).json({ 
      response: `I'm sorry, I'm having trouble accessing information about planets right now. Please try again later.`
    });
  }
});

/**
 * Get a response from Groq AI
 * @param {string} planetName - Name of the planet
 * @param {string} userMessage - User's message
 * @param {Array} messages - Full message history
 * @returns {Promise<string>} - AI-generated response
 */
async function getGroqResponse(planetName, userMessage, messages) {
  try {
    if (!GROQ_API_KEY) {
      console.warn('Groq API key not found.');
      return getPlanetInfo(planetName, userMessage);
    }
    
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: `You are an expert on the planet ${planetName}. Provide accurate, educational information about ${planetName} in response to user questions. Keep responses concise but informative. Format your response as plain text without markdown formatting or headers.`
          },
          ...messages.filter(m => m.role !== 'system')
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Clean up the response to remove any markdown or formatting
    let content = response.data.choices[0].message.content;
    
    // Remove markdown formatting
    content = content.replace(/\*\*(.*?)\*\*/g, '$1'); // Remove bold
    content = content.replace(/\*(.*?)\*/g, '$1');     // Remove italics
    content = content.replace(/#{1,6} (.*?)\n/g, '$1\n'); // Remove headers
    content = content.replace(/\[(.*?)\]\((.*?)\)/g, '$1'); // Remove links
    
    return content;
  } catch (error) {
    console.error('Error calling Groq API:', error);
    return getPlanetInfo(planetName, userMessage);
  }
}

/**
 * Get a research-based response using Tavily
 * @param {string} planetName - Name of the planet
 * @param {string} userMessage - User's message
 * @returns {Promise<string>} - Research-based response
 */
async function getResearchResponse(planetName, userMessage) {
  try {
    if (!TAVILY_API_KEY) {
      console.warn('Tavily API key not found.');
      return getPlanetInfo(planetName, userMessage);
    }
    
    // Search for information using Tavily
    const searchResponse = await axios.post(
      TAVILY_API_URL,
      {
        query: `${userMessage} about planet ${planetName}`,
        search_depth: 'advanced',
        include_answer: true,
        include_images: false,
        include_raw_content: false
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': TAVILY_API_KEY
        }
      }
    );
    
    if (searchResponse.data && searchResponse.data.answer) {
      return searchResponse.data.answer;
    } else {
      return getPlanetInfo(planetName, userMessage);
    }
  } catch (error) {
    console.error('Error calling Tavily API:', error);
    return getPlanetInfo(planetName, userMessage);
  }
}

/**
 * Get planet information based on the user's message
 * @param {string} planetName - Name of the planet
 * @param {string} userMessage - User's message
 * @returns {string} - Information about the planet
 */
function getPlanetInfo(planetName, userMessage) {
  // Check what type of information the user is asking for
  if (userMessage.toLowerCase().includes('atmosphere')) {
    return getPlanetAtmosphereInfo(planetName);
  } else if (userMessage.toLowerCase().includes('temperature')) {
    return getPlanetTemperatureInfo(planetName);
  } else if (userMessage.toLowerCase().includes('mission') || userMessage.toLowerCase().includes('spacecraft')) {
    return getPlanetMissionInfo(planetName);
  } else if (userMessage.toLowerCase().includes('fact') || userMessage.toLowerCase().includes('interesting')) {
    return getPlanetFunFact(planetName);
  } else {
    return getGeneralPlanetInfo(planetName);
  }
}

// Helper functions to generate responses
function getPlanetAtmosphereInfo(planetName) {
  const atmosphereInfo = {
    'Mercury': "Mercury has a very thin atmosphere, almost a vacuum, consisting mainly of oxygen, sodium, hydrogen, helium, and potassium. The atmospheric pressure is less than one trillionth of Earth's atmospheric pressure.",
    'Venus': "Venus has a thick atmosphere composed mainly of carbon dioxide (96.5%) and nitrogen (3.5%), with traces of other gases. The atmospheric pressure is about 92 times that of Earth, making it the most dense atmosphere of any terrestrial planet.",
    'Earth': "Earth's atmosphere consists primarily of nitrogen (78%) and oxygen (21%), with trace amounts of argon, carbon dioxide, and other gases. It's divided into five main layers: troposphere, stratosphere, mesosphere, thermosphere, and exosphere.",
    'Mars': "Mars has a thin atmosphere composed mainly of carbon dioxide (95.3%), nitrogen (2.7%), and argon (1.6%). The atmospheric pressure is only about 0.6% of Earth's, making it much thinner but still capable of supporting weather patterns and dust storms.",
    'Jupiter': "Jupiter's atmosphere is the largest planetary atmosphere in the Solar System, composed mainly of hydrogen (89%) and helium (10%), with trace amounts of methane, ammonia, and water. It features the Great Red Spot, a giant storm that has existed for at least 400 years.",
    'Saturn': "Saturn's atmosphere is similar to Jupiter's, primarily composed of hydrogen (96.3%) and helium (3.25%), with traces of methane, ammonia, and water vapor. It has the strongest winds in the Solar System, reaching speeds of 1,800 km/h.",
    'Uranus': "Uranus has an atmosphere composed primarily of hydrogen (83%), helium (15%), and methane (2%). The methane absorbs red light and reflects blue light, giving Uranus its distinctive blue-green color.",
    'Neptune': "Neptune's atmosphere consists of hydrogen (80%), helium (19%), and methane (1.5%). Like Uranus, methane gives Neptune its blue color. It has the strongest winds in the Solar System, reaching speeds of 2,100 km/h."
  };
  
  return atmosphereInfo[planetName] || `Information about ${planetName}'s atmosphere is not available.`;
}

function getPlanetTemperatureInfo(planetName) {
  const temperatureInfo = {
    'Mercury': "Mercury experiences extreme temperature variations, ranging from about -173°C (-280°F) at night to 427°C (800°F) during the day. This extreme range is due to its thin atmosphere that cannot retain heat and its slow rotation.",
    'Venus': "Venus is the hottest planet in our solar system with an average surface temperature of about 462°C (864°F). This extreme heat is due to its thick atmosphere that traps heat in a runaway greenhouse effect.",
    'Earth': "Earth's average surface temperature is about 15°C (59°F), though it varies widely by location. The greenhouse effect keeps Earth warm enough to support liquid water and life.",
    'Mars': "Mars has an average temperature of about -63°C (-81°F), but it can range from -153°C (-243°F) at the poles in winter to 20°C (68°F) at the equator during summer days.",
    'Jupiter': "Jupiter's cloud-top temperature is about -145°C (-234°F). However, temperatures increase with depth due to the planet's internal heat, reaching thousands of degrees in its core.",
    'Saturn': "Saturn's average temperature is about -178°C (-288°F) at the cloud tops. Like Jupiter, its temperature increases with depth due to internal heat generation.",
    'Uranus': "Uranus is extremely cold with cloud-top temperatures around -224°C (-371°F). Interestingly, its upper atmosphere is colder than Neptune's, despite being closer to the Sun.",
    'Neptune': "Neptune has an average temperature of about -214°C (-353°F) at its cloud tops. Despite being the farthest planet from the Sun, it generates internal heat that makes it slightly warmer than Uranus."
  };
  
  return temperatureInfo[planetName] || `Information about ${planetName}'s temperature is not available.`;
}

function getPlanetMissionInfo(planetName) {
  const missionInfo = {
    'Mercury': "Mercury has been visited by two spacecraft: NASA's Mariner 10 (1974-1975), which mapped about 45% of its surface, and NASA's MESSENGER (2011-2015), which orbited Mercury and mapped its entire surface. The BepiColombo mission, launched in 2018 by ESA and JAXA, is currently en route to Mercury and will arrive in 2025.",
    'Venus': "Venus has been visited by numerous spacecraft, including NASA's Mariner 2 (first successful planetary flyby in 1962), Soviet Venera missions (first landing on another planet in 1970), NASA's Magellan (mapped 98% of the surface with radar in the 1990s), and ESA's Venus Express (2006-2014). NASA's Parker Solar Probe is currently making regular flybys of Venus.",
    'Earth': "Earth is continuously observed by hundreds of satellites for weather forecasting, navigation, communications, and scientific research. Notable Earth observation missions include NASA's Landsat program (since 1972), ESA's Copernicus program, and the International Space Station (since 1998).",
    'Mars': "Mars has been visited by numerous orbiters, landers, and rovers, including NASA's Mariner 4 (first successful flyby in 1965), Viking landers (1976), Pathfinder and Sojourner rover (1997), Spirit and Opportunity rovers (2004), Phoenix lander (2008), Curiosity rover (2012), MAVEN orbiter (2014), InSight lander (2018), and Perseverance rover with Ingenuity helicopter (2021). Other nations' missions include ESA's Mars Express, India's Mars Orbiter Mission, UAE's Hope, and China's Tianwen-1 with Zhurong rover.",
    'Jupiter': "Jupiter has been visited by several spacecraft, including NASA's Pioneer 10 and 11 (1973-1974), Voyager 1 and 2 (1979), Galileo (orbited from 1995-2003), New Horizons (flyby in 2007), and Juno (currently orbiting since 2016). ESA's JUICE mission and NASA's Europa Clipper are planned for launch in the coming years.",
    'Saturn': "Saturn has been visited by four spacecraft: NASA's Pioneer 11 (1979), Voyager 1 and 2 (1980-1981), and the NASA/ESA Cassini-Huygens mission (2004-2017), which orbited Saturn for 13 years and deployed the Huygens probe to Saturn's moon Titan—the first landing in the outer solar system.",
    'Uranus': "Uranus has only been visited once, by NASA's Voyager 2 spacecraft, which flew by in January 1986. This brief flyby provided most of what we know about Uranus and its moons and rings. No other missions have been sent, though several have been proposed for the future.",
    'Neptune': "Neptune has only been visited by one spacecraft, NASA's Voyager 2, which flew by in August 1989. This single flyby gave us most of our detailed knowledge of Neptune and its moons. No other spacecraft has visited Neptune, though several missions have been proposed."
  };
  
  return missionInfo[planetName] || `Information about missions to ${planetName} is not available.`;
}

function getPlanetFunFact(planetName) {
  const funFacts = {
    'Mercury': [
      "A day on Mercury (sunrise to sunrise) lasts 176 Earth days, while its year is only 88 Earth days—making a Mercury day longer than its year!",
      "Mercury's surface resembles our Moon with craters and ancient lava flows, but it also has unique 'wrinkle ridges' formed as the planet cooled and contracted.",
      "Despite being the closest planet to the Sun, Mercury is not the hottest planet—Venus is hotter due to its thick atmosphere.",
      "Mercury has a magnetic field that is only about 1% as strong as Earth's."
    ],
    'Venus': [
      "Venus rotates backwards compared to other planets, so on Venus, the Sun rises in the west and sets in the east.",
      "A day on Venus is longer than its year—it takes 243 Earth days to rotate once but only 225 Earth days to orbit the Sun.",
      "The atmospheric pressure on Venus's surface is 92 times greater than Earth's—equivalent to the pressure at nearly 1 km deep in Earth's oceans.",
      "Venus has more volcanoes than any other planet in our solar system, with over 1,600 major volcanoes and many more smaller ones."
    ],
    'Earth': [
      "Earth is the only planet not named after a god or goddess in Roman or Greek mythology.",
      "About 71% of Earth's surface is covered with water, making it appear blue from space and earning it the nickname 'the Blue Planet.'",
      "Earth's atmosphere extends about 10,000 km (6,200 miles) above the planet's surface, but most of it is within 16 km (10 miles) of the surface.",
      "Earth's magnetic field is generated by its liquid iron outer core and protects us from harmful solar radiation."
    ],
    'Mars': [
      "Mars has the largest dust storms in the solar system, which can last for months and cover the entire planet.",
      "Mars has the tallest mountain in the solar system—Olympus Mons, which is about 22 km (13.6 miles) high and three times the height of Mount Everest.",
      "The red color of Mars comes from iron oxide (rust) on its surface.",
      "Mars has two small, irregularly shaped moons called Phobos and Deimos, which may be captured asteroids."
    ],
    'Jupiter': [
      "Jupiter has the shortest day of all the planets, rotating once every 10 hours despite its enormous size.",
      "Jupiter's Great Red Spot is a storm that has been raging for at least 400 years and is large enough to fit three Earths inside it.",
      "Jupiter has at least 79 moons, including the four large Galilean moons: Io, Europa, Ganymede, and Callisto.",
      "Jupiter's moon Ganymede is the largest moon in our solar system and is even larger than the planet Mercury."
    ],
    'Saturn': [
      "Saturn's rings are made up of billions of particles of ice and rock, ranging in size from tiny dust grains to house-sized boulders.",
      "Saturn has a density lower than water—it would float if placed in a giant bathtub!",
      "Saturn has the most extensive ring system of any planet, extending up to 282,000 km (175,000 miles) from the planet.",
      "Saturn's moon Titan is the only moon in our solar system with a substantial atmosphere and has lakes of liquid methane and ethane on its surface."
    ],
    'Uranus': [
      "Uranus rotates on its side with an axial tilt of about 98 degrees, likely due to a massive collision in its past.",
      "Uranus was the first planet discovered using a telescope, by William Herschel in 1781.",
      "Uranus has 13 known rings, which are dark and narrow compared to Saturn's bright rings.",
      "Uranus is named after the Greek god of the sky, making it the only planet named after a Greek deity rather than a Roman one."
    ],
    'Neptune': [
      "Neptune was mathematically predicted to exist before it was actually observed, based on irregularities in Uranus's orbit.",
      "Neptune has the strongest winds in the solar system, reaching speeds of up to 2,100 km/h (1,300 mph).",
      "Neptune's moon Triton orbits the planet backwards (retrograde) and is likely a captured dwarf planet from the Kuiper Belt.",
      "Neptune has only been visited by one spacecraft, Voyager 2, which flew by in 1989."
    ]
  };
  
  if (funFacts[planetName]) {
    // Return a random fun fact
    const randomIndex = Math.floor(Math.random() * funFacts[planetName].length);
    return funFacts[planetName][randomIndex];
  }
  
  return `Fun facts about ${planetName} are not available.`;
}

function getGeneralPlanetInfo(planetName) {
  const generalInfo = {
    'Mercury': "Mercury is the smallest and innermost planet in the Solar System. It has a cratered surface similar to our Moon and virtually no atmosphere to retain heat, causing extreme temperature variations. Mercury orbits the Sun every 88 Earth days, making it the fastest planet in our solar system.",
    'Venus': "Venus is the second planet from the Sun and the hottest planet in our solar system due to its thick atmosphere that traps heat. Often called Earth's sister planet because of their similar size, Venus rotates backwards compared to other planets and has a day longer than its year.",
    'Earth': "Earth is the third planet from the Sun and the only astronomical object known to harbor life. About 71% of Earth's surface is covered with water, making it unique among planets in our solar system. Earth's atmosphere and magnetic field protect life from harmful solar radiation.",
    'Mars': "Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System. Known as the 'Red Planet' due to iron oxide on its surface, Mars has polar ice caps, seasons similar to Earth, and evidence of ancient water flows. It's the most explored planet beyond Earth, with multiple rovers and orbiters studying it.",
    'Jupiter': "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It's a gas giant primarily composed of hydrogen and helium, with no solid surface. Jupiter has a strong magnetic field, at least 79 moons, and its most famous feature is the Great Red Spot, a giant storm that has existed for hundreds of years.",
    'Saturn': "Saturn is the sixth planet from the Sun and is famous for its spectacular ring system. Like Jupiter, it's a gas giant composed mainly of hydrogen and helium. Saturn has at least 82 moons, including Titan, which has its own atmosphere and lakes of liquid methane.",
    'Uranus': "Uranus is the seventh planet from the Sun and the first to be discovered through a telescope. It's an ice giant with a blue-green color due to methane in its atmosphere. Uniquely, Uranus rotates on its side with an axial tilt of about 98 degrees, likely caused by a massive collision in its past.",
    'Neptune': "Neptune is the eighth and farthest known planet from the Sun. It's an ice giant similar to Uranus but with a more vivid blue color. Neptune has the strongest winds in the solar system and was predicted mathematically before it was observed. It has 14 known moons, including Triton, which orbits backwards and is likely a captured dwarf planet."
  };
  
  return generalInfo[planetName] || `General information about ${planetName} is not available.`;
}

module.exports = router;
