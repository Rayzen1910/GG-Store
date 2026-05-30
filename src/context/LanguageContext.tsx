import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'id' | 'zh';

interface TranslationDict {
  [key: string]: {
    en: string;
    id: string;
    zh: string;
  };
}

export const translations: TranslationDict = {
  // Navigation / Header
  hardware: {
    en: 'HARDWARE',
    id: 'PERANGKAT',
    zh: '硬件设备',
  },
  collections: {
    en: 'COLLECTIONS',
    id: 'KOLEKSI',
    zh: '系列产品',
  },
  support: {
    en: 'SUPPORT',
    id: 'BANTUAN',
    zh: '客户支持',
  },
  login: {
    en: 'Login',
    id: 'Masuk',
    zh: '登录',
  },
  signOut: {
    en: 'Sign Out',
    id: 'Keluar',
    zh: '退出登录',
  },
  // Hero Section
  newCollection: {
    en: 'New Strike-X Collection',
    id: 'Koleksi Terbaru Strike-X',
    zh: '全新 Strike-X 系列',
  },
  builtFor: {
    en: 'BUILT FOR',
    id: 'DIBUAT UNTUK',
    zh: '专属打造',
  },
  precision: {
    en: 'PRECISION',
    id: 'PRESISI',
    zh: '极致精准',
  },
  heroDesc: {
    en: 'Engineered for performance, crafted for style. The future of gaming peripherals starts here.',
    id: 'Dirancang untuk performa, dibuat untuk gaya. Masa depan periferal gaming dimulai di sini.',
    zh: '为性能而生，为型格而制。电竞外设的未来由此开启。',
  },
  discoverCollection: {
    en: 'Discover Collection',
    id: 'Jelajahi Koleksi',
    zh: '探索系列',
  },
  // Home Page
  shopByStyle: {
    en: 'Shop by Style',
    id: 'Belanja Sesuai Gaya',
    zh: '按风格选购',
  },
  curatedAesthetics: {
    en: 'Curated aesthetics for every desk',
    id: 'Estetika pilihan untuk setiap meja',
    zh: '为您精心定制的书桌美学',
  },
  readyToUpgrade: {
    en: 'Ready to Upgrade Setup?',
    id: 'Siap Upgrade Setup Anda?',
    zh: '准备好升级你的电竞装备了吗？',
  },
  goToShop: {
    en: 'Go to Shop',
    id: 'Ke Toko',
    zh: '立即选购',
  },
  modern: {
    en: 'Modern',
    id: 'Modern',
    zh: '现代时尚',
  },
  minimalist: {
    en: 'Minimalist',
    id: 'Minimalis',
    zh: '极简主义',
  },
  gamer: {
    en: 'Gamer',
    id: 'Gamer',
    zh: '专业玩家',
  },
  modernDesc: {
    en: 'Clean aesthetics for the minimal professional.',
    id: 'Estetika bersih untuk profesional minimalis.',
    zh: '适合极简专业人士的干净美学。',
  },
  minimalistDesc: {
    en: 'Less is more. Essential tools for focused work.',
    id: 'Sederhana itu lebih. Alat esensial untuk kerja fokus.',
    zh: '少即是多。专注于高效工作的核心装备。',
  },
  gamerDesc: {
    en: 'Peak performance and RGB customization.',
    id: 'Performa puncak dan kustomisasi RGB maksimal.',
    zh: '巅峰性能与极致 RGB 灯效定制。',
  },
  // Features
  zeroLatency: {
    en: 'Zero Latency',
    id: 'Tanpa Latensi',
    zh: '超低延迟',
  },
  zeroLatencyDesc: {
    en: 'Proprietary 2.4GHz wireless tech for competitive gaming.',
    id: 'Teknologi nirkabel 2.4GHz eksklusif untuk gaming kompetitif.',
    zh: '专有 2.4GHz 无线技术，助力职业电竞竞赛。',
  },
  modularDesign: {
    en: 'Modular Design',
    id: 'Desain Modular',
    zh: '模块化设计',
  },
  modularDesignDesc: {
    en: 'Hot-swappable parts for every custom build and style.',
    id: 'Komponen hot-swappable untuk setiap rakitan dan gaya kustom.',
    zh: '热插拔定制部件，满足各种个性装机与独特风格。',
  },
  proTuned: {
    en: 'Pro Tuned',
    id: 'Kalibrasi Profesional',
    zh: '专业调校',
  },
  proTunedDesc: {
    en: 'Calibrated by eSports champions for maximum accuracy.',
    id: 'Dikalibrasi oleh juara eSports untuk akurasi maksimal.',
    zh: '由电竞世界冠军参与调校，确保极致精准操控。',
  },
  // Account Page
  customerMode: {
    en: 'Customer Mode',
    id: 'Mode Pelanggan',
    zh: '客户模式',
  },
  merchantMode: {
    en: 'Merchant Mode',
    id: 'Mode Penjual',
    zh: '商家模式',
  },
  purchaseHistory: {
    en: 'Purchase History',
    id: 'Riwayat Pembelian',
    zh: '购买历史记录',
  },
  reorderAll: {
    en: 'Reorder All',
    id: 'Pesan Ulang Semua',
    zh: '一键重新购买',
  },
  addToCart: {
    en: 'Add to Cart',
    id: 'Tambah ke Keranjang',
    zh: '加入购物车',
  },
  // Checkout & Cart
  orderSummary: {
    en: 'Order Summary',
    id: 'Ringkasan Pesanan',
    zh: '订单汇总',
  },
  checkout: {
    en: 'Checkout',
    id: 'Pembayaran',
    zh: '去结账',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('gg_lang');
    return (saved === 'en' || saved === 'id' || saved === 'zh') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('gg_lang', lang);
  };

  const t = (key: keyof typeof translations): string => {
    const translation = translations[key];
    if (!translation) return String(key);
    return translation[language] || translation['en'];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
