import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import PrimaryButton from "../components/PrimaryButton";
import { theme } from "../constants/theme";
import { listStories, type SavedStory } from "../services/storyLibrary";

export default function HomeScreen() {
  const [recentStories, setRecentStories] = useState<SavedStory[]>([]);

  const loadRecentStories = useCallback(async () => {
    const stories = await listStories();
    setRecentStories(stories.slice(0, 5));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRecentStories();
    }, [loadRecentStories])
  );

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topSpace} />
        <Text style={styles.badge}>AI Story Creator</Text>
        <Text style={styles.title}>What do you want to do?</Text>
        <Text style={styles.subtitle}>
          Start a new story or open your saved library.
        </Text>

        <View style={styles.tileRow}>
          <Pressable
            style={[styles.tile, styles.generateTile]}
            onPress={() => router.push("/topic")}
          >
            <Text style={styles.tileTitle}>Generate Stories</Text>
            <Text style={styles.tileText}>
              Create a new story with custom controls.
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tile, styles.savedTile]}
            onPress={() => router.push("/library")}
          >
            <Text style={styles.tileTitle}>Saved Stories</Text>
            <Text style={styles.tileText}>View all stories in your library.</Text>
          </Pressable>
        </View>

        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>Recent Stories</Text>
          <PrimaryButton title="View All" onPress={() => router.push("/library")} />
        </View>

        <View style={styles.recentList}>
          {recentStories.length === 0 ? (
            <Text style={styles.emptyText}>No recent stories yet.</Text>
          ) : (
            recentStories.map((story) => (
              <Pressable
                key={story.id}
                style={styles.recentCard}
                onPress={() =>
                  router.push({ pathname: "/saved-story", params: { id: story.id } })
                }
              >
                <Text numberOfLines={1} style={styles.recentCardTitle}>
                  {story.title}
                </Text>
                <Text numberOfLines={1} style={styles.recentCardMeta}>
                  {story.controls.genre} | {story.controls.language}
                </Text>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const tileBase = {
  borderRadius: 20,
  padding: 16,
  minHeight: 132,
  borderWidth: 1,
};

const styles = StyleSheet.create({
  topSpace: {
    height: 40,
  },
  badge: {
    color: "#C4B5FD",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
  },
  title: {
    color: theme.colors.text,
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 40,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 16,
    marginTop: 10,
    lineHeight: 24,
    marginBottom: 22,
  },
  tileRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  tile: {
    ...tileBase,
    flex: 1,
  },
  generateTile: {
    backgroundColor: "rgba(99,102,241,0.28)",
    borderColor: "rgba(129,140,248,0.45)",
  },
  savedTile: {
    backgroundColor: "rgba(20,184,166,0.2)",
    borderColor: "rgba(45,212,191,0.4)",
  },
  tileTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
  tileText: {
    color: "#CBD5E1",
    fontSize: 14,
    lineHeight: 20,
  },
  recentHeader: {
    marginBottom: 12,
  },
  recentTitle: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },
  recentList: {
    gap: 10,
    paddingBottom: 22,
  },
  recentCard: {
    backgroundColor: "rgba(30,41,59,0.88)",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  recentCardTitle: {
    color: theme.colors.text,
    fontWeight: "700",
    fontSize: 16,
  },
  recentCardMeta: {
    color: theme.colors.muted,
    fontSize: 13,
    marginTop: 4,
  },
  emptyText: {
    color: theme.colors.muted,
    fontSize: 15,
    textAlign: "center",
    marginTop: 6,
  },
});
