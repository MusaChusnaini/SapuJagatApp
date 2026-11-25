import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../../lib/supabase";
import { ThemeContext } from "../../context/ThemeContext";

interface CleanerItem {
  id: string;
  name: string;
  bio: string | null;
  rating: number | null;
  is_available: boolean;
  profile_id: string | null;
}

interface ServiceItem {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
}

export default function UserDashboard() {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const params = useLocalSearchParams();
  const router = useRouter();

  // State Peran & Profil Pengguna Aktif
  const paramRole = Array.isArray(params.currentRole)
    ? params.currentRole[0]
    : params.currentRole;
  const [activeRole, setActiveRole] = useState<"customer" | "cleaner">(
    (paramRole as "customer" | "cleaner") || "customer",
  );
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Pengguna");

  // State Data Cloud Supabase
  const [cleanersList, setCleanersList] = useState<CleanerItem[]>([]);
  const [defaultService, setDefaultService] = useState<ServiceItem | null>(
    null,
  );
  const [myCleanerProfile, setMyCleanerProfile] = useState<CleanerItem | null>(
    null,
  );
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [hiringId, setHiringId] = useState<string | null>(null);

  // ===================================================
  // 1. AMBIL DATA PROFIL & CLOUD DARI SUPABASE
  // ===================================================
  const fetchDashboardData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/");
        return;
      }

      setUserId(user.id);

      // Ambil role & nama dari tabel 'profiles'
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single();

      const resolvedRole =
        (profile?.role as "customer" | "cleaner") || activeRole;
      setActiveRole(resolvedRole);
      if (profile?.full_name) setUserName(profile.full_name);

      if (resolvedRole === "customer") {
        // MODE CUSTOMER: Ambil daftar cleaner & layanan aktif
        const [cleanersRes, servicesRes] = await Promise.all([
          supabase
            .from("cleaners")
            .select("*")
            .order("rating", { ascending: false }),
          supabase
            .from("services")
            .select("*")
            .eq("is_active", true)
            .limit(1)
            .single(),
        ]);

        if (cleanersRes.data) setCleanersList(cleanersRes.data);
        if (servicesRes.data) setDefaultService(servicesRes.data);
      } else {
        // MODE CLEANER: Ambil data profil cleaner & statistik order dari 'bookings'
        const { data: cleanerRow } = await supabase
          .from("cleaners")
          .select("*")
          .eq("profile_id", user.id)
          .single();

        if (cleanerRow) {
          setMyCleanerProfile(cleanerRow);

          const { data: bookingsData } = await supabase
            .from("bookings")
            .select("total_price, status")
            .eq("cleaner_id", cleanerRow.id);

          if (bookingsData) {
            const done = bookingsData.filter((b) => b.status === "completed");
            const income = done.reduce(
              (sum, b) => sum + (b.total_price || 0),
              0,
            );
            setCompletedCount(done.length);
            setTotalIncome(income);
          }
        }
      }
    } catch (err) {
      console.error("Gagal memuat dashboard:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  // ===================================================
  // 2. HANDLER SEWA CLEANER (INSERT KE TABEL BOOKINGS + OPTIMISTIC UI)
  // ===================================================
  const handleHireCleaner = async (cleaner: CleanerItem) => {
    if (!cleaner.is_available || hiringId || !userId) return;

    if (!defaultService) {
      Alert.alert(
        "Layanan Belum Tersedia",
        "Tambahkan minimal 1 data layanan di tabel 'services' Supabase terlebih dahulu.",
      );
      return;
    }

    setHiringId(cleaner.id);

    // Optimistic UI: langsung ubah status di layar sebelum response server selesai
    setCleanersList((prev) =>
      prev.map((item) =>
        item.id === cleaner.id ? { ...item, is_available: false } : item,
      ),
    );

    try {
      const { error } = await supabase.from("bookings").insert([
        {
          user_id: userId,
          service_id: defaultService.id,
          cleaner_id: cleaner.id,
          scheduled_at: new Date().toISOString(),
          address: "Alamat Pelanggan",
          notes: "Pemesanan langsung dari Dashboard",
          total_price: defaultService.price,
          status: "pending",
        },
      ]);

      if (error) throw error;

      Alert.alert("Berhasil!", `Berhasil menyewa ${cleaner.name}.`);
    } catch (err: any) {
      // Rollback jika gagal menyimpan ke database
      setCleanersList((prev) =>
        prev.map((item) =>
          item.id === cleaner.id ? { ...item, is_available: true } : item,
        ),
      );
      Alert.alert("Gagal Menyewa", err.message || "Terjadi kesalahan.");
    } finally {
      setHiringId(null);
    }
  };

  // ===================================================
  // 3. HANDLER LOGOUT (HAPUS SESI TOKEN SECURESTORE)
  // ===================================================
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  const theme = {
    bg: isDarkMode ? "#121212" : "#F4F6F9",
    cardBg: isDarkMode ? "#1E1E1E" : "#FFFFFF",
    textPrimary: isDarkMode ? "#FFFFFF" : "#1A202C",
    textSecondary: isDarkMode ? "#A0AEC0" : "#718096",
    border: isDarkMode ? "#2D3748" : "#E2E8F0",
    buttonBg: "#007AFF",
  };

  const isCustomer = activeRole === "customer";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Dashboard {isCustomer ? "Pengguna" : "Cleaner"}
        </Text>
        <Text
          style={{
            textAlign: "center",
            color: theme.textSecondary,
            marginBottom: 16,
          }}
        >
          Halo, {userName}
        </Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#007AFF"
            style={{ marginVertical: 40 }}
          />
        ) : (
          <>
            {isCustomer ? (
              /* ================= TAMPILAN CUSTOMER ================= */
              cleanersList.length === 0 ? (
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
                    style={{ color: theme.textSecondary, textAlign: "center" }}
                  >
                    Belum ada mitra cleaner terdaftar di database.
                  </Text>
                </View>
              ) : (
                cleanersList.map((cleaner) => {
                  const available = cleaner.is_available;
                  return (
                    <View
                      key={cleaner.id}
                      style={[
                        styles.card,
                        {
                          backgroundColor: theme.cardBg,
                          borderColor: theme.border,
                        },
                      ]}
                    >
                      <View style={styles.cardHeader}>
                        <Text
                          style={[
                            styles.cleanerName,
                            { color: theme.textPrimary },
                          ]}
                        >
                          {cleaner.name}
                        </Text>
                        <View
                          style={[
                            styles.badge,
                            {
                              backgroundColor: available
                                ? "#F0FFF4"
                                : "#FFF5F5",
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.badgeText,
                              { color: available ? "#38A169" : "#E53E3E" },
                            ]}
                          >
                            {available ? "Tersedia" : "Sedang Disewa"}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.divider} />

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
                          {cleaner.rating ?? 5.0} ⭐
                        </Text>
                      </View>

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
                          {defaultService
                            ? `Rp ${defaultService.price.toLocaleString("id-ID")}`
                            : "Rp 50.000 / Jam"}
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => handleHireCleaner(cleaner)}
                        disabled={!available || hiringId === cleaner.id}
                        style={[
                          styles.hireButton,
                          {
                            backgroundColor: available ? "#38A169" : "#A0AEC0",
                          },
                        ]}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.buttonText}>
                          {available
                            ? "Sewa Cleaner (Hire)"
                            : "Cleaner Sedang Bertugas"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })
              )
            ) : (
              /* ================= TAMPILAN CLEANER ================= */
              <View
                style={[
                  styles.card,
                  { backgroundColor: theme.cardBg, borderColor: theme.border },
                ]}
              >
                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
                  Performa Saya ({myCleanerProfile?.name || userName})
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
                      {myCleanerProfile?.rating ?? 5.0} ⭐
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
                      {completedCount} Order
                    </Text>
                  </View>

                  <View style={[styles.perfBox, { backgroundColor: theme.bg }]}>
                    <Text
                      style={[styles.perfLabel, { color: theme.textSecondary }]}
                    >
                      Pendapatan
                    </Text>
                    <Text style={[styles.perfValue, { color: "#38A169" }]}>
                      Rp {totalIncome.toLocaleString("id-ID")}
                    </Text>
                  </View>

                  <View style={[styles.perfBox, { backgroundColor: theme.bg }]}>
                    <Text
                      style={[styles.perfLabel, { color: theme.textSecondary }]}
                    >
                      Status Mitra
                    </Text>
                    <Text
                      style={[styles.perfValue, { color: theme.textPrimary }]}
                    >
                      {myCleanerProfile?.is_available !== false
                        ? "Tersedia"
                        : "Bertugas"}
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
            onPress={handleLogout}
            style={[styles.actionButton, { backgroundColor: "#E53E3E" }]}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Keluar (Sign Out)</Text>
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
    marginTop: 20,
    marginBottom: 4,
  },
  card: {
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
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
  buttonActionContainer: { gap: 12, marginTop: 8 },
  actionButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
});
