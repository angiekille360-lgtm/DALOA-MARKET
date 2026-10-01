import { createClient } from '@supabase/supabase-js';
import { 
  UserProfile, 
  Product, 
  Order, 
  OrderItem, 
  ProductStatus, 
  OrderStatus, 
  PaymentMethod,
  ProductCategory,
  ClientSupabase,
  CommandeSupabase
} from './types';
import { detectDeviceInfo } from './deviceDetector';
import { 
  INITIAL_USERS, 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS 
} from './mockData';

// Supabase environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isRealSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('placeholder')
);

// Real client (instantiated if credentials exist)
export const realSupabase = isRealSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ============================================================================
// DUAL-MODE SERVICE LAYER WITH LOCAL PERSISTENCE AND SUPABASE API COMPATIBILITY
// ============================================================================

const STORAGE_KEYS = {
  USERS: 'daloa_market_users_v1',
  PRODUCTS: 'daloa_market_products_v1',
  ORDERS: 'daloa_market_orders_v1',
  CURRENT_USER: 'daloa_market_current_user_v1',
  CART: 'daloa_market_cart_v1',
  CLIENTS: 'daloa_market_clients_v2',
  COMMANDES: 'daloa_market_commandes_v2',
};

// Initial clients sample
const INITIAL_CLIENTS: ClientSupabase[] = [
  {
    id: 'cli-001',
    nom: 'Awa Traoré',
    telephone: '0596367219',
    email: 'awa.traore@gmail.com',
    marque_telephone: 'Samsung',
    modele_telephone: 'Galaxy A14',
    navigateur: 'Google Chrome',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'cli-002',
    nom: 'Jean-Marc Kouassi',
    telephone: '0708091011',
    email: 'jm.kouassi@yahoo.fr',
    marque_telephone: 'Tecno',
    modele_telephone: 'Spark 10 Pro',
    navigateur: 'Chrome Mobile',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  }
];

const INITIAL_COMMANDES: CommandeSupabase[] = [
  {
    id: 'cmd-001',
    nom_client: 'Awa Traoré',
    numero_client: '0596367219',
    marque_telephone: 'Samsung (Galaxy A14)',
    produits_achetes: [
      { nom: 'Sac de Riz Parfumé 25kg', quantite: 1, prix: 17500, total: 17500 }
    ],
    quantite: 1,
    prix_total: 18500,
    adresse_livraison: 'Quartier Lobia, face pharmacie',
    info_supplementaire: 'Appeler avant livraison',
    transaction_wave: 'WV-991204',
    statut: 'Payé - à livrer sur 0596367219',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  }
];

// Initialize LocalStorage with seed data if not present
function initializeLocalStore() {
  if (typeof window === 'undefined') return;
  
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CLIENTS)) {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COMMANDES)) {
    localStorage.setItem(STORAGE_KEYS.COMMANDES, JSON.stringify(INITIAL_COMMANDES));
  }
}

initializeLocalStore();

function getStoredClients(): ClientSupabase[] {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    return val ? JSON.parse(val) : INITIAL_CLIENTS;
  } catch {
    return INITIAL_CLIENTS;
  }
}

function setStoredClients(clients: ClientSupabase[]) {
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
}

function getStoredCommandes(): CommandeSupabase[] {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.COMMANDES);
    return val ? JSON.parse(val) : INITIAL_COMMANDES;
  } catch {
    return INITIAL_COMMANDES;
  }
}

function setStoredCommandes(commandes: CommandeSupabase[]) {
  localStorage.setItem(STORAGE_KEYS.COMMANDES, JSON.stringify(commandes));
}

function getStoredUsers(): UserProfile[] {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.USERS);
    return val ? JSON.parse(val) : INITIAL_USERS;
  } catch {
    return INITIAL_USERS;
  }
}

function setStoredUsers(users: UserProfile[]) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function getStoredProducts(): Product[] {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return val ? JSON.parse(val) : INITIAL_PRODUCTS;
  } catch {
    return INITIAL_PRODUCTS;
  }
}

function setStoredProducts(products: Product[]) {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
}

function getStoredOrders(): Order[] {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return val ? JSON.parse(val) : INITIAL_ORDERS;
  } catch {
    return INITIAL_ORDERS;
  }
}

function setStoredOrders(orders: Order[]) {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
}

