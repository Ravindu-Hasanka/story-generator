import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import TextInput from "../components/TextInputFeild";
import PrimaryButton from "../components/PrimaryButton";
import { theme } from "../constants/theme";

export default function HomeScreen() {
  const [topic, setTopic] = useState("");

  const goNext = () => {
    if (!topic.trim()) return;
    router.push({
      pathname: "/description",
      params: { topic },
    });
  };

  return (
    <ScreenWrapper>
      <View style={styles.topSpace} />
      <Text style={styles.badge}>AI Story Creator</Text>
      <Text style={styles.title}>Start with a story topic</Text>
      <Text style={styles.subtitle}>
        Enter a simple topic like “space adventure”, “lost dragon”, or “magic forest”.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Story Topic</Text>
        <TextInput
          value={topic}
          onChangeText={setTopic}
          placeholder="Enter your topic"
        />
        <PrimaryButton
          title="Continue"
          onPress={goNext}
          disabled={!topic.trim()}
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
    marginBottom: 28,
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
});