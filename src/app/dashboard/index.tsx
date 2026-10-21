import { useRouter } from "expo-router";
import { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ThemeContext } from "../../context/ThemeContext";

export default function UserDashboard() {
  // Mengambil state dan fungsi dari Context
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);

  // Variabel gaya kondisional
  const bgColor = isDarkMode ? "#121212" : "#f8f9fa";
  const textColor = isDarkMode ? "#ffffff" : "#2c3e50";
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={[styles.title, { color: textColor }]}>
        Dashboard Pelanggan
      </Text>

      {/* Tombol untuk memicu toggleDarkMode */}
      <TouchableOpacity onPress={toggleDarkMode} style={styles.toggleButton}>
        <Text style={styles.buttonText}>
          Ubah ke {isDarkMode ? "Mode Terang" : "Mode Gelap"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          router.back();
        }}
        style={styles.toggleButton}
      >
        <Text style={styles.buttonText}>Kembali ke login screen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  toggleButton: { backgroundColor: "#3498db", padding: 12, borderRadius: 8 },
  buttonText: { color: "white", fontWeight: "bold" },
});
