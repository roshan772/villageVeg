
export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  stock: number;
  category: string;
  description?: string;
  image?: string;
  createdAt: string;
  createdBy: string;
}
