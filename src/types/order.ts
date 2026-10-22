import type { CartItem } from "./cart";

export interface Order {
  id: string;
  username: string;
  date: string;
  items: CartItem[];
  total: number;
  status: "Placed";
}
