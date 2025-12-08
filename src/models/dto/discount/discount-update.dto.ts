export interface DiscountUpdateDto {
  code?: string;
  discountType?: 'percentage' | 'fixed';
  value?: number;
  maxUsage?: number;
  minPurchase?: number;
  expiryDate?: Date;
}
