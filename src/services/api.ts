import type {
  Cleaner,
  CleanerRating,
  Booking,
} from "../types/cleaner";

// ==========================================
// 1. CREATE DATA SECTION
// ==========================================

// 1.1 CREATE CLEANERS DATA
const cleaners: Cleaner[] = [
  {
    id: 1,
    name: "Budi Santoso",
    image: "👨",
    description: "Cleaner profesional dan berpengalaman dalam membersihkan rumah dan kantor.",
    rating: 4.8,
    price: "Rp 50.000 / Jam",
    status: "Tersedia",
    totalCompleted: 124,
  },
  {
    id: 2,
    name: "Andi Pratama",
    image: "👨‍🔧",
    description: "Berpengalaman dalam layanan kebersihan rumah dan perawatan ruangan.",
    rating: 4.7,
    price: "Rp 45.000 / Jam",
    status: "Tersedia",
    totalCompleted: 98,
  },
];

// 1.2 CREATE RATINGS DATA
const ratings: CleanerRating[] = [
  {
    id: 1,
    cleanerId: 1,
    customerName: "Siti Aminah",
    rating: 5,
    comment: "Hasil pembersihan sangat memuaskan.",
  },
  {
    id: 2,
    cleanerId: 1,
    customerName: "Rina Putri",
    rating: 4.5,
    comment: "Pekerjaan rapi dan tepat waktu.",
  },
  {
    id: 3,
    cleanerId: 2,
    customerName: "Dewi Lestari",
    rating: 4.7,
    comment: "Pelayanan sangat baik.",
  },
];

// 1.3 CREATE BOOKINGS DATA
const bookings: Booking[] = [
  {
    id: 1,
    cleanerId: 1,
    customerName: "Siti Aminah",
    service: "Cleaning Rumah",
    date: "11 November 2026",
    status: "Selesai",
  },
  {
    id: 2,
    cleanerId: 1,
    customerName: "Rina Putri",
    service: "Cleaning Kamar",
    date: "12 November 2026",
    status: "Menunggu",
  },
];

// ==========================================
// 2. FETCH DATA SECTION
// ==========================================

// 2.1 FETCH CLEANERS
export const fetchCleaners = (): Promise<Cleaner[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (cleaners.length > 0) {
        resolve(cleaners);
      } else {
        reject(new Error("Data cleaner tidak ditemukan."));
      }
    }, 1000);
  });
};

// 2.2 FETCH CLEANER BY ID
export const fetchCleanerById = (
  id: number
): Promise<Cleaner> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const cleaner = cleaners.find((item) => item.id === id);

      if (cleaner) {
        resolve(cleaner);
      } else {
        reject(new Error("Cleaner tidak ditemukan."));
      }
    }, 500);
  });
};

// 2.3 FETCH RATINGS
export const fetchRatings = (
  cleanerId: number
): Promise<CleanerRating[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const result = ratings.filter(
        (item) => item.cleanerId === cleanerId
      );

      if (result.length > 0) {
        resolve(result);
      } else {
        reject(new Error("Rating belum tersedia."));
      }
    }, 500);
  });
};

// 2.4 FETCH BOOKINGS
export const fetchBookings = (
  cleanerId: number
): Promise<Booking[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const result = bookings.filter(
        (item) => item.cleanerId === cleanerId
      );

      resolve(result);
    }, 500);
  });
};
