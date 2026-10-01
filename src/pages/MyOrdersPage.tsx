import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  Phone, 
  MessageCircle, 
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { Order, OrderStatus } from '../lib/types';
import { DaloaService } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface MyOrdersPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export const MyOrdersPage: React.FC<MyOrdersPageProps> = ({ onNavigate }) => {
  const { currentUser, isVendor, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'buyer' | 'vendor'>('buyer');

  const loadOrders = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      if (activeTab === 'buyer') {
        const data = await DaloaService.getOrders({ userId: currentUser.id });
        setOrders(data);
      } else {
        const data = await DaloaService.getOrders({ vendorId: currentUser.id });
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [currentUser, activeTab]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" /> Livré
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> Annulé
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> En cours de livraison
          </span>
        );
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xs">
          <Package className="w-12 h-12 text-[#0F5D2E] mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">Suivi de vos commandes</h2>
          <p className="text-xs text-gray-500 mb-4">
            Connectez-vous pour voir l'historique et le statut de vos commandes.
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="py-2.5 px-6 bg-[#FF6B00] text-white rounded-xl text-xs font-bold"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">
            Mes Commandes Daloa Market
          </h1>
          <p className="text-xs text-gray-500">
            Consultez le statut de préparation et de livraison de vos articles
          </p>
        </div>

        {/* Tab switcher for vendors */}
        {(isVendor || isAdmin) && (
          <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('buyer')}
              className={`py-1.5 px-3 rounded-lg transition ${
                activeTab === 'buyer' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Mes Achats
            </button>
            <button
              onClick={() => setActiveTab('vendor')}
              className={`py-1.5 px-3 rounded-lg transition ${
                activeTab === 'vendor' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Ventes de mes articles
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-xs">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-900 mb-1">
            Aucune commande pour le moment
          </h3>
          <p className="text-xs text-gray-500 mb-5">
            {activeTab === 'buyer' 
              ? 'Vous n\'avez pas encore effectué d\'achat sur DALOA MARKET.'
              : 'Aucun client n\'a encore commandé l\'un de vos produits.'}
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="py-2.5 px-5 bg-[#0F5D2E] hover:bg-[#0c4723] text-white text-xs font-bold rounded-xl"
          >
            Explorer les produits de Daloa
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-xs transition hover:border-gray-200"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-gray-900">
                    Commande #{order.id}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(order.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                {getStatusBadge(order.status)}
              </div>

              {/* Order Items */}
              <div className="py-3 space-y-2">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                        {item.products?.image_url?.[0] ? (
                          <img src={item.products.image_url[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">📦</div>
                        )}
                      </div>
                      <span className="font-semibold text-gray-800">
                        {item.products?.name || 'Produit Daloa Market'}
                      </span>
                      <span className="text-gray-400 text-[11px]">x{item.quantity}</span>
                    </div>
                    <span className="font-bold text-gray-900">
                      {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1 text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span className="truncate max-w-sm">{order.delivery_address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{order.phone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block">Paiement WAVE</span>
                    <span className="font-black text-[#1DCBF7] text-sm sm:text-base">
                      {order.total_amount.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>

                  <a
                    href={`https://wa.me/2250596367219?text=Bonjour%2C%20je%20suis%20le%20client%20de%20la%20commande%20%23${order.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
                    title="Contacter le service client Wave au 0596367219"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
