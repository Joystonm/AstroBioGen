const axios = require('axios');

// Groq API configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Get AI explanation for gene expression data
 * @param {Array} genes - Array of gene objects with expression data
 * @param {Object} experimentMetadata - Metadata about the experiment
 * @returns {Promise<string>} - AI-generated explanation
 */
async function explainGeneExpression(genes, experimentMetadata) {
  try {
    // Validate inputs
    if (!genes || !Array.isArray(genes)) {
      console.warn('Invalid genes data provided to explainGeneExpression');
      throw new Error('Invalid input data');
    }
    
    if (!experimentMetadata || typeof experimentMetadata !== 'object') {
      console.warn('Invalid experimentMetadata provided to explainGeneExpression');
      throw new Error('Invalid input data');
    }
    
    // Create a prompt for Groq to explain the gene expression data
    const prompt = createGeneExpressionPrompt(genes, experimentMetadata);
    
    // Call Groq API
    const response = await callGroqAPI(prompt);
    
    return {
      explanation: response
    };
  } catch (error) {
    console.error('Error getting gene explanation from Groq:', error);
    throw error;
  }
}

/**
 * Get AI explanation of space environment effects
 * @param {Object} experimentMetadata - Metadata about the experiment
 * @param {Object} geneChanges - Summary of gene expression changes
 * @returns {Promise<string>} - AI-generated explanation
 */
async function explainSpaceEffects(experimentMetadata, geneChanges) {
  try {
    // Validate inputs
    if (!experimentMetadata || typeof experimentMetadata !== 'object') {
      console.warn('Invalid experimentMetadata provided to explainSpaceEffects');
      throw new Error('Invalid input data');
    }
    
    if (!geneChanges || typeof geneChanges !== 'object') {
      console.warn('Invalid geneChanges provided to explainSpaceEffects');
      throw new Error('Invalid input data');
    }
    
    // Create a prompt for Groq to explain space environment effects
    const prompt = createSpaceEffectsPrompt(experimentMetadata, geneChanges);
    
    // Call Groq API
    const response = await callGroqAPI(prompt);
    
    return response;
  } catch (error) {
    console.error('Error getting space effects explanation from Groq:', error);
    throw error;
  }
}

/**
 * Generate facts about a planet using Groq
 * @param {string} planetName - Name of the planet
 * @returns {Promise<Array>} - Array of planet facts
 */
