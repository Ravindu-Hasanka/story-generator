import AsyncStorage from "@react-native-async-storage/async-storage";
import type { StoryControls } from "./openapi";

const STORIES_KEY = "story_library_v1";

export type SavedStory = {
  id: string;
  title: string;
  topic: string;
  description: string;
  content: string;
  controls: StoryControls;
  isFavorite: boolean;
  createdAt: string;
};

export type NewSavedStory = Omit<SavedStory, "id" | "createdAt" | "isFavorite">;

function extractTitle(content: string) {
  const firstLine = content
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.length > 0);

  if (!firstLine) return "Untitled Story";
  return firstLine.replace(/^#{1,6}\s*/, "").slice(0, 80);
}

async function readStories() {
  const raw = await AsyncStorage.getItem(STORIES_KEY);
  if (!raw) return [] as SavedStory[];

  try {
    const parsed = JSON.parse(raw) as SavedStory[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeStories(stories: SavedStory[]) {
  await AsyncStorage.setItem(STORIES_KEY, JSON.stringify(stories));
}

export async function listStories() {
  const stories = await readStories();
  return stories.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getStoryById(id: string) {
  const stories = await readStories();
  return stories.find((story) => story.id === id) || null;
}

export async function saveStory(story: NewSavedStory) {
  const stories = await readStories();
  const next: SavedStory = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: extractTitle(story.content),
    topic: story.topic,
    description: story.description,
    content: story.content,
    controls: story.controls,
    isFavorite: false,
    createdAt: new Date().toISOString(),
  };

  await writeStories([next, ...stories]);
  return next;
}

export async function deleteStory(id: string) {
  const stories = await readStories();
  const filtered = stories.filter((story) => story.id !== id);
  await writeStories(filtered);
}

export async function toggleFavorite(id: string) {
  const stories = await readStories();
  const updated = stories.map((story) =>
    story.id === id ? { ...story, isFavorite: !story.isFavorite } : story
  );
  await writeStories(updated);
}
