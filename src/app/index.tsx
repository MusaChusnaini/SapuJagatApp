// useState digunakan untuk mengetahui input mana yang sedang focus
import { useState } from "react";

import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useLoginLogic } from "../hooks/loginLogic";
import { inlineTheme, styles } from "../styles/styling";

export default function LoginScreen() {

  // Mengambil data dan fungsi dari loginLogic
  const {
    role,
    setRole,
    errorMsg,
    handleLogin,
    inputList,
    roles,
  } = useLoginLogic();


  // Menyimpan ID input yang sedang mendapatkan focus
  const [focusedInput, setFocusedInput] =
    useState<string | null>(null);


  return (
    <View style={styles.container}>

      <View style={styles.header}>

        <Text style={styles.title}>
          Cleaning{" "}

          <Text style={inlineTheme.brandHighlight}>
            Service
          </Text>
        </Text>

        <Text style={styles.subtitle}>
          Pilih peran dan masuk ke akun kamu
        </Text>

      </View>


      {/* =====================================================
          PILIHAN ROLE
          ===================================================== */}

      <View style={styles.roleContainer}>

        {roles.map((item) => (

          <TouchableOpacity
            key={item}

            style={[
              // External Style
              styles.roleButton,

              // Style ketika role aktif
              role === item && styles.roleActive,

              // =================================================
              // INLINE STYLE 
              // =================================================
              {
                borderColor:
                  role === item
                    ? "#007AFF"
                    : "#CBD5E1",

                backgroundColor:
                  role === item
                    ? item === "user"
                      ? "#007AFF"
                      : "#10B981"
                    : "#FFFFFF",
              },
            ]}

            onPress={() => setRole(item)}

            // Memberikan efek visual ketika tombol ditekan
            activeOpacity={0.7}
          >

            <Text
              style={[
                role === item
                  ? styles.roleTextActive
                  : styles.roleText,

                // =================================================
                // INLINE STYLE DINAMIS PADA TEKS ROLE
                // =================================================
                {
                  color:
                    role === item
                      ? "#FFFFFF"
                      : "#475569",
                },
              ]}
            >
              {item === "user"
                ? "Pelanggan (User)"
                : "Pembersih (Cleaner)"}
            </Text>

          </TouchableOpacity>

        ))}

      </View>


      {/* =====================================================
          FORM INPUT
          ===================================================== */}

      {inputList.map((item) => (

        <View
          key={item.id}
          style={styles.inputGroup}
        >

          <Text style={styles.label}>
            {item.label}
          </Text>


          <TextInput

            style={[
              // External Style
              styles.input,


              // =================================================
              // External style khusus ketika focus
              // =================================================
              focusedInput === item.id &&
                styles.inputFocused,


              // =================================================
              // INLINE STYLE DINAMIS
              //
              // Warna border berubah ketika input aktif.
              // User  -> Biru
              // Cleaner -> Hijau
              // =================================================
              {
                borderColor:
                  focusedInput === item.id
                    ? role === "user"
                      ? "#007AFF"
                      : "#10B981"
                    : "#CBD5E1",
              },
            ]}


            placeholder={item.placeholder}

            // BARU:
            // Membuat warna placeholder lebih lembut
            placeholderTextColor="#94A3B8"

            value={item.value}

            onChangeText={item.onChange}

            secureTextEntry={item.secure}

            autoCapitalize="none"


            // =================================================
            // Ketika input disentuh/focus
            // simpan ID input tersebut
            // =================================================
            onFocus={() =>
              setFocusedInput(item.id)
            }


            // =================================================
            // Ketika keluar dari input
            // hapus status focus
            // =================================================
            onBlur={() =>
              setFocusedInput(null)
            }

          />

        </View>

      ))}


      {/* =====================================================
          ERROR MESSAGE
          ===================================================== */}

      {errorMsg ? (

        <Text
          style={[
            styles.errorText,
            {
              color: "#DC2626",
              backgroundColor: "#FEF2F2",
              padding: 10,
              borderRadius: 8,
              fontStyle: "italic",
            },
          ]}
        >
          {errorMsg}
        </Text>

      ) : null}


      {/* =====================================================
          LOGIN BUTTON
          ===================================================== */}

      <TouchableOpacity

        style={[
          // External Style
          styles.loginButton,


          // Preset shadow
          inlineTheme.cardShadow,


          // =================================================
          // INLINE STYLE DINAMIS BERDASARKAN ROLE
          //
          // User    -> Biru
          // Cleaner -> Hijau
          // =================================================
          {
            backgroundColor:
              role === "user"
                ? "#007AFF"
                : "#10B981",
          },
        ]}


        onPress={handleLogin}


        // =================================================
        // Feedback visual ketika tombol ditekan
        // =================================================
        activeOpacity={0.75}

      >

        <Text style={styles.buttonText}>
          Login sebagai {role.toUpperCase()}
        </Text>

      </TouchableOpacity>

    </View>
  );
}