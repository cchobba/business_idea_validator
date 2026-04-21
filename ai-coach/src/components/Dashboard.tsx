"use client";

import React, { useState } from "react";
import { 
  Search, 
  BrainCircuit, 
  BarChart3, 
  ShieldAlert, 
  Layers, 
  Rocket, 
  UserCircle,
  TrendingUp,
  ChevronRight,
  CheckCircle2,
  Circle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StepInteraction } from "./StepInteraction";

const PHASES = [
  { id: "A", name: "Founder Fit", icon: UserCircle },
  { id: "B", name: "Market & Traction", icon: TrendingUp },
  { id: "C", name: "Value Prop", icon: Search },
  { id: "D", name: "Business Model", icon: BarChart3 },
  { id: "E", name: "Architecture", icon: Layers },
  { id: "F", name: "GTM & Team", icon: Rocket },
  { id: "G", name: "Strategic Intelligence", icon: BrainCircuit },
];

export function Dashboard() {
  const [activePhase, setActivePhase] = useState("A");
  const [completedPhases, setCompletedPhases] = useState<string[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);

  const handlePhaseComplete = (phaseId: string) => {
    if (!completedPhases.includes(phaseId)) {
      const updated = [...completedPhases, phaseId];
      setCompletedPhases(updated);
      setOverallProgress((updated.length / (PHASES.length - 1)) * 100);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#09090b] text-zinc-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 border-r border-zinc-800 bg-[#09090b] flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-2 mb-4">
            <BrainCircuit className="w-8 h-8 text-indigo-500" />
            <span className="text-xl font-bold tracking-tight">AI Co-Founder</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-400 mb-1">
              <span>Validation Progress</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-1 bg-zinc-800" />
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <nav className="space-y-1">
            {PHASES.map((phase) => {
              const isActive = activePhase === phase.id;
              const isCompleted = completedPhases.includes(phase.id);
              const Icon = phase.icon;

              return (
                <button
                  key={phase.id}
                  onClick={() => setActivePhase(phase.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-md transition-all group",
                    isActive ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("w-4 h-4", isActive ? "text-indigo-400" : "text-zinc-500")} />
                    <span className="text-sm font-medium">{phase.name}</span>
                  </div>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <ChevronRight className={cn("w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity", isActive && "opacity-100")} />
                  )}
                </button>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold">
              FM
            </div>
            <div>
              <p className="text-sm font-medium">Future Founder</p>
              <p className="text-xs text-zinc-500">Free Account</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-[#09090b]">
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-[#09090b]/50 backdrop-blur-sm sticky top-0 z-10">
          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-widest">
            Phase {activePhase}: {PHASES.find(p => p.id === activePhase)?.name}
          </h2>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="border-zinc-800 hover:bg-zinc-900 text-xs">
              Save Draft
            </Button>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs font-medium">
              Export Report
            </Button>
          </div>
        </header>

        <ScrollArea className="flex-1">
          <div className="p-8 max-w-5xl mx-auto w-full">
            <StepInteraction 
              phaseId={activePhase} 
              onComplete={() => handlePhaseComplete(activePhase)} 
            />
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
