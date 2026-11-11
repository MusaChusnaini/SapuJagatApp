import {
  fetchCleanerById,
  fetchRatings,
  fetchBookings,
} from "./api";

import type {
  Cleaner,
  CleanerRating,
  Booking,
} from "../types/cleaner";

export interface CleanerDashboardData {
  cleaner: Cleaner;
  ratings: CleanerRating[];
  bookings: Booking[];
}

export const getCleanerDashboard = async (
  id: number
): Promise<CleanerDashboardData> => {
  const cleaner = await fetchCleanerById(id);

  const [ratings, bookings] = await Promise.all([
    fetchRatings(id),
    fetchBookings(id),
  ]);

  return {
    cleaner,
    ratings,
    bookings,
  };
};
