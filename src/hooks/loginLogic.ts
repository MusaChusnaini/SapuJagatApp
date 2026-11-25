import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export const useLoginLogic = () => {
  const [role, setRole] = useState<"customer" | "cleaner">("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
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
    if (isRegistering && !fullName.trim()) {
      return "Nama lengkap wajib diisi saat pendaftaran!";
    }
    return "";
  };

  // ===================================================
  // CUSTOM FUNCTION 2: Process/Submit Login & Register ke Supabase
  // ===================================================
  const handleLogin = async () => {
    if (loading) return;

    const cleanEmail = email.trim();
    const cleanName = fullName.trim();

    const validationError = validateInput(cleanEmail, password);
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      if (isRegistering) {
        // ==========================================
        // ALUR A: PENDAFTARAN AKUN BARU (SIGN UP)
        // ==========================================
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: password,
          options: {
            data: {
              full_name: cleanName,
              role: role,
            },
          },
        });

        if (error) {
          setErrorMsg(error.message);
          return;
        }

        // Trigger Supabase otomatis membuat baris di tabel 'profiles' dari options.data
        if (data.user) {
          console.log("Pendaftaran sukses! User ID:", data.user.id);
          router.replace({
            pathname: "/dashboard",
            params: { currentRole: role },
          });
        }
      } else {
        // ==========================================
        // ALUR B: MASUK AKUN (SIGN IN)
        // ==========================================
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });

        if (error) {
          setErrorMsg(error.message);
          return;
        }

        if (data.user) {
          // Ambil data role asli user dari tabel 'profiles'
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .single();

          if (profileError) {
            console.error("Gagal mengambil profil:", profileError.message);
          }

          const verifiedRole =
            (profileData?.role as "customer" | "cleaner") || role;

          console.log("Login sukses sebagai:", verifiedRole);
          router.replace({
            pathname: "/dashboard",
            params: { currentRole: verifiedRole },
          });
        }
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan. Coba lagi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // LOOPING 1: Generate List Config untuk Input Form
  // ===================================================
  const getFormInputList = () => {
    const rawInputs = [
      ...(isRegistering
        ? [
            {
              id: "fullName",
              label: "Nama Lengkap",
              value: fullName,
              onChange: setFullName,
              secure: false,
              placeholder: "Masukkan nama lengkap",
            },
          ]
        : []),
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

  const roles: Array<"customer" | "cleaner"> = ["customer", "cleaner"];

  return {
    role,
    setRole,
    errorMsg,
    loading,
    isRegistering,
    setIsRegistering,
    handleLogin,
    inputList: getFormInputList(),
    roles,
  };
};
