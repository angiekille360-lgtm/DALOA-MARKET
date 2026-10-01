export type UserRole = 'user' | 'vendor' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  phone?: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
  last_sign_in_at?: string;
  is_blocked?: boolean;
}

export type ProductCategory = 
  | 'Électronique' 
  | 'Mode' 
  | 'Alimentation' 
  | 'Maison' 
  | 'Véhicules' 
  | 'Services';

export type ProductStatus = 'pending' | 'approved' | 'rejected';

export interface Product {
  id: string;
  user_id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image_url: string[];
  stock: number;
  status: ProductStatus;
  created_at: string;
  // Join / populated fields
  profiles?: UserProfile;
}

export type OrderStatus = 'pending' | 'en_attente' | 'delivered' | 'cancelled';
export type PaymentMethod = 'wave';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  products?: Product;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: OrderStatus;
  delivery_address: string;
  phone: string;
  payment_method: PaymentMethod;
  wave_transaction_id?: string;
  created_at: string;
  users?: UserProfile;
  order_items?: OrderItem[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CategoryInfo {
  id: string;
  name: ProductCategory;
  icon: string;
  description: string;
}

// Nouvelles tables Supabase demandées
export interface ClientSupabase {
  id?: string;
  nom: string;
  telephone: string;
  email: string;
  marque_telephone: string;
  modele_telephone: string;
  navigateur: string;
  created_at?: string;
}

export interface CommandeSupabase {
  id?: string;
  nom_client: string;
  numero_client: string;
  marque_telephone: string;
  produits_achetes: any;
  quantite: number;
  prix_total: number;
  adresse_livraison: string;
  info_supplementaire?: string;
  transaction_wave?: string;
  statut?: string;
  created_at?: string;
}
