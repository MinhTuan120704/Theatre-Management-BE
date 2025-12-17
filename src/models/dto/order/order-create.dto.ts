export interface OrderCreateDto {
  userId: number;
  totalPrice: number;
  paymentMethod: 'credit_card' | 'paypal' | 'cash';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paidAt?: Date;
  discountId?: number;
  orderedAt: Date;
  tickets?: Array<{
    showtimeId: number;
    seatId: number;
  }>;
  products?: Array<{
    productId: number;
    quantity: number;
  }>;
}
