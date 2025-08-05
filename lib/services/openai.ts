// lib/services/openai.ts
export async function callOpenAI({
  prompt,
  model = "gpt-4",
  temperature = 0.7,
  max_tokens = 500,
}: {
  prompt: string;
  model?: "gpt-4" | "gpt-3.5-turbo";
  temperature?: number;
  max_tokens?: number;
}): Promise<string | null> {
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature,
        max_tokens,
      }),
    });

    const json = await res.json();
    return json.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error("OpenAI Error:", error);
    return null;
  }
}