async function generatePlanetFacts(planetName) {
  try {
    const prompt = `
Generate 5 interesting and educational facts about the planet ${planetName}. 
These facts should be accurate, concise, and suitable for a student learning about the solar system.
Format the response as a simple array of facts, with each fact being 1-2 sentences long.
Do not include any markdown formatting, numbering, or bullet points.
`;

    const response = await callGroqAPI(prompt);
    
    // Parse the response into an array of facts
    const facts = response
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^\d+\.\s*/, '').trim()) // Remove any numbering
      .slice(0, 5); // Ensure we have at most 5 facts
    
    return facts;
  } catch (error) {
    console.error('Error generating planet facts:', error);
    
    // Return fallback facts based on the planet
    const fallbackFacts = {
      'Mercury': [
        "Mercury is the smallest planet in our solar system and the closest to the Sun.",
        "A day on Mercury (sunrise to sunrise) lasts 176 Earth days, while its year is only 88 Earth days.",
        "Mercury's surface resembles our Moon with craters and ancient lava flows.",
        "Despite being closest to the Sun, Mercury is not the hottest planet—Venus is hotter due to its thick atmosphere.",
        "Mercury has a thin atmosphere and experiences extreme temperature variations."
      ],
      'Venus': [
        "Venus is the hottest planet in our solar system with a surface temperature of about 462°C (864°F).",
        "Venus rotates backwards compared to other planets, so on Venus, the Sun rises in the west and sets in the east.",
        "A day on Venus is longer than its year—it takes 243 Earth days to rotate once but only 225 Earth days to orbit the Sun.",
        "Venus has a thick atmosphere composed mainly of carbon dioxide, creating an intense greenhouse effect.",
        "Venus is often called Earth's sister planet because of their similar size and proximity in the solar system."
      ],
      'Earth': [
        "Earth is the only planet known to harbor life and the only one with liquid water on its surface.",
        "Earth's atmosphere is composed primarily of nitrogen (78%) and oxygen (21%).",
        "About 71% of Earth's surface is covered with water, making it appear blue from space.",
        "Earth has a strong magnetic field that protects us from harmful solar radiation.",
        "Earth is the only planet not named after a god or goddess in Roman or Greek mythology."
      ],
      'Mars': [
        "Mars is known as the 'Red Planet' due to iron oxide (rust) on its surface.",
        "Mars has the largest volcano in the solar system, Olympus Mons, which is about three times the height of Mount Everest.",
        "Mars has two small moons, Phobos and Deimos, which may be captured asteroids.",
        "Mars experiences seasons similar to Earth because of its similar axial tilt.",
        "Evidence suggests that Mars once had liquid water on its surface and could have supported life."
      ],
      'Jupiter': [
        "Jupiter is the largest planet in our solar system, with a mass more than twice that of all other planets combined.",
        "Jupiter's Great Red Spot is a giant storm that has been raging for at least 400 years.",
        "Jupiter has at least 79 moons, including the four large Galilean moons discovered by Galileo Galilei.",
        "Jupiter is primarily composed of hydrogen and helium, similar to the composition of the Sun.",
        "Jupiter has the shortest day of all the planets, rotating once every 10 hours despite its enormous size."
      ],
      'Saturn': [
        "Saturn is famous for its spectacular ring system, which is made mostly of ice particles with some rocky debris.",
        "Saturn has at least 82 moons, with Titan being the largest and the only moon in our solar system with a substantial atmosphere.",
        "Saturn is the least dense planet in our solar system—it would float if placed in water.",
        "Saturn's rings extend up to 282,000 km from the planet but are only about 10 meters thick.",
        "Saturn's hexagonal cloud pattern at its north pole is a unique feature not found on any other planet."
      ],
      'Uranus': [
        "Uranus rotates on its side with an axial tilt of about 98 degrees, likely due to a massive collision in its past.",
        "Uranus is an ice giant composed primarily of water, methane, and ammonia ices.",
        "Uranus appears blue-green due to methane in its atmosphere, which absorbs red light and reflects blue light.",
        "Uranus has 13 known rings, which are much fainter than Saturn's.",
        "Uranus was the first planet discovered using a telescope, by William Herschel in 1781."
      ],
      'Neptune': [
        "Neptune has the strongest winds in the solar system, reaching speeds of up to 2,100 km/h (1,300 mph).",
        "Neptune was mathematically predicted to exist before it was actually observed, based on irregularities in Uranus's orbit.",
        "Neptune has a Great Dark Spot, similar to Jupiter's Great Red Spot, which is a storm system in its atmosphere.",
        "Neptune's moon Triton orbits the planet backwards (retrograde) and is likely a captured dwarf planet from the Kuiper Belt.",
        "Neptune has only been visited by one spacecraft, Voyager 2, which flew by in 1989."
      ],
      'Pluto': [
        "Pluto was reclassified from a planet to a dwarf planet in 2006 by the International Astronomical Union.",
        "Pluto has five known moons, with Charon being the largest and nearly half the size of Pluto itself.",
        "Pluto's orbit is highly elliptical and inclined, sometimes bringing it closer to the Sun than Neptune.",
        "Pluto has a heart-shaped region called Tombaugh Regio, named after its discoverer Clyde Tombaugh.",
        "NASA's New Horizons spacecraft provided the first close-up images of Pluto in 2015, revealing mountains and glaciers."
      ]
    };
    
    return fallbackFacts[planetName] || [
      `${planetName} is one of the celestial bodies in our solar system.`,
      `Scientists continue to study ${planetName} to learn more about its unique characteristics.`,
      `${planetName} has its own distinct features that make it different from other planets.`,
      `${planetName} follows its own orbit around the Sun.`,
      `${planetName} has been observed by astronomers for centuries.`
    ];
  }
}

