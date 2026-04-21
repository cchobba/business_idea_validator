import { GoogleGenerativeAI } from "@google/generative-ai";
import { tavily } from "@tavily/core";

// Initialize APIs
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY || "" });

export interface ValidationResponse {
  score: number;
  band: "Exceptional" | "Strong" | "Moderate" | "Weak" | "Poor";
  critique_items: Array<{
    dimension: string;
    text: string;
    severity: "low" | "medium" | "high";
  }>;
  insights: string[];
}

export async function validateStep(stepKey: string, userAnswer: string): Promise<ValidationResponse> {
  // 1. Perform Tavily Search for context
  const searchResults = await tvly.search(userAnswer, {
    searchDepth: "advanced",
    maxResults: 5,
  });

  const searchContext = searchResults.results
    .map((r) => `Source: ${r.url}\nTitle: ${r.title}\nContent: ${r.content}`)
    .join("\n\n");

  // 2. Prepare Gemini Prompt
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    You are an AI Co-Founder and Strategic Intelligence Partner with 30 years of business experience.
    Your task is to validate a specific phase of a business idea.

    PHASE: ${stepKey}
    USER INPUT: "${userAnswer}"
    
    MARKET CONTEXT (from web search):
    ${searchContext}

    CRITERIA FOR THIS PHASE:
    - Phase A: Founder-Fit, Problem-Exposure, Risk-Readiness.
    - Phase B: Problem-Pain, Market-Size Plausibility, Benchmark Alignment.
    - Phase C: Clarity, Unique Edge, UX Coherence.
    - Phase D: Pricing Logic, Margin Awareness, Regulatory Risk.
    - Phase E: Architecture Realism, Security Awareness.
    - Phase F: Timeline Realism, Resource Sufficiency.

    SCORING LOGIC:
    - 80–100: Exceptional (Investor Ready)
    - 60–79: Strong (Needs refinement)
    - 40–59: Moderate (Pivot required)
    - < 40: Weak (Stop/Pivot)

    Provide your response in strict JSON format:
    {
      "score": number,
      "band": "Exceptional" | "Strong" | "Moderate" | "Weak" | "Poor",
      "critique_items": [
        { "dimension": "string", "text": "string", "severity": "low" | "medium" | "high" }
      ],
      "insights": ["string"]
    }
  `;

  // 3. Call Gemini
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Clean JSON response (sometimes Gemini adds markdown blocks)
  const jsonText = text.replace(/```json|```/g, "").trim();
  
  try {
    return JSON.parse(jsonText);
  } catch (e) {
    console.error("Failed to parse AI response:", text);
    throw new Error("Invalid AI response format");
  }
}

export async function generateGlobalAnalysis(allSubmissions: any[]) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const context = allSubmissions
    .map((s) => `Phase ${s.stepKey}: ${s.userAnswer}\nAI Score: ${s.score}\nCritique: ${JSON.stringify(s.critiqueItems)}`)
    .join("\n\n---\n\n");

  const prompt = `
    Review the full context of this business project based on all 6 validation phases.
    Generate a SWOT Analysis and a Risk Evaluation.

    CONTEXT:
    ${context}

    Provide your response in strict JSON format:
    {
      "swot": {
        "strengths": ["string"],
        "weaknesses": ["string"],
        "opportunities": ["string"],
        "threats": ["string"]
      },
      "risks": [
        { "category": "Financial" | "Market" | "Tech" | "Team", "description": "string", "probability": "High" | "Med" | "Low", "impact": "Critical" | "High" | "Med" | "Low" }
      ]
    }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  const jsonText = text.replace(/```json|```/g, "").trim();
  
  try {
    return JSON.parse(jsonText);
  } catch (e) {
    console.error("Failed to parse Global AI response:", text);
    throw new Error("Invalid Global AI response format");
  }
}
