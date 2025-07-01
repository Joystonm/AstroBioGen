# AstroBioGen – AI-Powered Genetic Insight Explorer for Space Biology

AstroBioGen is an interactive platform that lets users explore real NASA space biology experiments and visualize gene expression data affected by microgravity and radiation. By combining open genetic datasets from NASA GeneLab with powerful AI tools (Groq + Tavily), it helps users understand how space alters life at the molecular level — and what it means for medicine back on Earth.

## How to Run the Application

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/AstroBioGen.git
cd AstroBioGen/astrobiogen
```

2. Install dependencies:
```
npm run install-all
```

3. Set up environment variables:
   - Create a `.env` file in the server directory based on `.env.example`
   - Add your API keys for Groq and Tavily (optional - mock data will be used if not provided)

### Running the Application

1. Start both client and server:
```
npm run dev
```

2. Or start them separately:
   - Client only: `npm run client`
   - Server only: `npm run server`

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

## What Problem Does It Solve?

NASA conducts critical biological experiments on the ISS, but the results — stored in GeneLab — are too complex for the public, students, or even non-specialist scientists. Valuable insights remain hidden due to raw CSVs, scattered metadata, and steep learning curves.

AstroBioGen solves this by:
- Making gene expression data visual and intuitive
- Using AI to explain complex biological effects in plain language
- Showing Earth-side implications of space experiments

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js + Tailwind CSS + GSAP |
| Backend | Node.js + Express |
| APIs | NASA GeneLab API, Skyfield, Celestrak, SpaceX API, NASA Open APIs, Open-Meteo API |
| AI Tools | Groq (explain genes), Tavily (research assistant) |
| Visualization | Chart.js + D3.js for gene expression |

## Key Features

- Gene expression heatmaps and charts
- Groq-powered biological explanations
- Tavily-powered Earth-medical relevance
- Interactive experiment metadata viewer
- Orbit visualization of experiment missions
- Educational mode for biology learners