/**
 * Generate quiz questions using Groq
 * @param {Array} planets - Array of planets the user has visited
 * @param {Array} facts - Array of facts the user has seen
 * @param {number} questionCount - Number of questions to generate
 * @returns {Promise<Array>} - Array of quiz questions
 */
async function generateQuizQuestions(planets, facts, questionCount) {
  try {
    const planetNames = planets.map(p => p.name).join(', ');
    const factsText = facts.join('\n');
    
    const prompt = `
Generate ${questionCount} multiple-choice quiz questions about the solar system, focusing on these planets: ${planetNames}.
Base the questions on these facts that the user has learned:

${factsText}

Each question should have 4 options with only one correct answer.
Format the response as a JSON array of objects, where each object has:
- "question": the question text
- "options": an array of 4 possible answers
- "correctAnswer": the correct answer (which must be one of the options)

Make sure the questions are educational, accurate, and appropriate for students learning about the solar system.
`;

    const response = await callGroqAPI(prompt);
    
    // Try to parse the response as JSON
    try {
      // First, try to extract JSON if it's wrapped in markdown code blocks
      const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const jsonText = jsonMatch ? jsonMatch[1] : response;
      
      // Parse the JSON
      const questions = JSON.parse(jsonText);
      return questions.slice(0, questionCount);
    } catch (parseError) {
      console.error('Error parsing quiz questions JSON:', parseError);
      
      // Return fallback questions
      return [
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
        }
      ].slice(0, questionCount);
    }
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    
    // Return fallback questions
    return [
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
      }
    ].slice(0, questionCount);
  }
}

/**
 * Create a prompt for explaining gene expression data
 * @param {Array} genes - Array of gene objects with expression data
 * @param {Object} experimentMetadata - Metadata about the experiment
 * @returns {string} - Formatted prompt for Groq
 */
function createGeneExpressionPrompt(genes, experimentMetadata) {
  // Handle missing or incomplete experimentMetadata
  const metadata = experimentMetadata || {};
  const title = metadata.title || 'Unknown Experiment';
  const organism = metadata.organism || 'Unknown Organism';
  const tissue = metadata.tissue || 'Unknown Tissue';
  const mission = metadata.mission || 'Unknown Mission';
  const duration = metadata.duration || 'Unknown Duration';

  // Extract the top 5 upregulated and downregulated genes
  const upregulatedGenes = genes
    .filter(gene => gene.fold_change > 0)
    .sort((a, b) => b.fold_change - a.fold_change)
    .slice(0, 5);
    
  const downregulatedGenes = genes
    .filter(gene => gene.fold_change < 0)
    .sort((a, b) => a.fold_change - b.fold_change)
    .slice(0, 5);
  
  // Format the gene data for the prompt
  const formatGene = gene => {
    const geneSymbol = gene.gene_symbol || 'Unknown';
    const geneName = gene.gene_name || 'Unknown';
    const foldChange = typeof gene.fold_change === 'number' ? gene.fold_change.toFixed(2) : 'Unknown';
    const pValue = gene.p_value || 'Unknown';
    const geneFunction = gene.function || 'Unknown function';
    
    return `${geneSymbol} (${geneName}): ${foldChange} fold change, p-value: ${pValue}. Function: ${geneFunction}`;
  };
  
  const upregulatedText = upregulatedGenes.length > 0 
    ? upregulatedGenes.map(formatGene).join('\n')
    : 'No significantly upregulated genes found';
    
  const downregulatedText = downregulatedGenes.length > 0
    ? downregulatedGenes.map(formatGene).join('\n')
    : 'No significantly downregulated genes found';
  
  // Create the prompt
  return `
You are a space biology expert explaining gene expression changes in a space experiment to a scientifically literate audience.

Experiment details:
- Title: ${title}
- Organism: ${organism}
- Tissue: ${tissue}
- Mission: ${mission}
- Duration: ${duration}

Top upregulated genes (increased expression in space):
${upregulatedText}

Top downregulated genes (decreased expression in space):
${downregulatedText}

Please provide:
1. A clear explanation of what these gene expression changes mean biologically
2. How microgravity and/or space radiation likely caused these changes
3. What cellular pathways or processes are most affected
4. The potential physiological impact on the organism

Format your response as plain text without markdown formatting or headers. Use clear paragraphs with proper spacing. Do not use bold, italics, or other formatting. Do not include section headers or titles in your response.

Keep your explanation scientifically accurate but accessible to someone with basic biology knowledge. Use about 250-300 words.
`;
}

