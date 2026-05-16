async function test() {
  const voiceId = "ErXwobaYiN019PkySvjV"; // Antoni
  const apiKey = "sk_6b4504bc45a2749e2735c803a330ee2bd7ce951d7f31a25f";

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text: "नमस्ते! मेरा नाम मोहसिन है। मैं एक डेवलपर हूँ। Hello! My name is Mohsin.",
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("ElevenLabs API Response Error:", response.status, errorText);
  } else {
    console.log("Success! Audio length:", (await response.arrayBuffer()).byteLength);
  }
}

test();
