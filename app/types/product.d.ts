// app/types/product.ts
export interface Product {
  _id: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  quantity: number;
  minStock: number;
  category: string;
  supplier: string;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  sku: string;
  price: number;
  quantity: number;
  minStock: number;
  category: string;
  supplier: string;
  status: "active" | "inactive";
}

export interface Transaction {
  id: string;
  type: "IN" | "OUT";
  quantity: number;
  date: string;
  user: string;
  notes: string;
}

export interface User {
  role: string;
  name: string;
}

export interface StockStatus {
  status: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}
