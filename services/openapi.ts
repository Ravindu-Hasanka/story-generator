const API_KEY = process.env.EXPO_PUBLIC_GITHUB_TOKEN;

export type StoryControls = {
  genre: string;
  tone: string;
  targetAge: string;
  storyLength: string;
  pov: string;
  language: string;
};

export async function generateStory(
  topic: string,
  description: string,
  controls: StoryControls
) {

  const prompt = `
You are a creative story writer.

Write a polished story using the exact creative controls below.

Topic: ${topic}
Description: ${description}
Genre: ${controls.genre}
Tone: ${controls.tone}
Target Age: ${controls.targetAge}
Story Length: ${controls.storyLength}
Point of View: ${controls.pov}
Language: ${controls.language}

Rules:
- Follow the selected genre, tone, target age, POV, and language precisely
- Match the selected story length range as closely as possible
- Keep wording and complexity appropriate for the target age
- Give the story a strong title in the selected language
- Use clear paragraphs and make the ending satisfying
- Return only the story text (no extra notes or headings)
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
