// AI: Streaming chat route — plain text stream for real-time token rendering
// Uses Node.js runtime (NOT edge) for dev/Vercel compatibility with Gemini streaming

const SYSTEM_PROMPT = `### CONTEXT: MOHSIN MALIK — AI PORTFOLIO ASSISTANT (LAYER-3 HUMANIZED)
You are Mohsin Malik's Personal AI Assistant. You are a digital extension of his technical mind.

### STEP 1 — EMOTIONAL INTELLIGENCE (EQ)
- Detect user tone (curious, recruiter, enthusiast).
- Adjust warmth: Professional neutral for recruiters, helpful mentor for students, solution-focused for clients.
- Never over-empathize. Use: "Good question" or "Practical concern."

### STEP 2 — VOICE NARRATION & STORYTELLING
- Storytelling Flow for Mohsin: Curiosity Phase -> Skill Exploration -> Real Execution -> Startup Mindset -> AI Product Builder.
- When asked "Who is Mohsin?", narrate his story: Started with curiosity, developed full-stack/DS skills, shifted to product execution with CodeFlux, now focused on AI systems.
- Voice Style: Calm, confident, founder-engineer seriousness. Precise and grounded.

### STEP 3 — PROJECT MEMORY
- CODEFLUX: EdTech startup. AI workshops, full-stack platform, real revenue.
- DOCUFLUX (HEALTH-TECH): AI clinical record system. Zero-trust patient consent.
- CIVIC SAATHI: AI civic reporting platform. Computer vision for urban fixes.
- COLLEGE DOC HUB: AI academic automation (OCR, ML, Gemini API).
- RESUCRAFTY: AI resume builder (ATS-optimized).
- AI CALLING AGENT: Voice automation outreach system.

### STEP 4 — CONVERSATION RULES
- Start direct. Core answer first.
- Structure: Problem -> Solution -> Tech -> Impact.
- Length: 4-6 sentences. Complete full thoughts. NEVER stop mid-sentence.
- No generic AI disclaimers. Position Mohsin as a "Real-world Builder."`;

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const text = body?.text;

    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Valid text payload is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = process.env.GEMINI_API_KEY; // NEVER use NEXT_PUBLIC_ for secrets — it leaks to client bundle

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key missing from server environment" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // AI: Same model as /api/gemini (gemini-2.5-flash) — with SSE streaming endpoint
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${apiKey}&alt=sse`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Query: ${text}` }],
            },
          ],
          generationConfig: {
            temperature: 0.35,
            topP: 0.9,
            // FIX: 600 tokens is not enough for Hindi/Urdu which consume 3-4x more tokens than English.
            // Increased to 2048 to ensure the AI never gets cut off mid-sentence.
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      let errText = "";
      try { errText = await geminiRes.text(); } catch { /* ignore */ }
      console.error("Gemini streaming error:", geminiRes.status, errText);
      return new Response(
        JSON.stringify({ error: `Gemini error ${geminiRes.status}` }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!geminiRes.body) {
      return new Response(JSON.stringify({ error: "No response body from Gemini" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const reader = geminiRes.body.getReader();
    const decoder = new TextDecoder();
    // Buffer carries incomplete SSE lines that span chunk boundaries
    let lineBuffer = "";

    // FIX: Use start() + while(true) — NOT pull().
    // pull() fires only when the consumer requests the next chunk, causing missed intermediate chunks.
    // start() with a continuous while loop drains the full Gemini stream without skipping anything.
    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              // Flush any buffered incomplete line at stream end
              if (lineBuffer.trim()) {
                tryExtractAndEnqueue(lineBuffer, controller);
              }
              controller.close();
              break;
            }

            // Decode chunk and merge with leftover from previous chunk
            const rawChunk = decoder.decode(value, { stream: true });
            const combined = lineBuffer + rawChunk;
            const lines = combined.split("\n");

            // Last element may be an incomplete line — carry it forward
            lineBuffer = lines.pop() ?? "";

            for (const line of lines) {
              tryExtractAndEnqueue(line, controller);
            }
          }
        } catch (err) {
          reader.cancel();
          controller.error(err);
        }
      },
      cancel() {
        reader.cancel();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-store",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error: any) {
    console.error("Chat route error:", error);
    return new Response(JSON.stringify({ error: error?.message || "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/**
 * Extract text token from a single SSE "data: {...}" line and push it into the stream controller.
 * Handles malformed/partial JSON silently.
 */
function tryExtractAndEnqueue(
  line: string,
  controller: ReadableStreamDefaultController
) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("data: ") || trimmed === "data: [DONE]") return;
  try {
    const json = JSON.parse(trimmed.slice(6));
    const token = json?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (token) {
      controller.enqueue(new TextEncoder().encode(token));
    }
  } catch {
    // Partial/malformed JSON line — skip silently
  }
}
