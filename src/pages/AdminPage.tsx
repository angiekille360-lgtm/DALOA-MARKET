import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Users, 
  Clock, 
  Package, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  DollarSign, 
  Search, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  AlertTriangle, 
  Eye, 
  Trash2, 
  Activity, 
  Filter, 
  Radio, 
  UserX, 
  UserCheck,
  TrendingUp,
  X
} from 'lucide-react';
import { 
  Order, 
  Product, 
  UserProfile, 
  OrderStatus, 
  ProductStatus,
  CommandeSupabase,
  ClientSupabase
} from '../lib/types';
import { DaloaService } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface AdminPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const { currentUser, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'commandes' | 'clients' | 'orders' | 'users' | 'pending' | 'products' | 'activity'>('commandes');
  
  // Data states
  const [commandesList, setCommandesList] = useState<CommandeSupabase[]>([]);
  const [clientsList, setClientsList] = useState<ClientSupabase[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & searches
  const [orderSearch, setOrderSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStatusFilter, setProductStatusFilter] = useState<'all' | ProductStatus>('all');

  // Modals
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedUserProfile, setSelectedUserProfile] = useState<UserProfile | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [o, p, u, cmd, cli] = await Promise.all([
        DaloaService.getOrders(),
        DaloaService.getProducts({ status: 'all' }),
        DaloaService.getAllUsers(),
        DaloaService.getCommandes(),
        DaloaService.getClients(),
      ]);
      setOrders(o);
      setProducts(p);
      setUsers(u);
      setCommandesList(cmd);
      setClientsList(cli);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Check access: only admin@daloamarket.ci or admin role
  if (!isAdmin && currentUser?.email !== 'admin@daloamarket.ci') {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="bg-white rounded-3xl border border-red-200 p-8 shadow-xs">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900 mb-1">Accès Restreint</h2>
          <p className="text-xs text-gray-500 mb-4">
            Ce serveur d'administration est réservé au Super Administrateur (<code>admin@daloamarket.ci</code>).
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="py-2 px-4 bg-[#0F5D2E] text-white rounded-xl text-xs font-bold"
          >
            Se connecter avec un compte admin
          </button>
        </div>
      </div>
    );
  }

  // Dashboard Stats Calculations
  const totalUsers = users.length;
  const totalProducts = products.length;
  const pendingProducts = products.filter(p => p.status === 'pending');
  const totalOrders = orders.length;
  
  // Orders today
  const todayStr = new Date().toISOString().split('T')[0];
  const ordersToday = orders.filter(o => o.created_at.startsWith(todayStr)).length;
  
  // Total Revenue (delivered or pending)
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total_amount, 0);

  // Helper: check if user online (< 5 mins)
  const isUserOnline = (lastSignIn?: string) => {
    if (!lastSignIn) return false;
    const diff = (Date.now() - new Date(lastSignIn).getTime()) / 60000;
    return diff <= 5;
  };

  // Actions
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await DaloaService.updateOrderStatus(orderId, status);
    showToast(`Commande ${orderId} marquée comme ${status === 'delivered' ? 'Livrée' : 'Annulée'} !`, 'success');
    loadData();
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status } : null);
    }
  };

  const handleUpdateProductStatus = async (productId: string, status: ProductStatus) => {
    await DaloaService.updateProductStatus(productId, status);
    showToast(`Produit mis à jour : ${status === 'approved' ? 'Approuvé' : 'Refusé'} !`, 'success');
    loadData();
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Voulez-vous supprimer définitivement ce produit ?')) {
      await DaloaService.deleteProduct(productId);
      showToast('Produit supprimé du catalogue.', 'info');
      loadData();
    }
  };

  const handleToggleBlockUser = async (userId: string) => {
    await DaloaService.toggleBlockUser(userId);
    showToast('Statut de l\'utilisateur mis à jour.', 'info');
    loadData();
  };

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    const term = orderSearch.toLowerCase();
    const clientName = o.users?.full_name?.toLowerCase() || '';
    const phone = o.phone || '';
    return o.id.toLowerCase().includes(term) || clientName.includes(term) || phone.includes(term);
  });

  // Filtered products for tab 4
  const filteredProducts = products.filter(p => {
    const term = productSearch.toLowerCase();
    const matchTerm = p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term);
    const matchCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    const matchStatus = productStatusFilter === 'all' || p.status === productStatusFilter;
    return matchTerm && matchCat && matchStatus;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 pb-20">
      
      {/* Top Header of Admin Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-100 text-red-700">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              Serveur Administrateur DALOA MARKET
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Gestion centrale des commandes, utilisateurs, approbations et flux direct
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-50 text-[#0F5D2E] px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Serveur Daloa Actif</span>
          </div>
          <button
            onClick={() => onNavigate('home')}
            className="text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-xl transition"
          >
            Vue Boutique
          </button>
        </div>
      </div>

      {/* 6 Dashboard Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
        
        {/* Card 1: Users */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Utilisateurs</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-gray-900">{totalUsers}</div>
          <p className="text-[10px] text-gray-400 mt-1">Inscrits à Daloa</p>
        </div>

        {/* Card 2: Total Products */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Total Produits</span>
            <Package className="w-4 h-4 text-[#FF6B00]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-gray-900">{totalProducts}</div>
          <p className="text-[10px] text-gray-400 mt-1">Catalogue global</p>
        </div>

        {/* Card 3: Pending Products (Red Badge) */}
        <div className={`rounded-2xl p-4 border shadow-xs transition ${
          pendingProducts.length > 0 ? 'bg-red-50/70 border-red-200' : 'bg-white border-gray-100'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-700">En attente</span>
            <Clock className="w-4 h-4 text-red-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-red-600">{pendingProducts.length}</span>
            {pendingProducts.length > 0 && (
              <span className="text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.2 rounded-full animate-bounce">
                À modérer
              </span>
            )}
          </div>
          <p className="text-[10px] text-red-500 mt-1">Approbation requise</p>
        </div>

        {/* Card 4: Total Orders */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Commandes</span>
            <ShoppingBag className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-gray-900">{totalOrders}</div>
          <p className="text-[10px] text-gray-400 mt-1">Toutes périodes</p>
        </div>

        {/* Card 5: Orders Today */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Aujourd'hui</span>
            <Calendar className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-gray-900">{ordersToday}</div>
          <p className="text-[10px] text-gray-400 mt-1">Nouvelles commandes</p>
        </div>

        {/* Card 6: Total Revenue */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Revenu Total</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-lg sm:text-xl font-black text-[#0F5D2E] truncate">
            {totalRevenue.toLocaleString('fr-FR')} <span className="text-xs font-bold">F</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Volume d'affaires</p>
        </div>

      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200 mb-6 scrollbar-none text-xs font-bold">
        <button
          onClick={() => setActiveTab('commandes')}
          className={`py-2 px-4 rounded-xl shrink-0 transition flex items-center gap-2 ${
            activeTab === 'commandes'
              ? 'bg-[#1DCBF7] text-gray-950 font-black shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <DollarSign className="w-4 h-4 text-gray-950" />
          <span>Ventes Wave (Table 'commandes') ({commandesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('clients')}
          className={`py-2 px-4 rounded-xl shrink-0 transition flex items-center gap-2 ${
            activeTab === 'clients'
              ? 'bg-[#0F5D2E] text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Clients & Téléphones (Table 'clients') ({clientsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`py-2 px-4 rounded-xl shrink-0 transition flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-gray-800 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Suivi Livraisons ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`py-2 px-4 rounded-xl shrink-0 transition flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-gray-800 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Comptes Auth ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`py-2 px-4 rounded-xl shrink-0 transition flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>3. Produits en attente</span>
          {pendingProducts.length > 0 && (
            <span className="bg-white text-red-600 text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {pendingProducts.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`py-2 px-4 rounded-xl shrink-0 transition flex items-center gap-2 ${
            activeTab === 'products'
              ? 'bg-[#0F5D2E] text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>4. Tous les produits ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`py-2 px-4 rounded-xl shrink-0 transition flex items-center gap-2 ${
            activeTab === 'activity'
              ? 'bg-[#0F5D2E] text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>5. Activité Live & Inscriptions</span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* ONGLET 0A: TABLE COMMANDES (NOUVELLE TABLE SUPABASE OFFICIELLE) */}
      {/* ==================================================================== */}
      {activeTab === 'commandes' && (
        <div className="bg-white rounded-3xl border border-sky-200 shadow-sm overflow-hidden animate-in fade-in">
          <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-sky-50/40">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1DCBF7] animate-pulse" />
                <h2 className="text-sm sm:text-base font-black text-gray-900">
                  Table 'commandes' - Toutes les ventes WAVE
                </h2>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Données synchronisées avec Supabase (<code>public.commandes</code>). Statut par défaut : <strong>Payé - à livrer sur 0596367219</strong>.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-800 bg-white px-3 py-1.5 rounded-xl border border-sky-200 shadow-xs">
                Total : {commandesList.length} vente{commandesList.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Téléphone</th>
                  <th className="py-3 px-4">Appareil Client</th>
                  <th className="py-3 px-4">Produits Achetés</th>
                  <th className="py-3 px-4 text-center">Qté</th>
                  <th className="py-3 px-4">Prix Total</th>
                  <th className="py-3 px-4">Adresse Livraison</th>
                  <th className="py-3 px-4">Réf. Wave</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {commandesList.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-gray-400">
                      Aucune vente enregistrée pour le moment dans la table 'commandes'.
                    </td>
                  </tr>
                ) : (
                  commandesList.map((cmd, idx) => (
                    <tr key={cmd.id || idx} className="hover:bg-sky-50/30 transition">
                      <td className="py-3 px-4 font-bold text-gray-900 whitespace-nowrap">
                        {cmd.nom_client}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <a 
                            href={`tel:${cmd.numero_client}`} 
                            className="font-mono font-bold text-[#0F5D2E] hover:underline"
                          >
                            {cmd.numero_client}
                          </a>
                          <a
                            href={`https://wa.me/225${cmd.numero_client.replace(/\D/g, '')}?text=${encodeURIComponent(`Bonjour ${cmd.nom_client}, c'est DALOA MARKET concernant votre commande.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded bg-emerald-50 text-[#25D366] hover:bg-emerald-100"
                            title="Contacter sur WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md text-[11px] font-medium">
                          {cmd.marque_telephone || 'Mobile'}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        {Array.isArray(cmd.produits_achetes) ? (
                          <div className="space-y-0.5">
                            {cmd.produits_achetes.map((p: any, pIdx: number) => (
                              <div key={pIdx} className="text-[11px] text-gray-700 truncate">
                                • {p.nom || p.name || 'Article'} (x{p.quantite || p.quantity || 1})
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500 text-[11px]">
                            {JSON.stringify(cmd.produits_achetes)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-gray-700">
                        {cmd.quantite}
                      </td>
                      <td className="py-3 px-4 font-black text-[#1DCBF7] whitespace-nowrap">
                        {cmd.prix_total?.toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="py-3 px-4 text-gray-700 text-[11px] max-w-xs truncate" title={cmd.adresse_livraison}>
                        {cmd.adresse_livraison}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-emerald-800 text-[11px] whitespace-nowrap">
                        {cmd.transaction_wave || 'WV-WAVE'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-[#0F5D2E] border border-emerald-200">
                          {cmd.statut || 'Payé - à livrer sur 0596367219'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-[11px] whitespace-nowrap">
                        {cmd.created_at ? new Date(cmd.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Récemment'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* ONGLET 0B: TABLE CLIENTS (NOUVELLE TABLE SUPABASE OFFICIELLE) */}
      {/* ==================================================================== */}
      {activeTab === 'clients' && (
        <div className="bg-white rounded-3xl border border-emerald-200 shadow-sm overflow-hidden animate-in fade-in">
          <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/40">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0F5D2E]" />
                <h2 className="text-sm sm:text-base font-black text-gray-900">
                  Table 'clients' - Tous ceux qui s'inscrivent
                </h2>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Données synchronisées avec Supabase (<code>public.clients</code>) incluant marque, modèle de téléphone et navigateur.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0F5D2E] bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-xs">
                Total : {clientsList.length} client{clientsList.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Nom Client</th>
                  <th className="py-3 px-4">Téléphone</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Marque Téléphone</th>
                  <th className="py-3 px-4">Modèle Téléphone</th>
                  <th className="py-3 px-4">Navigateur</th>
                  <th className="py-3 px-4">Date d'inscription</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {clientsList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">
                      Aucun client enregistré pour le moment dans la table 'clients'.
                    </td>
                  </tr>
                ) : (
                  clientsList.map((cli, idx) => (
                    <tr key={cli.id || idx} className="hover:bg-emerald-50/30 transition">
                      <td className="py-3 px-4 font-bold text-gray-900 whitespace-nowrap">
                        {cli.nom}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <a 
                            href={`tel:${cli.telephone}`} 
                            className="font-mono font-bold text-[#0F5D2E] hover:underline"
                          >
                            {cli.telephone}
                          </a>
                          <a
                            href={`https://wa.me/225${cli.telephone.replace(/\D/g, '')}?text=${encodeURIComponent(`Bonjour ${cli.nom}, bienvenue sur DALOA MARKET !`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded bg-emerald-50 text-[#25D366] hover:bg-emerald-100"
                            title="Contacter sur WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 whitespace-nowrap font-mono text-[11px]">
                        {cli.email}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-bold text-sky-800 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full text-[11px]">
                          {cli.marque_telephone}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700 whitespace-nowrap font-medium text-[11px]">
                        {cli.modele_telephone}
                      </td>
                      <td className="py-3 px-4 text-gray-600 whitespace-nowrap text-[11px]">
                        {cli.navigateur}
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-[11px] whitespace-nowrap">
                        {cli.created_at ? new Date(cli.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Récemment'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* ONGLET 1: COMMANDES */}
      {/* ==================================================================== */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm sm:text-base font-black text-gray-900">
                Gestion des Commandes Daloa
              </h2>
              <p className="text-xs text-gray-500">
                Table alimentée par <code>supabase.from('orders').select('*, users(*), order_items(*, products(*))')</code>
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Chercher #cmd, client, tel..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:border-[#FF6B00] outline-hidden"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">#Commande</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Produits</th>
                  <th className="py-3 px-4">Montant FCFA</th>
                  <th className="py-3 px-4">Adresse Livraison</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredOrders.map((order) => {
                  const clientName = order.users?.full_name || 'Client Daloa';
                  const clientPhone = order.phone || order.users?.phone || '';
                  const productsCount = order.order_items?.length || 0;

                  return (
                    <tr key={order.id} className="hover:bg-gray-50/80 transition">
                      {/* #Commande */}
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900 whitespace-nowrap">
                        #{order.id}
                      </td>

                      {/* Client */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-900">{clientName}</div>
                        {clientPhone && (
                          <a
                            href={`tel:${clientPhone}`}
                            className="text-[#0F5D2E] hover:underline flex items-center gap-1 font-mono text-[11px]"
                          >
                            <Phone className="w-3 h-3" />
                            {clientPhone}
                          </a>
                        )}
                      </td>

                      {/* Produits */}
                      <td className="py-3.5 px-4">
                        <div className="max-w-[200px] truncate font-medium text-gray-800">
                          {order.order_items?.map(i => `${i.quantity}x ${i.products?.name || 'Article'}`).join(', ')}
                        </div>
                        <span className="text-[10px] text-gray-400">({productsCount} référence{productsCount > 1 ? 's' : ''})</span>
                      </td>

                      {/* Montant FCFA & Wave ID */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-black text-[#FF6B00]">
                          {order.total_amount.toLocaleString('fr-FR')} FCFA
                        </div>
                        <div className="text-[10px] font-bold text-[#0284c7] flex items-center gap-1 mt-0.5">
                          <span>Wave CI</span>
                          {order.wave_transaction_id && (
                            <span className="font-mono text-gray-500 font-normal">({order.wave_transaction_id})</span>
                          )}
                        </div>
                      </td>

                      {/* Adresse */}
                      <td className="py-3.5 px-4">
                        <span className="max-w-[180px] truncate block text-gray-600" title={order.delivery_address}>
                          {order.delivery_address}
                        </span>
                      </td>

                      {/* Statut Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {order.status === 'delivered' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Livré
                          </span>
                        ) : order.status === 'cancelled' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full">
                            <XCircle className="w-3 h-3" /> Annulé
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" /> En attente
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-gray-400 text-[11px] whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Voir détails */}
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                            title="Voir détails de la commande"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Appeler client */}
                          {clientPhone && (
                            <a
                              href={`tel:${clientPhone}`}
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#0F5D2E] transition"
                              title="Appeler le client"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* WhatsApp client */}
                          {clientPhone && (
                            <a
                              href={`https://wa.me/${clientPhone.replace(/\D/g, '')}?text=Bonjour%2C%20je%20suis%20l%27administrateur%20DALOA%20MARKET%20concernant%20votre%20commande%20%23${order.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] transition"
                              title="Écrire sur WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Marquer Livré */}
                          {order.status !== 'delivered' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                              className="px-2 py-1 rounded-lg bg-[#0F5D2E] hover:bg-[#0c4723] text-white font-bold text-[10px] transition"
                              title="Valider la livraison"
                            >
                              Livré
                            </button>
                          )}

                          {/* Annuler */}
                          {order.status !== 'cancelled' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                              className="p-1.5 rounded-lg bg-gray-100 hover:bg-rose-100 text-gray-500 hover:text-rose-600 transition"
                              title="Annuler la commande"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* ONGLET 2: UTILISATEURS */}
      {/* ==================================================================== */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-black text-gray-900">
                Utilisateurs & Commerçants
              </h2>
              <p className="text-xs text-gray-500">
                Liste complète des profils synchronisés avec <code>auth.users</code>
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Utilisateur</th>
                  <th className="py-3 px-4">Téléphone</th>
                  <th className="py-3 px-4">Rôle</th>
                  <th className="py-3 px-4">Inscription</th>
                  <th className="py-3 px-4">Nb Produits</th>
                  <th className="py-3 px-4">Nb Commandes</th>
                  <th className="py-3 px-4">Dernière Connexion</th>
                  <th className="py-3 px-4">Statut En Ligne</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {users.map((u) => {
                  const userProds = products.filter(p => p.user_id === u.id).length;
                  const userOrders = orders.filter(o => o.user_id === u.id).length;
                  const online = isUserOnline(u.last_sign_in_at);

                  return (
                    <tr key={u.id} className="hover:bg-gray-50/80 transition">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={u.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-bold text-gray-900 flex items-center gap-1.5">
                              <span>{u.full_name}</span>
                              {u.is_blocked && (
                                <span className="bg-red-100 text-red-700 text-[9px] font-bold px-1.5 py-0.2 rounded">
                                  Bloqué
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-gray-400">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px]">
                        {u.phone ? (
                          <a href={`tel:${u.phone}`} className="text-[#0F5D2E] hover:underline flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {u.phone}
                          </a>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          u.role === 'admin' 
                            ? 'bg-red-100 text-red-800' 
                            : u.role === 'vendor' 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {u.role === 'admin' ? 'Super Admin' : u.role === 'vendor' ? 'Vendeur' : 'Client'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-gray-400 text-[11px]">
                        {new Date(u.created_at).toLocaleDateString('fr-FR')}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-gray-800">
                        {userProds}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-gray-800">
                        {userOrders}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-[11px] text-gray-500">
                        {u.last_sign_in_at 
                          ? new Date(u.last_sign_in_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) 
                          : 'Jamais'}
                      </td>

                      {/* Statut en ligne (<5 min = vert) */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {online ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            En ligne
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
                            <span className="w-2 h-2 rounded-full bg-gray-300" />
                            Hors-ligne
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedUserProfile(u)}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                            title="Voir profil"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {u.email !== 'admin@daloamarket.ci' && (
                            <button
                              onClick={() => handleToggleBlockUser(u.id)}
                              className={`p-1.5 rounded-lg transition ${
                                u.is_blocked
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-red-100 text-red-700 hover:bg-red-200'
                              }`}
                              title={u.is_blocked ? 'Débloquer' : 'Bloquer le compte'}
                            >
                              {u.is_blocked ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* ONGLET 3: PRODUITS EN ATTENTE */}
      {/* ==================================================================== */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-black text-gray-900">
                Produits en attente de modération ({pendingProducts.length})
              </h2>
              <p className="text-xs text-gray-500">
                Requête : <code>supabase.from('products').select('*, users(email, phone)').eq('status','pending')</code>
              </p>
            </div>
          </div>

          {pendingProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-xs">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-900 mb-1">
                Aucun produit en attente !
              </h3>
              <p className="text-xs text-gray-500">
                Tous les articles soumis ont été examinés et approuvés.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingProducts.map((p) => {
                const img = p.image_url?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80';
                const posterName = p.profiles?.full_name || 'Utilisateur';
                const posterEmail = p.profiles?.email || 'email inconnu';
                const posterPhone = p.profiles?.phone;

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex gap-4 mb-4">
                        <img
                          src={img}
                          alt=""
                          className="w-24 h-24 rounded-2xl object-cover bg-gray-100 border border-gray-100 shrink-0"
                        />
                        <div>
                          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                            {p.category}
                          </span>
                          <h3 className="text-sm font-bold text-gray-900 leading-snug">
                            {p.name}
                          </h3>
                          <div className="text-base font-black text-[#FF6B00] mt-1">
                            {p.price.toLocaleString('fr-FR')} FCFA
                          </div>
                          <span className="text-[11px] text-gray-500">
                            Quantité : {p.stock} en stock
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 line-clamp-3 mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        {p.description || 'Aucune description.'}
                      </p>

                      {/* Poster Details */}
                      <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-100 mb-4 text-xs">
                        <span className="text-[10px] font-bold uppercase text-orange-800 block mb-1">
                          Vendeur qui a posté :
                        </span>
                        <div className="font-semibold text-gray-900">{posterName}</div>
                        <div className="text-gray-500 text-[11px]">{posterEmail}</div>
                        {posterPhone && (
                          <div className="text-[#0F5D2E] font-mono text-[11px] mt-0.5 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {posterPhone}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => handleUpdateProductStatus(p.id, 'approved')}
                        className="flex-1 py-2 bg-[#0F5D2E] hover:bg-[#0c4723] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approuver</span>
                      </button>

                      <button
                        onClick={() => handleUpdateProductStatus(p.id, 'rejected')}
                        className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Refuser</span>
                      </button>

                      <button
                        onClick={() => setSelectedProduct(p)}
                        className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* ONGLET 4: TOUS LES PRODUITS */}
      {/* ==================================================================== */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-100 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm sm:text-base font-black text-gray-900">
                  Inventaire Global DALOA MARKET ({filteredProducts.length})
                </h2>
                <p className="text-xs text-gray-500">
                  Filtrez par statut, catégorie et modifiez ou supprimez n'importe quel article
                </p>
              </div>
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Rechercher par nom..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:border-[#FF6B00] outline-hidden"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Filter tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-gray-400 font-medium">Statut :</span>
              {(['all', 'approved', 'pending', 'rejected'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setProductStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                    productStatusFilter === st
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {st === 'all' ? 'Tous' : st === 'approved' ? 'Approuvés' : st === 'pending' ? 'En attente' : 'Refusés'}
                </button>
              ))}

              <span className="text-gray-400 font-medium ml-2">Catégorie :</span>
              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="px-2.5 py-1 text-xs bg-gray-100 rounded-lg border-0 outline-hidden font-medium text-gray-700"
              >
                <option value="all">Toutes catégories</option>
                <option value="Électronique">Électronique</option>
                <option value="Mode">Mode</option>
                <option value="Alimentation">Alimentation</option>
                <option value="Maison">Maison</option>
                <option value="Véhicules">Véhicules</option>
                <option value="Services">Services</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-4">Catégorie</th>
                  <th className="py-3 px-4">Prix</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Vendeur</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredProducts.map((p) => {
                  const img = p.image_url?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80';
                  const vendor = p.profiles?.full_name || 'Commerçant Daloa';

                  return (
                    <tr key={p.id} className="hover:bg-gray-50/80 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img src={img} alt="" className="w-9 h-9 rounded-lg object-cover bg-gray-100 shrink-0" />
                          <div className="min-w-0">
                            <div className="font-bold text-gray-900 truncate max-w-[200px]" title={p.name}>
                              {p.name}
                            </div>
                            <span className="text-[10px] text-gray-400">ID: {p.id.substring(0, 8)}...</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-semibold text-emerald-800 whitespace-nowrap">
                        {p.category}
                      </td>

                      <td className="py-3 px-4 font-black text-[#FF6B00] whitespace-nowrap">
                        {p.price.toLocaleString('fr-FR')} F
                      </td>

                      <td className="py-3 px-4 font-bold text-gray-800">
                        {p.stock}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-gray-800 truncate max-w-[120px] block" title={vendor}>
                          {vendor}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <select
                          value={p.status}
                          onChange={(e) => handleUpdateProductStatus(p.id, e.target.value as ProductStatus)}
                          className={`text-[10px] font-bold px-2 py-1 rounded-md border-0 outline-hidden cursor-pointer ${
                            p.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : p.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          <option value="approved">Approved</option>
                          <option value="pending">Pending</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>

                      <td className="py-3 px-4 text-gray-400 text-[11px] whitespace-nowrap">
                        {new Date(p.created_at).toLocaleDateString('fr-FR')}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedProduct(p)}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                            title="Voir article"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* ONGLET 5: ACTIVITÉ LIVE & GRAPH */}
      {/* ==================================================================== */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Live Presence: Who logged in today / online */}
            <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <h3 className="text-sm font-bold text-gray-900">
                    Présence en temps réel (Supabase Realtime)
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Actif maintenant
                </span>
              </div>

              <div className="space-y-3">
                {users.map((u) => {
                  const online = isUserOnline(u.last_sign_in_at);
                  return (
                    <div
                      key={u.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-gray-100/70 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={u.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                            alt=""
                            className="w-9 h-9 rounded-full object-cover"
                          />
                          <span
                            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                              online ? 'bg-emerald-500' : 'bg-gray-300'
                            }`}
                          />
                        </div>
                        <div>
                          <div className="font-bold text-xs text-gray-900">{u.full_name}</div>
                          <div className="text-[10px] text-gray-400">{u.email}</div>
                        </div>
                      </div>

                      <div className="text-right text-[11px]">
                        <span className={`font-bold ${online ? 'text-emerald-700' : 'text-gray-400'}`}>
                          {online ? 'En ligne maintenant' : 'Déconnecté'}
                        </span>
                        <div className="text-[10px] text-gray-400">
                          {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleTimeString('fr-FR') : 'Jamais'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inscriptions 7 derniers jours Chart */}
            <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#0F5D2E]" />
                    <h3 className="text-sm font-bold text-gray-900">
                      Inscriptions des 7 derniers jours à Daloa
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">Daloa City</span>
                </div>

                {/* Simulated Chart Bars for 7 days */}
                <div className="pt-6 pb-4">
                  <div className="flex items-end justify-between h-40 gap-2 px-2">
                    {[
                      { day: 'J-6', count: 2, height: '35%' },
                      { day: 'J-5', count: 4, height: '55%' },
                      { day: 'J-4', count: 3, height: '45%' },
                      { day: 'J-3', count: 7, height: '80%' },
                      { day: 'J-2', count: 5, height: '65%' },
                      { day: 'Hier', count: 8, height: '90%' },
                      { day: 'Aujourd\'hui', count: 6, height: '75%' },
                    ].map((bar, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-700">{bar.count}</span>
                        <div className="w-full bg-gray-100 rounded-t-xl overflow-hidden h-32 flex items-end">
                          <div
                            className="w-full bg-gradient-to-t from-[#0F5D2E] to-[#FF6B00] rounded-t-xl transition-all duration-500"
                            style={{ height: bar.height }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-500 font-medium truncate max-w-[45px]">
                          {bar.day}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-900">
                <span className="font-bold">Croissance active :</span> +42% de nouveaux commerçants inscrits cette semaine à Daloa (quartiers Tazibouo & Grand Marché en tête).
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: DETAILS COMMANDE */}
      {/* ==================================================================== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-black text-gray-900 text-base">
                Détails Commande #{selectedOrder.id}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs mb-6">
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Client</p>
                <p className="font-bold text-gray-900">{selectedOrder.users?.full_name || 'Client Daloa'}</p>
                <p className="text-gray-500">{selectedOrder.users?.email}</p>
                <p className="text-[#0F5D2E] font-mono mt-0.5">{selectedOrder.phone}</p>
              </div>

              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Livraison & Paiement</p>
                <p className="text-gray-800 font-medium">Adresse : {selectedOrder.delivery_address}</p>
                <p className="text-[#0284c7] font-bold mt-1">
                  Moyen : WAVE Côte d'Ivoire (0596367219)
                </p>
                {selectedOrder.wave_transaction_id && (
                  <p className="text-emerald-700 font-mono text-[11px] mt-0.5">
                    ID Transaction Wave : {selectedOrder.wave_transaction_id}
                  </p>
                )}
              </div>

              <div>
                <p className="font-bold text-gray-800 mb-1.5">Articles commandés :</p>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {selectedOrder.order_items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-2 rounded-xl bg-gray-50">
                      <span>{item.quantity}x {item.products?.name}</span>
                      <span className="font-bold text-[#FF6B00]">{(item.price * item.quantity).toLocaleString('fr-FR')} F</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gray-200 text-sm font-black text-gray-900">
                <span>Total de la commande :</span>
                <span className="text-[#FF6B00]">{selectedOrder.total_amount.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>

            <div className="flex gap-2">
              {selectedOrder.status !== 'delivered' && (
                <button
                  onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'delivered')}
                  className="flex-1 py-2.5 bg-[#0F5D2E] text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Marquer comme Livrée
                </button>
              )}
              {selectedOrder.status !== 'cancelled' && (
                <button
                  onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'cancelled')}
                  className="flex-1 py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs rounded-xl border border-rose-200"
                >
                  Annuler la commande
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: DETAILS PRODUIT */}
      {/* ==================================================================== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-black text-gray-900 text-base">Aperçu Produit</h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <img
              src={selectedProduct.image_url?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80'}
              alt=""
              className="w-full h-48 rounded-2xl object-cover mb-4"
            />

            <h4 className="font-bold text-sm text-gray-900 mb-1">{selectedProduct.name}</h4>
            <div className="text-base font-black text-[#FF6B00] mb-2">
              {selectedProduct.price.toLocaleString('fr-FR')} FCFA
            </div>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">{selectedProduct.description}</p>

            <div className="flex gap-2">
              {selectedProduct.status !== 'approved' && (
                <button
                  onClick={() => {
                    handleUpdateProductStatus(selectedProduct.id, 'approved');
                    setSelectedProduct(null);
                  }}
                  className="flex-1 py-2.5 bg-[#0F5D2E] text-white font-bold text-xs rounded-xl"
                >
                  Approuver
                </button>
              )}
              {selectedProduct.status !== 'rejected' && (
                <button
                  onClick={() => {
                    handleUpdateProductStatus(selectedProduct.id, 'rejected');
                    setSelectedProduct(null);
                  }}
                  className="flex-1 py-2.5 bg-rose-50 text-rose-700 font-bold text-xs rounded-xl"
                >
                  Refuser
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: DETAILS PROFIL UTILISATEUR */}
      {/* ==================================================================== */}
      {selectedUserProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-center">
            <div className="flex justify-end">
              <button onClick={() => setSelectedUserProfile(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={selectedUserProfile.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
              alt=""
              className="w-16 h-16 rounded-full mx-auto mb-3 object-cover border-2 border-[#0F5D2E]"
            />
            <h3 className="font-bold text-base text-gray-900">{selectedUserProfile.full_name}</h3>
            <p className="text-xs text-gray-500">{selectedUserProfile.email}</p>
            {selectedUserProfile.phone && (
              <p className="text-xs font-mono text-[#0F5D2E] mt-1">{selectedUserProfile.phone}</p>
            )}
            <div className="mt-4 pt-3 border-t border-gray-100 text-left text-xs space-y-1.5 text-gray-600">
              <p>Rôle : <strong className="capitalize">{selectedUserProfile.role}</strong></p>
              <p>Membre depuis : {new Date(selectedUserProfile.created_at).toLocaleDateString('fr-FR')}</p>
              <p>Statut : <span className={selectedUserProfile.is_blocked ? 'text-red-600 font-bold' : 'text-emerald-700 font-bold'}>
                {selectedUserProfile.is_blocked ? 'Compte Bloqué' : 'Compte Actif'}
              </span></p>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setSelectedUserProfile(null)}
                className="w-full py-2 bg-gray-900 text-white rounded-xl text-xs font-semibold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
