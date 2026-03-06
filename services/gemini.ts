const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

export async function generateStory(topic: string, description: string) {
  const prompt = `
You are a creative story writer.

Write a short, engaging story based on the following:

Topic: ${topic}
Description: ${description}

Rules:
- Make it imaginative and easy to read
- Around 400 to 600 words
- Give the story a title
- Use paragraphs
- Make the ending satisfying
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Failed to generate story");
  }

  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text || "No story generated.";

  return text;
}