# Implementation Plan: AI Co-Founder Idea Validator

This plan outlines the full development cycle to transform the PRD documentation into a functional "Dark Strategic" AI-powered web application.

## 1. Project Initialization & Foundation
- [ ] Create `/app` subfolder and initialize Next.js 14 (App Router, TypeScript, Tailwind).
- [ ] Install core dependencies: `prisma`, `@prisma/client`, `@google/generative-ai`, `tavily-sdk`, `lucide-react`, `clsx`, `tailwind-merge`.
- [ ] Initialize **Shadcn/UI** and configure a "Dark Strategic" theme (Slate/Zinc palette with primary blue/indigo accents).
- [ ] Set up `.env` file template for `DATABASE_URL`, `GOOGLE_GENERATIVE_AI_API_KEY`, and `TAVILY_API_KEY`.

## 2. Database & Data Modeling
- [ ] Define `schema.prisma`:
    - `Project`: Stores the overall idea metadata, SWOT, and Risk evaluations.
    - `StepSubmission`: Stores answers, AI scores, Tavily search results, and "Conscious Risk" overrides for each of the 7 phases.
- [ ] Push schema to **Neon Tech** and generate Prisma Client.

## 3. The "Intelligence Engine" (Core Logic)
- [ ] Create `lib/ai/orchestrator.ts`:
    - **Tavily Integration**: Function to perform deep web searches based on user answers.
    - **Gemini Scrutiny**: A specialized prompt engine using **Google Gemini 1.5 Flash** that takes user input + search results to generate a structured 0-100 score and critique.
    - **Scoring Logic**: Implements the dimension-based weights defined in the PRD.
- [ ] Create API Route `/api/validate-step`: The main endpoint for processing phase inputs.

## 4. UI/UX: The Coach Interface
- [ ] **Main Layout**: Sidebar navigation tracking the 7-phase progress (A-G) with status indicators (e.g., "Validated", "Risk Accepted", "Pending").
- [ ] **Step Component**: 
    - Left Panel: Socratic question input.
    - Right Panel: Real-time feedback showing Score, Band (Exceptional to Poor), AI Insights, and the "Accept Risk" override button.
- [ ] **Animation**: Use subtle transitions to indicate "AI Thinking" during Tavily/OpenAI processing.

## 5. Phase Implementation (A through F)
- [ ] Implement specific UI and prompts for:
    - **A: Founder Fit**
    - **B: Market & Traction**
    - **C: Value Prop**
    - **D: Business Model**
    - **E: Architecture**
    - **F: GTM & Team**

## 6. Phase G: Strategic Intelligence & Report
- [ ] Build the **Global Aggregator**: An API route that reads all previous steps and generates the final SWOT matrix and Risk Radar.
- [ ] **Final Dashboard**:
    - Interactive 2x2 SWOT Grid.
    - Risk Radar visualization (Severity/Probability).
    - "Conscious Risk Register" (Summary of all overrides).
- [ ] **Export**: Implement "Download as PDF/Markdown" feature.

## 7. Verification & Testing
- [ ] **Benchmarking**: Test the AI engine with a "Weak" idea and a "Strong" idea to ensure scoring accuracy.
- [ ] **Flow Test**: Ensure "Risk Overrides" correctly propagate to the final report.
- [ ] **Mobile Responsiveness**: Ensure the dashboard is usable on tablets/laptops.
