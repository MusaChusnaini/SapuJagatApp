import { ThemeContext } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../lib/supabase";
import { useLoginLogic } from "../hooks/loginLogic";
import { inlineTheme, styles } from "../styles/styling";

export default function LoginScreen() {
  // Panggil data dan fungsi dari file logika (Tugas Kamu)
  const {
    role,
    setRole,
    errorMsg,
    loading,
    isRegistering,
    setIsRegistering,
    handleLogin,
    inputList,
    roles,
  } = useLoginLogic();

  useEffect(() => {
    console.log("Cek ENV URL:", process.env.EXPO_PUBLIC_SUPABASE_URL);

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("Koneksi Supabase gagal:", error.message);
      } else {
        console.log("Terhubung ke Supabase! Sesi aktif:", data.session);
      }
    });
  }, []);
  // Mengambil state dan fungsi dari Context
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);

  // Variabel gaya kondisional
  const bgColor = isDarkMode ? "#121212" : "#f8f9fa";
  const textColor = isDarkMode ? "#ffffff" : "#2c3e50";

  const router = useRouter();

  useEffect(() => {
    console.log("Njir berubah");
  }, [role]);
  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={{ marginBottom: 20 }}>
        <Text style={[styles.title, { color: textColor }]}>
          Sapu
          <Text style={inlineTheme.brandHighlight}>Jagat</Text>
        </Text>
        <Text style={[styles.subtitle, { color: textColor }]}>
          Pilih peran dan masuk ke akun kamu
        </Text>
      </View>

      <View style={styles.roleContainer}>
        {roles.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.roleButton, role === item && styles.roleActive]}
            onPress={() => {
              setRole(item);
            }}
          >
            <Text
              style={role === item ? styles.roleTextActive : styles.roleText}
            >
              {item === "customer" ? "Pelanggan (User)" : "Pembersih (Cleaner)"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {inputList.map((item) => (
        <View key={item.id} style={styles.inputGroup}>
          <Text style={[styles.label, { color: textColor }]}>{item.label}</Text>
          <TextInput
            style={[
              styles.input,
              { color: textColor },
              { backgroundColor: bgColor },
            ]}
            placeholder={item.placeholder}
            value={item.value}
            onChangeText={item.onChange}
            secureTextEntry={item.secure}
            autoCapitalize="none"
          />
        </View>
      ))}

      {errorMsg ? (
        <Text style={[styles.errorText, { fontStyle: "italic" }]}>
          {errorMsg}
        </Text>
      ) : null}

      {/* Tombol Login yang memanggil Custom Function handleLogin */}
      <TouchableOpacity
        style={[
          styles.loginButton,
          inlineTheme.cardShadow,
          loading && { opacity: 0.7 },
        ]}
        disabled={loading}
        onPress={handleLogin}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>
            {isRegistering
              ? `Daftar sebagai ${role.toUpperCase()}`
              : `Login sebagai ${role.toUpperCase()}`}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginTop: 16, alignItems: "center" }}
        disabled={loading}
        onPress={() => setIsRegistering(!isRegistering)}
      >
        <Text style={{ color: textColor, textDecorationLine: "underline" }}>
          {isRegistering
            ? "Sudah punya akun? Masuk di sini"
            : "Belum punya akun? Daftar sekarang"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
