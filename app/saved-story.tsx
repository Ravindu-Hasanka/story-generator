import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import ScreenWrapper from "../components/ScreenWrapper";
import { deleteStory, getStoryById, toggleFavorite, type SavedStory } from "../services/storyLibrary";
import { theme } from "../constants/theme";

export default function SavedStoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [story, setStory] = useState<SavedStory | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStory = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const found = await getStoryById(id);
    setStory(found);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    loadStory();
  }, [loadStory]);

  useFocusEffect(
    useCallback(() => {
      loadStory();
    }, [loadStory])
  );

  const onDelete = () => {
    if (!story) return;

    Alert.alert("Delete Story", "This story will be removed from your library.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteStory(story.id);
          router.replace("/library");
        },
      },
    ]);
  };

  return (
    <ScreenWrapper>
      <View style={styles.topSpace} />
      {loading ? (
        <Text style={styles.info}>Loading story...</Text>
      ) : !story ? (
        <>
          <Text style={styles.title}>Story not found</Text>
          <Pressable style={styles.soloBackBtn} onPress={() => router.replace("/library")}>
            <Text style={styles.backText}>Back to My Stories</Text>
          </Pressable>
        </>
      ) : (
        <>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{story.title}</Text>
            <Pressable
              onPress={async () => {
                await toggleFavorite(story.id);
                loadStory();
              }}
            >
              <Text style={styles.favorite}>{story.isFavorite ? "★" : "☆"}</Text>
            </Pressable>
          </View>

          <Text style={styles.meta}>
            {story.controls.genre}  |  {story.controls.tone}  |  {story.controls.language}
          </Text>

          <View style={styles.storyCard}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.storyText}>{story.content}</Text>
            </ScrollView>
          </View>

          <View style={styles.actions}>
            <Pressable style={[styles.actionBtn, styles.backBtn]} onPress={() => router.replace("/library")}>
              <Text style={styles.actionText}>Back</Text>
            </Pressable>
            <Pressable style={[styles.actionBtn, styles.deleteBtn]} onPress={onDelete}>
              <Text style={styles.actionText}>Delete</Text>
            </Pressable>
          </View>
        </>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  topSpace: {
    height: 40,
  },
  title: {
    color: theme.colors.text,
    fontSize: 30,
    fontWeight: "800",
  },
  info: {
    color: theme.colors.muted,
    textAlign: "center",
    marginTop: 24,
    fontSize: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  favorite: {
    color: "#FDE68A",
    fontSize: 24,
    lineHeight: 24,
  },
  meta: {
    color: theme.colors.muted,
    marginBottom: 14,
  },
  storyCard: {
    flex: 1,
    backgroundColor: "rgba(30,41,59,0.88)",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  storyText: {
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 28,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 12,
  },
  backBtn: {
    backgroundColor: "rgba(59,130,246,0.75)",
  },
  deleteBtn: {
    backgroundColor: "rgba(239,68,68,0.75)",
  },
  actionText: {
    color: theme.colors.white,
    fontWeight: "700",
    fontSize: 15,
  },
  backText: {
    color: theme.colors.white,
    fontWeight: "700",
    textAlign: "center",
  },
  soloBackBtn: {
    marginTop: 16,
    backgroundColor: "rgba(59,130,246,0.75)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
