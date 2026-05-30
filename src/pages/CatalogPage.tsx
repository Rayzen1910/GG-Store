import React, { useState, useMemo } from 'react';
import Header from '../components/Header.tsx';
import Footer from '../components/Footer.tsx';
import { motion } from 'motion/react';
import { ShoppingBag, Star, Filter, Heart, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.tsx';

const categories = [
  { id: 'all', label: 'All Hardware' },
  { id: 'keyboard', label: 'Keyboards' },
  { id: 'mouse', label: 'Mice' },
  { id: 'audio', label: 'Audio' },
  { id: 'accessory', label: 'Accessories' }
];

export default function CatalogPage() {
  const { products, wishlist, toggleWishlist } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<string>('all'); // 'all', 'under-1-5m', '1-5m-2-5m', 'over-2-5m'
  const [sortBy, setSortBy] = useState<string>('default'); // 'default', 'price-asc', 'price-desc', 'rating-desc'

  const processedProducts = useMemo(() => {
    // 1. Filter by category type
    let items = currentCategory === 'all' ? products : products.filter(p => p.type === currentCategory);

    // 2. Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    // 3. Filter by price range
    if (priceRange === 'under-1-5m') {
      items = items.filter(p => p.price < 1500000);
    } else if (priceRange === '1-5m-2-5m') {
      items = items.filter(p => p.price >= 1500000 && p.price <= 2500000);
    } else if (priceRange === 'over-2-5m') {
      items = items.filter(p => p.price > 2500000);
    }

    // 4. Sort
    if (sortBy === 'price-asc') {
      items = [...items].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      items = [...items].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating-desc') {
      items = [...items].sort((a, b) => b.rating - a.rating);
    }

    return items;
  }, [currentCategory, products, searchQuery, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-brand-red selection:text-brand-dark transition-colors duration-300 relative">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-mono uppercase text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
          <Link to="/" className="hover:text-brand-red transition-colors">Home</Link>
          <span>/</span>
          <span className="text-text-primary">Catalog</span>
          <span>/</span>
          <span className="text-brand-red">{currentCategory}</span>
        </nav>

        <div className="flex flex-col gap-12">
          {/* Header & Filter Bar */}
          <section>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <span className="text-brand-red font-mono text-[10px] uppercase tracking-[0.3em] mb-2 block">Premium Arsenal</span>
                <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
                  {categories.find(c => c.id === currentCategory)?.label.split(' ')[0]}
                  <br />
                  <span className="text-transparent border-t border-b border-white/20 px-2">{categories.find(c => c.id === currentCategory)?.label.split(' ')[1] || 'GEAR'}</span>
                </h1>
              </motion.div>

              <div className="flex flex-wrap gap-3 glass p-2 rounded-sm">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSearchParams({ category: cat.id });
                      // Reset search query when changing categories to avoid empty state confusion
                      setSearchQuery('');
                    }}
                    className={`px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-sm cursor-pointer ${
                      currentCategory === cat.id 
                        ? 'bg-brand-red text-brand-dark shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter and Control Panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 glass p-4 rounded-sm border-white/5">
              {/* Search Bar */}
              <div className="relative flex items-center">
                <Search size={16} className="absolute left-4 text-gray-500" />
                <input 
                  type="text"
                  placeholder="Search weapons of choice..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-12 pr-4 text-xs font-mono font-bold tracking-wider placeholder-gray-500 focus:outline-none focus:border-brand-red transition-all"
                />
              </div>

              {/* Price Filter */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-gray-500 shrink-0 ml-2" />
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-sm py-3 px-3 text-xs font-mono font-bold tracking-wider focus:outline-none focus:border-brand-red cursor-pointer"
                >
                  <option value="all" className="bg-bg-secondary text-text-primary">All Prices</option>
                  <option value="under-1-5m" className="bg-bg-secondary text-text-primary">Under Rp 1.500.000</option>
                  <option value="1-5m-2-5m" className="bg-bg-secondary text-text-primary">Rp 1.500.000 - Rp 2.500.000</option>
                  <option value="over-2-5m" className="bg-bg-secondary text-text-primary">Over Rp 2.500.000</option>
                </select>
              </div>

              {/* Sorting */}
              <div className="flex items-center gap-2">
                <ArrowUpDown size={14} className="text-gray-500 shrink-0 ml-2" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-sm py-3 px-3 text-xs font-mono font-bold tracking-wider focus:outline-none focus:border-brand-red cursor-pointer"
                >
                  <option value="default" className="bg-bg-secondary text-text-primary">Default Sorting</option>
                  <option value="price-asc" className="bg-bg-secondary text-text-primary">Price: Low to High</option>
                  <option value="price-desc" className="bg-bg-secondary text-text-primary">Price: High to Low</option>
                  <option value="rating-desc" className="bg-bg-secondary text-text-primary">Top Rated First</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {processedProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: (i % 4) * 0.1 }}
                  viewport={{ once: true }}
                  className="group glass rounded-sm overflow-hidden border-white/5 hover:border-brand-red/50 transition-all duration-500 flex flex-col h-full relative"
                >
                  <div className="relative overflow-hidden aspect-[4/5]">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className="absolute top-4 left-4 p-2.5 rounded-full glass border border-white/10 hover:border-brand-red transition-all cursor-pointer z-20 group/heart"
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
                      <div className="absolute top-0 right-0 bg-brand-red text-brand-dark px-4 py-1.5 font-black italic text-[10px] uppercase tracking-tighter">
                        {product.tag}
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center translate-y-4 group-hover:translate-y-0">
                       <p className="text-xs text-gray-300 font-mono mb-6 line-clamp-3">High-performance gear engineered for professionals.</p>
                       <Link 
                        to={`/product/${product.id}`}
                        className="w-full bg-white text-black py-4 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-red hover:text-brand-dark transition-colors"
                      >
                        Detailed Specs
                      </Link>
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-brand-red font-mono text-[10px] uppercase tracking-widest">{product.category}</p>
                      <div className="flex items-center gap-1 text-[10px] text-gray-500 font-black uppercase tracking-widest">
                        <Star size={10} className="fill-brand-red text-brand-red" />
                        {product.rating}
                      </div>
                    </div>
                    {product.soldCount !== undefined && (
                      <div className="flex items-center gap-1.5 mb-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-widest ${
                          product.soldCount >= 3000
                            ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                            : 'bg-white/5 text-gray-500 border border-white/5'
                        }`}>
                          🔥 {product.soldCount.toLocaleString('id-ID')} terjual
                        </span>
                      </div>
                    )}
                    
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-6 group-hover:text-brand-red transition-colors leading-none flex-grow">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-end justify-between pt-6 border-t border-white/5 mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Price</span>
                        <span className="text-2xl font-black tracking-tighter">Rp {product.price.toLocaleString('id-ID')}</span>
                      </div>
                      <Link 
                        to={`/product/${product.id}`}
                        className="p-4 bg-brand-red/10 text-brand-red rounded-full hover:bg-brand-red hover:text-brand-dark transition-all duration-300 animate-pulse hover:animate-none"
                      >
                        <ShoppingBag size={20} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {processedProducts.length === 0 && (
              <div className="py-40 text-center glass rounded-sm">
                <Filter size={48} className="mx-auto mb-6 text-gray-600 opacity-20" />
                <p className="text-gray-500 font-mono uppercase tracking-widest text-xs">No equipment found matching criteria.</p>
                <button 
                  onClick={() => {
                    setSearchParams({ category: 'all' });
                    setSearchQuery('');
                    setPriceRange('all');
                    setSortBy('default');
                  }}
                  className="mt-8 text-brand-red font-black uppercase tracking-widest text-[10px] hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
