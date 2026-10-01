import React, { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  User, 
  PlusCircle, 
  ShieldCheck, 
  PackageCheck, 
  LogOut, 
  Menu, 
  X,
  Phone,
  Database
} from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { isRealSupabaseConfigured } from '../lib/supabase';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenSupabaseModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  searchQuery,
  onSearchChange,
  onOpenSupabaseModal,
}) => {
  const { currentUser, isAdmin, signOut, quickLoginAsAdmin } = useAuth();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-xs">
      {/* Top micro announcement bar */}
      <div className="bg-[#0F5D2E] text-white text-[11px] py-1 px-4 flex items-center justify-between font-medium">
        <div className="flex items-center gap-2 truncate">
          <span className="inline-block w-2 h-2 rounded-full bg-[#1DCBF7] animate-pulse" />
          <span>🇨🇮 Marketplace #1 de Daloa · Paiement 100% WAVE au 0596367219 · Livraison 24h</span>
        </div>
        <div className="hidden md:flex items-center gap-4 shrink-0 text-white/90">
          <a href="tel:0596367219" className="hover:text-white flex items-center gap-1 font-bold">
            <Phone className="w-3 h-3 text-[#1DCBF7]" /> Service Client : 0596367219
          </a>
          <button 
            onClick={onOpenSupabaseModal}
            className="flex items-center gap-1 hover:text-white text-[11px] bg-white/10 px-2 py-0.5 rounded cursor-pointer transition"
            title="État Supabase & Schéma SQL"
          >
            <Database className="w-3 h-3 text-emerald-300" />
            <span>Supabase: {isRealSupabaseConfigured ? 'Connecté' : 'Mode Démo/Actif'}</span>
          </button>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Logo */}
          <div
            onClick={() => onNavigate('home')}
            className="cursor-pointer text-left focus:outline-hidden"
          >
            <Logo size="md" onClick={() => onNavigate('home')} />
          </div>

          {/* Search Bar (Desktop & Tablet) */}
          <div className="hidden sm:flex flex-1 max-w-lg mx-2 lg:mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Chercher un produit à Daloa (ex: moto, bazin, attiéké, tecno...)"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 hover:bg-gray-50 focus:bg-white rounded-xl border border-transparent focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition outline-hidden"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Direct Wave Payment Button */}
            <button
              onClick={() => onNavigate('wave-payment')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black bg-[#1DCBF7] hover:bg-[#0eb7e3] text-gray-950 transition shadow-xs cursor-pointer active:scale-95"
              title="Effectuer un paiement direct Wave au 0596367219"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="hidden sm:inline">Payer Wave</span>
              <span className="sm:hidden font-mono text-[11px]">Wave</span>
            </button>

            {/* Vendre Button */}
            <button
              onClick={() => onNavigate('sell')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-[#0F5D2E] hover:bg-emerald-100 border border-emerald-200 transition"
            >
              <PlusCircle className="w-4 h-4 text-[#0F5D2E]" />
              <span>Vendre à Daloa</span>
            </button>

            {/* Admin Panel Quick Link */}
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs ${
                  currentView === 'admin'
                    ? 'bg-[#0F5D2E] text-white'
                    : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                }`}
                title="Panneau Administrateur Daloa Market"
              >
                <ShieldCheck className="w-4 h-4 text-red-600" />
                <span className="hidden sm:inline">Admin Panel</span>
                <span className="sm:hidden">Admin</span>
              </button>
            )}

            {/* Cart Button with Count Badge & Pop Bounce Animation */}
            <button
              id="header-cart-btn"
              onClick={() => onNavigate('cart')}
              className="relative p-2.5 rounded-xl text-gray-700 hover:text-[#0F5D2E] hover:bg-gray-100 transition cursor-pointer"
              aria-label="Panier d'achats"
            >
              <ShoppingCart id="header-cart-icon" className="w-5 h-5 sm:w-6 sm:h-6 transition-transform" />
              {totalItems > 0 && (
                <span 
                  id="header-cart-badge"
                  className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-[#FF6B00] text-white text-[11px] font-black shadow-md border-2 border-white"
                >
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Account / Profile dropdown */}
            <div className="relative">
              {currentUser ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition focus:outline-hidden"
                  >
                    <img
                      src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                      alt={currentUser.full_name}
                      className="w-8 h-8 rounded-full object-cover border border-emerald-600"
                    />
                    <div className="hidden lg:flex flex-col text-left">
                      <span className="text-xs font-bold text-gray-800 leading-tight truncate max-w-[110px]">
                        {currentUser.full_name.split(' ')[0]}
                      </span>
                      <span className="text-[10px] text-gray-500 capitalize">
                        {currentUser.role === 'admin' ? 'Administrateur' : currentUser.role === 'vendor' ? 'Vendeur' : 'Client'}
                      </span>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-900 truncate">{currentUser.full_name}</p>
                        <p className="text-[11px] text-gray-500 truncate">{currentUser.email}</p>
                        {currentUser.phone && (
                          <p className="text-[10px] text-emerald-700 mt-0.5">{currentUser.phone}</p>
                        )}
                      </div>

                      <button
                        onClick={() => onNavigate('my-orders')}
                        className="w-full px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
                      >
                        <PackageCheck className="w-4 h-4 text-emerald-700" />
                        Mes Commandes
                      </button>

                      <button
                        onClick={() => onNavigate('sell')}
                        className="w-full px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
                      >
                        <PlusCircle className="w-4 h-4 text-[#FF6B00]" />
                        Mettre en vente
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => onNavigate('admin')}
                          className="w-full px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-bold"
                        >
                          <ShieldCheck className="w-4 h-4 text-red-600" />
                          Serveur Admin Daloa
                        </button>
                      )}

                      <div className="border-t border-gray-100 my-1" />

                      <button
                        onClick={() => signOut()}
                        className="w-full px-4 py-2 text-xs text-gray-600 hover:text-red-600 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Se déconnecter
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => onNavigate('login')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 hover:text-[#0F5D2E] hover:bg-gray-100 transition"
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => onNavigate('register')}
                    className="bg-[#FF6B00] hover:bg-[#e05e00] text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-xs"
                  >
                    S'inscrire
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 text-gray-600 hover:text-gray-900"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="sm:hidden pb-3">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Rechercher à Daloa (moto, riz, bazin...)"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-gray-100 rounded-xl border border-transparent focus:border-[#FF6B00] focus:bg-white outline-hidden"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-2 animate-in slide-in-from-top-2">
          <button
            onClick={() => {
              onNavigate('wave-payment');
              setMobileMenuOpen(false);
            }}
            className="w-full py-2.5 px-3 bg-[#1DCBF7] text-gray-950 font-black text-xs rounded-xl flex items-center justify-between shadow-xs"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Payer avec Wave (0596367219)
            </span>
            <span className="text-[10px] bg-white/40 px-2 py-0.5 rounded-full font-bold">Wave CI</span>
          </button>

          <button
            onClick={() => {
              onNavigate('sell');
              setMobileMenuOpen(false);
            }}
            className="w-full py-2.5 px-3 bg-emerald-50 text-[#0F5D2E] font-semibold text-xs rounded-xl flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4" /> Vendre un article à Daloa
            </span>
            <span className="text-[10px] bg-emerald-200 px-2 py-0.5 rounded-full">Gratuit</span>
          </button>

          <button
            onClick={() => {
              onNavigate('my-orders');
              setMobileMenuOpen(false);
            }}
            className="w-full py-2 px-3 text-left text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2"
          >
            <PackageCheck className="w-4 h-4 text-[#0F5D2E]" /> Mes Commandes
          </button>

          {isAdmin ? (
            <button
              onClick={() => {
                onNavigate('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 text-left text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-red-600" /> Panneau Administrateur
            </button>
          ) : (
            <button
              onClick={() => {
                quickLoginAsAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 text-left text-xs text-emerald-800 bg-emerald-50/50 hover:bg-emerald-100 rounded-lg flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-700" /> Connexion test Admin (admin@daloamarket.ci)
            </button>
          )}

          <button
            onClick={() => {
              if (onOpenSupabaseModal) onOpenSupabaseModal();
              setMobileMenuOpen(false);
            }}
            className="w-full py-2 px-3 text-left text-xs text-gray-600 hover:bg-gray-50 rounded-lg flex items-center gap-2"
          >
            <Database className="w-4 h-4 text-gray-500" /> Configuration Supabase / Schéma SQL
          </button>
        </div>
      )}
    </header>
  );
};
