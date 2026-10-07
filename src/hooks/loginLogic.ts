import { useState } from "react";
import { Alert } from "react-native";

export const useLoginLogic = () => {
  const [role, setRole] = useState<"user" | "cleaner">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // ===================================================
  // CUSTOM FUNCTION 1: Validasi Input Form
  // ===================================================
  const validateInput = (userEmail: string, userPassword: string): string => {
    if (!userEmail || !userPassword) {
      return "Email dan password tidak boleh kosong!";
    }
    if (!userEmail.includes("@")) {
      return "Format email tidak valid!";
    }
    if (userPassword.length < 6) {
      return "Password minimal 6 karakter!";
    }
    return "";
  };

  // ===================================================
  // CUSTOM FUNCTION 2: Process/Submit Login
  // ===================================================
  const handleLogin = () => {
    const error = validateInput(email, password);
    if (error) {
      setErrorMsg(error);
      return;
    }
    setErrorMsg("");
    Alert.alert(
      "Login Berhasil",
      `Selamat datang ${role.toUpperCase()}!\nEmail: ${email}`,
    );
  };

  // ===================================================
  // LOOPING 1: Generate List Config untuk Input Form
  // (Menggunakan 'for' loop untuk membentuk array)
  // ===================================================
  const getFormInputList = () => {
    const rawInputs = [
      {
        id: "email",
        label: "Email Address",
        value: email,
        onChange: setEmail,
        secure: false,
        placeholder: "contoh@mail.com",
      },
      {
        id: "password",
        label: "Password",
        value: password,
        onChange: setPassword,
        secure: true,
        placeholder: "Masukkan password",
      },
    ];

    const inputList = [];
    for (let i = 0; i < rawInputs.length; i++) {
      inputList.push(rawInputs[i]);
    }
    return inputList;
  };

  // Array Role untuk pilihan login
  const roles: Array<"user" | "cleaner"> = ["user", "cleaner"];

  return {
    role,
    setRole,
    errorMsg,
    handleLogin,
    inputList: getFormInputList(),
    roles,
  };
};
