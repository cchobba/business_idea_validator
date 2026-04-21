"use client";

import React, { useState } from "react";
import { Send, AlertTriangle, CheckCircle2, Info, Loader2, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StepInteractionProps {
  phaseId: string;
  onComplete: () => void;
}

const QUESTIONS: Record<string, string> = {
  A: "Describe your personal discovery story. Why are you the right person to build this? What is your 'Unfair Advantage' and risk tolerance?",
  B: "What is the core problem you're solving? Describe your target market assumptions and any early traction signals (waitlists, LOIs, etc.).",
  C: "What is your 1-sentence Value Proposition? How is your solution fundamentally different from competitors? Describe your UX vision.",
  D: "What is your pricing model and cost structure? How do you plan to acquire users (GTM channels)? How does this scale?",
  E: "What is your high-level system vision? What tech stack do you prefer, and why? How will you handle security and scalability?",
  F: "What is the MVP scope? What is your target timeline for launch? Describe your current or planned team composition.",
  G: "Review your Strategic Intelligence Report below. This analysis is generated based on all your previous inputs.",
};

export function StepInteraction({ phaseId, onComplete }: StepInteractionProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleValidate = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/validate-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: "default-project", // For MVP, we use a single project
          stepKey: phaseId,
          userAnswer: input,
        }),
      });

      const data = await response.json();
      if (data.validation) {
        setResult(data.validation);
        if (data.validation.score >= 60) {
          onComplete();
        }
      }
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (phaseId === "G") {
    return (
      <div className="space-y-6">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xl">Global Strategic Report</CardTitle>
            <CardDescription>Comprehensive SWOT & Risk Analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-400">Analysis will be generated here once all phases are completed.</p>
            <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700">Generate Full Report</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Input Side */}
      <div className="space-y-6">
        <div className="space-y-4">
          <label className="text-lg font-semibold text-zinc-200">
            {QUESTIONS[phaseId]}
          </label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer here..."
            className="min-h-[300px] bg-zinc-900/50 border-zinc-800 text-zinc-100 focus:ring-indigo-500"
          />
          <Button 
            onClick={handleValidate} 
            disabled={loading || !input.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-sm font-bold"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                AI Scrutiny in Progress...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Validate Phase
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Feedback Side */}
      <div className="space-y-6">
        {result ? (
          <Card className="bg-zinc-900 border-zinc-800 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-widest">AI Verdict</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    "text-3xl font-bold",
                    result.score >= 80 ? "text-emerald-500" : 
                    result.score >= 60 ? "text-amber-500" : "text-rose-500"
                  )}>
                    {result.score}
                  </span>
                  <Badge variant="outline" className={cn(
                    "bg-zinc-800 border-none",
                    result.band === "Exceptional" ? "text-emerald-400" :
                    result.band === "Strong" ? "text-amber-400" : "text-rose-400"
                  )}>
                    {result.band}
                  </Badge>
                </div>
              </div>
              {result.score >= 80 ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-amber-500" />
              )}
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                  <Info className="w-3 h-3" /> Critical Critique
                </h4>
                <ul className="space-y-3">
                  {result.critique_items.map((item: any, idx: number) => (
                    <li key={idx} className="bg-zinc-800/50 p-3 rounded-md border-l-2 border-indigo-500">
                      <p className="text-xs font-bold text-indigo-400 mb-1">{item.dimension}</p>
                      <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                   Market Insights
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.insights.map((insight: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="bg-zinc-800 text-zinc-400 font-normal">
                      {insight}
                    </Badge>
                  ))}
                </div>
              </div>

              {result.score < 60 && (
                <div className="pt-4 border-t border-zinc-800">
                   <Button variant="ghost" className="w-full text-rose-400 hover:text-rose-300 hover:bg-rose-900/20 text-xs">
                    Accept Risk & Proceed Anyway
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-zinc-800 rounded-xl">
             <BrainCircuit className="w-12 h-12 text-zinc-700 mb-4" />
             <p className="text-zinc-500 font-medium">Waiting for input...</p>
             <p className="text-xs text-zinc-600 mt-2 max-w-xs">
               Provide your answer on the left to trigger the AI Co-Founder's scrutiny engine.
             </p>
          </div>
        )}
      </div>
    </div>
  );
}
