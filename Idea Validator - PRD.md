Product Requirements Document (PRD)
Project Name: AI Co-Founder Idea Validator Version: 1.1 (Final Specification - Includes SWOT & Risk Analysis)Date: April 21, 2026Status: Ready for Development
________________________________________
1. Executive Summary
1.1 Vision
To build a web application that acts as a 30-year experienced business co-founder and strategic intelligence partner. It guides entrepreneurs through a rigorous, step-by-step validation process, combining human intuition (User Input) with objective market intelligence (AI Search).
1.2 Core Value Proposition
•	Self-Validation: Enables founders to stress-test their ideas before revealing them to the public.
•	Investor Prep: Generates a data-backed, rigorous report highlighting strengths, mitigated risks, SWOT analysis, and strategic clarity.
•	Enlightened Autonomy: The app does not "block" the user; it warns them. The user has the final say, allowing them to consciously accept calculated risks.
1.3 Success Metrics
•	Completion Rate: % of users who finish all 7 phases.
•	Risk Awareness: % of users who utilize the "Override" feature, indicating high-stakes decision making.
•	Report Utilization: Frequency of PDF exports (Investor Prep indicator).
________________________________________
2. User Personas
•	The Aspiring Founder: Non-technical or technical individuals with a specific idea who need structure and guidance on where to start.
•	The Product Manager: Individuals looking to streamline the discovery phase and generate a System Requirements Specification (SRS) quickly.
________________________________________
3. Functional Requirements: The Validation Process
The application follows a Linear-but-Flexible progression through 7 Phases (A-G). Each phase follows the "Input -> Process -> Insight -> Decide" loop.
3.1 Interaction Loop (The Core Mechanic)
1.	Input: User answers Socratic questions in their own words (Founder-only data).
2.	Process: App performs Deep Web Search + Logic Scoring.
3.	Insight: App returns a Score (0-100), a Band (Exceptional/Weak), and Critique Items (Risk/Gaps).
4.	Decide:
o	Iterate: User edits answers to improve score.
o	Accept Risk: User locks step despite low score (Marked as "Conscious Risk" in report).
3.2 Phase Specifications
Phase A: Founder Story & Opportunity Detection
•	Input: Personal discovery story, "Unfair Advantage," Risk tolerance (e.g., "Can survive 12 months without salary").
•	AI Action: Sentiment analysis, keyword extraction.
•	Scoring (Max 15): Founder-Fit, Problem-Exposure, Risk-Readiness.
•	Override Logic: User may proceed if they acknowledge their inexperience.
Phase B: Problem, Market & Traction
•	Input: Problem description, Market assumptions, Early signals (LOIs, waitlists).
•	AI Action: Deep Search for Market Size (TAM/SAM/SOM), Competitor pricing.
•	Scoring (Max 25): Problem-Pain, Market-Size Plausibility, Benchmark Alignment.
•	Fallback Logic: If no search data exists (Niche), AI switches to "First Principles" logic.
Phase C: Value Proposition & Differentiation
•	Input: 1-sentence Value Prop, UX vision, Differentiation strategy.
•	AI Action: Competitor UX analysis, Clarity check (Reading level).
•	Scoring (Max 20): Clarity, Unique Edge, UX Coherence.
•	Critical Check: "If competitor X copies you, what stops them?"
Phase D: Business Model & Scalability
•	Input: Pricing model, Cost structure, GTM channels.
•	AI Action: Regulatory scan, LTV/CAC calculation vs. Industry benchmarks.
•	Scoring (Max 20): Pricing Logic, Margin Awareness, Regulatory Risk.
•	Ripple Effect: If pricing changes here, Phase B score must be re-validated.
Phase E: Design & Architecture
•	Input: High-level system vision, Tech stack preference.
•	AI Action: Technical Audit (Scalability check), Security/Privacy scan.
•	Scoring (Max 20): Architecture Realism, Security Awareness.
•	Helper Mode: If user is non-technical, AI uses "Analogy Mode".
Phase F: Go-to-Market & Team
•	Input: MVP Scope, Timeline, Team composition.
•	AI Action: Timeline realism check (Optimism Probe).
•	Scoring (Max 15): Timeline Realism, Resource Sufficiency.
Phase G: Global Strategic Intelligence (SWOT & Risk)
•	Trigger: Runs automatically upon completion of Phases A-F.
•	Input: Aggregated data from all previous steps.
•	AI Action:
1.	Risk Evaluation: Categorizes risks into Market, Financial, Technical, and Team. Assigns probability and impact.
2.	SWOT Analysis: Generates a matrix based on the founder's inputs vs. the market data found.
•	Output: A structured SWOT Grid and Risk Radar Chart data.
•	Scoring: This phase is not scored but serves as a qualitative summary for the final report.
________________________________________
4. System Architecture & Tech Stack
4.1 Tech Stack (The "Serverless AI" Stack)
•	Frontend & Backend: Next.js 14 (App Router). Unified full-stack framework.
•	Database: Neon Tech (PostgreSQL). Serverless, scales-to-zero DB.
•	ORM: Prisma. Database toolkit for type-safe access.
•	UI Library: Shadcn/UI (Radix UI primitives + Tailwind CSS).
•	AI/LLM: OpenAI GPT-4o. (For reasoning, critique, and SWOT generation).
•	Search: Tavily API. (For deep web search and data extraction).
•	Hosting: Vercel. (Free tier compatible).
4.2 Data Flow Diagram
1.	Frontend: User submits text via StepInteraction component.
2.	API Route (/api/validate-step): Receives payload.
3.	Orchestration (Phases A-F):
o	Calls Tavily for Search Results.
o	Formats Context.
o	Calls OpenAI for Scoring.
4.	Database: Writes StepSubmission to Neon via Prisma.
5.	Orchestration (Phase G):
o	User triggers "Generate Report."
o	System fetches all StepSubmissions for the project.
o	Calls OpenAI with full context to generate swotAnalysis and riskEvaluation.
o	Updates Project record with Global Analysis.
6.	Response: Returns JSON to Frontend to render the Final Report.
________________________________________
5. Data Model (Schema)
Entities:
Project
•	id (String, PK)
•	title (String)
•	createdAt (DateTime)
•	New Fields:
o	swotAnalysis (JSON) - { strengths: [], weaknesses: [], opportunities: [], threats: [] }
o	riskEvaluation (JSON) - { market_risks: [], tech_risks: [], team_risks: [] }
•	submissions (Relation)
StepSubmission
•	id (String, PK)
•	projectId (FK)
•	stepKey (String) - e.g., "A.1", "D.1"
•	userAnswer (Text) - The Founder's raw input.
•	searchResults (JSON) - Auto-searched market data.
•	score (Int) - 0-100.
•	band (String) - "Exceptional", "Strong", "Moderate", "Weak", "Poor".
•	critiqueItems (JSON) - Array of { dimension, text, severity }.
•	userOverride (Boolean) - True if user accepted the risk.
•	status (String) - "validated", "risk_accepted".
•	createdAt (DateTime)
________________________________________
6. The AI-Scoring Engine Specification
6.1 Engine Logic
The engine is a hybrid of Rule-Based Logic (for thresholds) and LLM Augmentation (for nuance).
6.2 Scoring Algorithm (Phases A-F)
1.	Input: userAnswer + searchResults.
2.	Dimension Calculation: The AI evaluates specific dimensions on a scale of 0-5.
3.	Aggregation: Dimensions are weighted based on the Phase.
4.	Banding:
o	80–100: Exceptional (Investor Ready)
o	60–79: Strong (Needs refinement)
o	40–59: Moderate (Pivot required)
o	< 40: Weak (Stop/Pivot)
6.3 Global Analysis Algorithm (Phase G)
Input: All StepSubmissions from the Project.AI Prompt Instruction:"Review the full context of this project. Generate:
1.	A SWOT Analysis (4 quadrants) referencing specific inputs.
2.	A Risk Evaluation listing Top 3 risks in categories: Market, Tech, Financial, Team.Assess probability (High/Med/Low) and Impact (High/Med/Low)."
6.4 Output Format
For Step Validation:
{  "score": 85,  "band": "Exceptional",  "critique_items": [    { "dimension": "Market Size", "text": "Assumption is 2x higher than data.", "severity": "high" }  ]}
For Global Analysis (Phase G):
json
{
  "swot": {
    "strengths": ["Founder has 5 yrs domain expertise", "High initial demand signals"],
    "weaknesses": ["No technical co-founder", "Low initial runway"],
    "opportunities": ["Emerging AI technology trends", "Competitors ignoring X segment"],
    "threats": ["Established player Y entering market", "Regulatory changes pending"]
  },
  "risks": [
    { "category": "Financial", "description": "Cash burn rate exceeds projections", "probability": "High", "impact": "Critical" },
    { "category": "Market", "description": "Niche audience size too small", "probability": "Low", "impact": "Medium" }
  ]
}
________________________________________
7. UI/UX Requirements
7.1 The "Coach" Interface (Split View)
•	Left Panel (Input): Large textarea, clear prompts, "Validate Step" CTA.
•	Right Panel (Feedback):
o	Score Card: Large numeric score + Color-coded Band.
o	Insights: Bullet points summarizing market data.
o	Critiques: List of risks/gaps.
o	Risk Override Button: Appears only if Score < 60. "Accept Risk & Proceed."
7.2 Final Report Dashboard
•	Executive Summary: Overall Score + Verdict.
•	SWOT Matrix: A 2x2 grid visualization of Strengths, Weaknesses, Opportunities, Threats.
•	Risk Radar: A visual list of evaluated risks with color-coded severity.
•	The Risk Register: A table of all risks the user consciously "Overrode."
•	Per-Phase Breakdown: Scores and detailed insights.
________________________________________
8. Final Report Generation
8.1 Report Structure
•	Cover Page: Project Title, Date, Overall Verdict (Go/Pivot/Stop).
•	Executive Summary:
o	Overall Score (0-100).
o	3 Strongest Advantages.
o	3 Critical Risks.
•	Strategic Intelligence (New):
o	SWOT Analysis: Detailed matrix.
o	Risk Evaluation: Categorized list of external and internal risks with mitigation suggestions.
•	The "Conscious Risk" Register:
o	Table of all risks the user accepted via the Override feature.
o	Format: "AI Warning: [Risk]. Founder Decision: [Accept Rationale]."
•	Per-Phase Breakdown:
o	Scores, Critiques, and Actionable Insights for A-F.
•	Next Steps: Concrete to-do list based on the final verdict.
8.2 Export Formats
•	PDF (Styled for investors).
•	Markdown (Raw text for editing).
________________________________________
9. Non-Functional Requirements
•	Latency: AI validation (A-F) < 15s. Global Analysis (G) < 30s.
•	Security: User inputs encrypted at rest (Neon). API calls have training=false.
•	Scalability: Serverless architecture handles auto-scaling.
________________________________________
10. Appendix A: Technical Setup (For Developers)
A.1 Initial Commands
bash
npx create-next-app@latest ai-coach --typescript --tailwind --eslint
cd ai-coach
npm install prisma @prisma/client ai openai tavily-sdk
npx shadcn-ui@latest init

A.2 Database Schema (Prisma)
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Project {
  id              String   @id @default(cuid())
  title           String
  createdAt       DateTime @default(now())
  swotAnalysis    Json?    // Stores SWOT object
  riskEvaluation  Json?    // Stores Risk object
  submissions     StepSubmission[]
}

model StepSubmission {
  id              String   @id @default(cuid())
  projectId       String
  stepKey         String   
  userAnswer      String   @db.Text
  searchResults   Json?    
  score           Int      
  band            String   
  critiqueItems   Json?    
  userOverride    Boolean  @default(false) 
  status          String   @default("draft") 
  project         Project  @relation(fields: [projectId], references: [id])
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
} A.3 Environment Variables
•	DATABASE_URL (Neon Connection String)
•	OPENAI_API_KEY
•	TAVILY_API_KEY

