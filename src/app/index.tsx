import { ThemeContext } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useLoginLogic } from "../hooks/loginLogic";
import { inlineTheme, styles } from "../styles/styling";

export default function LoginScreen() {
  // Panggil data dan fungsi dari file logika (Tugas Kamu)
  const { role, setRole, errorMsg, handleLogin, inputList, roles } =
    useLoginLogic();

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
              {item === "user" ? "Pelanggan (User)" : "Pembersih (Cleaner)"}
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
        style={[styles.loginButton, inlineTheme.cardShadow]}
        onPress={() => {
          handleLogin();
        }}
      >
        <Text style={styles.buttonText}>
          Login sebagai {role.toUpperCase()}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
