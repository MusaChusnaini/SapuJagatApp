import { styles } from "@/styles/styling";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ThemeContext } from "../../context/ThemeContext";

export default function UserDashboard() {
  // buatin dashboard untuk menampilkan kartu kartu pilihan menu untuk user, sementara
  // buatin dummy card terus kasih teks dibawahnya ini button apa saja dalam bentuk kontiner grid
  // sama buat buttonnya wajib ada button buat balik ke login scren, sama bisa respons mode malam
  // copas aja semua yang ada disini ke AI lalu minta buatin yang lebih layak
  // STYLING DIDALAM SATU FILE, GABUNG SEMUA DISINI JANGAN UBAH FILE LAIN

  // Mengambil state dan fungsi dari Context
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const { currentRole } = useLocalSearchParams();
  // Variabel gaya kondisional
  const bgColor = isDarkMode ? "#121212" : "#f8f9fa";
  const textColor = isDarkMode ? "#ffffff" : "#2c3e50";
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={[styles.title, { color: textColor }]}>
        Dashboard {currentRole === "user" ? "Pengguna" : "Cleaner"}
      </Text>

      <TouchableOpacity onPress={toggleDarkMode} style={styles.toggleButton}>
        <Text style={styles.buttonText}>
          Ubah ke {isDarkMode ? "Mode Terang" : "Mode Gelap"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
          }
        }}
        style={styles.toggleButton}
      >
        <Text style={styles.buttonText}>Kembali ke login screen</Text>
      </TouchableOpacity>
    </View>
  );
}
