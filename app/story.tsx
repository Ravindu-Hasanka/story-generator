import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import ScreenWrapper from "../components/ScreenWrapper";
import { generateStory } from "../services/openapi";
import { theme } from "../constants/theme";

export default function ResultScreen() {
  const { topic, description } = useLocalSearchParams<{
    topic: string;
    description: string;
  }>();

  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError("");
        const result = await generateStory(topic, description);
        setStory(result);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [topic, description]);

  return (
    <ScreenWrapper>
      <View style={styles.topSpace} />
      <Text style={styles.badge}>Your Story</Text>
      <Text style={styles.title}>Generated Story</Text>

      <View style={styles.storyCard}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#C4B5FD" />
            <Text style={styles.loadingText}>Creating your story...</Text>
          </View>
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.storyText}>{story}</Text>
          </ScrollView>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  topSpace: {
    height: 40,
  },
  badge: {
    color: "#A5F3FC",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
  },
  title: {
    color: theme.colors.text,
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 20,
  },
  storyCard: {
    flex: 1,
    backgroundColor: "rgba(30,41,59,0.88)",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: theme.colors.muted,
    marginTop: 14,
    fontSize: 16,
  },
  storyText: {
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 28,
  },
  error: {
    color: "#FCA5A5",
    fontSize: 16,
    lineHeight: 24,
  },
});