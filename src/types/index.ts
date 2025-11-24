export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  commission: number;
  category: string;
  image: string;
  status: 'approved' | 'pending' | 'rejected';
  sales: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'vendor' | 'affiliate' | 'consumer';
  wallet: number;
}

export interface VendorStats {
  revenue: number;
  sales: number;
  products: number;
  pending: number;
}

export interface AffiliateStats {
  commission: number;
  clicks: number;
  conversions: number;
  rate: number;
}
