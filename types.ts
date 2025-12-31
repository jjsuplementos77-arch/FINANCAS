
export type PaymentMethod = 'PIX' | 'CARD' | 'CASH';

export interface Product {
  id: string;
  name: string;
  photo: string | null;
  costPrice: number;
  sellingPrice: number;
  stock: number;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;     // Valor final da venda
  totalCost: number;      // Custo de investimento
  totalBasePrice: number; // Valor original de venda
  date: string;           // ISO string
  customerName: string;
  paymentMethod: PaymentMethod;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  type: 'sale' | 'product' | 'system';
}

export enum Tab {
  Inventory = 'inventory',
  Sales = 'sales',
  Reports = 'reports'
}
