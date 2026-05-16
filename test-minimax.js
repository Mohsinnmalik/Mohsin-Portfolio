async function test() {
  const apiKey = "sk-api-kVo1yFGXZr61txCbW3tZ4JHrUwLRzkNC3MJRz_kPPJ51S7DRofxv-3WARvEm5OIglbcp3pPyIhOQgxlHeVEkD6pWfGhZ7mu9CWWzWwkLrShhHA0fzX3qkDg";
  const groupId = "2052759947191525571";

  const response = await fetch(`https://api.minimax.io/v1/t2a_v2?GroupId=${groupId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "speech-01-turbo",
      text: "Hello world, this is MiniMax API testing on the international endpoint!",
      stream: false,
      voice_setting: {
        voice_id: "male-qn-qingse", // Popular male voice
        speed: 1.0,
        vol: 1.0,
        pitch: 0
      },
      audio_setting: {
        sample_rate: 32000,
        bitrate: 128000,
        format: "mp3",
        channel: 1
      }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("MiniMax API Response Error:", response.status, errorText);
  } else {
    const json = await response.json();
    if (json.base_resp && json.base_resp.status_code !== 0) {
       console.error("MiniMax returned error code:", json.base_resp);
    } else {
       console.log("Success! Received audio data of length:", json.data?.audio?.length);
    }
  }
}

test();
