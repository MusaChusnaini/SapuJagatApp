import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemeContext } from "../../context/ThemeContext";

// Interface Data Dummy
interface CleanerData {
  id: number;
  nama: string;
  rating: string | number;
  biaya: string;
  status: string;
  totalSelesai: number;
  totalPendapatan: string;
  jamKerja: string;
}

// -------------------------------------------------------------
// DUMMY DATA LOKAL (Tanpa Backend/API Server External)
// -------------------------------------------------------------
const INITIAL_DUMMY_DATA: CleanerData = {
  id: 1,
  nama: "Budi Santoso",
  rating: "4.8",
  biaya: "Rp 50.000 / Jam",
  status: "Tersedia",
  totalSelesai: 124,
  totalPendapatan: "Rp 3.500.000",
  jamKerja: "180 Jam",
};

export default function UserDashboard() {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const params = useLocalSearchParams();
  const currentRole = Array.isArray(params.currentRole)
    ? params.currentRole[0]
    : params.currentRole;
  const router = useRouter();

  // State Lokal
  const [cleanerData, setCleanerData] = useState<CleanerData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isHired, setIsHired] = useState<boolean>(false);

  // Load Dummy Data saat halaman dibuka (simulasi async 500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setCleanerData(INITIAL_DUMMY_DATA);
      if (INITIAL_DUMMY_DATA.status === "Sedang Disewa") {
        setIsHired(true);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Handler Tombol Hire (Simulasi Lokal)
  const handleHireCleaner = () => {
    if (isHired) return;

    setIsHired(true);
    setCleanerData((prev) =>
      prev ? { ...prev, status: "Sedang Disewa" } : null,
    );
    Alert.alert(
      "Berhasil!",
      `Berhasil menyewa ${cleanerData?.nama || "Cleaner"}.`,
    );
  };

  const theme = {
    bg: isDarkMode ? "#121212" : "#F4F6F9",
    cardBg: isDarkMode ? "#1E1E1E" : "#FFFFFF",
    textPrimary: isDarkMode ? "#FFFFFF" : "#1A202C",
    textSecondary: isDarkMode ? "#A0AEC0" : "#718096",
    border: isDarkMode ? "#2D3748" : "#E2E8F0",
    buttonBg: "#007AFF",
    hireButtonBg: isHired ? "#A0AEC0" : "#38A169",
    badgeBg: isHired ? "#FFF5F5" : "#F0FFF4",
    badgeText: isHired ? "#E53E3E" : "#38A169",
  };

  const isUser = currentRole === "user";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Dashboard {isUser ? "Pengguna" : "Cleaner"}
        </Text>

        {/* Indikator Loading */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#007AFF"
            style={{ marginVertical: 40 }}
          />
        ) : (
          <>
            {isUser ? (
              /* TAMPILAN USER */
              <View
                style={[
                  styles.card,
                  { backgroundColor: theme.cardBg, borderColor: theme.border },
                ]}
              >
                <View style={styles.cardHeader}>
                  <Text
                    style={[styles.cleanerName, { color: theme.textPrimary }]}
                  >
                    {cleanerData?.nama || "Budi Santoso"}
                  </Text>
                  <View
                    style={[styles.badge, { backgroundColor: theme.badgeBg }]}
                  >
                    <Text
                      style={[styles.badgeText, { color: theme.badgeText }]}
                    >
                      {isHired
                        ? "Sedang Disewa"
                        : cleanerData?.status || "Tersedia"}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <Text
                    style={[styles.infoLabel, { color: theme.textSecondary }]}
                  >
                    Rating:
                  </Text>
                  <Text
                    style={[styles.infoValue, { color: theme.textPrimary }]}
                  >
                    {cleanerData?.rating
                      ? `${cleanerData.rating} ⭐`
                      : "4.8 ⭐"}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text
                    style={[styles.infoLabel, { color: theme.textSecondary }]}
                  >
                    Biaya Layanan:
                  </Text>
                  <Text
                    style={[styles.infoValue, { color: theme.textPrimary }]}
                  >
                    {cleanerData?.biaya || "Rp 50.000 / Jam"}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={handleHireCleaner}
                  disabled={isHired}
                  style={[
                    styles.hireButton,
                    { backgroundColor: theme.hireButtonBg },
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonText}>
                    {isHired
                      ? "Cleaner Sedang Bertugas"
                      : "Sewa Cleaner (Hire)"}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* TAMPILAN CLEANER */
              <View
                style={[
                  styles.card,
                  { backgroundColor: theme.cardBg, borderColor: theme.border },
                ]}
              >
                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
                  Performa Saya ({cleanerData?.nama || "Budi Santoso"})
                </Text>

                <View style={styles.performanceGrid}>
                  <View style={[styles.perfBox, { backgroundColor: theme.bg }]}>
                    <Text
                      style={[styles.perfLabel, { color: theme.textSecondary }]}
                    >
                      Rating Anda
                    </Text>
                    <Text
                      style={[styles.perfValue, { color: theme.textPrimary }]}
                    >
                      {cleanerData?.rating
                        ? `${cleanerData.rating} ⭐`
                        : "4.8 ⭐"}
                    </Text>
                  </View>

                  <View style={[styles.perfBox, { backgroundColor: theme.bg }]}>
                    <Text
                      style={[styles.perfLabel, { color: theme.textSecondary }]}
                    >
                      Total Selesai
                    </Text>
                    <Text
                      style={[styles.perfValue, { color: theme.textPrimary }]}
                    >
                      {cleanerData?.totalSelesai || 124} Order
                    </Text>
                  </View>

                  <View style={[styles.perfBox, { backgroundColor: theme.bg }]}>
                    <Text
                      style={[styles.perfLabel, { color: theme.textSecondary }]}
                    >
                      Pendapatan
                    </Text>
                    <Text style={[styles.perfValue, { color: "#38A169" }]}>
                      {cleanerData?.totalPendapatan || "Rp 3.500.000"}
                    </Text>
                  </View>

                  <View style={[styles.perfBox, { backgroundColor: theme.bg }]}>
                    <Text
                      style={[styles.perfLabel, { color: theme.textSecondary }]}
                    >
                      Jam Kerja
                    </Text>
                    <Text
                      style={[styles.perfValue, { color: theme.textPrimary }]}
                    >
                      {cleanerData?.jamKerja || "180 Jam"}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </>
        )}

        {/* Tombol Navigasi & Dark Mode */}
        <View style={styles.buttonActionContainer}>
          <TouchableOpacity
            onPress={toggleDarkMode}
            style={[styles.actionButton, { backgroundColor: theme.buttonBg }]}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              Ubah ke {isDarkMode ? "Mode Terang" : "Mode Gelap"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/");
              }
            }}
            style={[styles.actionButton, { backgroundColor: theme.buttonBg }]}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Kembali ke Login Screen</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 20,
  },
  card: {
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cleanerName: { fontSize: 20, fontWeight: "700" },
  cardTitle: { fontSize: 18, fontWeight: "700", marginBottom: 16 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: "700" },
  divider: { height: 1, backgroundColor: "#E2E8F0", marginVertical: 12 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  infoLabel: { fontSize: 14 },
  infoValue: { fontSize: 14, fontWeight: "600" },
  hireButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  performanceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  perfBox: { width: "48%", padding: 12, borderRadius: 8, marginBottom: 10 },
  perfLabel: { fontSize: 12, marginBottom: 4 },
  perfValue: { fontSize: 16, fontWeight: "700" },
  buttonActionContainer: { gap: 12 },
  actionButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
});
