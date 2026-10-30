import { PaymentMethod, PaymentStatus } from './order';

export interface IPaymentTransaction {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  reference: string;
  phoneNumber?: string;
  receiptNumber?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface MpesaStkPushRequest {
  orderId: string;
  phoneNumber: string;
  amount: number;
  accountReference?: string;
}

export interface MpesaStkPushResponse {
  success: boolean;
  message: string;
  checkoutRequestId?: string;
  merchantRequestId?: string;
  customerMessage?: string;
}

export interface CardPaymentRequest {
  orderId: string;
  amount: number;
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface CardPaymentResponse {
  success: boolean;
  message: string;
  transactionId?: string;
  authCode?: string;
}
