import { ReactNode } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  children: ReactNode;
};

export default function ScreenWrapper({ children }: Props) {
  return (
    <LinearGradient
      colors={["#0F172A", "#1E1B4B", "#312E81"]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>{children}</View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
});
