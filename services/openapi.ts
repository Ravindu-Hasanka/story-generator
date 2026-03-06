const API_KEY = process.env.EXPO_PUBLIC_GITHUB_TOKEN;

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

  console.log("KEY:", API_KEY?.slice(0, 20) + "...");
  console.log("MODEL:", "openai/gpt-4.1-mini");
  console.log("ENDPOINT:", "https://models.github.ai/inference/chat/completions");

  const response = await fetch(
    "https://models.github.ai/inference/chat/completions",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({
        model: "openai/gpt-4.1-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          }
        ],
        temperature: 0.8,
      }),
    }
  );

  console.log("STATUS:", response.status);

  const text = await response.text();
  console.log("RAW RESPONSE:", text);

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON response");
  }

  if (!response.ok) {
    console.log("ERROR:", data);
    throw new Error(data?.error?.message || "Failed to generate story");
  }

  return data?.choices?.[0]?.message?.content || "No story generated.";
}