export interface DiscountResponseDto {
  discount_id: number;
  code: string;
  discount_type: 'percentage' | 'fixed';
  value: number;
  max_usage: number;
  min_purchase: number;
  expiry_date: Date;
  created_at: Date;
}
