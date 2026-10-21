import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export const useLoginLogic = () => {
  const [role, setRole] = useState<"user" | "cleaner">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => {
        setErrorMsg("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

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
  // CUSTOM FUNCTION 2: Process/Submit Login (DIPERBAIKI)
  // ===================================================
  const handleLogin = () => {
    // 1. Jalankan fungsi validasi
    const validationError = validateInput(email, password);

    // 2. Jika ada pesan error dari validasi, masukkan ke state
    if (validationError) {
      setErrorMsg(validationError); // Ini akan memicu useEffect di atas secara otomatis!
      return; // Hentikan fungsi di sini, jangan lakukan navigasi
    }

    // 3. Jika lolos validasi, lakukan login dan navigasi menggunakan replace
    console.log("Validasi sukses, Lakukan Login.");
    router.replace({ pathname: "/dashboard", params: { currentRole: role } });
  };

  // ===================================================
  // LOOPING 1: Generate List Config untuk Input Form
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
