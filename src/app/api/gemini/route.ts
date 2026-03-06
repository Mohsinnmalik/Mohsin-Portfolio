import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const textToAnalyze = body?.text;

    if (!textToAnalyze || typeof textToAnalyze !== 'string') {
      return NextResponse.json({ error: "Valid text payload is required" }, { status: 400 });
    }

    // Use regular server-only env variable, NEVER NEXT_PUBLIC_ for secret keys
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

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
          parts: [{ text: `You are Mohsin, the Founder of CodeFlux. Respond concisely (under 3 sentences) to: ${textToAnalyze}` }]
        }]
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
