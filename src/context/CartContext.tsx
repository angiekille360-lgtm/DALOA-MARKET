import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../lib/types';
import { useToast } from './ToastContext';
import { fireAddToCartConfetti } from '../components/AddToCartCelebration';
import { animateFlyToCart } from '../lib/flyingCart';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, eventCoords?: { x?: number; y?: number }) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  lastAddedProduct: { product: Product; quantity: number } | null;
  clearLastAddedProduct: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = 'daloa_market_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [lastAddedProduct, setLastAddedProduct] = useState<{ product: Product; quantity: number } | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const clearLastAddedProduct = () => {
    setLastAddedProduct(null);
  };

  const addToCart = (
    product: Product, 
    quantity = 1, 
    eventCoords?: { x?: number; y?: number }
  ) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    // 1. Déclenche l'animation PANIER VOLANT : l'image vole vers l'icône panier en haut à droite
    try {
      const imgUrl = product.image_url?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80';
      animateFlyToCart(imgUrl, eventCoords);
    } catch (e) {
      console.log('Fly to cart note:', e);
    }

    // 2. Déclenche l'animation festive Confetti aux couleurs de Daloa Market & Wave
    try {
      fireAddToCartConfetti(eventCoords);
    } catch (e) {
      console.log('Confetti trigger note:', e);
    }

    // 3. Déclenche l'icône de validation sautillante
    setLastAddedProduct({ product, quantity });

    // Auto-fermeture après 3.5s
    setTimeout(() => {
      setLastAddedProduct((curr) => (curr?.product.id === product.id ? null : curr));
    }, 3500);

    showToast(`${product.name} ajouté au panier !`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Article retiré du panier.', 'info');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        lastAddedProduct,
        clearLastAddedProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
