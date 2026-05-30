import React, { useState } from 'react';
import Header from '../components/Header.tsx';
import Footer from '../components/Footer.tsx';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ChevronRight, Share2, Heart, ShieldCheck, Truck, RefreshCcw, Info, Star } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';

export default function ProductPage() {
  const { id } = useParams();
  const { products, addToCart, wishlist, toggleWishlist, reviews, addReview } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const product = products.find(p => p.id === id) || products[0];

  const [selectedColor, setSelectedColor] = useState({ name: 'Obsidian Black', hex: '#000000' });
  const [selectedImage, setSelectedImage] = useState(0);

  // Review Form state
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');

  if (!product) {
    return (
      <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center">
        <p className="text-xl font-mono uppercase tracking-widest text-brand-red">Product not found</p>
      </div>
    );
  }

  const productReviews = reviews[product.id] || [];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-brand-red selection:text-brand-dark transition-colors duration-300">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-mono uppercase text-gray-500 mb-8 sm:mb-12">
          <Link to="/" className="hover:text-brand-red">Home</Link>
          <ChevronRight size={12} />
          <Link to="/catalog" className="hover:text-brand-red">Hardware</Link>
          <ChevronRight size={12} />
          <span className="text-text-primary">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Product Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-[4/3] bg-bg-secondary border border-border-subtle rounded-sm overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  src={product.images ? product.images[selectedImage] : product.image}
                  alt="Product Hero"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {product.images?.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square bg-bg-secondary border-2 rounded-sm overflow-hidden transition-all cursor-pointer ${selectedImage === i ? 'border-brand-red' : 'border-transparent hover:border-text-primary/20'}`}
                >
                  <img src={img} alt={`Thumb ${i}`} referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-brand-red text-brand-dark px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter italic">In Stock</span>
                <span className="text-brand-red font-mono text-[10px] uppercase tracking-widest">{product.category} / {product.id.toUpperCase()} {product.storeName ? `| Seller: ${product.storeName}` : ''}</span>
              </div>
              <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-tight mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-bold">Rp {product.price.toLocaleString('id-ID')}</span>
                  <span className="text-xl text-gray-500 line-through">Rp {Math.round(product.price * 1.25).toLocaleString('id-ID')}</span>
                </div>
                <div className="h-6 w-[1px] bg-white/10" />
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold">
                  <Star size={12} className="fill-brand-red text-brand-red" />
                  <span>{product.rating}</span>
                  <span className="text-gray-500 font-normal">({productReviews.length})</span>
                </div>
              </div>

              {/* Sold Count Badge */}
              {product.soldCount !== undefined && (
                <div className="flex items-center gap-2 mb-6">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest ${
                    product.soldCount >= 3000
                      ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                      : 'bg-white/5 text-gray-400 border border-white/10'
                  }`}>
                    🔥 {product.soldCount.toLocaleString('id-ID')} unit terjual
                  </span>
                  {product.soldCount >= 3000 && (
                    <span className="text-[9px] font-mono text-orange-400/70 uppercase tracking-widest">Produk Laris!</span>
                  )}
                </div>
              )}

              <p className="text-gray-400 font-light leading-relaxed mb-6">
                {product.description}
              </p>
            </div>

            {/* Variants / Colors */}
            <div>
              <p className="text-xs font-mono uppercase text-gray-500 mb-4 tracking-widest">Select Variant: <span className="text-text-primary">{selectedColor.name}</span></p>
              <div className="flex gap-4 flex-wrap">
                {(product.variants && product.variants.length > 0 
                  ? product.variants.map(v => ({ name: v, hex: '#444' })) 
                  : [
                      { name: 'Obsidian Black', hex: '#000000' },
                      { name: 'Pure White', hex: '#FFFFFF' },
                      { name: 'Radiant Red', hex: '#EF4444' }
                    ]
                ).map(color => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`h-10 rounded-sm border-2 transition-all px-4 cursor-pointer flex items-center justify-center font-mono text-xs uppercase tracking-wider ${selectedColor.name === color.name ? 'border-brand-red text-brand-red bg-brand-red/10' : 'border-transparent bg-white/5 text-gray-400 hover:border-white/20'}`}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Overview / Features */}
            <div className="border-y border-border-subtle py-8 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-brand-red">Product Features</h3>
              <ul className="space-y-3">
                {product.features?.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 bg-brand-red rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Analysis Report if exists */}
            {product.analysisReport && (
              <div className="border border-brand-red/30 bg-brand-red/5 p-6 rounded-sm space-y-3">
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-brand-red flex items-center gap-2">
                  <Info size={14} /> Merchant Analysis Report
                </h4>
                <p className="text-xs text-text-primary/95 leading-relaxed font-light font-mono">
                  {product.analysisReport}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  addToCart(product, selectedColor.name);
                  // Dynamic confirmation alert or redirect to cart
                  navigate('/cart');
                }}
                className="flex-grow bg-brand-red text-brand-dark py-5 font-black uppercase tracking-tighter flex items-center justify-center gap-3 hover:opacity-90 transition-all rounded-sm shadow-xl cursor-pointer"
              >
                <ShoppingBag size={20} />
                Add to your kit
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className="p-5 glass border border-white/10 hover:border-brand-red rounded-sm transition-all cursor-pointer flex items-center justify-center"
                aria-label="Toggle Wishlist"
              >
                <Heart 
                  size={20} 
                  className={wishlist.includes(product.id) ? 'fill-brand-red text-brand-red' : 'text-text-primary'}
                />
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { icon: <Truck size={16} />, label: "Express Shipping" },
                { icon: <ShieldCheck size={16} />, label: "2 Year Warranty" },
                { icon: <RefreshCcw size={16} />, label: "30-Day Returns" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 text-center group">
                  <div className="text-gray-500 group-hover:text-brand-red transition-colors">{item.icon}</div>
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter group-hover:text-text-primary">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ratings & Reviews Section */}
        <section className="mt-20 pt-16 border-t border-white/5">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-12">
            <div>
              <span className="text-brand-red font-mono text-[10px] uppercase tracking-[0.3em] mb-2 block">Customer Reports</span>
              <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
                Ratings & <span className="text-transparent border-t border-b border-white/20 px-2">Reviews</span>
              </h2>
            </div>
            
            <div className="flex items-center gap-6 glass p-6 rounded-sm">
              <div className="text-center">
                <span className="text-5xl font-black text-brand-red">{product.rating}</span>
                <span className="text-xs text-gray-500 font-mono block mt-1">out of 5</span>
              </div>
              <div className="h-12 w-[1px] bg-white/10" />
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={14} 
                      className={star <= Math.round(product.rating) ? 'fill-brand-red text-brand-red' : 'text-gray-600'} 
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">{productReviews.length} Verified Reviews</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Write a Review Form */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass p-8 rounded-sm border-white/5">
                <h3 className="text-lg font-black italic uppercase tracking-tighter mb-6">Leave an Assessment</h3>
                
                {user ? (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!commentInput.trim()) return;
                    
                    const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
                    addReview(product.id, ratingInput, commentInput, name);
                    
                    // Reset inputs
                    setCommentInput('');
                    setRatingInput(5);
                  }} className="space-y-6">
                    {/* Star Rating Selector */}
                    <div>
                      <label className="text-xs font-mono uppercase text-gray-500 mb-3 block tracking-wider">Select Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setRatingInput(star)}
                            className="p-1 hover:scale-125 transition-transform cursor-pointer"
                          >
                            <Star 
                              size={24} 
                              className={star <= ratingInput ? 'fill-brand-red text-brand-red' : 'text-gray-600 hover:text-brand-red'} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Review Text Area */}
                    <div>
                      <label htmlFor="comment" className="text-xs font-mono uppercase text-gray-500 mb-3 block tracking-wider">Your Experience</label>
                      <textarea
                        id="comment"
                        rows={4}
                        placeholder="Tell the community about performance, latency, build quality..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-sm p-4 text-xs font-mono font-bold tracking-wider placeholder-gray-500 focus:outline-none focus:border-brand-red transition-all resize-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-brand-red text-brand-dark py-4 font-black uppercase tracking-tighter flex items-center justify-center gap-3 hover:opacity-90 transition-all rounded-sm cursor-pointer shadow-lg"
                    >
                      Submit Assessment
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-xs font-mono uppercase text-gray-400 mb-6 leading-relaxed">
                      You must be signed in to rate and review this gaming arsenal.
                    </p>
                    <Link
                      to="/auth"
                      className="inline-block bg-white text-black px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-red hover:text-brand-dark transition-all rounded-sm"
                    >
                      Sign In Now
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-7 space-y-4">
              {productReviews.length > 0 ? (
                productReviews.map((review) => (
                  <div key={review.id} className="glass p-6 rounded-sm border-white/5 flex gap-4 items-start">
                    {/* User Avatar Initials */}
                    <div className="w-10 h-10 rounded-full bg-brand-red text-brand-dark flex items-center justify-center font-mono font-bold text-xs uppercase shrink-0">
                      {review.userName.slice(0, 2).toUpperCase()}
                    </div>
                    
                    <div className="space-y-2 flex-grow">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-xs font-mono font-bold tracking-wider">{review.userName}</span>
                        <span className="text-[10px] font-mono text-gray-500">{review.date}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={10} 
                            className={star <= review.rating ? 'fill-brand-red text-brand-red' : 'text-gray-700'} 
                          />
                        ))}
                      </div>
                      
                      <p className="text-xs text-gray-300 leading-relaxed font-light font-mono pt-2">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center glass rounded-sm">
                  <p className="text-gray-500 font-mono uppercase tracking-widest text-xs">No assessments recorded in this sector yet.</p>
                  <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest mt-2">Be the first to provide feedback on this weapon!</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
