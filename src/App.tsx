import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AddToCartCelebration } from './components/AddToCartCelebration';

import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AuthPage } from './pages/AuthPage';
import { SellPage } from './pages/SellPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { AdminPage } from './pages/AdminPage';
import { WavePaymentPage } from './pages/WavePaymentPage';

type ViewType = 
  | 'home' 
  | 'product' 
  | 'login' 
  | 'register' 
  | 'sell' 
  | 'cart' 
  | 'checkout' 
  | 'wave-payment'
  | 'my-orders' 
  | 'admin';

function MainApp() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [activeParam, setActiveParam] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);
  const { lastAddedProduct, clearLastAddedProduct } = useCart();

  // Sync with browser URL / history
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/' || path === '') {
        setCurrentView('home');
      } else if (path.startsWith('/product/')) {
        setCurrentView('product');
        setActiveParam(path.replace('/product/', ''));
      } else if (path === '/login') {
        setCurrentView('login');
      } else if (path === '/register') {
        setCurrentView('register');
      } else if (path === '/sell') {
        setCurrentView('sell');
      } else if (path === '/cart') {
        setCurrentView('cart');
      } else if (path === '/checkout') {
        setCurrentView('checkout');
      } else if (path.startsWith('/wave-payment')) {
        setCurrentView('wave-payment');
        const qOrder = new URLSearchParams(window.location.search).get('orderId');
        if (qOrder) setActiveParam(qOrder);
      } else if (path === '/my-orders') {
        setCurrentView('my-orders');
      } else if (path === '/admin') {
        setCurrentView('admin');
      }
    };

    handlePopState();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (view: string, param?: string) => {
    setCurrentView(view as ViewType);
    if (param) setActiveParam(param);

    // Update history state
    let targetPath = '/';
    if (view === 'product' && param) targetPath = `/product/${param}`;
    else if (view !== 'home') targetPath = `/${view}`;

    window.history.pushState({}, '', targetPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans selection:bg-[#FF6B00] selection:text-white">
      {/* PWA Install Banner */}
      <PWAInstallBanner />

      {/* Header */}
      <Header
        currentView={currentView}
        onNavigate={navigate}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (currentView !== 'home') {
            navigate('home');
          }
        }}
        onOpenSupabaseModal={() => setSupabaseModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {currentView === 'home' && (
          <HomePage onNavigate={navigate} searchQuery={searchQuery} />
        )}

        {currentView === 'product' && (
          <ProductDetailPage productId={activeParam} onNavigate={navigate} />
        )}

        {(currentView === 'login' || currentView === 'register') && (
          <AuthPage initialMode={currentView} onNavigate={navigate} />
        )}

        {currentView === 'sell' && (
          <SellPage onNavigate={navigate} />
        )}

        {currentView === 'cart' && (
          <CartPage onNavigate={navigate} />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage onNavigate={navigate} />
        )}

        {currentView === 'wave-payment' && (
          <WavePaymentPage onNavigate={navigate} orderIdParam={activeParam} />
        )}

        {currentView === 'my-orders' && (
          <MyOrdersPage onNavigate={navigate} />
        )}

        {currentView === 'admin' && (
          <AdminPage onNavigate={navigate} />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigate} />

      {/* Floating WhatsApp Service Client Button */}
      <FloatingWhatsApp />

      {/* Visual Animation: Confetti & Sautillante Validation Icon */}
      <AddToCartCelebration
        lastAddedProduct={lastAddedProduct}
        onClose={clearLastAddedProduct}
        onGoToCart={() => navigate('cart')}
      />

      {/* Supabase SQL and Info Modal */}
      <SupabaseConfigModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
