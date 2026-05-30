import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  tag?: string;
  category: string;
  type: string;
  description: string;
  features?: string[];
  images?: string[];
  analysisReport?: string; // Analysis report added by merchant
  storeName?: string; // Merchant store association
  soldCount?: number; // Sales volume count
  stock?: number;
  variants?: string[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  color: string;
  quantity: number;
}

export interface StoreInfo {
  name: string;
  description: string;
}

export interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: number;
  details?: CartItem[];
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface AppContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'rating'>) => void;
  cart: CartItem[];
  addToCart: (product: Product, color?: string) => void;
  removeFromCart: (id: string) => void;
  updateCartQty: (id: string, delta: number) => void;
  clearCart: () => void;
  activeRole: 'customer' | 'merchant';
  setActiveRole: (role: 'customer' | 'merchant') => void;
  storeInfo: StoreInfo | null;
  createStore: (store: StoreInfo) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  logout: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  reviews: Record<string, Review[]>;
  addReview: (productId: string, rating: number, comment: string, userName: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Fetch products from Supabase
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (data) {
        setProducts(data as Product[]);
      } else if (error) {
        console.error('Error fetching products:', error);
      }
    };
    
    fetchProducts();
  }, []);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('gg_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeRole, setActiveRole] = useState<'customer' | 'merchant'>(() => {
    const saved = localStorage.getItem('gg_active_role');
    return (saved as 'customer' | 'merchant') || 'customer';
  });

  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(() => {
    const saved = localStorage.getItem('gg_store_info');
    return saved ? JSON.parse(saved) : null;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('gg_orders');
    return saved ? JSON.parse(saved) : [
      { 
        id: 'GGS-9283', 
        date: 'Oct 24, 2023', 
        status: 'Delivered', 
        total: 3450000, 
        items: 2,
        details: [
          {
            id: 'kb-1',
            name: 'Striker-65 Mini',
            price: 2050000,
            image: 'https://images.unsplash.com/photo-1541140134513-85a161dc4a00?q=80&w=1200&auto=format&fit=crop',
            color: 'Carbon Black',
            quantity: 1
          },
          {
            id: 'mouse-1',
            name: 'Striker-X Modular Mouse',
            price: 1400000,
            image: 'https://images.unsplash.com/photo-1527814732934-719533273171?q=80&w=1200&auto=format&fit=crop',
            color: 'Obsidian Black',
            quantity: 1
          }
        ]
      },
      { 
        id: 'GGS-8172', 
        date: 'Aug 12, 2023', 
        status: 'Delivered', 
        total: 1400000, 
        items: 1,
        details: [
          {
            id: 'mouse-1',
            name: 'Striker-X Modular Mouse',
            price: 1400000,
            image: 'https://images.unsplash.com/photo-1527814732934-719533273171?q=80&w=1200&auto=format&fit=crop',
            color: 'Obsidian Black',
            quantity: 1
          }
        ]
      }
    ];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('gg_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [reviews, setReviews] = useState<Record<string, Review[]>>(() => {
    const saved = localStorage.getItem('gg_reviews');
    if (saved) return JSON.parse(saved);
    
    // Seed gorgeous initial reviews for the products
    return {
      'kb-1': [
        { id: 'rev-1', userName: 'StrikerFan_99', rating: 5, comment: 'Absolutely solid build. The lubed stabilizers feel premium and the keycap texture is phenomenal.', date: 'May 10, 2026' },
        { id: 'rev-2', userName: 'CyberDesk', rating: 4, comment: 'Incredible form factor. Compact, sleek, and perfect layout for my gaming sessions.', date: 'May 14, 2026' }
      ],
      'mouse-1': [
        { id: 'rev-3', userName: 'QuantumAim', rating: 5, comment: 'Super lightweight and the sensor tracking is absolutely surgical. Flawless modular shell.', date: 'May 12, 2026' },
        { id: 'rev-4', userName: 'GamerX', rating: 5, comment: 'Best mouse I have ever used. Low latency wireless dongle works perfectly.', date: 'May 20, 2026' }
      ],
      'audio-1': [
        { id: 'rev-5', userName: 'HifiGamer', rating: 5, comment: 'Perfect sound isolation and high dynamic range. Hearing footsteps in FPS games has never been this easy.', date: 'May 18, 2026' }
      ]
    };
  });

  useEffect(() => {
    // We no longer sync products to local storage as they are in Supabase
  }, [products]);

  useEffect(() => {
    localStorage.setItem('gg_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('gg_active_role', activeRole);
  }, [activeRole]);

  useEffect(() => {
    localStorage.setItem('gg_store_info', JSON.stringify(storeInfo));
  }, [storeInfo]);

  useEffect(() => {
    localStorage.setItem('gg_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('gg_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('gg_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addReview = (productId: string, rating: number, comment: string, userName: string) => {
    const newReview: Review = {
      id: 'rev-' + Date.now(),
      userName: userName || 'Anonymous',
      rating,
      comment,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    
    setReviews(prev => {
      const currentProductReviews = prev[productId] || [];
      const updatedReviews = [newReview, ...currentProductReviews];
      const updated = {
        ...prev,
        [productId]: updatedReviews
      };
      
      // Dynamically update the product rating average
      const averageRating = parseFloat(
        (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)
      );
      
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === productId ? { ...p, rating: averageRating } : p
        )
      );
      
      return updated;
    });
  };

  const addProduct = async (newProduct: Omit<Product, 'id' | 'rating'>) => {
    const productData = {
      ...newProduct,
      rating: 0.0,
      images: [newProduct.image],
      soldCount: 0
    };

    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (data) {
      setProducts(prev => [data as Product, ...prev]);
    } else if (error) {
      console.error('Error saving product to Supabase:', error);
    }
  };

  const addToCart = (product: Product, color: string = 'Obsidian Black') => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        color,
        quantity: 1
      }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const createStore = (store: StoreInfo) => {
    setStoreInfo(store);
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const logout = () => {
    // Wipe all persisted state from localStorage
    localStorage.removeItem('gg_cart');
    localStorage.removeItem('gg_orders');
    localStorage.removeItem('gg_active_role');
    localStorage.removeItem('gg_store_info');
    localStorage.removeItem('gg_wishlist');
    localStorage.removeItem('gg_reviews');
    // Reset all state to defaults
    setCart([]);
    setOrders([]);
    setActiveRole('customer');
    setStoreInfo(null);
    setWishlist([]);
  };

  return (
    <AppContext.Provider value={{
      products,
      addProduct,
      cart,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      activeRole,
      setActiveRole,
      storeInfo,
      createStore,
      orders,
      addOrder,
      logout,
      wishlist,
      toggleWishlist,
      reviews,
      addReview
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
