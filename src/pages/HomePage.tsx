import React from 'react';
import Header from '../components/Header.tsx';
import Footer from '../components/Footer.tsx';
import { motion } from 'motion/react';
import { ChevronRight, ArrowRight, ShoppingBag, Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage, translations } from '../context/LanguageContext.tsx';

import { useApp } from '../context/AppContext.tsx';

export default function HomePage() {
  const { t } = useLanguage();
  const { products, wishlist, toggleWishlist } = useApp();
  
  // Get top 8 products
  const featuredProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-brand-red selection:text-brand-dark overflow-x-hidden transition-colors duration-300 relative">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/20 to-bg-primary z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1618335829737-2228ad30662e?q=80&w=2000&auto=format&fit=crop)' }}
        />
        
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-brand-red font-mono tracking-widest text-sm uppercase mb-4 block">
              {t('newCollection')}
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black italic tracking-tighter mb-6 leading-tight">
              {t('builtFor')}<br />
              <span className="text-brand-red border-t-2 border-b-2 border-brand-red px-2 md:px-4 text-glow">
                {t('precision')}
              </span>
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-gray-400 mb-8 md:mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              {t('heroDesc')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/catalog"
                className="bg-brand-red text-brand-dark px-6 py-4 md:px-10 md:py-5 text-sm md:text-base font-bold rounded-sm flex items-center gap-2 hover:opacity-90 transition-all uppercase tracking-tighter shadow-[0_0_30px_rgba(239,68,68,0.3)]"
              >
                {t('discoverCollection')} <ArrowRight size={20} className="w-4 h-4 md:w-5 md:h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brand Marquee */}
      <div className="py-12 border-y border-white/5 bg-black/20 overflow-hidden select-none">
        <motion.div 
          className="flex whitespace-nowrap gap-20"
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {Array(10).fill(['RAZER', 'LOGITECH', 'STEELSERIES', 'CORSAIR', 'ASUS ROG', 'MSI']).flat().map((brand, i) => (
            <span key={i} className="text-4xl font-black italic text-white/10 tracking-tighter hover:text-brand-red transition-colors cursor-default uppercase">
              {brand}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Featured Gear */}
      <section className="py-24 px-6 bg-bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 md:mb-16 border-l-4 border-brand-red pl-4 md:pl-6 flex justify-between items-end">
            <div>
              <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase">
                Trending Products
              </h2>
              <p className="text-gray-400 font-mono mt-2 uppercase tracking-widest text-[10px] md:text-xs">
                Top Rated Hardware
              </p>
            </div>
            <Link to="/catalog" className="hidden md:flex items-center gap-2 text-brand-red font-black text-xs uppercase tracking-widest hover:underline">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: (i % 4) * 0.1 }}
                viewport={{ once: true }}
                className="group bg-bg-secondary md:glass rounded-sm overflow-hidden border border-border-subtle md:border-white/5 hover:border-brand-red/50 transition-all duration-500 flex flex-col h-full relative shadow-lg shadow-black/20"
              >
                <div className="relative overflow-hidden aspect-square md:aspect-[4/5]">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-2 left-2 md:top-4 md:left-4 p-2 md:p-2.5 rounded-full glass border border-white/10 hover:border-brand-red transition-all cursor-pointer z-20 group/heart"
                    aria-label="Wishlist"
                  >
                    <Heart 
                      size={14} 
                      className={`transition-colors duration-300 ${
                        wishlist.includes(product.id) 
                          ? 'fill-brand-red text-brand-red' 
                          : 'text-gray-400 group-hover/heart:text-brand-red'
                      }`}
                    />
                  </button>
                  
                  {product.tag && (
                    <div className="absolute top-0 right-0 bg-brand-red text-brand-dark px-2 md:px-4 py-1 md:py-1.5 font-black italic text-[8px] md:text-[10px] uppercase tracking-tighter">
                      {product.tag}
                    </div>
                  )}
                </div>
                
                <div className="p-3 md:p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-1.5 md:mb-2">
                    <p className="text-brand-red font-mono text-[9px] md:text-[10px] uppercase tracking-widest bg-brand-red/10 px-1.5 py-0.5 rounded-sm">{product.category}</p>
                    <div className="hidden md:flex items-center gap-1 text-[10px] text-gray-500 font-black uppercase tracking-widest">
                      <Star size={10} className="fill-brand-red text-brand-red" />
                      {product.rating}
                    </div>
                  </div>
                  
                  <h3 className="text-xs md:text-xl font-bold md:font-black md:italic uppercase tracking-tight md:tracking-tighter mb-1 group-hover:text-brand-red transition-colors leading-tight line-clamp-2">
                    {product.name}
                  </h3>
                  {product.storeName ? (
                    <p className="text-[8px] md:text-[10px] font-mono text-gray-400 mb-2 flex-grow uppercase tracking-widest">
                      by <span className="text-brand-red font-bold">{product.storeName}</span>
                    </p>
                  ) : (
                    <div className="mb-2 flex-grow"></div>
                  )}
                  
                  <div className="flex items-center justify-between mt-auto mb-1">
                    <span className="text-brand-red font-bold text-sm md:text-2xl tracking-tight md:tracking-tighter">Rp {product.price.toLocaleString('id-ID')}</span>
                    <Link 
                      to={`/product/${product.id}`}
                      className="p-1.5 md:p-3 bg-brand-red text-brand-dark rounded-full hover:bg-white hover:text-black transition-all md:hidden"
                    >
                      <ShoppingBag size={14} />
                    </Link>
                  </div>

                  <div className="flex items-center justify-between border-t border-border-subtle md:border-white/5 pt-2 mt-1">
                    <div className="flex items-center gap-1 text-[9px] md:text-xs text-gray-400">
                      <Star size={10} className="fill-yellow-500 text-yellow-500" />
                      {product.rating}
                    </div>
                    {product.soldCount !== undefined && (
                      <span className="text-[9px] md:text-xs text-gray-400">
                        {product.soldCount >= 1000 ? `${(product.soldCount / 1000).toFixed(1)}k+` : product.soldCount} terjual
                      </span>
                    )}
                  </div>
                  
                  <Link 
                    to={`/product/${product.id}`}
                    className="hidden md:flex mt-4 w-full bg-brand-red/10 text-brand-red py-2.5 items-center justify-center gap-2 rounded-sm hover:bg-brand-red hover:text-brand-dark transition-all font-black text-[10px] uppercase tracking-[0.1em]"
                  >
                    <ShoppingBag size={16} /> View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link to="/catalog" className="inline-flex items-center gap-2 bg-white/5 px-6 py-3 rounded-sm text-xs font-black uppercase tracking-widest hover:bg-brand-red hover:text-brand-dark transition-colors">
              View All Products <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Premium Features */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { titleKey: 'zeroLatency' as const, descKey: 'zeroLatencyDesc' as const },
              { titleKey: 'modularDesign' as const, descKey: 'modularDesignDesc' as const },
              { titleKey: 'proTuned' as const, descKey: 'proTunedDesc' as const }
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="glass p-10 rounded-sm border-l-4 border-brand-red"
              >
                <h4 className="text-xl font-black italic uppercase mb-4 tracking-tighter">
                  {t(feature.titleKey)}
                </h4>
                <p className="text-gray-400 font-mono text-sm leading-relaxed">
                  {t(feature.descKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      <Footer />
    </div>
  );
}
