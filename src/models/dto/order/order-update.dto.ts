export interface OrderUpdateDto {
  userId?: number;
  totalPrice?: number;
  paymentMethod?: 'credit_card' | 'paypal' | 'cash';
  status?: 'pending' | 'completed' | 'failed' | 'cancelled';
  paidAt?: Date;
  discountId?: number;
  orderedAt?: Date;
}
