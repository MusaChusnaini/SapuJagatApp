import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  // Background dibuat abu-abu terang sesuai tema cleaning service
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 30,
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },

  // Header dibuat menjadi satu kelompok style
  header: {
    marginBottom: 25,
  },

  // Ukuran dan warna judul dibuat lebih modern
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
    color: "#1E293B",
  },

  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#64748B",
  },

  roleContainer: {
    flexDirection: "row",
    marginBottom: 22,
  },

  // Border, radius, dan padding diperbaiki
  roleButton: {
    flex: 1,
    paddingVertical: 13,
    paddingHorizontal: 8,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 4,
    backgroundColor: "#FFFFFF",
  },

  // Style dasar role aktif
  roleActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },

  roleText: {
    color: "#475569",
    fontWeight: "600",
    fontSize: 13,
  },

  roleTextActive: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 13,
  },

  inputGroup: {
    marginBottom: 16,
  },

  label: {
    marginBottom: 7,
    fontSize: 14,
    color: "#334155",
    fontWeight: "600",
  },

  input: {
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    fontSize: 15,
    color: "#1E293B",
  },

  // Digunakan ketika TextInput sedang mendapatkan focus
  inputFocused: {
    borderColor: "#007AFF",
    backgroundColor: "#F8FBFF",
  },

  loginButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },

  errorText: {
    textAlign: "center",
    marginBottom: 12,
    fontSize: 13,
    fontWeight: "500",
  },

});

export const inlineTheme = {

  // Warna biru digunakan sebagai warna utama cleaning service
  brandHighlight: {
    color: "#007AFF",
    fontWeight: "bold" as const,
  },

  // Shadow tetap digunakan pada tombol login
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },

};