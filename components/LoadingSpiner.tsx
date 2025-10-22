import { COLORS } from "@/constants/color";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
interface SpinerProps {
    message: string;
    size: string;
}
export default function LoadingSpinner({ message = "Loading...", size = "large" }: SpinerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size={10} color={COLORS.primary} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: COLORS.background,
  },
  content: {
    alignItems: "center",
    gap: 16,
  },
  message: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
  },
});