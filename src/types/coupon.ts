export type DiscountType = 'percentage' | 'fixed';

export interface ICoupon {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  expiresAt: string;
  isActive: boolean;
  usageCount: number;
  usageLimit?: number;
}

export interface CouponValidationResult {
  valid: boolean;
  coupon?: ICoupon;
  discountAmount: number;
  message: string;
}
