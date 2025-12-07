export interface OrderResponseDto {
  order_id: number;
  user_id: number;
  total_price: number;
  payment_method: 'credit_card' | 'paypal' | 'cash';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paid_at?: Date;
  discount_id?: number;
  ordered_at: Date;
}
