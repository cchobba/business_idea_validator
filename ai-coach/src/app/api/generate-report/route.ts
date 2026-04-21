import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateGlobalAnalysis } from "@/lib/ai/orchestrator";

export async function POST(req: NextRequest) {
  try {
    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    }

    // 1. Fetch all submissions for the project
    const submissions = await prisma.stepSubmission.findMany({
      where: { projectId },
    });

    if (submissions.length === 0) {
      return NextResponse.json({ error: "No submissions found for this project" }, { status: 404 });
    }

    // 2. Generate Global Strategic Analysis (SWOT & Risk)
    const analysis = await generateGlobalAnalysis(submissions);

    // 3. Update project with the analysis
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        swotAnalysis: analysis.swot,
        riskEvaluation: analysis.risks,
      },
    });

    return NextResponse.json({ project: updatedProject, analysis });
  } catch (error: any) {
    console.error("Report Generation Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
