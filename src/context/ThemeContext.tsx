import { createContext, ReactNode, useState } from "react";

// 1. Tipe data untuk Context (khusus TypeScript)
type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

// 2. Membuat Context dengan nilai bawaan (default)
export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

// 3. Membuat Provider Component
export function ThemeProvider({ children }: { children: ReactNode }) {
  // State untuk menyimpan mode saat ini
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fungsi untuk membalikkan nilai state (true jadi false, false jadi true)
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    // Membagikan isDarkMode dan toggleDarkMode ke semua komponen children
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
