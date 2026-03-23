export interface User {
  id: string;
  name: string;
  whatsapp: string;
  pix_key?: string;
  avatar_url?: string;
  is_seller: boolean;
  is_verified?: boolean;
  is_banned?: boolean;
  created_at: string;
  rating_avg?: number;
  rating_count?: number;
  role?: 'admin' | 'user';
}

export interface Product {
  id: string;
  seller_id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category?: string;
  created_at: string;
  seller_name?: string;
  seller_whatsapp?: string;
  seller_pix_key?: string;
  seller_avatar_url?: string;
  seller_rating_avg?: number;
  seller_rating_count?: number;
  seller_is_verified?: boolean;
  rating_avg?: number;
  rating_count?: number;
  seller_role?: 'admin' | 'user';
}

export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id?: string;
  reported_product_id?: string;
  reason: string;
  details?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  created_at: string;
}

export interface Review {
  id: string;
  buyer_id: string;
  seller_id: string;
  product_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  buyer_name?: string;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  text: string;
  image_url?: string;
  created_at: string;
}

export interface Chat {
  id: string;
  buyer_id: string;
  seller_id: string;
  product_id: string;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  value: number;
  created_at: string;
}
