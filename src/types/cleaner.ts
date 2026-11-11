
export interface Cleaner {
  id: number;
  name: string;
  image: string;
  description: string;
  rating: number;
  price: string;
  status: string;
  totalCompleted: number;
}

export interface CleanerRating {
  id: number;
  cleanerId: number;
  customerName: string;
  rating: number;
  comment: string;
}

export interface Booking {
  id: number;
  cleanerId: number;
  customerName: string;
  service: string;
  date: string;
  status: string;
}
