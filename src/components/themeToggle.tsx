import { useContext } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { ThemeContext } from "../context/ThemeContext";

export default function ThemeToggleButton() {
  // Ambil status dan fungsi dari Context
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      style={[
        styles.floatingButton,
        { backgroundColor: isDarkMode ? "#2c3e50" : "#ffffff" },
      ]}
      onPress={toggleDarkMode}
    ></TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 30, // Jarak dari bawah layar
    right: 20, // Jarak dari kanan layar
    padding: 12,
    borderRadius: 30,
    zIndex: 1000, // Memastikan tombol selalu berada di lapisan paling atas
    // Efek bayangan (shadow)
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