/**
 * Create a prompt for explaining space environment effects
 * @param {Object} experimentMetadata - Metadata about the experiment
 * @param {Object} geneChanges - Summary of gene expression changes
 * @returns {string} - Formatted prompt for Groq
 */
function createSpaceEffectsPrompt(experimentMetadata, geneChanges) {
  // Handle missing or incomplete experimentMetadata
  const metadata = experimentMetadata || {};
  const title = metadata.title || 'Unknown Experiment';
  const organism = metadata.organism || 'Unknown Organism';
  const tissue = metadata.tissue || 'Unknown Tissue';
  const mission = metadata.mission || 'Unknown Mission';
  const duration = metadata.duration || 'Unknown Duration';
  
  // Handle missing or incomplete geneChanges
  const changes = geneChanges || {};
  const upregulated = changes.upregulated || 'Unknown number of';
  const downregulated = changes.downregulated || 'Unknown number of';
  const topPathways = Array.isArray(changes.topPathways) ? changes.topPathways.join(', ') : 'Unknown pathways';

  return `
You are a space biology expert explaining how the space environment affects living organisms at the molecular level.

Experiment details:
- Title: ${title}
- Organism: ${organism}
- Tissue: ${tissue}
- Mission: ${mission}
- Duration: ${duration}

Gene expression changes summary:
- ${upregulated} genes significantly upregulated
- ${downregulated} genes significantly downregulated
- Top affected pathways: ${topPathways}

Please explain:
1. How microgravity specifically affects cells and tissues in this experiment
2. How space radiation may have contributed to these changes
3. Why these particular biological pathways are sensitive to the space environment
4. How these molecular changes connect to known physiological effects of spaceflight

Format your response as plain text without markdown formatting or headers. Use clear paragraphs with proper spacing. Do not use bold, italics, or other formatting. Do not include section headers or titles in your response.

Keep your explanation scientifically accurate but accessible to someone with basic biology knowledge. Use about 250-300 words.
`;
}

/**
 * Call the Groq API with a prompt
 * @param {string} prompt - The prompt to send to Groq
 * @returns {Promise<string>} - The response from Groq
 */
async function callGroqAPI(prompt) {
  try {
    // Check if API key is available
    if (!GROQ_API_KEY) {
      console.warn('Groq API key not found.');
      throw new Error('Groq API key not found');
    }
    
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful space biology expert that explains complex genetic concepts clearly and accurately. Format your response as plain text without markdown formatting or headers. Use clear paragraphs with proper spacing. Do not use bold, italics, or other formatting. Do not include section headers or titles in your response.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 800
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
    
    // Fix spacing issues
    content = content.replace(/\n{3,}/g, '\n\n'); // Replace multiple newlines with double newlines
    
    return content;
  } catch (error) {
    console.error('Error calling Groq API:', error);
    throw error;
  }
}

module.exports = {
  explainGeneExpression,
  explainSpaceEffects,
  generatePlanetFacts,
  generateQuizQuestions
};
