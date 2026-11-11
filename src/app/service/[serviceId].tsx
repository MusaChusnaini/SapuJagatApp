import { ThemeContext } from "@/context/ThemeContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const serviceData: Record<string, { title: string; description: string; emoji: string; price: string; duration: string; points: string[] }> = {
  "home-cleaning": { title: "Bersih Rumah", description: "Bantu menjaga rumah tetap rapi, bersih, dan nyaman untuk seluruh keluarga.", emoji: "🏡", price: "Mulai Rp75.000", duration: "2–3 jam", points: ["Menyapu dan mengepel lantai", "Membersihkan permukaan meja", "Merapikan area utama", "Membersihkan area yang sering digunakan"] },
  "deep-cleaning": { title: "Deep Cleaning", description: "Pembersihan lebih menyeluruh untuk area rumah yang membutuhkan perhatian ekstra.", emoji: "✨", price: "Mulai Rp150.000", duration: "3–5 jam", points: ["Pembersihan detail area rumah", "Membersihkan sudut dan celah", "Pembersihan kamar mandi dasar", "Pembersihan permukaan dan lantai"] },
  laundry: { title: "Cuci & Setrika", description: "Perawatan pakaian agar bersih, rapi, dan siap digunakan kembali.", emoji: "👕", price: "Mulai Rp8.000/kg", duration: "Sesuai antrean", points: ["Pencucian pakaian", "Pengeringan sesuai kebutuhan", "Setrika pakaian", "Lipat pakaian dengan rapi"] },
  "office-cleaning": { title: "Bersih Kantor", description: "Menjaga ruang kerja tetap bersih dan nyaman agar aktivitas kerja lebih produktif.", emoji: "🏢", price: "Mulai Rp200.000", duration: "Sesuai luas area", points: ["Membersihkan meja kerja", "Menyapu dan mengepel", "Membersihkan ruang bersama", "Mengumpulkan sampah pada tempatnya"] },
};

export default function ServiceDetailScreen() {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const router = useRouter();
  const { isDarkMode } = useContext(ThemeContext);
  const [requested, setRequested] = useState(false);
  const service = serviceData[String(serviceId)] ?? serviceData["home-cleaning"];
  const c = isDarkMode ? { bg: "#101827", card: "#182438", text: "#F7FAFC", muted: "#A8B4C7", border: "#2C3B52" } : { bg: "#F4F7FB", card: "#FFFFFF", text: "#17243A", muted: "#718096", border: "#E5EAF2" };

  useEffect(() => { setRequested(false); }, [serviceId]);

  const requestService = () => {
    setRequested(true);
    Alert.alert("Permintaan dicatat (demo)", `Kamu memilih layanan ${service.title}. Fitur pemesanan ini masih berupa simulasi.`);
  };

  return <ScrollView style={{ flex: 1, backgroundColor: c.bg }} contentContainerStyle={d.page}>
    <TouchableOpacity style={d.back} onPress={() => router.canGoBack() ? router.back() : router.replace("/dashboard")}><Text style={{ color: c.text, fontWeight: "800" }}>←  Kembali</Text></TouchableOpacity>
    <View style={d.hero}><Text style={d.emoji}>{service.emoji}</Text><Text style={d.eyebrow}>DETAIL LAYANAN SAPUJAGAT</Text><Text style={d.title}>{service.title}</Text><Text style={d.heroCopy}>{service.description}</Text></View>
    <View style={[d.infoCard, { backgroundColor: c.card, borderColor: c.border }]}><View style={d.infoRow}><View><Text style={[d.infoLabel, { color: c.muted }]}>Harga</Text><Text style={d.price}>{service.price}</Text></View><View><Text style={[d.infoLabel, { color: c.muted }]}>Estimasi</Text><Text style={[d.duration, { color: c.text }]}>{service.duration}</Text></View></View>
      <Text style={[d.sectionTitle, { color: c.text }]}>Yang termasuk layanan</Text>
      {service.points.map((point) => <View key={point} style={d.pointRow}><Text style={d.check}>✓</Text><Text style={[d.pointText, { color: c.muted }]}>{point}</Text></View>)}
      <TouchableOpacity style={[d.requestButton, requested && { backgroundColor: "#718096" }]} onPress={requestService}><Text style={d.requestText}>{requested ? "Permintaan dipilih ✓" : "Pilih layanan ini  →"}</Text></TouchableOpacity>
      <Text style={[d.note, { color: c.muted }]}>Catatan: tombol pemesanan masih simulasi untuk kebutuhan demo.</Text>
    </View>
  </ScrollView>;
}

const d = StyleSheet.create({ page: { padding: 20, paddingTop: 26, paddingBottom: 40, maxWidth: 720, width: "100%", alignSelf: "center" }, back: { alignSelf: "flex-start", paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, backgroundColor: "#E9F9F1", marginBottom: 18 }, hero: { backgroundColor: "#123D35", borderRadius: 25, padding: 25, marginBottom: 18 }, emoji: { fontSize: 55, marginBottom: 18 }, eyebrow: { color: "#A8E8CE", fontWeight: "800", letterSpacing: 1, fontSize: 10, marginBottom: 8 }, title: { color: "#FFFFFF", fontSize: 29, fontWeight: "900", marginBottom: 10 }, heroCopy: { color: "#D1E9DF", fontSize: 13, lineHeight: 21 }, infoCard: { borderWidth: 1, borderRadius: 22, padding: 20 }, infoRow: { flexDirection: "row", justifyContent: "space-between", paddingBottom: 22, marginBottom: 22, borderBottomWidth: 1, borderBottomColor: "#E5EAF2" }, infoLabel: { fontSize: 12, marginBottom: 6 }, price: { color: "#159568", fontSize: 17, fontWeight: "900" }, duration: { fontSize: 15, fontWeight: "800" }, sectionTitle: { fontSize: 18, fontWeight: "900", marginBottom: 15 }, pointRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 12 }, check: { color: "#159568", fontWeight: "900", fontSize: 16 }, pointText: { flex: 1, fontSize: 13, lineHeight: 20 }, requestButton: { backgroundColor: "#19A974", borderRadius: 14, alignItems: "center", paddingVertical: 15, marginTop: 16 }, requestText: { color: "#FFFFFF", fontWeight: "900", fontSize: 14 }, note: { textAlign: "center", fontSize: 11, lineHeight: 17, marginTop: 12 } });
