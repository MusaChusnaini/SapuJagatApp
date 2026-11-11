
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
import { getCleanerDashboard } from "../../services/cleanerService";
import type { CleanerDashboardData } from "../../services/cleanerService";

export default function UserDashboard() {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);

  const params = useLocalSearchParams();
  const currentRole = Array.isArray(params.currentRole)
    ? params.currentRole[0]
    : params.currentRole;

  const router = useRouter();

  // ==========================================
  // 1. STATE LOKAL
  // ==========================================

  const [dashboardData, setDashboardData] =
    useState<CleanerDashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHired, setIsHired] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // ==========================================
  // 2. FETCH API DATA
  // ==========================================

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getCleanerDashboard(1);

        if (isMounted) {
          setDashboardData(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal mengambil data cleaner."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [retryCount]);

  // ==========================================
  // 3. HANDLER TOMBOL HIRE
  // ==========================================

  const handleHireCleaner = () => {
    if (isHired || !dashboardData) return;

    setIsHired(true);

    Alert.alert(
      "Berhasil!",
      `Berhasil menyewa ${dashboardData.cleaner.name}.`
    );
  };

  // ==========================================
  // 4. THEME CONFIGURATION
  // ==========================================

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

  // ==========================================
  // 5. DASHBOARD UI
  // ==========================================

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.bg }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Dashboard {isUser ? "Pengguna" : "Cleaner"}
        </Text>

        {/* LOADING INDICATOR */}

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#007AFF"
            style={{ marginVertical: 40 }}
          />
        ) : error ? (
          /* ERROR HANDLING */

          <View
            style={{
              alignItems: "center",
              marginVertical: 30,
            }}
          >
            <Text style={{ color: "red", marginBottom: 12 }}>
              {error}
            </Text>

            <TouchableOpacity
              onPress={() => setRetryCount((prev) => prev + 1)}
              style={[
                styles.actionButton,
                { backgroundColor: theme.buttonBg },
              ]}
            >
              <Text style={styles.buttonText}>Coba Lagi</Text>
            </TouchableOpacity>
          </View>
        ) : dashboardData ? (
          <>
            {isUser ? (
              /* ==================================
                 DASHBOARD PENGGUNA
              ================================== */

              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.cardBg,
                    borderColor: theme.border,
                  },
                ]}
              >
                {/* NAMA CLEANER DAN STATUS */}

                <View style={styles.cardHeader}>
                  <Text
                    style={[
                      styles.cleanerName,
                      { color: theme.textPrimary },
                    ]}
                  >
                    {dashboardData.cleaner.name}
                  </Text>

                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: theme.badgeBg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        { color: theme.badgeText },
                      ]}
                    >
                      {isHired
                        ? "Sedang Disewa"
                        : dashboardData.cleaner.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* RATING */}

                <View style={styles.infoRow}>
                  <Text
                    style={[
                      styles.infoLabel,
                      { color: theme.textSecondary },
                    ]}
                  >
                    Rating:
                  </Text>

                  <Text
                    style={[
                      styles.infoValue,
                      { color: theme.textPrimary },
                    ]}
                  >
                    {dashboardData.cleaner.rating} ⭐
                  </Text>
                </View>

                {/* BIAYA LAYANAN */}

                <View style={styles.infoRow}>
                  <Text
                    style={[
                      styles.infoLabel,
                      { color: theme.textSecondary },
                    ]}
                  >
                    Biaya Layanan:
                  </Text>

                  <Text
                    style={[
                      styles.infoValue,
                      { color: theme.textPrimary },
                    ]}
                  >
                    {dashboardData.cleaner.price}
                  </Text>
                </View>

                {/* DESKRIPSI CLEANER */}

                <View style={styles.infoRow}>
                  <Text
                    style={[
                      styles.infoLabel,
                      { color: theme.textSecondary },
                    ]}
                  >
                    Deskripsi:
                  </Text>

                  <Text
                    style={[
                      styles.infoValue,
                      { color: theme.textPrimary },
                      { flex: 1, textAlign: "right" },
                    ]}
                  >
                    {dashboardData.cleaner.description}
                  </Text>
                </View>

                {/* TOMBOL HIRE */}

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

                {/* DATA RATING PELANGGAN */}

                <View style={styles.divider} />

                <Text
                  style={[
                    styles.cardTitle,
                    { color: theme.textPrimary },
                  ]}
                >
                  Ulasan Pelanggan
                </Text>

                {dashboardData.ratings.map((item) => (
                  <View
                    key={item.id}
                    style={{ marginBottom: 12 }}
                  >
                    <Text
                      style={{
                        color: theme.textPrimary,
                        fontWeight: "600",
                      }}
                    >
                      {item.customerName} - ⭐ {item.rating}
                    </Text>

                    <Text style={{ color: theme.textSecondary }}>
                      {item.comment}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              /* ==================================
                 DASHBOARD CLEANER
              ================================== */

              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.cardBg,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.cardTitle,
                    { color: theme.textPrimary },
                  ]}
                >
                  Performa Saya ({dashboardData.cleaner.name})
                </Text>

                <View style={styles.performanceGrid}>
                  {/* RATING */}

                  <View
                    style={[
                      styles.perfBox,
                      { backgroundColor: theme.bg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.perfLabel,
                        { color: theme.textSecondary },
                      ]}
                    >
                      Rating Anda
                    </Text>

                    <Text
                      style={[
                        styles.perfValue,
                        { color: theme.textPrimary },
                      ]}
                    >
                      {dashboardData.cleaner.rating} ⭐
                    </Text>
                  </View>

                  {/* TOTAL SELESAI */}

                  <View
                    style={[
                      styles.perfBox,
                      { backgroundColor: theme.bg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.perfLabel,
                        { color: theme.textSecondary },
                      ]}
                    >
                      Total Selesai
                    </Text>

                    <Text
                      style={[
                        styles.perfValue,
                        { color: theme.textPrimary },
                      ]}
                    >
                      {dashboardData.cleaner.totalCompleted} Order
                    </Text>
                  </View>

                  {/* PENDAPATAN */}

                  <View
                    style={[
                      styles.perfBox,
                      { backgroundColor: theme.bg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.perfLabel,
                        { color: theme.textSecondary },
                      ]}
                    >
                      Pendapatan
                    </Text>

                    <Text
                      style={[
                        styles.perfValue,
                        { color: "#38A169" },
                      ]}
                    >
                      Rp 3.500.000
                    </Text>
                  </View>

                  {/* JAM KERJA */}

                  <View
                    style={[
                      styles.perfBox,
                      { backgroundColor: theme.bg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.perfLabel,
                        { color: theme.textSecondary },
                      ]}
                    >
                      Jam Kerja
                    </Text>

                    <Text
                      style={[
                        styles.perfValue,
                        { color: theme.textPrimary },
                      ]}
                    >
                      180 Jam
                    </Text>
                  </View>
                </View>

                {/* RIWAYAT BOOKING */}

                <View style={styles.divider} />

                <Text
                  style={[
                    styles.cardTitle,
                    { color: theme.textPrimary },
                  ]}
                >
                  Riwayat Booking
                </Text>

                {dashboardData.bookings.map((item) => (
                  <View
                    key={item.id}
                    style={{
                      marginBottom: 12,
                      padding: 10,
                      backgroundColor: theme.bg,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: theme.textPrimary,
                        fontWeight: "600",
                      }}
                    >
                      {item.customerName}
                    </Text>

                    <Text style={{ color: theme.textSecondary }}>
                      {item.service}
                    </Text>

                    <Text style={{ color: theme.textSecondary }}>
                      {item.date}
                    </Text>

                    <Text
                      style={{
                        color:
                          item.status === "Selesai"
                            ? "#38A169"
                            : "#D69E2E",
                        fontWeight: "600",
                      }}
                    >
                      {item.status}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </>
        ) : null}

        {/* ==================================
            TOMBOL NAVIGASI DAN DARK MODE
        ================================== */}

        <View style={styles.buttonActionContainer}>
          <TouchableOpacity
            onPress={toggleDarkMode}
            style={[
              styles.actionButton,
              { backgroundColor: theme.buttonBg },
            ]}
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
            style={[
              styles.actionButton,
              { backgroundColor: theme.buttonBg },
            ]}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              Kembali ke Login Screen
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ==========================================
// 6. STYLING
// ==========================================

const styles = StyleSheet.create({
  container: { flex: 1 },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

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

  cleanerName: {
    fontSize: 20,
    fontWeight: "700",
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 12,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },

  infoLabel: {
    fontSize: 14,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "600",
  },

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

  perfBox: {
    width: "48%",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },

  perfLabel: {
    fontSize: 12,
    marginBottom: 4,
  },

  perfValue: {
    fontSize: 16,
    fontWeight: "700",
  },

  buttonActionContainer: {
    gap: 12,
  },

  actionButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
