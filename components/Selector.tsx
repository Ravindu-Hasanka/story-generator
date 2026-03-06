import { theme } from "@/constants/theme";
import { View, Text, Pressable, StyleSheet } from "react-native";

type SelectorProps = {
  title: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
};

export function Selector({ title, options, selected, onSelect }: SelectorProps) {
  return (
    <View style={styles.selectorWrap}>
      <Text style={styles.selectorTitle}>{title}</Text>
      <View style={styles.chipsWrap}>
        {options.map((option) => {
          const active = option === selected;
          return (
            <Pressable
              key={option}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onSelect(option)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  
  selectorWrap: {
    marginBottom: 14,
  },
  selectorTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    backgroundColor: "rgba(51,65,85,0.45)",
  },
  chipActive: {
    borderColor: "#C4B5FD",
    backgroundColor: "rgba(139,92,246,0.25)",
  },
  chipText: {
    color: theme.colors.muted,
    fontSize: 13,
    fontWeight: "600",
  },
  chipTextActive: {
    color: theme.colors.text,
  },
});
