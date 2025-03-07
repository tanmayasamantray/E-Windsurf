import { CartItem } from './cart-item.model';

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  customerInfo: CustomerInfo;
  paymentMethod: string;
  shippingMethod: string;
  orderNotes?: string;
  orderDate: Date;
  status: OrderStatus;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  companyName?: string;
  country: string;
  streetAddress: string;
  apartment?: string;
  townCity: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
