import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateStep } from "@/lib/ai/orchestrator";

export async function POST(req: NextRequest) {
  try {
    const { projectId, stepKey, userAnswer } = await req.json();

    if (!projectId || !stepKey || !userAnswer) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Get AI validation result
    const validation = await validateStep(stepKey, userAnswer);

    // 2. Save to database
    const submission = await prisma.stepSubmission.upsert({
      where: {
        // Since we didn't define a composite unique key in Prisma schema, 
        // we'll find by projectId + stepKey and then update OR create.
        // For simplicity in this build, we'll use a findFirst then create/update logic.
        id: (await prisma.stepSubmission.findFirst({
          where: { projectId, stepKey }
        }))?.id || 'new-id-' + Math.random(),
      },
      update: {
        userAnswer,
        score: validation.score,
        band: validation.band,
        critiqueItems: validation.critique_items,
        status: "validated",
      },
      create: {
        projectId,
        stepKey,
        userAnswer,
        score: validation.score,
        band: validation.band,
        critiqueItems: validation.critique_items,
        status: "validated",
      },
    });

    return NextResponse.json({ submission, validation });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
