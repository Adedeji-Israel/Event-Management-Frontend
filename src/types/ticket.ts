
import type { Event } from "./event";
import type { User } from "./user";
export type PaymentStatus = "pending" | "paid" | "failed";

export interface TicketItem {
  ticketTypeId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Ticket {
  _id: string;
  event: Event; 
  user: User;
  email: string;
  name: string;
  tickets: TicketItem[];
  totalQuantity: number;
  amount: number;
  paymentReference: string;
  status: PaymentStatus;
  ticketId: string;
  purchaseDate: string;
  createdAt: string;
  updatedAt: string;
}
