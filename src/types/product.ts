
export interface Product {
  isHotDeal: boolean;
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

  discountPercent?: number;
  originalPrice?: number;
  rating?: number;
  ratingCount?: number;
  soldCount?: number;
  freeDelivery?: boolean;
}
