import React from 'react';
import Header from '../components/Header.tsx';
import Footer from '../components/Footer.tsx';
import { motion } from 'motion/react';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, ChevronRight, Package, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.tsx';


export default function CartPage() {
  const { cart: items, updateCartQty, removeFromCart } = useApp();

  const updateQuantity = (id: string, delta: number) => {
    updateCartQty(id, delta);
  };

  const removeItem = (id: string) => {
    removeFromCart(id);
  };

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 2000000 ? 0 : 50000;
  const tax = Math.round(subtotal * 0.11);
  const total = subtotal + shippingCost + tax;

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-brand-red selection:text-brand-dark transition-colors duration-300">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-12">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">Your Kit</h1>
          <div className="flex-grow h-px bg-border-subtle" />
          <span className="text-brand-red font-mono text-sm">[{items.length} ITEMS]</span>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Items List */}
            <div className="lg:col-span-8 space-y-6">
              {items.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  className="flex flex-row gap-4 sm:gap-6 p-4 sm:p-6 bg-bg-secondary border border-border-subtle rounded-sm group hover:border-text-primary/20 transition-all items-start sm:items-stretch"
                >
                  <div className="w-24 sm:w-40 aspect-square bg-black p-1 sm:p-2 rounded-sm overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} referrerPolicy="no-referrer" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                  
                  <div className="flex-grow flex flex-col justify-between py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold uppercase tracking-tighter mb-1 select-none group-hover:text-brand-red transition-colors">{item.name}</h3>
                        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">{item.color}</p>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-600 hover:text-red-500 transition-colors p-2"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between mt-4 sm:mt-0 gap-2 sm:gap-0">
                      <div className="flex items-center border border-border-subtle p-0.5 sm:p-1 rounded-sm bg-bg-primary/40">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1.5 sm:p-2 hover:text-brand-red transition-colors"
                        >
                          <Minus size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        <span className="w-8 sm:w-12 text-center font-bold text-xs sm:text-sm select-none">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1.5 sm:p-2 hover:text-brand-red transition-colors"
                        >
                          <Plus size={14} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
                      <div className="text-lg sm:text-2xl font-black italic tracking-tighter text-right">
                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              <Link to="/catalog" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-tighter text-gray-500 hover:text-brand-red transition-colors group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Continue Exploring
              </Link>
            </div>

            {/* Order Summary */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-bg-secondary border border-border-subtle rounded-sm overflow-hidden flex flex-col">
                <div className="p-8 space-y-6 border-b border-border-subtle">
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter italic">Summary</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-400 font-mono">
                      <span className="uppercase tracking-tighter">Subtotal</span>
                      <span className="text-text-primary font-bold">Rp {subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 font-mono">
                      <span className="uppercase tracking-tighter">Expedited Shipping</span>
                      <span className="text-text-primary font-bold">{shippingCost === 0 ? 'GRATIS' : `Rp ${shippingCost.toLocaleString('id-ID')}`}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 font-mono">
                      <span className="uppercase tracking-tighter">PPN (11%)</span>
                      <span className="text-text-primary font-bold">Rp {tax.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-bg-primary/30">
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-xs font-mono uppercase tracking-widest text-brand-red font-bold">Total Ready</span>
                    <span className="text-3xl font-black italic tracking-tighter">Rp {total.toLocaleString('id-ID')}</span>
                  </div>
                  <Link
                    to="/checkout"
                    className="w-full bg-brand-red text-brand-dark py-5 flex items-center justify-center gap-3 font-black uppercase tracking-tighter hover:opacity-90 transition-all rounded-sm shadow-xl"
                  >
                    <ShieldCheck size={20} />
                    Secure Checkout <ChevronRight size={20} />
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-4 p-4 border border-white/5 rounded-sm bg-zinc-900/40">
                  <Package size={24} className="text-gray-600" />
                  <div>
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Free Shipping</p>
                    <p className="text-xs font-bold uppercase tracking-tighter italic">On orders above Rp 2.000.000</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border border-white/5 rounded-sm bg-zinc-900/40">
                  <ShieldCheck size={24} className="text-gray-600" />
                  <div>
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Safe & Encryption</p>
                    <p className="text-xs font-bold uppercase tracking-tighter italic">Protected payment gateway</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center text-center">
            <div className="bg-bg-secondary w-24 h-24 rounded-full flex items-center justify-center mb-8 border border-border-subtle">
              <ShoppingBag size={40} className="text-gray-600" />
            </div>
            <h2 className="text-3xl font-black italic italic uppercase tracking-tighter mb-4">Your Kit is Empty</h2>
            <p className="text-gray-500 font-light mb-8 max-w-sm">Looks like you haven't added any precision hardware to your kit yet.</p>
            <Link 
              to="/catalog"
              className="bg-brand-red text-brand-dark px-10 py-4 font-black uppercase tracking-tighter hover:opacity-90 transition-all rounded-sm"
            >
              Start Exploring
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
