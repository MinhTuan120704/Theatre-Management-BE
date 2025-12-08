export interface DiscountCreateDto {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  maxUsage?: number;
  minPurchase?: number;
  expiryDate: Date;
}
