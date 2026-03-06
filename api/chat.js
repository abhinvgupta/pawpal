const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = "gpt-4o-mini";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: { message: "Method not allowed" } });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: { message: "OPENAI_API_KEY is not configured." } });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    if (!messages.length) {
      return res
        .status(400)
        .json({ error: { message: "messages array is required." } });
    }

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data?.error?.message ?? "OpenAI request failed.";
      return res.status(response.status).json({ error: { message } });
    }

    const assistantText =
      data?.choices?.[0]?.message?.content?.trim() ||
      "I could not generate a response.";

    return res.status(200).json({ reply: assistantText });
  } catch (error) {
    return res.status(500).json({
      error: {
        message:
          error instanceof Error ? error.message : "Unexpected server error.",
      },
    });
  }
}
