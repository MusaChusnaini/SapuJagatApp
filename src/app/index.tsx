import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useLoginLogic } from "../hooks/loginLogic";
import { inlineTheme, styles } from "../styles/styling";

export default function LoginScreen() {
  // Panggil data dan fungsi dari file logika (Tugas Kamu)
  const { role, setRole, errorMsg, handleLogin, inputList, roles } =
    useLoginLogic();

  return (
    <View style={styles.container}>
      {/* Header dengan kombinasi Style External & Style dari Preset */}
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.title}>
          Cleaning <Text style={inlineTheme.brandHighlight}>Service</Text>
        </Text>
        <Text style={styles.subtitle}>Pilih peran dan masuk ke akun kamu</Text>
      </View>

      {/* LOOPING 1: Render Pilihan Role (Menggunakan .map) */}
      <View style={styles.roleContainer}>
        {roles.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.roleButton, role === item && styles.roleActive]}
            onPress={() => setRole(item)}
          >
            <Text
              style={role === item ? styles.roleTextActive : styles.roleText}
            >
              {item === "user" ? "Pelanggan (User)" : "Pembersih (Cleaner)"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LOOPING 2: Render Dynamic Form Inputs (Menggunakan .map dari array hasil loop) */}
      {inputList.map((item) => (
        <View key={item.id} style={styles.inputGroup}>
          <Text style={styles.label}>{item.label}</Text>
          <TextInput
            style={styles.input}
            placeholder={item.placeholder}
            value={item.value}
            onChangeText={item.onChange}
            secureTextEntry={item.secure}
            autoCapitalize="none"
          />
        </View>
      ))}

      {/* Menampilkan pesan error validasi hasil Custom Function */}
      {errorMsg ? (
        <Text style={[styles.errorText, { fontStyle: "italic" }]}>
          {errorMsg}
        </Text>
      ) : null}

      {/* Tombol Login yang memanggil Custom Function handleLogin */}
      <TouchableOpacity
        style={[styles.loginButton, inlineTheme.cardShadow]}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>
          Login sebagai {role.toUpperCase()}
        </Text>
      </TouchableOpacity>

      {/*
        ============================================================
        PETUNJUK BAGI ANGGOTA KELOMPOK LAIN:
        ------------------------------------------------------------
        TEMAN A (Poin 2: Type & Array of Objects):
        1. Buat file `types.ts` untuk mendefinisikan interface/type
           (misal: `User`, `Cleaner`, `FormConfig`).
        2. Buat array of objects berisi mock data pengguna/cleaner.

        TEMAN B (Poin 3: Inline & External Styles):
        1. Kembangkan `styling.ts` untuk external styles.
        2. Tambahkan properti inline style secara langsung pada komponen di `index.tsx`
           contoh: style={{ marginTop: 10, padding: 5 }}
        ============================================================
      */}
    </View>
  );
}
