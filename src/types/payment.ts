export interface Payment {
  id: string;
  booking_id: string;
  owner_id: string;
  runner_id?: string;
  escrow_status: string;
  amount_cents: number;
  platform_fee_cents: number;
  runner_payout_cents: number;
  currency: string;
  payment_method?: string;
  stripe_payment_id?: string;
  escrow_held_at?: string;
  escrow_released_at?: string;
  refunded_at?: string;
  refund_reason?: string;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface InitiatePaymentRequest {
  booking_id: string;
  amount_cents: number;
  currency: string;
  customer_email: string;
}
