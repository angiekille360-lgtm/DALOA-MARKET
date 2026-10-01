import { UserProfile, Product, Order, CategoryInfo } from './types';

export const INITIAL_CATEGORIES: CategoryInfo[] = [
  { id: 'electronique', name: 'Électronique', icon: 'Smartphone', description: 'Smartphones, TV, Audio & Accessoires' },
  { id: 'mode', name: 'Mode', icon: 'Shirt', description: 'Vêtements hommes, femmes, pagnes & chaussures' },
  { id: 'alimentation', name: 'Alimentation', icon: 'UtensilsCrossed', description: 'Riz local, attiéké, épicerie & produits frais' },
  { id: 'maison', name: 'Maison', icon: 'Home', description: 'Ventilateurs solaires, électroménager, salon' },
  { id: 'vehicules', name: 'Véhicules', icon: 'Car', description: 'Motos Haojue, tricycles, vélos & pièces' },
  { id: 'services', name: 'Services', icon: 'Wrench', description: 'Réparations, plomberie, livraisons Daloa' },
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-admin-1',
    email: 'admin@daloamarket.ci',
    phone: '0596367219',
    full_name: 'Super Administrateur Daloa',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    role: 'admin',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    last_sign_in_at: new Date().toISOString(),
  },
  {
    id: 'user-vendor-1',
    email: 'kone.boutique@daloamarket.ci',
    phone: '0596367219',
    full_name: 'Boutique Koné & Frères (Grand Marché)',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    role: 'vendor',
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    last_sign_in_at: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
  {
    id: 'user-vendor-2',
    email: 'daloa.tech@gmail.com',
    phone: '0596367219',
    full_name: 'Daloa High Tech (Rond-point Kennedy)',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    role: 'vendor',
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    last_sign_in_at: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: 'user-client-1',
    email: 'traore.jean@gmail.com',
    phone: '0596367219',
    full_name: 'Jean Traoré (Tazibouo)',
    avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    role: 'user',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    last_sign_in_at: new Date(Date.now() - 2 * 60000).toISOString(), // Online (<5 min)
  },
  {
    id: 'user-client-2',
    email: 'aya.yao@yahoo.fr',
    phone: '0596367219',
    full_name: 'Aya Marie-Josée Yao (Commerce)',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    role: 'user',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    last_sign_in_at: new Date(Date.now() - 1 * 60000).toISOString(), // Online
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    user_id: 'user-vendor-2',
    name: 'Smartphone Tecno Spark 20 Pro+ (256Go / 8Go RAM)',
    description: 'Écran AMOLED 120Hz incurvé, Caméra Ultra 108MP, Batterie 5000mAh charge rapide 33W. Garanti 13 mois boutique Rond-point Kennedy Daloa.',
    price: 125000,
    category: 'Électronique',
    image_url: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 14,
    status: 'approved',
    created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
    profiles: INITIAL_USERS[2],
  },
  {
    id: 'prod-2',
    user_id: 'user-vendor-1',
    name: 'Complet Bazin Riche Getzner Authentique 3 Pièces',
    description: 'Bazin 100% coton de qualité supérieure, broderie fil d\'or artisanale faite par les maîtres tailleurs du Grand Marché de Daloa. Idéal fêtes, mariages et réceptions.',
    price: 35000,
    category: 'Mode',
    image_url: [
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 8,
    status: 'approved',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    profiles: INITIAL_USERS[1],
  },
  {
    id: 'prod-3',
    user_id: 'user-vendor-1',
    name: 'Sac de Riz Local Parfumé de Lobo (50 kg)',
    description: 'Riz blanc produit dans la région du Haut-Sassandra (Lobo / Daloa). Grains longs, parfum naturel d\'exception, sans additifs ni conservateurs. Soutenez nos producteurs locaux!',
    price: 24500,
    category: 'Alimentation',
    image_url: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 35,
    status: 'approved',
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    profiles: INITIAL_USERS[1],
  },
  {
    id: 'prod-4',
    user_id: 'user-vendor-2',
    name: 'Moto Haojue 110cc Nouveau Modèle Daloa Express',
    description: 'Moto neuve 0 km, consommation économique (1.8L / 100km), démarrage électrique et kick. Avec papiers de douane en règle et casque offert. Disponible immédiatement à Daloa.',
    price: 635000,
    category: 'Véhicules',
    image_url: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 4,
    status: 'approved',
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    profiles: INITIAL_USERS[2],
  },
  {
    id: 'prod-5',
    user_id: 'user-vendor-2',
    name: 'Ventilateur Rechargeable Solaire 16" Haute Puissance',
    description: 'Autonomie 14 heures sans coupure! Panneau solaire 20W inclus + port USB pour charger vos téléphones. Idéal contre les coupures d\'électricité à Daloa.',
    price: 29500,
    category: 'Maison',
    image_url: [
      'https://images.unsplash.com/photo-1618941716939-553df3c6c278?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 19,
    status: 'approved',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    profiles: INITIAL_USERS[2],
  },
  {
    id: 'prod-6',
    user_id: 'user-vendor-1',
    name: 'Attiéké Frais Garba de Lobia (Colis Spécial 15 boules)',
    description: 'Véritable attiéké frais artisanal de Daloa quartier Lobia. Grain fin, goût acidulé authentique, fraîchement préparé chaque matin. Emballage étanche et propre.',
    price: 4500,
    category: 'Alimentation',
    image_url: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 50,
    status: 'approved',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    profiles: INITIAL_USERS[1],
  },
  // Pending products for Admin review demonstration
  {
    id: 'prod-7',
    user_id: 'user-client-1',
    name: 'Chaussures Mocassins Cuir Véritable Homme',
    description: 'Mocassins neufs pointure 42, cuir souple et semelle antidérapante. Reçu de France mais pointure trop petite.',
    price: 18000,
    category: 'Mode',
    image_url: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 1,
    status: 'pending',
    created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    profiles: INITIAL_USERS[3],
  },
  {
    id: 'prod-8',
    user_id: 'user-client-2',
    name: 'Service Vidange & Dépannage Moto à Domicile Daloa',
    description: 'Mécanicien moto professionnel se déplace chez vous partout à Daloa (Tazibouo, Kennedy, Lobia, Marais). Huile moteur neuve et réglage freins.',
    price: 7500,
    category: 'Services',
    image_url: [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 99,
    status: 'pending',
    created_at: new Date(Date.now() - 1 * 3600000).toISOString(),
    profiles: INITIAL_USERS[4],
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'cmd-dl-1042',
    user_id: 'user-client-1',
    total_amount: 125000,
    status: 'pending',
    delivery_address: 'Quartier Tazibouo, près de l\'Université Jean Lorougnon Guédé, Villa 12',
    phone: '0596367219',
    payment_method: 'wave',
    wave_transaction_id: 'WV-CI-847291',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    users: INITIAL_USERS[3],
    order_items: [
      {
        id: 'item-1',
        order_id: 'cmd-dl-1042',
        product_id: 'prod-1',
        quantity: 1,
        price: 125000,
        products: INITIAL_PRODUCTS[0],
      }
    ],
  },
  {
    id: 'cmd-dl-1041',
    user_id: 'user-client-2',
    total_amount: 39500,
    status: 'delivered',
    delivery_address: 'Quartier Commerce, face Pharmacie des Marais, Daloa',
    phone: '0596367219',
    payment_method: 'wave',
    wave_transaction_id: 'WV-CI-539102',
    created_at: new Date(Date.now() - 18 * 3600000).toISOString(),
    users: INITIAL_USERS[4],
    order_items: [
      {
        id: 'item-2',
        order_id: 'cmd-dl-1041',
        product_id: 'prod-2',
        quantity: 1,
        price: 35000,
        products: INITIAL_PRODUCTS[1],
      },
      {
        id: 'item-3',
        order_id: 'cmd-dl-1041',
        product_id: 'prod-6',
        quantity: 1,
        price: 4500,
        products: INITIAL_PRODUCTS[5],
      }
    ],
  },
  {
    id: 'cmd-dl-1040',
    user_id: 'user-client-1',
    total_amount: 29500,
    status: 'delivered',
    delivery_address: 'Quartier Kennedy, derrière le Collège Moderne, Daloa',
    phone: '0596367219',
    payment_method: 'wave',
    wave_transaction_id: 'WV-CI-119403',
    created_at: new Date(Date.now() - 48 * 3600000).toISOString(),
    users: INITIAL_USERS[3],
    order_items: [
      {
        id: 'item-4',
        order_id: 'cmd-dl-1040',
        product_id: 'prod-5',
        quantity: 1,
        price: 29500,
        products: INITIAL_PRODUCTS[4],
      }
    ],
  }
];

export const DALOA_QUARTIERS = [
  'Tazibouo (Université)',
  'Kennedy (Rond-point)',
  'Centre-Commercial / Grand Marché',
  'Huberson',
  'Lobia',
  'Marais',
  'Soleil',
  'Gbeuliville',
  'Belleville',
  'Abattoir',
  'Garage Ébène',
  'Cité Policière',
  'Balouzon',
  'Autre quartier de Daloa'
];
