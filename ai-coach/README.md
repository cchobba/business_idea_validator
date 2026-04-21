# AI Co-Founder Idea Validator

A high-intelligence business validation tool powered by Google Gemini 1.5 Flash and Tavily Search.

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in this directory and add the following:
```env
DATABASE_URL="your-neon-postgres-url"
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"
TAVILY_API_KEY="your-tavily-api-key"
```

### 2. Database Initialization
Since `npx` may have issues on this system, use the following command to push the schema to your Neon database:
```bash
node node_modules/prisma/build/index.js db push
```

### 3. Run Development Server
```bash
npm run dev
```

## Features
- **7-Phase Validation Loop**: From Founder-Fit to Strategic Intelligence.
- **Deep Web Search**: Real-time market data extraction via Tavily.
- **AI Scrutiny Engine**: Strategic critique and scoring (0-100) via Gemini 1.5 Flash.
- **Conscious Risk Logging**: Accept identified risks to proceed and include them in the final report.
- **Dark Strategic UI**: A professional, data-dense interface built with Shadcn/UI.
