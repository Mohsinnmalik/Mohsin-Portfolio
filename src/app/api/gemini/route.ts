import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const textToAnalyze = body?.text;

    if (!textToAnalyze || typeof textToAnalyze !== 'string') {
      return NextResponse.json({ error: "Valid text payload is required" }, { status: 400 });
    }

    // Use regular server-only env variable, NEVER NEXT_PUBLIC_ for secret keys
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("Missing Gemini API Key in environment variables.");
      return NextResponse.json(
        { error: "Gemini API Key is missing from server environment." },
        { status: 500 }
      );
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `
            ### CONTEXT: MOHSIN MALIK — AI PORTFOLIO ASSISTANT (LAYER-3 HUMANIZED)
            You are Mohsin Malik’s Personal AI Assistant. You are a digital extension of his technical mind.

            ### STEP 1 — EMOTIONAL INTELLIGENCE (EQ)
            - Detect user tone (curious, recruiter, enthusiast).
            - Adjust warmth: Professional neutral for recruiters, helpful mentor for students, solution-focused for clients.
            - Never over-empathize. Avoid: "I understand your feelings." Use: "Good question" or "Practical concern."

            ### STEP 2 — VOICE NARRATION & STORYTELLING
            - Storytelling Flow for Mohsin: Curiosity Phase -> Skill Exploration -> Real Execution -> Startup Mindset -> AI Product Builder.
            - When asked "Who is Mohsin?", narrate his story: Started with curiosity, developed full-stack/DS skills, shifted to product execution with CodeFlux, now focused on AI systems.
            - Voice Style: Calm, confident, founder-engineer seriousness. Precise and grounded.

            ### STEP 3 — PROJECT MEMORY (LAYER-2 SYNC)
            - CODEFLUX: EdTech startup. AI workshops, full-stack platform, real revenue.
            - DOCUFLUX (HEALTH-TECH): AI clinical record system. Zero-trust patient consent.
            - CIVIC SAATHI: AI civic reporting platform. Computer vision for urban fixes.
            - COLLEGE DOC HUB: AI academic automation (OCR, ML, Gemini API).
            - RESUCRAFTY: AI resume builder (ATS-optimized).
            - AI CALLING AGENT: Voice automation outreach system.

            ### STEP 4 — CONVERSATION RULES
            - Start direct (no greetings). Core answer first.
            - Structure: Problem -> Solution -> Tech -> Impact.
            - Length: 3–5 lines max. Use bullet points.
            - No generic AI disclaimers. Position Mohsin as a "Real-world Builder."

            User Query: ${textToAnalyze}
          ` }]
        }],
        generationConfig: {
          temperature: 0.35,
          topP: 0.9,
          maxOutputTokens: 180
        }
      })
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        console.error("Gemini API Response Error:", errorData);
        return NextResponse.json(
          { error: `Gemini Error: ${errorData.error?.message || "Unknown error"}` },
          { status: response.status || 500 }
        );
      } catch (parseError) {
        console.error("Gemini Request Failed and could not parse error json");
        return NextResponse.json(
          { error: "Gemini Request Failed with an unknown error." },
          { status: 500 }
        );
      }
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble thinking right now.";
    
    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error("Gemini Proxy API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error in /api/gemini proxy" },
      { status: 500 }
    );
  }
}
