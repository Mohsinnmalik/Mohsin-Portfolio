import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const text = body?.text;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: "Valid text payload is required" }, { status: 400 });
    }

    const voiceId = process.env.NEXT_PUBLIC_VOICE_ID;
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!voiceId || !apiKey) {
      console.error("Missing ElevenLabs API Keys logic in environment variables.");
      return NextResponse.json(
        { error: "ElevenLabs API Key or Voice ID is missing from server environment." },
        { status: 500 }
      );
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        }
      }),
    });

    if (!response.ok) {
      try {
        const errorText = await response.text();
        console.error("ElevenLabs API Response Error:", errorText);
        return NextResponse.json(
          { error: `ElevenLabs Error: ${errorText}` },
          { status: response.status || 500 }
        );
      } catch (parseError) {
        console.error("ElevenLabs Request Failed and could not parse error text");
        return NextResponse.json(
          { error: "ElevenLabs Request Failed with an unknown error." },
          { status: 500 }
        );
      }
    }

    // Return the audio stream directly to the client
    const audioBuffer = await response.arrayBuffer();
    
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });

  } catch (error: any) {
    console.error("ElevenLabs Proxy API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error in /api/speak proxy" },
      { status: 500 }
    );
  }
}
