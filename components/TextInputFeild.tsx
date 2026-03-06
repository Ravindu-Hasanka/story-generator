import { StyleSheet, TextInput, TextInputProps } from "react-native";
import { theme } from "../constants/theme";

export default function TextInputFeild(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={theme.colors.muted}
      {...props}
      style={[styles.input, props.style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: theme.colors.inputBg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.text,
    borderRadius: theme.radius.md,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
  },
});