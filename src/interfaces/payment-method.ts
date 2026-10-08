export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  badge?: string;
  details?: string[];
}