export const DaloaService = {
  // --------------------------------------------------------------------------
  // AUTHENTICATION
  // --------------------------------------------------------------------------
  async getCurrentUser(): Promise<UserProfile | null> {
    if (isRealSupabaseConfigured && realSupabase) {
      try {
        const { data: { user } } = await realSupabase.auth.getUser();
        if (user) {
          const { data } = await realSupabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          if (data) return data as UserProfile;
        }
      } catch (err) {
        console.warn('Real Supabase auth check error:', err);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  async signIn(email: string, password?: string): Promise<{ user: UserProfile | null; error: string | null }> {
    if (isRealSupabaseConfigured && realSupabase && password) {
      try {
        const { data, error } = await realSupabase.auth.signInWithPassword({ email, password });
        if (error) return { user: null, error: error.message };
        if (data.user) {
          const { data: profile } = await realSupabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          return { user: profile as UserProfile, error: null };
        }
      } catch (e: any) {
        console.warn('Fallback to local auth due to:', e);
      }
    }

    // Local authentication
    const users = getStoredUsers();
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // If logging in as admin@daloamarket.ci
      if (email.toLowerCase() === 'admin@daloamarket.ci') {
        user = {
          id: 'user-admin-1',
          email: 'admin@daloamarket.ci',
          phone: '0596367219',
          full_name: 'Super Administrateur Daloa',
          role: 'admin',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          created_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
        };
        users.unshift(user);
        setStoredUsers(users);
      } else {
        return { user: null, error: 'Identifiants invalides ou utilisateur non trouvé.' };
      }
    }

    if (user.is_blocked) {
      return { user: null, error: 'Ce compte a été suspendu par l\'administrateur.' };
    }

    // Update last_sign_in_at
    user.last_sign_in_at = new Date().toISOString();
    const updatedUsers = users.map(u => u.id === user?.id ? user : u);
    setStoredUsers(updatedUsers);

    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    return { user, error: null };
  },

  async signUp(params: {
    email: string;
    password?: string;
    full_name: string;
    phone: string;
    role?: 'user' | 'vendor';
  }): Promise<{ user: UserProfile | null; error: string | null }> {
    const role = params.email.toLowerCase() === 'admin@daloamarket.ci' ? 'admin' : (params.role || 'user');

    if (isRealSupabaseConfigured && realSupabase && params.password) {
      try {
        const { data, error } = await realSupabase.auth.signUp({
          email: params.email,
          password: params.password,
          options: {
            data: {
              full_name: params.full_name,
              phone: params.phone,
              role: role,
            }
          }
        });
        if (error) return { user: null, error: error.message };
        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: params.email,
            phone: params.phone,
            full_name: params.full_name,
            role: role,
            created_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString(),
          };
          await realSupabase.from('profiles').upsert(profile);
          return { user: profile, error: null };
        }
      } catch (err: any) {
        console.warn('Fallback to local signUp:', err);
      }
    }

    const users = getStoredUsers();
    if (users.some(u => u.email.toLowerCase() === params.email.toLowerCase())) {
      return { user: null, error: 'Un compte avec cet email existe déjà.' };
    }

    const newUser: UserProfile = {
      id: 'usr-' + Date.now(),
      email: params.email,
      full_name: params.full_name,
      phone: params.phone,
      role: role,
      avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
      created_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
    };

    // Auto-record into clients table
    const devInfo = detectDeviceInfo();
    await this.recordClient({
      nom: params.full_name,
      telephone: params.phone,
      email: params.email,
      marque_telephone: devInfo.marque,
      modele_telephone: devInfo.modele,
      navigateur: devInfo.navigateur,
    });

    users.push(newUser);
    setStoredUsers(users);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));

    return { user: newUser, error: null };
  },

  async signOut(): Promise<void> {
    if (isRealSupabaseConfigured && realSupabase) {
      try {
        await realSupabase.auth.signOut();
      } catch (e) {
        console.warn(e);
      }
    }
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  // --------------------------------------------------------------------------
  // PRODUCTS
  // --------------------------------------------------------------------------
  async getProducts(options?: {
    category?: string;
    search?: string;
    status?: ProductStatus | 'all';
    userId?: string;
  }): Promise<Product[]> {
    if (isRealSupabaseConfigured && realSupabase) {
      try {
        let query = realSupabase
          .from('products')
          .select('*, profiles:user_id(id, email, phone, full_name, role)');

        if (options?.status && options.status !== 'all') {
          query = query.eq('status', options.status);
        } else if (!options?.status) {
          query = query.eq('status', 'approved');
        }

        if (options?.category && options.category !== 'all') {
          query = query.eq('category', options.category);
        }

        if (options?.userId) {
          query = query.eq('user_id', options.userId);
        }

        const { data, error } = await query.order('created_at', { ascending: false });
        if (!error && data) return data as Product[];
      } catch (err) {
        console.warn('Real Supabase products fetch error, fallback to local:', err);
      }
    }

    // Local store filtering
    let products = getStoredProducts();
    const users = getStoredUsers();

    // Attach profile reference
    products = products.map(p => {
      const user = users.find(u => u.id === p.user_id);
      return { ...p, profiles: user || p.profiles };
    });

    if (options?.status && options.status !== 'all') {
      products = products.filter(p => p.status === options.status);
    } else if (!options?.status) {
      // Default: only approved
      products = products.filter(p => p.status === 'approved');
    }

    if (options?.category && options.category !== 'all') {
      products = products.filter(p => p.category === options.category);
    }

    if (options?.userId) {
      products = products.filter(p => p.user_id === options.userId);
    }

    if (options?.search) {
      const term = options.search.toLowerCase().trim();
      products = products.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.description?.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      );
    }

    return products;
  },

  async getProductById(id: string): Promise<Product | null> {
    if (isRealSupabaseConfigured && realSupabase) {
      try {
        const { data, error } = await realSupabase
          .from('products')
          .select('*, profiles:user_id(id, email, phone, full_name, role)')
          .eq('id', id)
          .single();
        if (!error && data) return data as Product;
      } catch (e) {
        console.warn(e);
      }
    }

    const products = getStoredProducts();
    const users = getStoredUsers();
    const prod = products.find(p => p.id === id);
    if (!prod) return null;
    const user = users.find(u => u.id === prod.user_id);
    return { ...prod, profiles: user || prod.profiles };
  },

  async createProduct(params: {
    user_id: string;
    name: string;
    description: string;
    price: number;
    category: ProductCategory;
    image_url: string[];
    stock: number;
    isAdmin?: boolean;
  }): Promise<{ product: Product | null; error: string | null }> {
    const status: ProductStatus = params.isAdmin ? 'approved' : 'pending';

    const newProd: Product = {
      id: 'prod-' + Date.now(),
      user_id: params.user_id,
      name: params.name,
      description: params.description,
      price: params.price,
      category: params.category,
      image_url: params.image_url.length > 0 
        ? params.image_url 
        : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'],
      stock: params.stock || 1,
      status: status,
      created_at: new Date().toISOString(),
    };

    if (isRealSupabaseConfigured && realSupabase) {
      try {
        const { data, error } = await realSupabase
          .from('products')
          .insert({
            user_id: params.user_id,
            name: params.name,
            description: params.description,
            price: params.price,
            category: params.category,
            image_url: newProd.image_url,
            stock: params.stock || 1,
            status: status
          })
          .select()
          .single();
        if (!error && data) return { product: data as Product, error: null };
      } catch (err: any) {
        console.warn('Real Supabase insert product failed, fallback local:', err);
      }
    }

    const products = getStoredProducts();
    products.unshift(newProd);
    setStoredProducts(products);
    return { product: newProd, error: null };
  },

  async updateProductStatus(id: string, status: ProductStatus): Promise<boolean> {
    if (isRealSupabaseConfigured && realSupabase) {
      try {
        await realSupabase.from('products').update({ status }).eq('id', id);
      } catch (e) {
        console.warn(e);
      }
    }

    const products = getStoredProducts();
    const updated = products.map(p => p.id === id ? { ...p, status } : p);
    setStoredProducts(updated);
    return true;
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (isRealSupabaseConfigured && realSupabase) {
      try {
        await realSupabase.from('products').delete().eq('id', id);
      } catch (e) {
        console.warn(e);
      }
    }

    const products = getStoredProducts();
    const updated = products.filter(p => p.id !== id);
    setStoredProducts(updated);
    return true;
  },

  // --------------------------------------------------------------------------
  // ORDERS & COMMANDES
  // --------------------------------------------------------------------------
  async createOrder(params: {
    user_id: string;
    items: { product: Product; quantity: number }[];
    delivery_address: string;
    phone: string;
    payment_method: PaymentMethod;
    wave_transaction_id?: string;
    status?: OrderStatus;
    customer_name?: string;
    info_supplementaire?: string;
  }): Promise<{ order: Order | null; error: string | null }> {
    const total_amount = params.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const orderId = 'cmd-dl-' + Math.floor(1000 + Math.random() * 9000);
    const orderStatus: OrderStatus = params.status || 'en_attente';
    const devInfo = detectDeviceInfo();

    const orderItems: OrderItem[] = params.items.map((item, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      order_id: orderId,
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
      products: item.product,
    }));

    const users = getStoredUsers();
    const user = users.find(u => u.id === params.user_id);
    const clientName = params.customer_name || user?.full_name || 'Client Daloa';
    const totalQty = params.items.reduce((sum, item) => sum + item.quantity, 0);

    // Schema Commande Supabase officiel demandé
    const commandePayload: CommandeSupabase = {
      nom_client: clientName,
      numero_client: params.phone,
      marque_telephone: `${devInfo.marque} (${devInfo.modele})`,
      produits_achetes: params.items.map(item => ({
        nom: item.product.name,
        prix: item.product.price,
        quantite: item.quantity,
        total: item.product.price * item.quantity,
      })),
      quantite: totalQty,
      prix_total: total_amount,
      adresse_livraison: params.delivery_address,
      info_supplementaire: params.info_supplementaire || 'Paiement Wave vérifié sur 0596367219',
      transaction_wave: params.wave_transaction_id || 'WV-PENDING',
      statut: 'Payé - à livrer sur 0596367219',
      created_at: new Date().toISOString(),
    };

    // Enregistrement automatique dans la table clients
    await this.recordClient({
      nom: clientName,
      telephone: params.phone,
      email: user?.email || `${params.phone}@daloamarket.ci`,
      marque_telephone: devInfo.marque,
      modele_telephone: devInfo.modele,
      navigateur: devInfo.navigateur,
    });

    // Enregistrement automatique dans la table commandes
    await this.recordCommande(commandePayload);

    const newOrder: Order = {
      id: orderId,
      user_id: params.user_id,
      total_amount,
      status: orderStatus,
      delivery_address: params.delivery_address,
      phone: params.phone,
      payment_method: params.payment_method,
      wave_transaction_id: params.wave_transaction_id,
      created_at: new Date().toISOString(),
      users: user,
      order_items: orderItems,
    };

    if (isRealSupabaseConfigured && realSupabase) {
      try {
        // Insertion compatible avec l'ancienne table orders si existante
        const res2 = await realSupabase
          .from('orders')
          .insert({
            user_id: params.user_id,
            total_amount,
            status: orderStatus,
            delivery_address: params.delivery_address,
            phone: params.phone,
            payment_method: params.payment_method,
            wave_transaction_id: params.wave_transaction_id,
          })
          .select()
          .single();

        if (!res2.error && res2.data) {
          const itemsPayload = params.items.map(item => ({
            order_id: res2.data.id,
            product_id: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          }));
          await realSupabase.from('order_items').insert(itemsPayload);
          return { order: { ...res2.data, order_items: orderItems, users: user }, error: null };
        }
      } catch (err) {
        console.warn('Real Supabase orders insert note:', err);
      }
    }

    const orders = getStoredOrders();
    orders.unshift(newOrder);
    setStoredOrders(orders);
    return { order: newOrder, error: null };
  },

  // Enregistrement direct table 'clients'
  async recordClient(client: Partial<ClientSupabase>): Promise<boolean> {
    const devInfo = detectDeviceInfo();
    const newClient: ClientSupabase = {
      id: client.id || 'cli-' + Date.now(),
      nom: client.nom || 'Client Daloa',
      telephone: client.telephone || '0596367219',
      email: client.email || 'client@daloamarket.ci',
      marque_telephone: client.marque_telephone || devInfo.marque,
      modele_telephone: client.modele_telephone || devInfo.modele,
      navigateur: client.navigateur || devInfo.navigateur,
      created_at: new Date().toISOString(),
    };

    if (isRealSupabaseConfigured && realSupabase) {
      try {
        await realSupabase.from('clients').insert({
          nom: newClient.nom,
          telephone: newClient.telephone,
          email: newClient.email,
          marque_telephone: newClient.marque_telephone,
          modele_telephone: newClient.modele_telephone,
          navigateur: newClient.navigateur,
        });
      } catch (e) {
        console.warn('Supabase clients insert error:', e);
      }
    }

    // Persistance locale
    const stored = getStoredClients();
    stored.unshift(newClient);
    setStoredClients(stored);
    return true;
  },

  // Enregistrement direct table 'commandes'
  async recordCommande(commande: Partial<CommandeSupabase>): Promise<boolean> {
    const devInfo = detectDeviceInfo();
    const newCmd: CommandeSupabase = {
      id: commande.id || 'cmd-' + Date.now(),
      nom_client: commande.nom_client || 'Client Daloa',
      numero_client: commande.numero_client || '0596367219',
      marque_telephone: commande.marque_telephone || `${devInfo.marque} (${devInfo.modele})`,
      produits_achetes: commande.produits_achetes || [],
      quantite: commande.quantite || 1,
      prix_total: commande.prix_total || 0,
      adresse_livraison: commande.adresse_livraison || 'Daloa Centre',
      info_supplementaire: commande.info_supplementaire || 'Paiement Wave au 0596367219',
      transaction_wave: commande.transaction_wave || 'WV-PENDING',
      statut: commande.statut || 'Payé - à livrer sur 0596367219',
      created_at: new Date().toISOString(),
    };

    if (isRealSupabaseConfigured && realSupabase) {
      try {
        await realSupabase.from('commandes').insert({
          nom_client: newCmd.nom_client,
          numero_client: newCmd.numero_client,
          marque_telephone: newCmd.marque_telephone,
          produits_achetes: newCmd.produits_achetes,
          quantite: newCmd.quantite,
          prix_total: newCmd.prix_total,
          adresse_livraison: newCmd.adresse_livraison,
          info_supplementaire: newCmd.info_supplementaire,
          transaction_wave: newCmd.transaction_wave,
          statut: newCmd.statut,
        });
      } catch (e) {
        console.warn('Supabase commandes insert error:', e);
      }
    }

    // Persistance locale
    const stored = getStoredCommandes();
    stored.unshift(newCmd);
    setStoredCommandes(stored);
    return true;
  },

  // Récupération des clients (table 'clients')
  async getClients(): Promise<ClientSupabase[]> {
    if (isRealSupabaseConfigured && realSupabase) {
      try {
        const { data, error } = await realSupabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as ClientSupabase[];
      } catch (e) {
        console.warn('Supabase getClients error, fallback to local:', e);
      }
    }
    return getStoredClients();
  },

  // Récupération des ventes (table 'commandes')
  async getCommandes(): Promise<CommandeSupabase[]> {
    if (isRealSupabaseConfigured && realSupabase) {
      try {
        const { data, error } = await realSupabase
          .from('commandes')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as CommandeSupabase[];
      } catch (e) {
        console.warn('Supabase getCommandes error, fallback to local:', e);
      }
    }
    return getStoredCommandes();
  },

  async getOrders(options?: { userId?: string; vendorId?: string }): Promise<Order[]> {
    if (isRealSupabaseConfigured && realSupabase) {
      try {
        let query = realSupabase
          .from('orders')
          .select('*, users:user_id(*), order_items(*, products(*))')
          .order('created_at', { ascending: false });

        if (options?.userId) {
          query = query.eq('user_id', options.userId);
        }

        const { data, error } = await query;
        if (!error && data) return data as Order[];
      } catch (err) {
        console.warn('Real Supabase fetch orders error, fallback to local:', err);
      }
    }

    let orders = getStoredOrders();

    if (options?.userId) {
      orders = orders.filter(o => o.user_id === options.userId);
    }

    if (options?.vendorId) {
      // Vendor orders: orders that contain products owned by this vendor
      orders = orders.filter(o => 
        o.order_items?.some(item => item.products?.user_id === options.vendorId)
      );
    }

    return orders;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    if (isRealSupabaseConfigured && realSupabase) {
      try {
        await realSupabase.from('orders').update({ status }).eq('id', orderId);
      } catch (err) {
        console.warn(err);
      }
    }

    const orders = getStoredOrders();
    const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
    setStoredOrders(updated);
    return true;
  },

  // --------------------------------------------------------------------------
  // ADMIN & USERS
  // --------------------------------------------------------------------------
  async getAllUsers(): Promise<UserProfile[]> {
    if (isRealSupabaseConfigured && realSupabase) {
      try {
        const { data, error } = await realSupabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data as UserProfile[];
      } catch (err) {
        console.warn(err);
      }
    }

    return getStoredUsers();
  },

  async toggleBlockUser(userId: string): Promise<boolean> {
    const users = getStoredUsers();
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, is_blocked: !u.is_blocked };
      }
      return u;
    });
    setStoredUsers(updated);
    return true;
  },

  // --------------------------------------------------------------------------
  // STORAGE
  // --------------------------------------------------------------------------
  async uploadProductImage(file: File): Promise<string> {
    if (isRealSupabaseConfigured && realSupabase) {
      try {
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
        const { error } = await realSupabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (!error) {
          const { data } = realSupabase.storage
            .from('product-images')
            .getPublicUrl(fileName);
          return data.publicUrl;
        }
      } catch (e) {
        console.warn('Supabase storage upload error, fallback to data url:', e);
      }
    }

    // Fallback: convert file to Base64 Data URL so it is fully persistent in local store
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // Reset to seed data
  resetDemoData(): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};
