import { useCallback, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import ScreenWrapper from "../components/ScreenWrapper";
import TextInputFeild from "../components/TextInputFeild";
import { deleteStory, listStories, toggleFavorite, type SavedStory } from "../services/storyLibrary";
import { theme } from "../constants/theme";

function formatDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function LibraryScreen() {
  const [stories, setStories] = useState<SavedStory[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadStories = useCallback(async () => {
    setLoading(true);
    const next = await listStories();
    setStories(next);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStories();
    }, [loadStories])
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return stories;
    return stories.filter((story) => {
      const haystack = `${story.title} ${story.topic} ${story.description}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [search, stories]);

  const onDelete = (id: string) => {
    Alert.alert("Delete Story", "This story will be removed from your library.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteStory(id);
          loadStories();
        },
      },
    ]);
  };

  return (
    <ScreenWrapper>
      <View style={styles.topSpace} />
      <Text style={styles.badge}>Library</Text>
      <Text style={styles.title}>My Stories</Text>
      <Text style={styles.subtitle}>Search, favorite, and reopen saved stories.</Text>

      <TextInputFeild
        value={search}
        onChangeText={setSearch}
        placeholder="Search title, topic, or description..."
        style={styles.search}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {loading ? (
          <Text style={styles.empty}>Loading stories...</Text>
        ) : filtered.length === 0 ? (
          <Text style={styles.empty}>No stories found.</Text>
        ) : (
          filtered.map((story) => (
            <View key={story.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.cardTitle}>{story.title}</Text>
                <Pressable onPress={async () => { await toggleFavorite(story.id); loadStories(); }}>
                  <Text style={styles.favorite}>{story.isFavorite ? "★" : "☆"}</Text>
                </Pressable>
              </View>

              <Text style={styles.meta}>
                {formatDate(story.createdAt)}  |  {story.controls.genre}  |  {story.controls.language}
              </Text>
              <Text numberOfLines={2} style={styles.preview}>
                {story.content}
              </Text>

              <View style={styles.actions}>
                <Pressable
                  style={[styles.actionBtn, styles.openBtn]}
                  onPress={() => router.push({ pathname: "/saved-story", params: { id: story.id } })}
                >
                  <Text style={styles.actionText}>Open</Text>
                </Pressable>
                <Pressable style={[styles.actionBtn, styles.deleteBtn]} onPress={() => onDelete(story.id)}>
                  <Text style={styles.actionText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  topSpace: {
    height: 40,
  },
  badge: {
    color: "#93C5FD",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
  },
  title: {
    color: theme.colors.text,
    fontSize: 30,
    fontWeight: "800",
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 15,
    marginTop: 8,
    marginBottom: 16,
  },
  search: {
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 24,
    gap: 12,
  },
  empty: {
    color: theme.colors.muted,
    marginTop: 24,
    textAlign: "center",
    fontSize: 16,
  },
  card: {
    backgroundColor: "rgba(30,41,59,0.88)",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "700",
    flex: 1,
    paddingRight: 12,
  },
  favorite: {
    color: "#FDE68A",
    fontSize: 22,
    lineHeight: 22,
  },
  meta: {
    color: theme.colors.muted,
    marginTop: 8,
    fontSize: 12,
  },
  preview: {
    color: "#D1D5DB",
    marginTop: 10,
    lineHeight: 22,
    fontSize: 14,
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
    paddingVertical: 10,
  },
  openBtn: {
    backgroundColor: "rgba(59,130,246,0.7)",
  },
  deleteBtn: {
    backgroundColor: "rgba(239,68,68,0.7)",
  },
  actionText: {
    color: theme.colors.white,
    fontWeight: "700",
    fontSize: 14,
  },
});
