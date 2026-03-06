import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import TextInputFeild from "../components/TextInputFeild";
import PrimaryButton from "../components/PrimaryButton";
import { theme } from "../constants/theme";

export default function DescriptionScreen() {
  const { topic } = useLocalSearchParams<{ topic: string }>();
  const [description, setDescription] = useState("");

  const generateStory = () => {
    if (!description.trim()) return;
    router.push({
      pathname: "/story",
      params: {
        topic,
        description,
      },
    });
  };

  return (
    <ScreenWrapper>
      <View style={styles.topSpace} />
      <Text style={styles.badge}>Step 2</Text>
      <Text style={styles.title}>Add more details</Text>
      <Text style={styles.subtitle}>
        Topic: <Text style={styles.topic}>{topic}</Text>
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Story Description</Text>
        <TextInputFeild
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the characters, mood, place, and style..."
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          style={styles.textArea}
        />
        <PrimaryButton
          title="Generate Story"
          onPress={generateStory}
          disabled={!description.trim()}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  topSpace: {
    height: 40,
  },
  badge: {
    color: "#F9A8D4",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
  },
  title: {
    color: theme.colors.text,
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 38,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 16,
    marginTop: 10,
    marginBottom: 24,
  },
  topic: {
    color: "#DDD6FE",
    fontWeight: "700",
  },
  card: {
    backgroundColor: "rgba(30,41,59,0.85)",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  label: {
    color: theme.colors.text,
    fontSize: 15,
    marginBottom: 10,
    fontWeight: "600",
  },
  textArea: {
    minHeight: 150,
  },
});