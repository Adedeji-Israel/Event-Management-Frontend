
export interface TicketType {
  _id?: string; // Mongoose subdoc may include this
  name: "VIP" | "Regular";
  price: number;
  quantity: number;
  sold: number;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  organizer: string; // ObjectId
  status: "draft" | "live" | "ended";
  ticketTypes: TicketType[];
  totalTicketsSold: number;
  totalRevenue: number;
  createdAt: string;
  updatedAt: string;
  bookingsCount?: number;
  revenue: number; 
}
