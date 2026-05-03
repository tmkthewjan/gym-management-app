import { ScrollView, Text, TextInput, TouchableOpacity, Alert, StyleSheet, View } from "react-native";

export default function Feedback() {
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Feedback</Text>
        <Text style={styles.subtitle}>Share what you love and help us improve your gym experience.</Text>
      </View>

      <TextInput
        placeholder="Write your feedback..."
        placeholderTextColor="#9CA3AF"
        multiline={true}
        style={styles.input}
      />

      <TouchableOpacity
        onPress={() => Alert.alert("Success", "Feedback submitted")}
        style={styles.actionBtn}
      >
        <Text style={styles.actionText}>Submit Feedback</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#05070B" },
  container: { padding: 24, paddingBottom: 40 },
  header: { marginTop: 60, marginBottom: 18 },
  title: { color: "#EF233C", fontSize: 32, fontWeight: "900" },
  subtitle: { color: "#9CA3AF", fontSize: 16, marginTop: 8, lineHeight: 22 },
  input: {
    backgroundColor: "#111827",
    color: "white",
    padding: 18,
    borderRadius: 22,
    minHeight: 160,
    marginTop: 20,
    fontSize: 16,
    textAlignVertical: "top",
  },
  actionBtn: {
    backgroundColor: "#EF233C",
    paddingVertical: 16,
    borderRadius: 20,
    marginTop: 24,
    alignItems: "center",
  },
  actionText: { color: "white", fontWeight: "900", fontSize: 16 },
});
