export interface Refuel {
  date?: Date;
  quantity?: number;
  price?: number;
  paymentMethod?: string;
}

export interface PaymentDistanceAndQuantity {
  card: { distance: number; quantity: number };
  cash: { distance: number; quantity: number };
}

export interface PaymentMethod {
  card: number;
  cash: number;
}
